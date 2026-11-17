/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildNarrationSequence,
  narrateItem,
  MOSTLY_HEARD,
  type ClipOutcome,
  type NarrationEvent,
  type NarrationItem,
} from '../src/services/narrationSequence.ts';
import type { Sentence } from '../src/types/story.ts';

// Module ids stand in for require('…mp3') (numbers on native).
const sentences: Sentence[] = [
  { id: 'p01-s01', en: 'One.', vi: 'Một.', audio: { en: 101, vi: 102 } },
  { id: 'p01-s02', en: 'Two.', vi: 'Hai.', audio: { en: 201 } }, // no vi recording
  { id: 'p01-s03', en: 'Three.', vi: 'Ba.' }, // no recordings
];

const summary = (items: NarrationItem[]) => items.map((i) => `${i.sentenceIndex}${i.phase}:${i.audio ?? '-'}`);

// ─── Selection ───────────────────────────────────────────────

test('bilingual: each sentence EN then VI, each with its own language clip', () => {
  assert.deepEqual(summary(buildNarrationSequence(sentences, 'en', 'bilingual_parallel')), [
    '0en:101', '0vi:102', '1en:201', '1vi:-', '2en:-', '2vi:-',
  ]);
});

test('single language modes use only that language’s clips', () => {
  assert.deepEqual(summary(buildNarrationSequence(sentences, 'en', 'single_en')), ['0en:101', '1en:201', '2en:-']);
  assert.deepEqual(summary(buildNarrationSequence(sentences, 'en', 'single_vi')), ['0vi:102', '1vi:-', '2vi:-']);
});

test('vi-first mode follows the round language passed by the reader', () => {
  assert.deepEqual(summary(buildNarrationSequence(sentences, 'vi', 'vi_first_en_second')), ['0vi:102', '1vi:-', '2vi:-']);
  assert.deepEqual(summary(buildNarrationSequence(sentences, 'en', 'vi_first_en_second')), ['0en:101', '1en:201', '2en:-']);
});

test('text matches the language being voiced', () => {
  const items = buildNarrationSequence(sentences.slice(0, 1), 'en', 'bilingual_parallel');
  assert.deepEqual(items.map((i) => i.text), ['One.', 'Một.']);
});

test('single-sentence replay keeps the real sentence index', () => {
  const items = buildNarrationSequence([sentences[1]], 'en', 'single_en', 1);
  assert.equal(items[0].sentenceIndex, 1);
  assert.equal(items[0].audio, 201);
});

// ─── Fallback policy ─────────────────────────────────────────

function harness(outcome: ClipOutcome | null, opts: { currentAfterClip?: boolean } = {}) {
  const calls: string[] = [];
  const events: NarrationEvent[] = [];
  let current = true;
  const deps = {
    playClip: async (source: unknown) => {
      calls.push(`clip:${source}`);
      if (opts.currentAfterClip === false) current = false;
      return outcome!;
    },
    speak: async (text: string, phase: string) => {
      calls.push(`tts:${phase}:${text}`);
    },
    isCurrent: () => current,
    report: (e: NarrationEvent) => {
      events.push(e);
    },
  };
  return { calls, events, deps };
}
const where = { storyId: 'tam-cam', pageIndex: 2 };
const withClip: NarrationItem = { sentenceIndex: 0, text: 'One.', phase: 'en', audio: 101 };
const noClip: NarrationItem = { sentenceIndex: 2, text: 'Ba.', phase: 'vi' };

test('a recording that plays through never touches TTS', async () => {
  const h = harness({ result: 'finished' });
  assert.equal(await narrateItem(withClip, 0.9, where, h.deps), 'clip');
  assert.deepEqual(h.calls, ['clip:101']);
  assert.deepEqual(h.events, []);
});

test('a recording that fails early falls back to TTS and reports why', async () => {
  const h = harness({ result: 'failed', reason: 'did not start within 3500 ms', progress: 0 });
  assert.equal(await narrateItem(withClip, 0.9, where, h.deps), 'tts');
  assert.deepEqual(h.calls, ['clip:101', 'tts:en:One.']);
  assert.equal(h.events.length, 1);
  assert.deepEqual(h.events[0], {
    kind: 'clip-failed',
    fallback: 'tts',
    reason: 'did not start within 3500 ms',
    progress: 0,
    status: undefined,
  });
});

test('a recording that failed after most of it was heard is not read again', async () => {
  const h = harness({ result: 'failed', reason: 'stalled', progress: MOSTLY_HEARD + 0.05 });
  assert.equal(await narrateItem(withClip, 0.9, where, h.deps), 'clip-partial');
  assert.deepEqual(h.calls, ['clip:101']);
  assert.equal(h.events[0].kind === 'clip-failed' && h.events[0].fallback, 'none');
});

test('stopping during a recording neither speaks nor reports', async () => {
  const h = harness({ result: 'stopped' });
  assert.equal(await narrateItem(withClip, 0.9, where, h.deps), 'stopped');
  assert.deepEqual(h.calls, ['clip:101']);
  assert.deepEqual(h.events, []);
});

test('a failure after narration was stopped does not start TTS', async () => {
  const h = harness({ result: 'failed', reason: 'x', progress: 0 }, { currentAfterClip: false });
  assert.equal(await narrateItem(withClip, 0.9, where, h.deps), 'stopped');
  assert.deepEqual(h.calls, ['clip:101']);
});

test('no recording → TTS straight away (no clip attempt, no delay)', async () => {
  const h = harness(null);
  assert.equal(await narrateItem(noClip, 0.9, where, h.deps), 'tts');
  assert.deepEqual(h.calls, ['tts:vi:Ba.']);
  assert.deepEqual(h.events, [{ kind: 'no-recording' }]);
});

test('a clip paused from outside the app neither falls back to TTS nor reports a failure', async () => {
  const h = harness({ result: 'paused', progress: 0.4 });
  assert.equal(await narrateItem(withClip, 0.9, where, h.deps), 'paused');
  assert.deepEqual(h.calls, ['clip:101']);
  assert.deepEqual(h.events, []);
});
