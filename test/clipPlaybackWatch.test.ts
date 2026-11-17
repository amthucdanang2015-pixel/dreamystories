/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ClipPlaybackWatch, DEFAULT_CLIP_WATCH_OPTIONS as O } from '../src/services/clipPlaybackWatch.ts';

const playing = (t: number, d = 4) => ({ isLoaded: true, playing: true, currentTime: t, duration: d });

test('normal clip: finishes on didJustFinish', () => {
  const w = new ClipPlaybackWatch(0);
  assert.equal(w.onStatus({ isLoaded: true, playing: false, currentTime: 0, duration: 4 }, 50).type, 'none');
  assert.equal(w.onStatus(playing(0.2), 300).type, 'none');
  assert.equal(w.onTick(500).type, 'none');
  assert.equal(w.onStatus(playing(3.9), 4000).type, 'none');
  assert.equal(w.onStatus({ didJustFinish: true, playing: false, currentTime: 4, duration: 4 }, 4200).type, 'finish');
  // Nothing after it has settled.
  assert.equal(w.onTick(99_000).type, 'none');
});

test('player error fails immediately with the underlying message', () => {
  const w = new ClipPlaybackWatch(0);
  const a = w.onStatus({ error: 'The operation could not be completed' }, 100);
  assert.deepEqual(a, { type: 'fail', reason: 'player error: The operation could not be completed' });
});

test('a clip that never starts is nudged once, then fails with the player state', () => {
  const w = new ClipPlaybackWatch(0);
  w.onStatus({ isLoaded: true, playing: false, timeControlStatus: 'waitingToPlayAtSpecifiedRate', reasonForWaitingToPlay: 'noItemToPlay' }, 50);
  assert.equal(w.onTick(O.startNudgeMs - 1).type, 'none');
  assert.equal(w.onTick(O.startNudgeMs).type, 'nudge');
  assert.equal(w.onTick(O.startNudgeMs + 250).type, 'none'); // only one nudge
  const a = w.onTick(O.startTimeoutMs);
  assert.equal(a.type, 'fail');
  assert.match((a as { reason: string }).reason, /did not start within 3500 ms .*timeControl=waitingToPlayAtSpecifiedRate .*waiting=noItemToPlay/);
});

test('a nudge that gets the clip going avoids the fallback', () => {
  const w = new ClipPlaybackWatch(0);
  assert.equal(w.onTick(O.startNudgeMs).type, 'nudge');
  w.onStatus(playing(0.1), 1300);
  w.onStatus(playing(1.8), 3000);
  assert.equal(w.onTick(O.startTimeoutMs + 100).type, 'none');
  assert.equal(w.onStatus({ didJustFinish: true }, 5000).type, 'finish');
});

test('a clip stuck waiting mid-way is nudged, then fails with how far it got', () => {
  const w = new ClipPlaybackWatch(0);
  w.onStatus(playing(0.1), 200);
  w.onStatus(playing(1.2), 1300);
  w.onStatus(
    { isLoaded: true, playing: false, currentTime: 1.2, duration: 4, timeControlStatus: 'waitingToPlayAtSpecifiedRate' },
    1400
  );
  assert.equal(w.onTick(1300 + O.stallMs).type, 'nudge');
  const a = w.onTick(1300 + O.stallMs * 2);
  assert.equal(a.type, 'fail');
  assert.match((a as { reason: string }).reason, /stalled at 1\.20\/4\.00s/);
  assert.equal(Math.round(w.progress * 100), 30);
});

test('reaching the end without didJustFinish still counts as finished', () => {
  const w = new ClipPlaybackWatch(0);
  w.onStatus(playing(0.1), 200);
  w.onStatus(playing(3.85), 4000);
  assert.equal(w.onStatus({ isLoaded: true, playing: false, currentTime: 3.95, duration: 4 }, 4100).type, 'finish');
});

test('a stall right at the end is treated as finished (no TTS re-read)', () => {
  const w = new ClipPlaybackWatch(0);
  w.onStatus(playing(0.1), 200);
  w.onStatus(playing(3.8), 4000);
  assert.equal(w.onTick(4000 + O.stallMs).type, 'finish');
});

test('slow narration speed is fine as long as the position keeps moving', () => {
  const w = new ClipPlaybackWatch(0);
  let now = 0;
  for (let t = 0; t <= 8; t += 0.25) {
    now += 500; // half speed: 0.25 s of audio per 500 ms
    assert.equal(w.onStatus(playing(t, 8), now).type, 'none');
    assert.equal(w.onTick(now).type, 'none');
  }
  assert.equal(w.onStatus({ didJustFinish: true }, now + 100).type, 'finish');
});

test('a stale "paused" event from the previous clip is not mistaken for the end', () => {
  const w = new ClipPlaybackWatch(0);
  // Previous clip paused at its end, delivered after the new listener attached.
  assert.equal(w.onStatus({ isLoaded: true, playing: false, currentTime: 4, duration: 4 }, 10).type, 'none');
  assert.equal(w.started, false);
});

test('hard cap ends a runaway clip', () => {
  const w = new ClipPlaybackWatch(0, { maxClipMs: 10_000, stallMs: 60_000 });
  w.onStatus(playing(0.1), 100);
  assert.equal(w.onTick(10_000).type, 'fail');
});

// ─── Paused from outside the app ─────────────────────────────

test('a call / unplugged headphones / lock-screen pause mid-clip pauses narration (iOS)', () => {
  const w = new ClipPlaybackWatch(0);
  w.onStatus(playing(0.1), 200);
  w.onStatus(playing(1.5), 1700);
  const a = w.onStatus({ isLoaded: true, playing: false, currentTime: 1.5, duration: 4, timeControlStatus: 'paused' }, 1800);
  assert.equal(a.type, 'paused');
  // Settled: no nudge that would resume it, no failure that would start TTS.
  assert.equal(w.onTick(10_000).type, 'none');
});

test('notification pause on Android (no timeControlStatus) pauses narration', () => {
  const w = new ClipPlaybackWatch(0);
  w.onStatus(playing(0.1), 200);
  assert.equal(w.onStatus({ isLoaded: true, playing: false, isBuffering: false, currentTime: 2, duration: 4 }, 2100).type, 'paused');
});

test('buffering is not mistaken for a pause', () => {
  const w = new ClipPlaybackWatch(0);
  w.onStatus(playing(0.1), 200);
  assert.equal(w.onStatus({ isLoaded: true, playing: false, isBuffering: true, currentTime: 1, duration: 4 }, 1100).type, 'none');
});

test('a pause before the clip ever started is not an external pause', () => {
  const w = new ClipPlaybackWatch(0);
  assert.equal(w.onStatus({ isLoaded: true, playing: false, currentTime: 0, duration: 4, timeControlStatus: 'paused' }, 50).type, 'none');
});
