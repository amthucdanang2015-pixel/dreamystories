#!/usr/bin/env node
// ============================================================
// StoryMoon story asset tool
//
//   node scripts/story-assets.mjs            # validate + regenerate registry/manifest/README
//   node scripts/story-assets.mjs --check    # same, but exit 1 if any expected asset is missing
//
// Reads   src/data/stories/content/*.json
// Checks  assets/images/stories/<id>/{cover,page-NN}.png
//         assets/audio/<id>/page-NN/sentence-NN-{en,vi}.mp3
// Writes  src/data/stories/storyAssets.generated.ts  (static require() for files that exist)
//         assets/stories-manifest.json
//         assets/STORY_ASSETS.md
//
// Metro can only bundle static require() calls whose files exist, so the
// registry is regenerated from disk instead of being hand-written.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'src/data/stories/content');
const REGISTRY_FILE = path.join(ROOT, 'src/data/stories/storyAssets.generated.ts');
const MANIFEST_FILE = path.join(ROOT, 'assets/stories-manifest.json');
const README_FILE = path.join(ROOT, 'assets/STORY_ASSETS.md');
const NARRATION_LOG = path.join(ROOT, 'assets/audio/narration-log.json');
const LANGS = ['en', 'vi'];
const PALETTE_ROLES = ['sky', 'skyLow', 'ground', 'groundDeep', 'accent', 'glow', 'ink', 'paper'];

// Brand style shared by every story; each story's artDirection makes it distinct.
const BRAND_STYLE =
  'Premium hand-painted picture-book illustration: gouache and soft watercolour textures on warm paper, ' +
  'rounded friendly shapes, gentle rim light, subtle paper grain and a soft vignette. Calm, comforting, ' +
  'never frightening. Respectful, accurate Vietnamese settings and dress. Keep each character identical on ' +
  'every page (see the character sheet). No text, letters, logos, signatures or watermarks.';

/** Full, ready-to-paste prompt for one illustration. */
function fullPrompt(story, scene) {
  const a = story.artDirection;
  const parts = [BRAND_STYLE];
  if (a) {
    parts.push(
      `Story identity — mood: ${a.mood} Setting: ${a.setting} Light: ${a.light} ` +
        `Signature motifs: ${a.motifs.join(', ')}. Palette: ${PALETTE_ROLES.map((r) => a.palette[r]).join(', ')}. ` +
        `Avoid: ${a.avoid.join(', ')}.`
    );
  }
  if (story.characters?.length) {
    parts.push('Characters: ' + story.characters.map((c) => `${c.name} — ${c.look}`).join('; ') + '.');
  }
  parts.push(`Scene: ${scene}.`);
  return parts.join(' ');
}
const CHECK = process.argv.includes('--check');

const pad = (n) => String(n).padStart(2, '0');
export const coverPath = (id) => `assets/images/stories/${id}/cover.png`;
export const pageImagePath = (id, p) => `assets/images/stories/${id}/page-${pad(p)}.png`;
export const audioPath = (id, p, s, lang) =>
  `assets/audio/${id}/page-${pad(p)}/sentence-${pad(s)}-${lang}.mp3`;

export function loadStories() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8')));
}

function validateContent(story, errors, warnings) {
  const where = `[${story.id}]`;
  for (const key of ['title', 'description', 'theme']) {
    for (const lang of LANGS) {
      if (!story[key]?.[lang]?.trim()) errors.push(`${where} missing ${key}.${lang}`);
    }
  }
  if (!/^[a-z0-9-]+$/.test(story.id)) errors.push(`${where} id must be kebab-case ascii`);
  const art = story.artDirection;
  if (!art) {
    warnings.push(`${where} has no artDirection (illustrations will use the generic palette)`);
  } else {
    for (const key of ['mood', 'setting', 'light']) {
      if (!art[key]?.trim()) warnings.push(`${where} artDirection.${key} is empty`);
    }
    for (const role of PALETTE_ROLES) {
      if (!/^#[0-9A-Fa-f]{6}$/.test(art.palette?.[role] ?? '')) {
        errors.push(`${where} artDirection.palette.${role} must be a #RRGGBB colour`);
      }
    }
  }
  const n = story.pages?.length ?? 0;
  if (n < 6 || n > 8) warnings.push(`${where} has ${n} pages (target 6–8)`);
  story.pages.forEach((page, pi) => {
    const sn = page.sentences.length;
    if (sn < 2 || sn > 3) warnings.push(`${where} page ${pi + 1} has ${sn} sentences (target 2–3)`);
    if (!page.prompt?.trim()) warnings.push(`${where} page ${pi + 1} has no illustration prompt`);
    page.sentences.forEach((pair, si) => {
      if (!Array.isArray(pair) || pair.length !== 2 || !pair[0]?.trim() || !pair[1]?.trim()) {
        errors.push(`${where} page ${pi + 1} sentence ${si + 1} must be [en, vi] with both non-empty`);
      }
    });
  });
}

