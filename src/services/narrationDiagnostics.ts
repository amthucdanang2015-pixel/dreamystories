// ============================================================
// Narration diagnostics — every time a sentence is not voiced by its
// bundled recording, record where (story, page, sentence, language) and
// why (the underlying player error / stall / timeout).
//
// Logged with a "[narration]" prefix. In release builds (TestFlight)
// React Native drops console.warn, so failures are logged with
// console.error there, which reaches the device log (Console.app /
// Xcode → Devices). The most recent entries are also kept in memory
// (getNarrationDiagnostics) for debugging tools.
// Pure (no React Native imports) so it is unit-tested.
// ============================================================

import type { NarrationEvent, NarrationItem, NarrationLocation } from './narrationSequence';

export interface NarrationDiagnostic {
  at: number;
  kind: NarrationEvent['kind'];
  storyId: string;
  /** 1-based, as shown to readers. */
  page: number;
  sentence: number;
  language: 'en' | 'vi';
  fallback: 'tts' | 'none';
  reason?: string;
  progress?: number;
  status?: unknown;
}

const MAX_ENTRIES = 50;
const entries: NarrationDiagnostic[] = [];
/** "No recording" is expected for some stories: log it once per story + language. */
const reportedMissing = new Set<string>();

type Logger = (message: string, detail?: unknown) => void;

declare const __DEV__: boolean | undefined;
const isDev = typeof __DEV__ !== 'undefined' && __DEV__;

let logger: { warn: Logger; error: Logger } = {
  warn: (m, d) => (d === undefined ? console.warn(m) : console.warn(m, d)),
  error: (m, d) => (d === undefined ? console.error(m) : console.error(m, d)),
};

/** Tests swap the console out. */
export function setNarrationLogger(l: { warn: Logger; error: Logger }): void {
  logger = l;
}

export function formatNarrationDiagnostic(d: NarrationDiagnostic): string {
  const where = `story=${d.storyId} page=${d.page} sentence=${d.sentence} lang=${d.language}`;
  if (d.kind === 'no-recording') return `[narration] no recording → TTS | ${where}`;
  const action = d.fallback === 'tts' ? 'TTS fallback' : 'no fallback (mostly heard)';
  const heard = d.progress !== undefined ? ` heard=${Math.round(d.progress * 100)}%` : '';
  return `[narration] clip failed → ${action} | ${where} | ${d.reason ?? 'unknown'}${heard}`;
}

export function reportNarrationEvent(
  event: NarrationEvent,
  item: NarrationItem,
  where: NarrationLocation
): NarrationDiagnostic | null {
  const base = {
    at: Date.now(),
    kind: event.kind,
    storyId: where.storyId,
    page: where.pageIndex + 1,
    sentence: item.sentenceIndex + 1,
    language: item.phase,
  };

  if (event.kind === 'no-recording') {
    const key = `${where.storyId}:${item.phase}`;
    if (reportedMissing.has(key)) return null;
    reportedMissing.add(key);
    const d: NarrationDiagnostic = { ...base, fallback: 'tts' };
    push(d);
    // Expected for stories without recordings: a dev-only note.
    if (isDev) logger.warn(formatNarrationDiagnostic(d));
    return d;
  }

  const d: NarrationDiagnostic = {
    ...base,
    fallback: event.fallback,
    reason: event.reason,
    progress: event.progress,
    status: event.status,
  };
  push(d);
  (isDev ? logger.warn : logger.error)(formatNarrationDiagnostic(d), event.status);
  return d;
}

function push(d: NarrationDiagnostic) {
  entries.push(d);
  if (entries.length > MAX_ENTRIES) entries.shift();
}

/** Most recent narration problems, oldest first. */
export function getNarrationDiagnostics(): readonly NarrationDiagnostic[] {
  return entries.slice();
}

export function clearNarrationDiagnostics(): void {
  entries.length = 0;
  reportedMissing.clear();
}
