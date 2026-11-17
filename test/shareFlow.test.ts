/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { afterDismissDelay, createAfterDismissQueue, type Timers } from '../src/utils/afterDismiss.ts';
import { buildShareArgs, isShareableUrl } from '../src/utils/sharePayload.ts';

const APP_STORE_URL = 'https://apps.apple.com/app/id6834674576';

function fakeTimers() {
  const pending = new Map<number, () => void>();
  let next = 1;
  const timers: Timers = {
    setTimeout: (fn) => {
      const id = next++;
      pending.set(id, fn);
      return id;
    },
    clearTimeout: (h) => void pending.delete(h as number),
  };
  const flush = () => {
    for (const [id, fn] of [...pending]) {
      pending.delete(id);
      fn();
    }
  };
  return { timers, flush, count: () => pending.size };
}

// ─── Gate → share hand-off ───────────────────────────────────

test('the approved action does not run while the gate is still closing', () => {
  const { timers } = fakeTimers();
  const q = createAfterDismissQueue(timers);
  let ran = 0;
  q.schedule(() => ran++, afterDismissDelay('ios'));
  assert.equal(ran, 0);
  assert.equal(q.pending, true);
});

test('iOS: runs once on Modal.onDismiss, and the fallback timer does not run it again', () => {
  const { timers, flush, count } = fakeTimers();
  const q = createAfterDismissQueue(timers);
  let ran = 0;
  q.schedule(() => ran++, afterDismissDelay('ios'));
  q.dismissed();
  assert.equal(ran, 1);
  assert.equal(count(), 0, 'fallback timer cleared');
  flush();
  q.dismissed();
  assert.equal(ran, 1);
});

test('runs from the fallback timer when no dismiss event arrives (Android / missed event)', () => {
  const { timers, flush } = fakeTimers();
  const q = createAfterDismissQueue(timers);
  let ran = 0;
  q.schedule(() => ran++, afterDismissDelay('android'));
  flush();
  assert.equal(ran, 1);
  assert.equal(q.pending, false);
});

test('cancel drops the queued action', () => {
  const { timers, flush } = fakeTimers();
  const q = createAfterDismissQueue(timers);
  let ran = 0;
  q.schedule(() => ran++, 100);
  q.cancel();
  flush();
  q.dismissed();
  assert.equal(ran, 0);
});

test('a dismiss with nothing queued (cancelled gate) does nothing', () => {
  const { timers } = fakeTimers();
  const q = createAfterDismissQueue(timers);
  assert.doesNotThrow(() => q.dismissed());
});

test('iOS waits for the dismiss event longer than the fade; Android waits past its fade', () => {
  assert.ok(afterDismissDelay('ios') >= 500);
  assert.ok(afterDismissDelay('android') >= 250 && afterDismissDelay('android') <= 600);
});

// ─── Share.share payload ─────────────────────────────────────

const input = { title: 'Dreamy Stories', message: 'A calm bilingual storybook.', url: APP_STORE_URL };

test('iOS: link is its own url item, message stays plain, subject set', () => {
  const { content, options } = buildShareArgs('ios', input);
  assert.deepEqual(content, { message: 'A calm bilingual storybook.', url: APP_STORE_URL });
  assert.deepEqual(options, { subject: 'Dreamy Stories' });
});

test('Android: link appended to the message (url is ignored there), chooser titled', () => {
  const { content, options } = buildShareArgs('android', input);
  assert.equal(content.message, `A calm bilingual storybook.\n${APP_STORE_URL}`);
  assert.equal(content.url, undefined);
  assert.equal(content.title, 'Dreamy Stories');
  assert.equal(options.dialogTitle, 'Dreamy Stories');
});

test('without a link every platform still gets a non-empty message', () => {
  for (const p of ['ios', 'android', 'web']) {
    const { content } = buildShareArgs(p, { ...input, url: null });
    assert.equal(content.message, 'A calm bilingual storybook.', p);
    assert.equal(content.url, undefined, p);
  }
});

test('the configured App Store URL is a valid share link; non-https links are dropped', () => {
  assert.equal(isShareableUrl(APP_STORE_URL), true);
  assert.equal(isShareableUrl('storymoon://story/x'), false);
  assert.equal(isShareableUrl('http://example.com'), false);
  assert.equal(buildShareArgs('ios', { ...input, url: 'storymoon://x' }).content.url, undefined);
});

test('sharing config keeps the App Store link and the grown-up check', async () => {
  const { SHARE_CONFIG, SHARE_REQUIRES_PARENTAL_GATE } = await import('../src/constants/sharing.ts');
  assert.equal(SHARE_CONFIG.appStoreUrl, APP_STORE_URL);
  assert.equal(SHARE_REQUIRES_PARENTAL_GATE, true);
});
