/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeSentenceScrollTarget,
  decideAutoScroll,
  initialAutoScrollState,
  topGapFor,
  NEAR_TOP_BAND,
  PAGE_START_BAND,
  USER_SCROLL_COOLDOWN_MS,
} from '../src/utils/sentenceAutoScroll.ts';

// ─── decideAutoScroll ─────────────────────────────────────────

test('scrolls when a new sentence starts', () => {
  const s = initialAutoScrollState();
  assert.equal(decideAutoScroll(s, 'p1:s1', 1000), 'scroll');
});

test('never moves again while the same sentence is playing (e.g. EN → VI of one sentence)', () => {
  const s = { ...initialAutoScrollState(), lastKey: 'p1:s1' };
  assert.equal(decideAutoScroll(s, 'p1:s1', 1000), 'same');
});

test('pauses while the reader is dragging', () => {
  const s = { ...initialAutoScrollState(), lastKey: 'p1:s1', interacting: true, lastInteractionAt: 900 };
  assert.equal(decideAutoScroll(s, 'p1:s2', 1000), 'blocked');
});

test('stays paused during the cooldown after the reader lets go', () => {
  const s = { ...initialAutoScrollState(), lastKey: 'p1:s1', lastInteractionAt: 10_000 };
  assert.equal(decideAutoScroll(s, 'p1:s2', 10_000 + USER_SCROLL_COOLDOWN_MS - 1), 'blocked');
});

test('resumes when the next sentence starts after the cooldown', () => {
  const s = { ...initialAutoScrollState(), lastKey: 'p1:s2', lastInteractionAt: 10_000 };
  assert.equal(decideAutoScroll(s, 'p1:s3', 10_000 + USER_SCROLL_COOLDOWN_MS), 'scroll');
});

test('a sentence skipped while blocked is not scrolled to later in that same sentence', () => {
  // The hook records a blocked sentence as handled, so the cooldown expiring
  // mid-sentence does not yank the view; the next sentence resumes.
  const s = { ...initialAutoScrollState(), lastInteractionAt: 1000 };
  assert.equal(decideAutoScroll(s, 'p1:s2', 1500), 'blocked');
  s.lastKey = 'p1:s2';
  assert.equal(decideAutoScroll(s, 'p1:s2', 1000 + USER_SCROLL_COOLDOWN_MS + 5000), 'same');
  assert.equal(decideAutoScroll(s, 'p1:s3', 1000 + USER_SCROLL_COOLDOWN_MS + 5000), 'scroll');
});

// ─── topGapFor ───────────────────────────────────────────────

test('top gap scales with the screen but stays small', () => {
  assert.equal(topGapFor(100), 12); // floor on tiny areas
  assert.equal(topGapFor(500), 30); // phone text area
  assert.equal(topGapFor(1200), 40); // tablet, capped
});

// ─── computeSentenceScrollTarget ──────────────────────────────

const phone = { viewportHeight: 600, contentHeight: 3000 };
const tablet = { viewportHeight: 1100, contentHeight: 5000 };

test('brings a sentence below the fold near the top, leaving a gap above it', () => {
  const target = computeSentenceScrollTarget({ ...phone, sentenceTop: 900, sentenceHeight: 80, offset: 0 });
  assert.equal(target, 900 - topGapFor(600));
});

test('brings a sentence above the viewport back near the top', () => {
  const target = computeSentenceScrollTarget({ ...phone, sentenceTop: 200, sentenceHeight: 80, offset: 800 });
  assert.equal(target, 200 - topGapFor(600));
});

test('does not move a sentence already near the top', () => {
  const target = computeSentenceScrollTarget({ ...phone, sentenceTop: 1050, sentenceHeight: 80, offset: 1000 });
  assert.equal(target, null);
});

test('moves a sentence that is visible but low on screen', () => {
  // Visible (top at 70% of the viewport) but outside the near-top band.
  const target = computeSentenceScrollTarget({ ...phone, sentenceTop: 1420, sentenceHeight: 80, offset: 1000 });
  assert.equal(target, 1420 - topGapFor(600));
});

test('first sentence of a page uses the looser band so the page art can stay in view', () => {
  const input = { ...phone, sentenceTop: 1250, sentenceHeight: 80, offset: 1000 }; // ~42% down
  assert.notEqual(computeSentenceScrollTarget({ ...input, band: NEAR_TOP_BAND }), null);
  assert.equal(computeSentenceScrollTarget({ ...input, band: PAGE_START_BAND }), null);
});

test('clamps to the end of the content (last sentences cannot reach the top)', () => {
  const target = computeSentenceScrollTarget({ ...phone, sentenceTop: 2900, sentenceHeight: 80, offset: 0 });
  assert.equal(target, 3000 - 600);
});

test('never scrolls above the start of the content', () => {
  const target = computeSentenceScrollTarget({ ...phone, sentenceTop: 5, sentenceHeight: 80, offset: 400 });
  assert.equal(target, 0);
});

test('short content that does not scroll produces no movement', () => {
  const target = computeSentenceScrollTarget({
    viewportHeight: 600,
    contentHeight: 400,
    sentenceTop: 300,
    sentenceHeight: 60,
    offset: 0,
  });
  assert.equal(target, null);
});

test('works the same on large screens', () => {
  const target = computeSentenceScrollTarget({ ...tablet, sentenceTop: 2000, sentenceHeight: 120, offset: 0 });
  assert.equal(target, 2000 - 40);
  assert.equal(
    computeSentenceScrollTarget({ ...tablet, sentenceTop: 2000 + 100, sentenceHeight: 120, offset: 2000 }),
    null
  );
});

test('a sentence taller than the viewport is still placed at the top', () => {
  const target = computeSentenceScrollTarget({ ...phone, sentenceTop: 1500, sentenceHeight: 900, offset: 0 });
  assert.equal(target, 1500 - topGapFor(600));
});

test('no layout yet → no scroll', () => {
  assert.equal(
    computeSentenceScrollTarget({ viewportHeight: 0, contentHeight: 0, sentenceTop: 100, sentenceHeight: 10, offset: 0 }),
    null
  );
});
