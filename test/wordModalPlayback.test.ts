/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWordModalPlayback } from '../src/utils/wordModalPlayback.ts';
import type { PlaybackStatus } from '../src/store/playbackStore.ts';

/** A fake reader: pause/resume change the status like the real buttons do. */
function fakeReader(initial: PlaybackStatus, learningMode = true) {
  const r = {
    status: initial,
    learningMode,
    calls: [] as string[],
  };
  const ctrl = createWordModalPlayback({
    getStatus: () => r.status,
    isLearningMode: () => r.learningMode,
    pause: () => {
      r.calls.push('pause');
      r.status = 'paused';
    },
    resume: () => {
      r.calls.push('resume');
      r.status = 'playing';
    },
  });
  return { r, ctrl };
}

test('playing: opening the card pauses, closing it resumes', () => {
  const { r, ctrl } = fakeReader('playing');
  ctrl.opened();
  assert.equal(r.status, 'paused');
  ctrl.closed();
  assert.equal(r.status, 'playing');
  assert.deepEqual(r.calls, ['pause', 'resume']);
});

test('narration still starting (loading) counts as playing', () => {
  const { r, ctrl } = fakeReader('loading');
  ctrl.opened();
  ctrl.closed();
  assert.deepEqual(r.calls, ['pause', 'resume']);
});

test('paused, stopped, idle or finished: the card never pauses or resumes', () => {
  for (const status of ['paused', 'idle', 'finished'] as PlaybackStatus[]) {
    const { r, ctrl } = fakeReader(status);
    ctrl.opened();
    ctrl.closed();
    assert.equal(r.status, status, status);
    assert.deepEqual(r.calls, [], status);
  }
});

test('Learning Mode off: playback is left alone', () => {
  const { r, ctrl } = fakeReader('playing', false);
  ctrl.opened();
  ctrl.closed();
  assert.equal(r.status, 'playing');
  assert.deepEqual(r.calls, []);
});

test('another word tapped while a card is open keeps the first decision', () => {
  const { r, ctrl } = fakeReader('playing');
  ctrl.opened();
  ctrl.opened(); // status is now 'paused' — must not forget it was playing
  ctrl.closed();
  assert.deepEqual(r.calls, ['pause', 'resume']);
});

test('duplicate close events resume only once', () => {
  const { r, ctrl } = fakeReader('playing');
  ctrl.opened();
  ctrl.closed();
  ctrl.closed();
  assert.deepEqual(r.calls, ['pause', 'resume']);
});

test('close without an open does nothing', () => {
  const { r, ctrl } = fakeReader('paused');
  ctrl.closed();
  assert.deepEqual(r.calls, []);
});

test('repeated open/close cycles follow the state just before each open', () => {
  const { r, ctrl } = fakeReader('playing');
  ctrl.opened();
  ctrl.closed(); // resumed → playing
  ctrl.opened();
  ctrl.closed(); // resumed again
  r.status = 'paused'; // user pauses
  ctrl.opened();
  ctrl.closed(); // stays paused
  assert.equal(r.status, 'paused');
  assert.deepEqual(r.calls, ['pause', 'resume', 'pause', 'resume']);
});

test('playback started elsewhere while the card is open is not resumed twice', () => {
  const { r, ctrl } = fakeReader('playing');
  ctrl.opened();
  r.status = 'playing'; // e.g. Play from the lock screen
  ctrl.closed();
  assert.deepEqual(r.calls, ['pause']);
});

test('story finished while the card is open stays finished', () => {
  const { r, ctrl } = fakeReader('playing');
  ctrl.opened();
  r.status = 'finished';
  ctrl.closed();
  assert.equal(r.status, 'finished');
  assert.deepEqual(r.calls, ['pause']);
});

test('sleep timer ending while the card is open cancels the resume', () => {
  const { r, ctrl } = fakeReader('playing');
  ctrl.opened();
  ctrl.cancelResume();
  ctrl.closed();
  assert.equal(r.status, 'paused');
  assert.deepEqual(r.calls, ['pause']);
});
