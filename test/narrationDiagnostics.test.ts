/// <reference types="node" />
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  clearNarrationDiagnostics,
  getNarrationDiagnostics,
  reportNarrationEvent,
  setNarrationLogger,
} from '../src/services/narrationDiagnostics.ts';

const logged: string[] = [];
setNarrationLogger({ warn: (m) => logged.push(`warn ${m}`), error: (m) => logged.push(`error ${m}`) });
beforeEach(() => {
  logged.length = 0;
  clearNarrationDiagnostics();
});

test('a failed clip reports story, page, sentence, language and the playback error', () => {
  const d = reportNarrationEvent(
    { kind: 'clip-failed', fallback: 'tts', reason: 'player error: Cannot Open', progress: 0, status: { playing: false } },
    { sentenceIndex: 1, text: 'Hai.', phase: 'vi', audio: 7 },
    { storyId: 'tam-cam', pageIndex: 2 }
  );
  assert.ok(d);
  assert.equal(d.storyId, 'tam-cam');
  assert.equal(d.page, 3); // 1-based
  assert.equal(d.sentence, 2);
  assert.equal(d.language, 'vi');
  assert.equal(d.reason, 'player error: Cannot Open');
  assert.equal(logged.length, 1);
  // Not a dev build here: release builds log with console.error so it reaches the device log.
  assert.match(
    logged[0],
    /^error \[narration\] clip failed → TTS fallback \| story=tam-cam page=3 sentence=2 lang=vi \| player error: Cannot Open heard=0%$/
  );
  assert.equal(getNarrationDiagnostics().length, 1);
});

test('"no recording" is recorded once per story and language', () => {
  const item = { sentenceIndex: 0, text: 'x', phase: 'en' as const };
  reportNarrationEvent({ kind: 'no-recording' }, item, { storyId: 'little-rabbit-moon', pageIndex: 0 });
  reportNarrationEvent({ kind: 'no-recording' }, { ...item, sentenceIndex: 1 }, { storyId: 'little-rabbit-moon', pageIndex: 0 });
  reportNarrationEvent({ kind: 'no-recording' }, { ...item, phase: 'vi' }, { storyId: 'little-rabbit-moon', pageIndex: 0 });
  assert.equal(getNarrationDiagnostics().length, 2);
});

test('only the most recent entries are kept', () => {
  for (let i = 0; i < 80; i++) {
    reportNarrationEvent(
      { kind: 'clip-failed', fallback: 'tts', reason: `r${i}`, progress: 0 },
      { sentenceIndex: 0, text: 'x', phase: 'en', audio: 1 },
      { storyId: 's', pageIndex: 0 }
    );
  }
  const all = getNarrationDiagnostics();
  assert.equal(all.length, 50);
  assert.equal(all[all.length - 1].reason, 'r79');
});