let ffprobeOk = true;
function probeDuration(rel) {
  if (!ffprobeOk) return null;
  try {
    const out = execFileSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', path.join(ROOT, rel)],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    );
    const d = parseFloat(out.trim());
    return Number.isFinite(d) ? Math.round(d * 100) / 100 : null;
  } catch (e) {
    if (e.code === 'ENOENT') ffprobeOk = false;
    return null;
  }
}

function fileInfo(rel, { audio = false } = {}) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return { path: rel, exists: false };
  const size = fs.statSync(abs).size;
  const info = { path: rel, exists: size > 0, bytes: size };
  if (audio && size > 0) {
    const d = probeDuration(rel);
    if (d !== null && d > 0) info.durationSec = d;
    else if (ffprobeOk) {
      // ffprobe is available but could not read a duration: corrupt or empty audio.
      info.exists = false;
      info.invalid = true;
    }
  }
  return info;
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(path.relative(ROOT, p));
  }
  return out;
}

function main() {
  const stories = loadStories();
  const errors = [];
  const warnings = [];
  const ids = new Set();
  for (const s of stories) {
    if (ids.has(s.id)) errors.push(`duplicate story id ${s.id}`);
    ids.add(s.id);
    validateContent(s, errors, warnings);
  }

  const narrationLog = fs.existsSync(NARRATION_LOG)
    ? JSON.parse(fs.readFileSync(NARRATION_LOG, 'utf8'))
    : null;

  const expected = new Set();
  const manifestStories = stories.map((s) => {
    const cover = fileInfo(coverPath(s.id));
    expected.add(cover.path);
    const pages = s.pages.map((page, pi) => {
      const p = pi + 1;
      const image = fileInfo(pageImagePath(s.id, p));
      expected.add(image.path);
      const sentences = page.sentences.map(([en, vi], si) => {
        const audio = {};
        for (const lang of LANGS) {
          audio[lang] = fileInfo(audioPath(s.id, p, si + 1, lang), { audio: true });
          expected.add(audio[lang].path);
        }
        return { id: `p${pad(p)}-s${pad(si + 1)}`, en, vi, audio };
      });
      return { id: `page-${pad(p)}`, prompt: page.prompt, image, sentences };
    });
    const all = [cover, ...pages.flatMap((pg) => [pg.image, ...pg.sentences.flatMap((x) => [x.audio.en, x.audio.vi])])];
    const present = all.filter((f) => f.exists).length;
    return {
      id: s.id,
      title: s.title,
      theme: s.theme,
      origin: s.origin,
      characters: s.characters,
      artDirection: s.artDirection,
      coverPrompt: s.cover?.prompt,
      coverFullPrompt: s.cover?.prompt ? fullPrompt(s, s.cover.prompt) : undefined,
      cover,
      pages: pages.map((pg) => ({ ...pg, fullPrompt: pg.prompt ? fullPrompt(s, pg.prompt) : undefined })),
      status: {
        images: `${[cover, ...pages.map((p) => p.image)].filter((f) => f.exists).length}/${pages.length + 1}`,
        audio: `${pages.flatMap((p) => p.sentences.flatMap((x) => [x.audio.en, x.audio.vi])).filter((f) => f.exists).length}/${pages.reduce((n, p) => n + p.sentences.length * 2, 0)}`,
        complete: present === all.length,
      },
    };
  });

  // Files on disk under story asset folders that no story references.
  const orphans = [
    ...walk(path.join(ROOT, 'assets/images/stories')),
    ...stories.flatMap((s) => walk(path.join(ROOT, 'assets/audio', s.id))),
  ].filter((f) => !expected.has(f) && !f.endsWith('.DS_Store'));

  // ── Registry (TypeScript, static requires) ─────────────────
  const req = (info) =>
    info.exists ? `require('../../../${info.path}')` : 'undefined';
  let ts = `// AUTO-GENERATED by scripts/story-assets.mjs — do not edit by hand.\n`;
  ts += `// Only files that exist on disk are required, so Metro bundling never breaks.\n\n`;
  ts += `import type { StoryAssetEntry } from '../../types/story';\n\n`;
  ts += `export const STORY_ASSETS: Record<string, StoryAssetEntry> = {\n`;
  for (const s of manifestStories) {
    ts += `  '${s.id}': {\n    cover: ${req(s.cover)},\n    pages: [\n`;
    for (const p of s.pages) {
      ts += `      {\n        image: ${req(p.image)},\n        sentences: [\n`;
      for (const x of p.sentences) {
        ts += `          { en: ${req(x.audio.en)}, vi: ${req(x.audio.vi)} },\n`;
      }
      ts += `        ],\n      },\n`;
    }
    ts += `    ],\n  },\n`;
  }
  ts += `};\n`;
  fs.writeFileSync(REGISTRY_FILE, ts);

  // ── Manifest ───────────────────────────────────────────────
  const totals = {
    stories: manifestStories.length,
    completeStories: manifestStories.filter((s) => s.status.complete).length,
    images: { expected: 0, present: 0 },
    audio: { expected: 0, present: 0 },
  };
  for (const s of manifestStories) {
    for (const img of [s.cover, ...s.pages.map((p) => p.image)]) {
      totals.images.expected++;
      if (img.exists) totals.images.present++;
    }
    for (const x of s.pages.flatMap((p) => p.sentences)) {
      for (const lang of LANGS) {
        totals.audio.expected++;
        if (x.audio[lang].exists) totals.audio.present++;
      }
    }
  }
  const manifest = {
    schema: 'storymoon-asset-manifest/1',
    generatedAt: new Date().toISOString(),
    pathConventions: {
      cover: 'assets/images/stories/<story-id>/cover.png',
      pageImage: 'assets/images/stories/<story-id>/page-NN.png',
      sentenceAudio: 'assets/audio/<story-id>/page-NN/sentence-NN-<en|vi>.mp3',
    },
    narration: narrationLog
      ? { source: 'VoiceStudio (see assets/audio/narration-log.json)', ...narrationLog.settings }
      : { source: null, note: 'No VoiceStudio narration has been generated yet.' },
    totals,
    orphans,
    stories: manifestStories,
  };
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2) + '\n');

  // ── README ─────────────────────────────────────────────────
  fs.writeFileSync(README_FILE, renderReadme(manifest));

  // ── Report ─────────────────────────────────────────────────
  for (const w of warnings) console.warn('warn:', w);
  for (const e of errors) console.error('error:', e);
  console.log(
    `stories ${totals.stories} (complete ${totals.completeStories}) | images ${totals.images.present}/${totals.images.expected} | audio ${totals.audio.present}/${totals.audio.expected} | orphans ${orphans.length}`
  );
  for (const s of manifestStories) {
    console.log(`  ${s.status.complete ? '✓' : '·'} ${s.id.padEnd(22)} images ${s.status.images.padEnd(6)} audio ${s.status.audio}`);
  }
  const invalid = manifestStories.flatMap((s) =>
    s.pages.flatMap((p) => p.sentences.flatMap((x) => [x.audio.en, x.audio.vi]))
  ).filter((f) => f.invalid);
  if (invalid.length) console.warn('invalid audio (unreadable, excluded from registry):\n  ' + invalid.map((f) => f.path).join('\n  '));
  if (orphans.length) console.warn('orphan files (not referenced by any story):\n  ' + orphans.join('\n  '));
  if (errors.length) process.exit(1);
  if (CHECK && totals.completeStories !== totals.stories) process.exit(1);
}

