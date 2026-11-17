// ============================================================
// ClipPlaybackWatch — decides when a narration clip has finished, has
// failed, or needs a nudge, from expo-audio status events plus a clock.
// Pure (no React Native / Expo imports) so it is unit-tested with
// `node --test`; NarrationAudioService feeds it real player events.
//
// Why progress-based rather than "duration + slack":
// on iOS the clip can be paused by the system (e.g. the shared audio
// session being deactivated) and then never finishes. A fixed timer
// waited the clip length + 2.5 s and then fell back to TTS, which
// re-read a sentence that had already partly played. Here we watch
// `currentTime` actually advancing, nudge a stalled player once, and
// recognise a clip that reached its end even if `didJustFinish` was lost.
// ============================================================

/** The subset of expo-audio's `AudioStatus` the watch reads. */
export interface ClipStatusLike {
  isLoaded?: boolean;
  playing?: boolean;
  currentTime?: number;
  duration?: number;
  didJustFinish?: boolean;
  error?: string | null;
  playbackState?: string;
  timeControlStatus?: string;
  reasonForWaitingToPlay?: string;
  isBuffering?: boolean;
}

export type WatchAction =
  | { type: 'none' }
  | { type: 'finish' }
  /** Ask the player to play again (re-activates the audio session on iOS). */
  | { type: 'nudge'; why: string }
  /**
   * Paused from outside the app's own controls while it was playing: a phone
   * call or alarm, headphones unplugged, or the lock-screen / notification
   * pause button. Narration should pause like the in-app Pause button,
   * neither resuming on its own nor falling back to TTS.
   */
  | { type: 'paused' }
  | { type: 'fail'; reason: string };

export interface ClipWatchOptions {
  /** Nudge once if the clip has not started after this long. */
  startNudgeMs: number;
  /** Give up if the clip has not started after this long. */
  startTimeoutMs: number;
  /** A playing clip whose position has not moved for this long is stalled. */
  stallMs: number;
  /** Treat a stalled clip within this many seconds of its end as finished. */
  endToleranceSec: number;
  /** Hard cap for one clip, regardless of progress. */
  maxClipMs: number;
}

export const DEFAULT_CLIP_WATCH_OPTIONS: ClipWatchOptions = {
  startNudgeMs: 1000,
  startTimeoutMs: 3500,
  stallMs: 2000,
  endToleranceSec: 0.3,
  maxClipMs: 60_000,
};

const NONE: WatchAction = { type: 'none' };

/**
 * A deliberate pause, as opposed to waiting for data: not buffering, and on iOS
 * AVPlayer reports `paused` (a stall reports `waitingToPlayAtSpecifiedRate`).
 * Android does not send timeControlStatus; isBuffering separates the cases.
 */
function isPausedState(s: ClipStatusLike): boolean {
  if (s.playing !== false || s.isBuffering === true) return false;
  return s.timeControlStatus === undefined || s.timeControlStatus === 'paused';
}

export class ClipPlaybackWatch {
  private readonly startedAt: number;
  private readonly opts: ClipWatchOptions;
  private seenPlaying = false;
  private startNudged = false;
  private stallNudged = false;
  private lastTime = 0;
  private lastProgressAt: number;
  private duration = 0;
  private last: ClipStatusLike | null = null;
  private done = false;

  constructor(startedAt: number, opts: Partial<ClipWatchOptions> = {}) {
    this.startedAt = startedAt;
    this.lastProgressAt = startedAt;
    this.opts = { ...DEFAULT_CLIP_WATCH_OPTIONS, ...opts };
  }

  /** Feed one `playbackStatusUpdate` event. */
  onStatus(s: ClipStatusLike, now: number): WatchAction {
    if (this.done) return NONE;
    this.last = s;

    if (s.error) return this.end({ type: 'fail', reason: `player error: ${s.error}` });
    if (s.didJustFinish) return this.end({ type: 'finish' });

    const t = typeof s.currentTime === 'number' && Number.isFinite(s.currentTime) ? s.currentTime : null;
    if (s.playing) {
      if (!this.seenPlaying) {
        this.seenPlaying = true;
        this.lastProgressAt = now;
        if (t !== null) this.lastTime = t;
      } else if (t !== null && Math.abs(t - this.lastTime) > 0.02) {
        this.lastTime = t;
        this.lastProgressAt = now;
        this.stallNudged = false; // moving again: a later stall may be nudged once more
      }
      if (typeof s.duration === 'number' && s.duration > 0) this.duration = s.duration;
    } else if (this.seenPlaying && t !== null) {
      if (t > this.lastTime) this.lastTime = t;
      // Stopped at (or next to) the end without a didJustFinish: it finished.
      if (this.duration > 0 && this.lastTime >= this.duration - this.opts.endToleranceSec) {
        return this.end({ type: 'finish' });
      }
      if (isPausedState(s)) return this.end({ type: 'paused' });
    }
    return NONE;
  }

  /** Call periodically (every ~250 ms). */
  onTick(now: number): WatchAction {
    if (this.done) return NONE;
    const o = this.opts;

    if (now - this.startedAt >= o.maxClipMs) {
      return this.end({ type: 'fail', reason: `exceeded ${o.maxClipMs} ms (${this.describe()})` });
    }

    if (!this.seenPlaying) {
      const waited = now - this.startedAt;
      if (waited >= o.startTimeoutMs) {
        return this.end({ type: 'fail', reason: `did not start within ${o.startTimeoutMs} ms (${this.describe()})` });
      }
      if (waited >= o.startNudgeMs && !this.startNudged) {
        this.startNudged = true;
        return { type: 'nudge', why: `not started after ${waited} ms` };
      }
      return NONE;
    }

    if (now - this.lastProgressAt >= o.stallMs) {
      if (this.duration > 0 && this.lastTime >= this.duration - o.endToleranceSec) {
        return this.end({ type: 'finish' });
      }
      if (!this.stallNudged) {
        this.stallNudged = true;
        this.lastProgressAt = now;
        return { type: 'nudge', why: `stalled at ${this.position()}` };
      }
      return this.end({ type: 'fail', reason: `stalled at ${this.position()} (${this.describe()})` });
    }
    return NONE;
  }

  /** Fraction of the clip heard so far (0 when unknown). */
  get progress(): number {
    return this.duration > 0 ? Math.min(this.lastTime / this.duration, 1) : 0;
  }

  get started(): boolean {
    return this.seenPlaying;
  }

  get lastStatus(): ClipStatusLike | null {
    return this.last;
  }

  private position(): string {
    return `${this.lastTime.toFixed(2)}/${this.duration > 0 ? this.duration.toFixed(2) : '?'}s`;
  }

  private describe(): string {
    const s = this.last;
    if (!s) return 'no status events';
    return [
      `loaded=${s.isLoaded ?? '?'}`,
      `playing=${s.playing ?? '?'}`,
      s.playbackState ? `state=${s.playbackState}` : '',
      s.timeControlStatus ? `timeControl=${s.timeControlStatus}` : '',
      s.reasonForWaitingToPlay ? `waiting=${s.reasonForWaitingToPlay}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private end(a: WatchAction): WatchAction {
    this.done = true;
    return a;
  }
}
