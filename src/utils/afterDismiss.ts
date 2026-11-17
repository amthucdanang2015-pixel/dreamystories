// ============================================================
// Run an action only after a modal has finished closing — pure logic
// (no React Native imports, so it runs under `node --test`).
//
// Why: on iOS, React Native presents the share sheet (and StoreKit,
// alerts, …) on the top-most presented view controller. If that is a
// <Modal> that is still animating out, UIKit silently drops the new
// presentation, and for Share.share the promise never settles. So the
// parental gate hands its follow-up action to this queue, and the
// queue runs it from Modal.onDismiss (iOS) or after a short delay
// (Android / web, where onDismiss does not fire). A fallback timer
// guarantees the action still runs if onDismiss is never delivered.
// Each action runs at most once.
// ============================================================

export interface Timers {
  setTimeout: (fn: () => void, ms: number) => unknown;
  clearTimeout: (handle: unknown) => void;
}

export interface AfterDismissQueue {
  /** Queue `action` to run after the modal is gone (replaces any queued action). */
  schedule(action: () => void, waitMs: number): void;
  /** Call from Modal.onDismiss: runs the queued action now. */
  dismissed(): void;
  /** Drop the queued action without running it (e.g. on unmount). */
  cancel(): void;
  /** True while an action is waiting. */
  readonly pending: boolean;
}

export function createAfterDismissQueue(timers: Timers): AfterDismissQueue {
  let queued: (() => void) | null = null;
  let handle: unknown = null;

  const clear = () => {
    if (handle !== null) timers.clearTimeout(handle);
    handle = null;
  };

  const run = () => {
    const action = queued;
    queued = null;
    clear();
    action?.();
  };

  return {
    schedule(action, waitMs) {
      clear();
      queued = action;
      handle = timers.setTimeout(run, Math.max(0, waitMs));
    },
    dismissed() {
      if (queued) run();
    },
    cancel() {
      queued = null;
      clear();
    },
    get pending() {
      return queued !== null;
    },
  };
}

/**
 * How long to wait before running the gated action when no dismiss
 * event is expected (Android / web) and the fallback when it is (iOS).
 * The gate fades out (~300 ms on iOS, ~200 ms on Android).
 */
export function afterDismissDelay(platform: string): number {
  return platform === 'ios' ? 1000 : 350;
}
