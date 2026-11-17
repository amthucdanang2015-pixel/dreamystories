// ============================================================
// Speech Service — on-device TTS narration via expo-speech
// Bilingual English (en-US) & Vietnamese (vi-VN).
//
// - Picks the best installed voice per language (enhanced/premium,
//   on-device, exact locale) instead of the system default.
// - Every speak() finishes exactly once: done, error, stop, or a
//   watchdog if the engine never reports back, so narration can't hang.
// - Callbacks from an utterance that was replaced or stopped are ignored.
// ============================================================

import * as Speech from 'expo-speech';
import { configureNarrationAudioMode, holdNarrationSession } from './narrationAudioService';

type SpeechCallback = () => void;

export interface SpeakOptions {
  text: string;
  language?: string; // BCP-47 e.g. 'en-US', 'vi-VN'
  rate?: number;      // 0.5 – 1.5
  onDone?: SpeechCallback;
  onError?: (error: string) => void;
}

type NarrationLocale = 'en-US' | 'vi-VN';

/** Watchdog slack added to the estimated utterance length. */
const WATCHDOG_SLACK_MS = 5000;
/** How long to wait for the voice list before speaking with the default voice. */
const VOICE_LOOKUP_TIMEOUT_MS = 1500;

/** Rough spoken length of a sentence, used for the watchdog and the no-engine fallback. */
function estimateDurationMs(text: string, rate: number): number {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const isVietnamese = /[àáâãèéêìíòóôõùúýăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(text);
  const baseWPM = isVietnamese ? 85 : 110;
  const msPerWord = 60_000 / baseWPM / Math.max(rate, 0.4);
  return Math.max(wordCount * msPerWord, 600);
}

/**
 * Apple novelty and Eloquence voices. Native iOS identifiers name them
 * (".speech.synthesis.voice.", ".eloquence."), but browsers only expose the
 * display name, so they are also matched by name.
 */
const UNSUITABLE_VOICE_NAME =
  /^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Fred|Good News|Hysterical|Jester|Junior|Kathy|Organ|Pipe Organ|Princess|Ralph|Superstar|Trinoids|Whisper|Wobble|Zarvox|Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley)\b/i;

/** Higher is better. Returns -1 for voices that should never be used for narration. */
function scoreVoice(voice: Speech.Voice, locale: NarrationLocale): number {
  const lang = voice.language.replace('_', '-').toLowerCase();
  const wanted = locale.toLowerCase();
  if (!lang.startsWith(wanted.slice(0, 2))) return -1;
  const id = voice.identifier.toLowerCase();
  // iOS novelty / legacy voices (Bahh, Bells, Eloquence "Grandpa", ...) sound wrong for bedtime stories.
  if (id.includes('speech.synthesis.voice') || id.includes('eloquence')) return -1;
  if (UNSUITABLE_VOICE_NAME.test(voice.name)) return -1;

  let score = 1;
  if (lang === wanted) score += 4; // exact locale: en-US rather than en-IN
  if (voice.quality === Speech.VoiceQuality.Enhanced) score += 3;
  if (id.includes('premium')) score += 4; // iOS premium voices report "Default" quality
  else if (id.includes('enhanced')) score += 2;
  if (id.includes('network')) score -= 3; // Android cloud voices need a connection
  if ((voice as Speech.WebVoice).localService === true) score += 1;
  return score;
}

class SpeechService {
  private _timer: ReturnType<typeof setTimeout> | null = null;
  private _isSpeaking = false;
  /** Incremented per utterance; callbacks from older utterances are ignored. */
  private _token = 0;
  private _voices: Promise<Partial<Record<NarrationLocale, string>>> | null = null;
  private _warnedMissing = new Set<NarrationLocale>();

  get isSpeaking(): boolean {
    return this._isSpeaking;
  }

  /** Best installed voice per narration language (looked up once). */
  private _loadVoices(): Promise<Partial<Record<NarrationLocale, string>>> {
    if (!this._voices) {
      this._voices = Speech.getAvailableVoicesAsync()
        .then((voices) => {
          const pick = (locale: NarrationLocale) => {
            let best: Speech.Voice | undefined;
            let bestScore = 0;
            for (const v of voices) {
              const s = scoreVoice(v, locale);
              if (s > bestScore) {
                best = v;
                bestScore = s;
              }
            }
            return best?.identifier;
          };
          return { 'en-US': pick('en-US'), 'vi-VN': pick('vi-VN') };
        })
        .catch(() => ({}));
      // Some engines return an empty list before they finish loading; retry next time.
      this._voices.then((v) => {
        if (!v['en-US'] && !v['vi-VN']) this._voices = null;
      });
    }
    return this._voices;
  }

  private async _voiceFor(locale: NarrationLocale): Promise<string | undefined> {
    const voices = await Promise.race([
      this._loadVoices(),
      new Promise<Partial<Record<NarrationLocale, string>>>((r) =>
        setTimeout(() => r({}), VOICE_LOOKUP_TIMEOUT_MS)
      ),
    ]);
    const id = voices[locale];
    if (!id && !this._warnedMissing.has(locale) && Object.keys(voices).length > 0) {
      this._warnedMissing.add(locale);
      console.warn(
        `No ${locale} text-to-speech voice is installed; the system default voice will be used.`
      );
    }
    return id;
  }

  /** Start loading voices early so the first sentence isn't delayed. */
  preload(): void {
    this._loadVoices();
  }

  speak(opts: SpeakOptions): void {
    this.stop();

    const { text, rate = 0.9, onDone, onError } = opts;
    const token = ++this._token;
    holdNarrationSession();

    if (!text || !text.trim()) {
      onDone?.();
      return;
    }

    const locale: NarrationLocale = opts.language?.startsWith('vi') ? 'vi-VN' : 'en-US';
    const clampedRate = Math.min(Math.max(rate, 0.5), 1.5);
    this._isSpeaking = true;

    // Settle exactly once, and only if this utterance is still the current one.
    const finish = (error?: string) => {
      if (token !== this._token) return;
      this._clearTimer();
      this._isSpeaking = false;
      if (error && onError) onError(error);
      else onDone?.();
    };

    (async () => {
      await configureNarrationAudioMode();
      const voice = await this._voiceFor(locale);
      if (token !== this._token) return; // stopped or replaced while preparing

      // If the engine never calls back (e.g. a missing voice), don't leave narration waiting.
      this._timer = setTimeout(
        () => finish(),
        estimateDurationMs(text, clampedRate) * 2 + WATCHDOG_SLACK_MS
      );

      try {
        Speech.speak(text, {
          language: locale,
          voice,
          rate: clampedRate,
          onDone: () => finish(),
          onError: (err) => finish((err as Error)?.message || 'Speech error'),
        });
      } catch {
        // Native engine unavailable: keep the reading rhythm with a timer.
        this._clearTimer();
        this._timer = setTimeout(() => finish(), estimateDurationMs(text, clampedRate));
      }
    })();
  }

  private _clearTimer(): void {
    if (this._timer !== null) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  stop(): void {
    this._token++;
    this._clearTimer();
    this._isSpeaking = false;
    try {
      Speech.stop();
    } catch {}
  }
}

export const speechService = new SpeechService();
