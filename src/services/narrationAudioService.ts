// ============================================================
// Narration Audio Service — plays pre-recorded sentence MP3s
// via expo-audio. One reusable player; every play() resolves
// exactly once (finished / failed / stopped) so the playback
// controller can never be left waiting.
//
// iOS audio session: expo-audio's pause() and end-of-clip both schedule
// a session deactivation 100 ms later unless the player was created with
// keepAudioSessionActive. That check only counts players already in the
// `.playing` state, so a clip that was still loading (every new sentence,
// and the first sentence right after the 1 s page-turn sound) had the
// session pulled from under it, stalled, and fell back to text-to-speech.
// Narration therefore keeps the session active while it runs and releases
// it itself once narration has been idle for a moment.
//
// Background: narration keeps playing when the screen locks or the user
// switches apps (needs UIBackgroundModes=audio on iOS, from the expo-audio
// plugin's enableBackgroundPlayback, plus shouldPlayInBackground here,
// without which expo-audio pauses every player on backgrounding). On Android
// the player is registered with the media session (setNowPlaying) so the
// foreground media service and its notification keep the process alive.
// ============================================================

import { Platform } from 'react-native';
import {
  createAudioPlayer,
  setAudioModeAsync,
  setIsAudioActiveAsync,
  AudioPlayer,
  AudioSource,
  AudioStatus,
} from 'expo-audio';
import { ClipPlaybackWatch, type ClipWatchOptions } from './clipPlaybackWatch';
import type { ClipOutcome } from './narrationSequence';

export type NarrationResult = ClipOutcome['result'];

/** How often the watch is ticked while a clip plays. */
const TICK_MS = 250;
/** Release the audio session after narration has been idle this long. */
const SESSION_IDLE_RELEASE_MS = 3000;

let modeConfigured: Promise<void> | null = null;

/**
 * Shared audio session for narration (recorded clips and text-to-speech,
 * which uses the app's audio session on iOS): audible with the silent
 * switch on, keeps playing with the screen locked or another app in front,
 * ducks other audio (and is paused by calls, alarms and unplugged headphones).
 * Configured once; never rejects.
 */
export function configureNarrationAudioMode(): Promise<void> {
  if (!modeConfigured) {
    // Don't let a slow audio session hold up narration.
    modeConfigured = Promise.race([
      setAudioModeAsync({
        playsInSilentMode: true,
        // Without this expo-audio pauses every player when the app is backgrounded.
        shouldPlayInBackground: true,
        // iOS: duck other audio (mixable; needs no lock-screen controls for
        // background audio). Android: exclusive focus, which expo-audio's media
        // notification requires, and which gives proper focus loss on calls.
        interruptionMode: Platform.OS === 'android' ? 'doNotMix' : 'duckOthers',
      }).catch(() => {}),
      new Promise<void>((resolve) => setTimeout(resolve, 1000)),
    ]);
  }
  return modeConfigured;
}

// ─── Session lifetime ─────────────────────────────────────────

let releaseTimer: ReturnType<typeof setTimeout> | null = null;

/** Narration (clip or speech) is about to make sound: keep the session. */
export function holdNarrationSession(): void {
  if (releaseTimer) {
    clearTimeout(releaseTimer);
    releaseTimer = null;
  }
}

/**
 * Narration stopped: once it stays idle, deactivate the session so other
 * apps' audio is no longer ducked. The next play() re-activates it.
 */
export function scheduleNarrationSessionRelease(): void {
  holdNarrationSession();
  if (Platform.OS !== 'ios') return;
  releaseTimer = setTimeout(() => {
    releaseTimer = null;
    setIsAudioActiveAsync(false).catch(() => {});
  }, SESSION_IDLE_RELEASE_MS);
}

// ─── Player ──────────────────────────────────────────────────

export interface NowPlaying {
  title: string;
  artist?: string;
}

/** Our own pause/stop can still deliver a late "playing" event for this long. */
const OWN_PAUSE_GRACE_MS = 600;

class NarrationAudioService {
  private _player: AudioPlayer | null = null;
  private _settle: ((o: ClipOutcome) => void) | null = null;
  private _nowPlaying: NowPlaying | null = null;
  private _lockScreenActive = false;
  private _ownPauseAt = 0;
  private _externalPlayListeners = new Set<() => void>();