function renderReadme(m) {
  const L = [];
  L.push('# StoryMoon Story Asset Pack');
  L.push('');
  L.push('> Auto-generated by `node scripts/story-assets.mjs`. Do not edit by hand — edit `src/data/stories/content/*.json` and re-run the script.');
  L.push('');
  L.push(`Generated: ${m.generatedAt}`);
  L.push('');
  L.push('## Status');
  L.push('');
  L.push(`- Stories: **${m.totals.stories}** (fully complete: ${m.totals.completeStories})`);
  L.push(`- Illustrations present: **${m.totals.images.present} / ${m.totals.images.expected}**`);
  L.push(`- Narration MP3s present: **${m.totals.audio.present} / ${m.totals.audio.expected}**`);
  L.push(`- Narration source: ${m.narration.source ?? '_none yet — ' + m.narration.note + '_'}`);
  L.push('');
  L.push('Missing narration falls back to on-device text-to-speech (expo-speech); missing illustrations fall back to the built-in vector art. Nothing listed as missing has been generated.');
  L.push('');
  L.push('| Story | Vietnamese title | Pages | Sentences | Illustrations | Audio | Complete |');
  L.push('|---|---|---|---|---|---|---|');
  for (const s of m.stories) {
    const sn = s.pages.reduce((n, p) => n + p.sentences.length, 0);
    L.push(`| \`${s.id}\` ${s.title.en} | ${s.title.vi} | ${s.pages.length} | ${sn} | ${s.status.images} | ${s.status.audio} | ${s.status.complete ? 'yes' : 'no'} |`);
  }
  L.push('');
  L.push('## File conventions');
  L.push('');
  L.push('```');
  L.push(m.pathConventions.cover);
  L.push(m.pathConventions.pageImage);
  L.push(m.pathConventions.sentenceAudio);
  L.push('```');
  L.push('');
  L.push('## Illustration style guide (all stories)');
  L.push('');
  L.push(BRAND_STYLE);
  L.push('');
  L.push('Every story then has its own **art direction** (below): a distinct setting, light, palette and signature motifs, so no two books share a look. Generic \"storybook forest\" backdrops are not used. Recommended size 1536×1024 (3:2) PNG for pages and 1024×1024 for covers; keep the focal subject in the central two-thirds, because the app crops covers to portrait shelf cards and landscape heroes.');
  L.push('');
  L.push('Until a PNG exists, the app renders the story-specific vector scene from `src/components/illustrations/scenes/` for that cover/page, built from the same art direction. Dropping a PNG in place and re-running this script switches that page to the painting.');
  L.push('');
  L.push('Each asset row has a short scene prompt; `assets/stories-manifest.json` also carries `fullPrompt` / `coverFullPrompt` with brand style + art direction + characters + scene combined, ready to paste into an image model.');
  L.push('');
  for (const s of m.stories) {
    L.push(`## ${s.title.en} — ${s.title.vi}`);
    L.push('');
    L.push(`- **ID:** \`${s.id}\``);
    L.push(`- **Theme:** ${s.theme.en} / ${s.theme.vi}`);
    L.push(`- **Origin:** ${s.origin}`);
    L.push('');
    if (s.artDirection) {
      const a = s.artDirection;
      L.push('**Art direction**');
      L.push('');
      L.push(`- Mood: ${a.mood}`);
      L.push(`- Setting: ${a.setting}`);
      L.push(`- Light: ${a.light}`);
      L.push(`- Signature motifs: ${a.motifs.join(', ')}`);
      L.push(`- Avoid: ${a.avoid.join(', ')}`);
      L.push(`- Palette: ${PALETTE_ROLES.map((r) => `${r} \`${a.palette[r]}\``).join(' · ')}`);
      L.push('');
    }
    L.push('**Character sheet**');
    L.push('');
    for (const c of s.characters ?? []) L.push(`- ${c.name}: ${c.look}`);
    L.push('');
    L.push('| Asset | Status | Illustration prompt |');
    L.push('|---|---|---|');
    L.push(`| \`${s.cover.path}\` | ${s.cover.exists ? 'present' : 'missing'} | ${s.coverPrompt ?? ''} |`);
    for (const p of s.pages) {
      L.push(`| \`${p.image.path}\` | ${p.image.exists ? 'present' : 'missing'} | ${p.prompt ?? ''} |`);
    }
    L.push('');
    L.push('| Sentence | English | Vietnamese | EN audio | VI audio |');
    L.push('|---|---|---|---|---|');
    for (const p of s.pages) {
      for (const x of p.sentences) {
        const a = (f) => (f.exists ? `✓ ${f.durationSec ?? '?'}s` : f.invalid ? 'INVALID' : 'missing');
        L.push(`| ${p.id}/${x.id} | ${x.en.replace(/\|/g, '\\|')} | ${x.vi.replace(/\|/g, '\\|')} | ${a(x.audio.en)} | ${a(x.audio.vi)} |`);
      }
    }
    L.push('');
  }
  return L.join('\n') + '\n';
}

if (import.meta.url === `file://${process.argv[1]}`) main();
