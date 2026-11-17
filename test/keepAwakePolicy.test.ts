/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createKeepAwakeController, shouldKeepScreenAwake } from '../src/utils/keepAwakePolicy.ts';
import type { PlaybackStatus } from '../src/store/playbackStore.ts';

// ─── shouldKeepScreenAwake ───────────────────────────────────

test('keeps the screen awake only while playing, in the foreground, on the reader', () => {
  assert.equal(shouldKeepScreenAwake({ status: 'playing', appState: 'active', isFocused: true }), true);
});

test('normal timeout when playback is not running (stopped, paused, finished, failed)', () => {
  // Errors and the sleep timer both leave the reader in 'paused'.
  for (const status of ['idle', 'loading', 'paused', 'finished'] as PlaybackStatus[]) {
    assert.equal(shouldKeepScreenAwake({ status, appState: 'active', isFocused: true }), false, status);
  }
});

test('normal timeout when the app leaves the foreground', () => {
  for (const appState of ['background', 'inactive', 'unknown']) {
    assert.equal(shouldKeepScreenAwake({ status: 'playing', appState, isFocused: true }), false, appState);
  }
});

test('normal timeout when another screen covers the reader', () => {
  assert.equal(shouldKeepScreenAwake({ status: 'playing', appState: 'active', isFocused: false }), false);
});

// ─── createKeepAwakeController ───────────────────────────────

function fakeDriver(opts: { failActivate?: boolean } = {}) {
  const calls: string[] = [];
  return {
    calls,
    driver: {
      activate: async (tag: string) => {
        calls.push(`on:${tag}`);
        if (opts.failActivate) throw new Error('no wake lock');
      },
      deactivate: async (tag: string) => {
        calls.push(`off:${tag}`);
      },
    },
  };
}

test('activates once and deactivates once with its own tag', () => {
  const { calls, driver } = fakeDriver();
  const c = createKeepAwakeController(driver, 'reader');
  c.set(true);
  c.set(true); // same sentence / re-render: no stacking
  assert.equal(c.isHeld, true);
  c.set(false);
  c.set(false);
  assert.equal(c.isHeld, false);
  assert.deepEqual(calls, ['on:reader', 'off:reader']);
});

test('play → background → foreground → pause → leave', () => {
  const { calls, driver } = fakeDriver();
  const c = createKeepAwakeController(driver, 't');
  const step = (status: PlaybackStatus, appState: string, isFocused = true) =>
    c.set(shouldKeepScreenAwake({ status, appState, isFocused }));

  step('playing', 'active'); // play
  step('playing', 'background'); // app backgrounded
  step('playing', 'active'); // back while still playing
  step('paused', 'active'); // paused
  c.release(); // reader unmounted
  assert.deepEqual(calls, ['on:t', 'off:t', 'on:t', 'off:t']);
  assert.equal(c.isHeld, false);
});

test('release() when nothing is held does nothing', () => {
  const { calls, driver } = fakeDriver();
  const c = createKeepAwakeController(driver, 't');
  c.release();
  assert.deepEqual(calls, []);
});

test('platform failures are reported, never thrown (async rejection)', async () => {
  const { driver } = fakeDriver({ failActivate: true });
  const errors: unknown[] = [];
  const c = createKeepAwakeController(driver, 't', (e) => errors.push(e));
  c.set(true);
  await new Promise<void>((r) => setImmediate(r));
  assert.equal(errors.length, 1);
  // Still releases cleanly afterwards.
  c.set(false);
  assert.equal(c.isHeld, false);
});

test('platform failures are reported, never thrown (synchronous throw)', () => {
  const errors: unknown[] = [];
  const driver = {
    activate: (() => {
      throw new Error('sync');
    }) as unknown as (tag: string) => Promise<void>,
    deactivate: async () => {},
  };
  const c = createKeepAwakeController(driver, 't', (e) => errors.push(e));
  assert.doesNotThrow(() => c.set(true));
  assert.equal(errors.length, 1);
});
