/// <reference types="node" />
// Full-catalog check: every sentence of every story with content JSON has its
// recordings on disk, registered in storyAssets.generated.ts at the matching
// page/sentence/language (no stale, shifted or swapped entries), and each file
// is a real MPEG audio stream. Languages a story was never recorded in are
// listed explicitly below (those sentences use text-to-speech by design).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src/data/stories/content');
const REGISTRY = fs.readFileSync(path.join(ROOT, 'src/data/stories/storyAssets.generated.ts'), 'utf8');
/**
 * Recorded gaps, by design (as of the 2026-11-13 VoiceStudio run): the original
 * bedtime stories were recorded in Vietnamese only. Their English lines are
 * read with on-device TTS. Adding the files + regenerating the registry should
 * come with removing the entry here.
 */
const UNRECORDED_LANGUAGES: Record<string, Array<'en' | 'vi'>> = {
  'dom-dom-soi-duong': ['en'],
  'may-nho-lam-mua': ['en'],
  'ngoi-sao-be-ti': ['en'],
  'thuyen-giay-dam-sen': ['en'],
};

const pad = (n: number) => String(n).padStart(2, '0');
const expectedPath = (id: string, p: number, s: number, lang: string) =>
  `assets/audio/${id}/page-${pad(p)}/sentence-${pad(s)}-${lang}.mp3`;

interface Content {
  id: string;
  pages: Array<{ sentences: string[][] }>;
}
const stories: Content[] = fs
  .readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort()
  .map((f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8')));

/** storyId → pages → sentences → { en, vi } paths as registered (null = undefined). */
function parseRegistry(): Map<string, Array<Array<{ en: string | null; vi: string | null }>>> {
  const out = new Map<string, Array<Array<{ en: string | null; vi: string | null }>>>();
  const blocks = REGISTRY.split(/^  '([a-z0-9-]+)': \{$/m);
  for (let i = 1; i < blocks.length; i += 2) {
    const id = blocks[i];
    const pages = blocks[i + 1].split(/^\s+\{\n\s+image:/m).slice(1);
    out.set(
      id,
      pages.map((pg) =>
        [...pg.matchAll(/\{ en: (require\('([^']+)'\)|undefined), vi: (require\('([^']+)'\)|undefined) \}/g)].map((m) => ({
          en: m[2] ? m[2].replace('../../../', '') : null,
          vi: m[4] ? m[4].replace('../../../', '') : null,
        }))
      )
    );
  }
  return out;
}
const registry = parseRegistry();

/** True when the file holds MPEG audio frames (after an optional ID3v2 tag). */
function isMpegAudio(file: string): boolean {
  const buf = fs.readFileSync(file);
  let off = 0;
  if (buf.subarray(0, 3).toString('latin1') === 'ID3') {
    const size = ((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f);
    off = 10 + size;
  }
  // Skip padding, then expect an MPEG frame sync (11 set bits).
  while (off < buf.length && buf[off] === 0) off++;
  return off + 1 < buf.length && buf[off] === 0xff && (buf[off + 1] & 0xe0) === 0xe0;
}

test('catalog has stories with narration', () => {
  assert.ok(stories.length >= 20, `found ${stories.length} stories`);
});

for (const story of stories) {
  const unrecorded = UNRECORDED_LANGUAGES[story.id] ?? [];
  const recorded = (['en', 'vi'] as const).filter((l) => !unrecorded.includes(l));
  test(`${story.id}: every sentence has registered, valid ${recorded.join(' + ').toUpperCase()} recordings`, () => {
    const reg = registry.get(story.id);
    assert.ok(reg, 'story missing from storyAssets.generated.ts (run node scripts/story-assets.mjs)');
    assert.equal(reg.length, story.pages.length, 'page count differs from the registry');
    story.pages.forEach((page, pi) => {
      assert.equal(reg[pi].length, page.sentences.length, `page ${pi + 1}: sentence count differs from the registry`);
      page.sentences.forEach((_, si) => {
        for (const lang of unrecorded) {
          const want = expectedPath(story.id, pi + 1, si + 1, lang);
          assert.ok(!fs.existsSync(path.join(ROOT, want)), `${want} exists: remove '${lang}' from UNRECORDED_LANGUAGES and regenerate the registry`);
          assert.equal(reg[pi][si][lang], null, `${want} should not be registered`);
        }
        for (const lang of recorded) {
          const want = expectedPath(story.id, pi + 1, si + 1, lang);
          const abs = path.join(ROOT, want);
          assert.ok(fs.existsSync(abs), `missing file ${want}`);
          assert.equal(reg[pi][si][lang], want, `registry entry for ${want} is wrong or missing`);
          assert.ok(fs.statSync(abs).size > 1024, `${want} is suspiciously small`);
          assert.ok(isMpegAudio(abs), `${want} is not MPEG audio`);
        }
      });
    });
  });
}

test('no audio on disk is left unregistered', () => {
  const registered = new Set(
    [...registry.values()].flatMap((pages) => pages.flatMap((s) => s.flatMap((x) => [x.en, x.vi]))).filter(Boolean)
  );
  const onDisk: string[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.mp3')) onDisk.push(path.relative(ROOT, p));
    }
  };
  walk(path.join(ROOT, 'assets/audio'));
  assert.deepEqual(onDisk.filter((f) => !registered.has(f)), []);
  assert.equal(onDisk.length, registered.size);
});
