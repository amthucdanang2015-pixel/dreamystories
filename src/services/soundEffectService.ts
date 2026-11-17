// ============================================================
// Sound Effect Service
// Plays page-turning sounds, gentle chime, and haptic feedback.
// Uses soumages-book-opening.mp3 for realistic paper page turning
// combined with Expo Haptics on native devices.
// ============================================================

import { Platform } from 'react-native';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { BOOK_OPENING_SOUND_BASE64 } from '../assets/sounds/bookOpeningSound';

// Bundled page-turn sound for iOS/Android. It has its own player, separate
// from the narration player, so the two never interrupt each other.
const PAGE_TURN_SOUND = require('../../assets/sounds/soumages-book-opening.mp3');

class SoundEffectService {
  private _audioCtx: any = null;
  private _decodedBuffer: any = null;
  private _isLoadingBuffer = false;
  private _lastPlayedAt = 0;
  private _nativePlayer: AudioPlayer | null = null;
  private _pageTurnPromise: Promise<void> | null = null;
  private static readonly DEBOUNCE_MS = 320;
  public static readonly PAGE_TURN_DURATION_MS = 1050;

  private _getAudioContext(): any {
    if (Platform.OS !== 'web') return null;
    try {
      if (typeof window !== 'undefined') {
        const AudioCtx =
          (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          if (!this._audioCtx) {
            this._audioCtx = new AudioCtx();
          }
          if (this._audioCtx.state === 'suspended') {
            this._audioCtx.resume();
          }
          return this._audioCtx;
        }
      }
    } catch { }
    return null;
  }

  private async _getDecodedBuffer(ctx: any): Promise<any> {
    if (this._decodedBuffer) return this._decodedBuffer;
    if (this._isLoadingBuffer) return null;
    this._isLoadingBuffer = true;

    try {
      if (typeof atob === 'function') {
        console.log("next page");
        const binaryString = atob(BOOK_OPENING_SOUND_BASE64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const buffer = await new Promise((resolve, reject) => {
          ctx.decodeAudioData(bytes.buffer.slice(0), resolve, reject);
        });
        this._decodedBuffer = buffer;
        return buffer;
      }
    } catch {
      // Fall back if decoding fails
    } finally {
      this._isLoadingBuffer = false;
    }
    return null;
  }

  /**
   * Play the page-turn sound using assets/sounds/soumages-book-opening.mp3.
   * Debounced to prevent duplicate sounds when page-turn events overlap.
   * Returns a Promise that resolves when the sound effect finishes playing.
   */
  async playPageTurn(): Promise<void> {
    const now = Date.now();
    if (now - this._lastPlayedAt < SoundEffectService.DEBOUNCE_MS) {
      return this._pageTurnPromise || Promise.resolve();
    }
    this._lastPlayedAt = now;

    // 1. Tactile haptic feedback
    this.triggerHaptic();

    // 2. Play page-turning audio from soumages-book-opening.mp3
    let playPromise: Promise<void>;

    if (Platform.OS !== 'web') {
      playPromise = new Promise<void>((resolve) => {
        try {
          if (!this._nativePlayer) {
            // keepAudioSessionActive: otherwise the sound's own end schedules an
            // iOS session deactivation ~100 ms later, exactly when the first
            // narration clip of the new page is loading (the reader starts it
            // 1050 ms after this 1.0 s sound), which stalled that clip.
            this._nativePlayer = createAudioPlayer(PAGE_TURN_SOUND, { keepAudioSessionActive: true });
            this._nativePlayer.volume = 1;
          }
          const player = this._nativePlayer;
          player.seekTo(0).then(() => {
            player.play();
          }).catch(() => { });
        } catch { }

        setTimeout(resolve, SoundEffectService.PAGE_TURN_DURATION_MS);
      });
    } else {
      playPromise = new Promise<void>((resolve) => {
        let finished = false;
        const done = () => {
          if (!finished) {
            finished = true;
            resolve();
          }
        };

        const timer = setTimeout(done, SoundEffectService.PAGE_TURN_DURATION_MS);

        try {
          const ctx = this._getAudioContext();
          if (ctx) {
            this._getDecodedBuffer(ctx).then((buffer) => {
              if (buffer) {
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.65, ctx.currentTime);
                source.connect(gain);
                gain.connect(ctx.destination);
                source.onended = () => {
                  clearTimeout(timer);
                  done();
                };
                source.start(0);
                return;
              }

              if (typeof Audio !== 'undefined') {
                const audio = new Audio(`data:audio/mp3;base64,${BOOK_OPENING_SOUND_BASE64}`);
                audio.volume = 0.65;
                audio.onended = () => {
                  clearTimeout(timer);
                  done();
                };
                audio.play().catch(done);
              } else {
                done();
              }
            }).catch(done);
            return;
          }

          // HTML5 Audio fallback for web
          if (typeof Audio !== 'undefined') {
            const audio = new Audio(`data:audio/mp3;base64,${BOOK_OPENING_SOUND_BASE64}`);
            audio.volume = 0.65;
            audio.onended = () => {
              clearTimeout(timer);
              done();
            };
            audio.play().catch(done);
          } else {
            done();
          }
        } catch {
          done();
        }
      });
    }

    playPromise.finally(() => {
      if (this._pageTurnPromise === playPromise) {
        this._pageTurnPromise = null;
      }
    });

    this._pageTurnPromise = playPromise;
    return playPromise;
  }

  /**
   * Waits for the current page turn sound to finish playing, if one is currently active.
   */
  async waitForPageTurn(): Promise<void> {
    if (this._pageTurnPromise) {
      await this._pageTurnPromise;
    }
  }

  /**
   * Play a soft bedtime chime
   */
  async playBedtimeChime(): Promise<void> {
    const ctx = this._getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz peaceful frequency
      osc.frequency.exponentialRampToValueAtTime(396, ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch { }
  }

  /**
   * Trigger subtle physical haptic feedback
   */
  async triggerHaptic(): Promise<void> {
    try {
      const Haptics = require('expo-haptics');
      if (Haptics && Haptics.impactAsync) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch { }
  }
}

export const soundEffectService = new SoundEffectService();