  private async _ensurePlayer(): Promise<AudioPlayer> {
    await configureNarrationAudioMode();
    if (!this._player) {
      const player = createAudioPlayer(null, {
        updateInterval: TICK_MS,
        // See the header: never let pause()/clip end deactivate the session mid-narration.
        keepAudioSessionActive: true,
      });
      this._player = player;
      // Between clips nothing is being watched: a "playing" update then can
      // only come from outside the app (notification / lock-screen play).
      player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
        if (this._settle || !status.playing) return;
        if (Date.now() - this._ownPauseAt < OWN_PAUSE_GRACE_MS) return;
        setTimeout(() => {
          if (this._settle || this._player !== player || !player.playing) return;
          this._externalPlayListeners.forEach((l) => l());
        }, 150);
      });
      this._applyNowPlaying();
    }
    return this._player;
  }

  /** Called when playback is started from outside the app while narration is idle. */
  addExternalPlayListener(listener: () => void): () => void {
    this._externalPlayListeners.add(listener);
    return () => this._externalPlayListeners.delete(listener);
  }

  /**
   * Show the story in the Android media notification / lock screen (null to
   * clear). On Android this also starts expo-audio's foreground media service,
   * which is what keeps narration alive in the background there. iOS needs no
   * controls for background audio, and does not show them for this mixable
   * (ducking) session, so nothing is registered there.
   */
  setNowPlaying(meta: NowPlaying | null): void {
    this._nowPlaying = meta;
    if (meta && !this._player) {
      // Create the player now so the service is bound before playback starts.
      this._ensurePlayer().catch(() => {});
      return;
    }
    this._applyNowPlaying();
  }

  private _applyNowPlaying(): void {
    const player = this._player;
    if (!player || Platform.OS !== 'android') return;
    try {
      if (this._nowPlaying) {
        const metadata = { title: this._nowPlaying.title, artist: this._nowPlaying.artist };
        if (this._lockScreenActive) {
          player.updateLockScreenMetadata(metadata);
        } else {
          player.setActiveForLockScreen(true, metadata, { showSeekForward: false, showSeekBackward: false });
          this._lockScreenActive = true;
        }
      } else if (this._lockScreenActive) {
        player.clearLockScreenControls();
        this._lockScreenActive = false;
      }
    } catch (err) {
      console.warn('[narration] media controls unavailable:', errorText(err));
    }
  }

  /**
   * Play one narration clip. Resolves when it finishes, fails, or is stopped.
   * Never rejects. A failed outcome carries the reason and how much was heard.
   * `watchOptions` overrides the watchdog timings (remote clips need time to buffer);
   * bundled clips use the defaults.
   */
  async play(source: AudioSource, rate = 1.0, watchOptions?: Partial<ClipWatchOptions>): Promise<ClipOutcome> {
    this.stop();
    holdNarrationSession();

    let player: AudioPlayer;
    try {
      player = await this._ensurePlayer();
    } catch (err) {
      return { result: 'failed', reason: `could not create player: ${errorText(err)}`, progress: 0 };
    }

    return new Promise<ClipOutcome>((resolve) => {
      const watch = new ClipPlaybackWatch(Date.now(), watchOptions);
      let done = false;
      let ticker: ReturnType<typeof setInterval> | null = null;
      let sub: { remove: () => void } | null = null;

      const settle = (outcome: ClipOutcome) => {
        if (done) return;
        done = true;
        if (ticker) clearInterval(ticker);
        sub?.remove();
        if (this._settle === settle) this._settle = null;
        if (outcome.result !== 'finished') {
          this._ownPauseAt = Date.now();
          try {
            player.pause();
          } catch {}
        }
        resolve({ progress: watch.progress, status: watch.lastStatus ?? undefined, ...outcome });
      };
      this._settle = settle;

      const act = (a: ReturnType<ClipPlaybackWatch['onTick']>) => {
        switch (a.type) {
          case 'finish':
            settle({ result: 'finished' });
            break;
          case 'fail':
            settle({ result: 'failed', reason: a.reason });
            break;
          case 'paused':
            settle({ result: 'paused' });
            break;
          case 'nudge':
            // Re-activates the audio session and resumes a system-paused player.
            try {
              player.play();
            } catch {}
            break;
        }
      };

      sub = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
        if (!done) act(watch.onStatus(status, Date.now()));
      });
      ticker = setInterval(() => {
        if (!done) act(watch.onTick(Date.now()));
      }, TICK_MS);

      try {
        player.replace(source);
        try {
          player.setPlaybackRate(rate, 'high');
        } catch {
          player.playbackRate = rate;
        }
        player.play();
      } catch (err) {
        settle({ result: 'failed', reason: `could not start: ${errorText(err)}` });
      }
    });
  }

  stop(): void {
    const settle = this._settle;
    this._settle = null;
    if (settle) settle({ result: 'stopped' });
    this._ownPauseAt = Date.now();
    try {
      this._player?.pause();
    } catch {}
  }

  release(): void {
    this.setNowPlaying(null);
    this.stop();
    try {
      this._player?.remove();
    } catch {}
    this._player = null;
  }
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export const narrationAudioService = new NarrationAudioService();
