// ============================================================
// Narration sequence + per-sentence fallback policy.
// Pure (no React Native / Expo runtime imports) so selection and fallback
// are unit-tested with `node --test`; PlaybackController supplies the real
// clip player and TTS engine.
// ============================================================

import type { AudioAssetSource, Language, ReadingMode, Sentence } from '../types/story';

export interface NarrationItem {
  sentenceIndex: number;
  text: string;
  phase: Language;
  /** Bundled recording for this sentence in this language, if one exists. */
  audio?: AudioAssetSource;
}

/**
 * What is read, in order, for one page. Each item carries the recording for
 * exactly the language it speaks (never the other language's clip).
 */
export function buildNarrationSequence(
  sentences: Sentence[],
  language: Language,
  readingMode: ReadingMode,
  sentenceIndexBase = 0
): NarrationItem[] {
  const item = (s: Sentence, i: number, phase: Language): NarrationItem => ({
    sentenceIndex: sentenceIndexBase + i,
    text: phase === 'vi' ? s.vi : s.en,
    phase,
    audio: s.audio?.[phase],
  });

  switch (readingMode) {
    case 'bilingual_parallel':
      // Each sentence: English, then its Vietnamese pair
      return sentences.flatMap((s, i) => [item(s, i, 'en'), item(s, i, 'vi')]);
    case 'single_en':
      return sentences.map((s, i) => item(s, i, 'en'));
    case 'single_vi':
      return sentences.map((s, i) => item(s, i, 'vi'));
    case 'vi_first_en_second':
      // The reader passes the current round's language (vi first, then en)
      return sentences.map((s, i) => item(s, i, language === 'vi' ? 'vi' : 'en'));
    default:
      return sentences.map((s, i) => item(s, i, 'en'));
  }
}

// ─── Fallback policy ─────────────────────────────────────────

/** `paused`: paused from outside the app (call, unplugged headphones, lock-screen button). */
export type ClipResult = 'finished' | 'failed' | 'stopped' | 'paused';

export interface ClipOutcome {
  result: ClipResult;
  /** Why it failed (player error, did not start, stalled …). */
  reason?: string;
  /** Fraction of the clip that was heard (0–1). */
  progress?: number;
  /** Last status snapshot from the player, for diagnostics. */
  status?: unknown;
}

/** A clip that failed after this much was heard is not re-read with TTS. */
export const MOSTLY_HEARD = 0.85;

export interface NarrationLocation {
  storyId: string;
  pageIndex: number;
}

export type NarrationEvent =
  | { kind: 'clip-failed'; fallback: 'tts' | 'none'; reason: string; progress: number; status?: unknown }
  | { kind: 'no-recording' };

export interface NarrateItemDeps {
  playClip: (source: AudioAssetSource, rate: number) => Promise<ClipOutcome>;
  speak: (text: string, phase: Language, rate: number) => Promise<void>;
  /** False once narration was stopped or superseded. */
  isCurrent: () => boolean;
  report: (event: NarrationEvent, item: NarrationItem, where: NarrationLocation) => void;
}

/** How a sentence was actually voiced. */
export type NarratedWith = 'clip' | 'clip-partial' | 'tts' | 'stopped' | 'paused';

/**
 * Voice one sentence: the bundled recording when there is one; text-to-speech
 * only when there is no recording, or the recording could not be played. A
 * clip that failed after most of it was heard is not read again.
 */
export async function narrateItem(
  item: NarrationItem,
  rate: number,
  where: NarrationLocation,
  deps: NarrateItemDeps
): Promise<NarratedWith> {
  if (item.audio !== undefined && item.audio !== null) {
    const outcome = await deps.playClip(item.audio, rate);
    if (outcome.result === 'finished') return 'clip';
    if (outcome.result === 'paused') return 'paused';
    if (outcome.result === 'stopped' || !deps.isCurrent()) return 'stopped';

    const progress = outcome.progress ?? 0;
    const skipTts = progress >= MOSTLY_HEARD;
    deps.report(
      {
        kind: 'clip-failed',
        fallback: skipTts ? 'none' : 'tts',
        reason: outcome.reason ?? 'unknown',
        progress,
        status: outcome.status,
      },
      item,
      where
    );
    if (skipTts) return 'clip-partial';
  } else {
    deps.report({ kind: 'no-recording' }, item, where);
  }

  if (!deps.isCurrent()) return 'stopped';
  await deps.speak(item.text, item.phase, rate);
  return deps.isCurrent() ? 'tts' : 'stopped';
}
