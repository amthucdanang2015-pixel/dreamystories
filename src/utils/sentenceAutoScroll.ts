// ============================================================
// Sentence auto-scroll — pure decision logic (no React Native imports,
// so it runs under `node --test`). The hook in
// src/hooks/useSentenceAutoScroll.tsx wires it to a ScrollView.
// ============================================================

/** How long after the reader's last touch/scroll auto-scroll stays paused. */
export const USER_SCROLL_COOLDOWN_MS = 2500;

export interface AutoScrollState {
  /** Sentence key the scroll position was last settled for (scrolled or skipped). */
  lastKey: string | null;
  /** A finger is on the story right now (drag or touch in progress). */
  interacting: boolean;
  /** Time (ms) of the reader's latest touch/scroll; 0 = never. */
  lastInteractionAt: number;
}

export const initialAutoScrollState = (): AutoScrollState => ({
  lastKey: null,
  interacting: false,
  lastInteractionAt: 0,
});

/**
 * What to do when sentence `key` is (re)reported as the one being read:
 * - `same`: this sentence was already handled — never move while it plays.
 * - `blocked`: the reader is (or just was) scrolling; leave the view alone and
 *   resume when the *next* sentence starts.
 * - `scroll`: measure the sentence and bring it near the top.
 */
export type AutoScrollDecision = 'same' | 'blocked' | 'scroll';

export function decideAutoScroll(
  state: AutoScrollState,
  key: string,
  now: number,
  cooldownMs: number = USER_SCROLL_COOLDOWN_MS
): AutoScrollDecision {
  if (key === state.lastKey) return 'same';
  if (state.interacting) return 'blocked';
  if (state.lastInteractionAt > 0 && now - state.lastInteractionAt < cooldownMs) return 'blocked';
  return 'scroll';
}

/** Space left above the sentence: a little breathing room that grows with the screen. */
export function topGapFor(viewportHeight: number): number {
  return Math.round(Math.min(Math.max(viewportHeight * 0.06, 12), 40));
}

export interface ScrollTargetInput {
  /** Sentence top, in scroll-content coordinates. */
  sentenceTop: number;
  sentenceHeight: number;
  /** Current scroll offset (or where an in-flight programmatic scroll is heading). */
  offset: number;
  viewportHeight: number;
  contentHeight: number;
  /**
   * Fraction of the viewport (from the top) that counts as "near the top".
   * A sentence already fully visible with its top inside this band is not
   * moved, which avoids small, needless jumps.
   */
  band?: number;
}

/** Default "near the top" band. The first sentence of a page uses a looser one so its art stays in view. */
export const NEAR_TOP_BAND = 0.3;
export const PAGE_START_BAND = 0.5;

/**
 * Offset that puts the sentence near the top (clamped to the scrollable
 * range), or `null` when it already sits comfortably near the top.
 */
export function computeSentenceScrollTarget({
  sentenceTop,
  sentenceHeight,
  offset,
  viewportHeight,
  contentHeight,
  band = NEAR_TOP_BAND,
}: ScrollTargetInput): number | null {
  if (viewportHeight <= 0) return null;
  const gap = topGapFor(viewportHeight);
  const maxOffset = Math.max(contentHeight - viewportHeight, 0);
  const desired = Math.min(Math.max(sentenceTop - gap, 0), maxOffset);

  const visibleTop = sentenceTop - offset;
  const fitsInView = sentenceHeight <= viewportHeight - gap;
  const alreadyNearTop =
    visibleTop >= gap / 2 &&
    visibleTop <= Math.max(viewportHeight * band, gap) &&
    (!fitsInView || visibleTop + sentenceHeight <= viewportHeight);
  if (alreadyNearTop) return null;

  if (Math.abs(desired - offset) < 2) return null;
  return desired;
}
