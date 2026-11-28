// ============================================================
// Learning Mode word card ↔ narration — pure logic (no React Native / Expo
// imports, so it runs under `node --test`). Wired up in app/reader/[id].tsx.
//
// Opening the word card while the story is being read aloud pauses it;
// closing the card resumes only if the card itself paused it. A story that
// was already paused, stopped or finished stays that way.
// ============================================================

import type { PlaybackStatus } from '../store/playbackStore';

/** Narration counts as running while it plays or is still starting. */
export function isPlaybackRunning(status: PlaybackStatus): boolean {
  return status === 'playing' || status === 'loading';
}

export interface WordModalPlaybackHost {
  /** Current playback status, read fresh at each event. */
  getStatus: () => PlaybackStatus;
  /** Learning Mode is on (word cards only exist in Learning Mode). */
  isLearningMode: () => boolean;
  /** Pause exactly like the in-app Pause button. */
  pause: () => void;
  /** Continue exactly like the in-app Play button. */
  resume: () => void;
}

export interface WordModalPlayback {
  /** A word was tapped. Call for every tap, including while a card is already open. */
  opened: () => void;
  /** The card was dismissed (Got it, ✕, backdrop or Android back). */
  closed: () => void;
  /** Something else stopped narration for good while the card was open (sleep timer). */
  cancelResume: () => void;
  /** For tests and debugging. */
  readonly state: { open: boolean; resumeOnClose: boolean };
}

export function createWordModalPlayback(host: WordModalPlaybackHost): WordModalPlayback {
  let open = false;
  let resumeOnClose = false;

  return {
    opened() {
      // Another word while a card is open: keep the decision made on the first open.
      if (open) return;
      open = true;
      resumeOnClose = false;
      if (!host.isLearningMode()) return;
      if (isPlaybackRunning(host.getStatus())) {
        resumeOnClose = true;
        host.pause();
      }
    },
    closed() {
      // Extra close events (e.g. backdrop and button in the same frame) are ignored.
      if (!open) return;
      open = false;
      const shouldResume = resumeOnClose;
      resumeOnClose = false;
      // Resume only from the pause the card made. If something else changed the
      // state meanwhile (Play from the lock screen, story finished), leave it.
      if (shouldResume && host.getStatus() === 'paused') host.resume();
    },
    cancelResume() {
      resumeOnClose = false;
    },
    get state() {
      return { open, resumeOnClose };
    },
  };
}
