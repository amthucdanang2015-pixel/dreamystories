// ============================================================
// Playback Controller
// Orchestrates narration, sentence highlighting, page turning
// ============================================================

import { Sentence, Language, ReadingMode } from '../types/story';
import { speechService } from './speechService';
import { narrationAudioService, scheduleNarrationSessionRelease } from './narrationAudioService';
import { buildNarrationSequence, narrateItem, resumeIndex, type NarrationPosition } from './narrationSequence';
import { reportNarrationEvent } from './narrationDiagnostics';

export interface PageNarrationContext {
  storyId: string;
  pageIndex: number;
  sentences: Sentence[];
  language: Language;
  readingMode: ReadingMode;
  speed: number;
  /** Index of sentences[0] on the page (for single-sentence replays); diagnostics only. */
  sentenceIndexBase?: number;
  /** Resume at this sentence/phase (e.g. after Pause) instead of the page start. */
  startAt?: NarrationPosition | null;
}

export interface PlaybackCallbacks {
  onSentenceStart: (sentenceIndex: number, phase: 'en' | 'vi') => void;
  onSentenceDone: (sentenceIndex: number, phase: 'en' | 'vi') => void;
  onPageDone: () => void;
  onError: (err: string) => void;
  /**
   * Narration was paused from outside the app (call, alarm, unplugged
   * headphones, lock-screen / notification pause). The loop has stopped.
   */
  onExternalPause?: () => void;
}

class PlaybackController {
  private _aborted = true;
  /** Incremented on every start/stop so a superseded narration loop exits. */
  private _session = 0;
  private _currentPageIndex = -1;
  private _currentSentenceIndex = -1;
  private _currentStoryId: string | null = null;

  get isActive(): boolean {
    return !this._aborted;
  }

  /**
   * Narrate a single page's sentences according to the reading mode.
   * Each sentence plays its recorded MP3 for the phase language; if the clip
   * is missing or fails, that sentence falls back to on-device TTS.
   */
  async narratePage(
    ctx: PageNarrationContext,
    callbacks: PlaybackCallbacks
  ): Promise<void> {
    const session = ++this._session;
    this._aborted = false;
    this._currentStoryId = ctx.storyId;
    this._currentPageIndex = ctx.pageIndex;

    const isCurrent = () => !this._aborted && session === this._session;
    const { sentences, language, readingMode, speed } = ctx;

    // Determine narration sequence
    const sequence = buildNarrationSequence(sentences, language, readingMode);
    const base = ctx.sentenceIndexBase ?? 0;
    const where = { storyId: ctx.storyId, pageIndex: ctx.pageIndex };

    for (let i = resumeIndex(sequence, ctx.startAt); i < sequence.length; i++) {
      if (!isCurrent()) return;

      const item = sequence[i];
      callbacks.onSentenceStart(item.sentenceIndex, item.phase);
      this._currentSentenceIndex = item.sentenceIndex;

      const voiced = await narrateItem(item, speed, where, {
        playClip: (source, rate) => narrationAudioService.play(source, rate),
        speak: (text, phase, rate) => this._speakAsync(text, phase, rate),
        isCurrent,
        report: (event, it, loc) =>
          reportNarrationEvent(event, { ...it, sentenceIndex: it.sentenceIndex + base }, loc),
      });

      if (voiced === 'paused' && isCurrent()) {
        this.stop();
        callbacks.onExternalPause?.();
        return;
      }
      if (!isCurrent()) return;
      callbacks.onSentenceDone(item.sentenceIndex, item.phase);

      // Small gap between sentences
      if (i < sequence.length - 1) {
        await this._delay(300);
      }
    }

    if (isCurrent()) {
      // Release the audio session if nothing follows (the next play holds it).
      scheduleNarrationSessionRelease();
      callbacks.onPageDone();
    }
  }

  private _speakAsync(text: string, phase: Language, speed: number): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this._aborted) {
        resolve();
        return;
      }
      this._resolveSpeech = resolve;

      const langCode = phase === 'vi' ? 'vi-VN' : 'en-US';
      const done = () => {
        if (this._resolveSpeech === resolve) this._resolveSpeech = null;
        resolve();
      };

      speechService.speak({
        text,
        language: langCode,
        rate: speed,
        onDone: done,
        onError: done, // Don't block on error
      });
    });
  }

  /** Resolves a pending TTS wait when narration is stopped (expo-speech does not call onDone on stop). */
  private _resolveSpeech: (() => void) | null = null;

  private _delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this._aborted) {
        resolve();
        return;
      }
      setTimeout(resolve, ms);
    });
  }

  stop(): void {
    const wasActive = !this._aborted;
    this._aborted = true;
    this._session++;
    narrationAudioService.stop();
    speechService.stop();
    const r = this._resolveSpeech;
    this._resolveSpeech = null;
    r?.();
    // Narration is idle now: give the audio session back once it stays idle.
    if (wasActive) scheduleNarrationSessionRelease();
  }

  /**
   * Playback was started from outside the app (Android notification / lock
   * screen) while narration was idle. While narration is running (e.g. during
   * a text-to-speech sentence) the stray clip is silenced instead.
   */
  onExternalPlay(listener: () => void): () => void {
    return narrationAudioService.addExternalPlayListener(() => {
      if (this.isActive) narrationAudioService.stop();
      else listener();
    });
  }

  pause(): void {
    this.stop();
  }
}

// Singleton controller
export const playbackController = new PlaybackController();
