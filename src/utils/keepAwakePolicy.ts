// ============================================================
// Keep-awake policy — pure logic (no React Native / Expo imports, so it
// runs under `node --test`). Wired up in src/hooks/usePlaybackKeepAwake.ts.
// ============================================================

import type { PlaybackStatus } from '../store/playbackStore';

export interface KeepAwakeInputs {
  status: PlaybackStatus;
  /** React Native AppState: 'active' | 'background' | 'inactive' | … */
  appState: string;
  /** The reader screen is the focused route (not covered by another screen). */
  isFocused: boolean;
}

/**
 * The screen stays on only while a story is actually being read aloud in the
 * foreground on the reader screen. Paused, finished, failed (→ paused), idle,
 * backgrounded or navigated away: normal screen timeout applies again.
 */
export function shouldKeepScreenAwake({ status, appState, isFocused }: KeepAwakeInputs): boolean {
  return status === 'playing' && appState === 'active' && isFocused;
}

export interface KeepAwakeDriver {
  activate: (tag: string) => Promise<void>;
  deactivate: (tag: string) => Promise<void>;
}

export interface KeepAwakeController {
  /** Hold or release the wake lock; repeated calls with the same value are no-ops. */
  set: (keepAwake: boolean) => void;
  /** Release unconditionally (screen unmount). */
  release: () => void;
  readonly isHeld: boolean;
}

/**
 * Idempotent wrapper around the platform keep-awake API under a single tag,
 * so it never stacks activations or releases another feature's lock.
 * Failures (e.g. the Web Wake Lock API is unavailable) are reported, never thrown.
 */
export function createKeepAwakeController(
  driver: KeepAwakeDriver,
  tag: string,
  onError: (err: unknown) => void = () => {}
): KeepAwakeController {
  let held = false;
  const run = (p: () => Promise<void>) => {
    try {
      p().catch(onError);
    } catch (err) {
      onError(err);
    }
  };
  const set = (keepAwake: boolean) => {
    if (keepAwake === held) return;
    held = keepAwake;
    run(() => (keepAwake ? driver.activate(tag) : driver.deactivate(tag)));
  };
  return {
    set,
    release: () => set(false),
    get isHeld() {
      return held;
    },
  };
}
