#!/usr/bin/env node
// ============================================================
// Online stories: validate metadata, render covers, regenerate the static
// registry, and audit the MP3 upload folder.
//
//   node scripts/online-stories.mjs            # update everything, report missing MP3s
//   node scripts/online-stories.mjs --check    # same, exit 1 if anything is missing
//   node scripts/online-stories.mjs --audio-dir <dir>   # default ../online-stories
//
// What it does:
//   1. Reads src/data/onlineStories/content/*.json and checks each story:
//      unique id (also vs. the bundled catalogue), text in both languages,
//      and relative audio paths that follow
//      <story-id>/page-NN/sentence-NN-<en|vi>.mp3
//   2. Renders assets/images/online-stories/<id>/cover.svg → cover.png with
//      macOS `sips` when the PNG is missing or older than the SVG.
//   3. Writes src/data/onlineStories/catalog.generated.ts (static imports of
//      the JSON + static require() of each cover PNG, since Metro bundles only
//      static requires). MP3s are never required: they are streamed from
//      HOST_ONLINE.
//   4. Checks every MP3 in the audio folder with ffprobe and stores the total
//      narration length in each story's `estimatedDurationSec`.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'src/data/onlineStories/content');
const BUNDLED_CONTENT_DIR = path.join(ROOT, 'src/data/stories/content');
const COVERS_DIR = path.join(ROOT, 'assets/images/online-stories');
const REGISTRY = path.join(ROOT, 'src/data/onlineStories/catalog.generated.ts');

const args = process.argv.slice(2);
const check = args.includes('--check');
const audioDirArg = args.indexOf('--audio-dir');
const AUDIO_DIR = audioDirArg >= 0 ? path.resolve(args[audioDirArg + 1]) : path.resolve(ROOT, '../online-stories');

const pad = (n) => String(n).padStart(2, '0');
const expectedAudio = (id, p, s, lang) => `${id}/page-${pad(p)}/sentence-${pad(s)}-${lang}.mp3`;

const errors = [];
const missingAudio = [];
const missingCovers = [];
/** Sentences without an exact audioUrl (they fall back to HOST_ONLINE). */
const missingUrls = [];

const bundledIds = new Set(
  fs.readdirSync(BUNDLED_CONTENT_DIR).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''))
);
bundledIds.add('little-rabbit-moon');

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json')).sort();
const stories = files.map((f) => ({ file: f, data: JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8')) }));

function probe(file) {
  try {
    const out = execFileSync(
      'ffprobe',
      ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_name:format=duration', '-of', 'json', file],
      { encoding: 'utf8' }
    );
    const j = JSON.parse(out);
    return { codec: j.streams?.[0]?.codec_name, duration: parseFloat(j.format?.duration) };
  } catch {
    return null;
  }
}

const seen = new Set();
for (const { file, data: s } of stories) {
  const where = `content/${file}`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.id ?? '')) errors.push(`${where}: id must be kebab-case ASCII`);
  if (file !== `${s.id}.json`) errors.push(`${where}: file name must be <id>.json`);
  if (seen.has(s.id)) errors.push(`${where}: duplicate id ${s.id}`);
  if (bundledIds.has(s.id)) errors.push(`${where}: id ${s.id} is already used by a bundled story`);
  seen.add(s.id);
  for (const k of ['title', 'description']) {
    if (!s[k]?.en || !s[k]?.vi) errors.push(`${where}: ${k}.en and ${k}.vi are required`);
  }
  for (const k of ['category', 'ageRange', 'duration']) if (!s[k]) errors.push(`${where}: ${k} is required`);
  if (!Array.isArray(s.pages) || !s.pages.length) errors.push(`${where}: at least one page is required`);

  // Cover
  const svg = path.join(COVERS_DIR, s.id, 'cover.svg');
  const png = path.join(COVERS_DIR, s.id, 'cover.png');
  if (fs.existsSync(svg) && (!fs.existsSync(png) || fs.statSync(png).mtimeMs < fs.statSync(svg).mtimeMs)) {
    try {
      execFileSync('sips', ['-s', 'format', 'png', svg, '--out', png], { stdio: 'ignore' });
      console.log(`rendered ${path.relative(ROOT, png)}`);
    } catch {
      errors.push(`${s.id}: could not render cover.svg (needs macOS sips); add cover.png by hand`);
    }
  }
  if (!fs.existsSync(png)) missingCovers.push(path.relative(ROOT, png));

  // Audio
  let total = 0;
  let complete = true;
  (s.pages ?? []).forEach((page, pi) => {
    (page.sentences ?? []).forEach((sentence, si) => {
      for (const lang of ['en', 'vi']) {
        const label = `${s.id} page ${pi + 1} sentence ${si + 1} ${lang}`;
        if (!sentence?.[lang]) errors.push(`${label}: missing text`);
        const rel = sentence?.audio?.[lang];
        const want = expectedAudio(s.id, pi + 1, si + 1, lang);
        if (rel !== want) errors.push(`${label}: audio path should be "${want}" (got ${JSON.stringify(rel)})`);
        // Exact host URL (e.g. Cloudinary Secure URL): https, and its public ID must be this
        // story/page/sentence/language (Cloudinary may add a "_xxxxxx" suffix and a version).
        const exact = sentence?.audioUrl?.[lang];
        if (exact === undefined) missingUrls.push(`${label} (${want})`);
        else {
          const m = /^https:\/\/\S+\/([a-z0-9-]+)\/page-(\d\d)\/sentence-(\d\d)-(en|vi)(?:_[A-Za-z0-9]+)?\.mp3$/.exec(exact);
          if (!m || m[1] !== s.id || +m[2] !== pi + 1 || +m[3] !== si + 1 || m[4] !== lang)
            errors.push(`${label}: audioUrl does not belong to this sentence: ${exact}`);
        }
        if (!rel) continue;
        const abs = path.join(AUDIO_DIR, rel);
        const info = fs.existsSync(abs) ? probe(abs) : null;
        if (!info || info.codec !== 'mp3' || !(info.duration > 0.3)) {
          complete = false;
          missingAudio.push(rel + (fs.existsSync(abs) ? '  (exists but is not valid MP3 audio)' : ''));
        } else total += info.duration;
      }
    });
  });

  // Store the measured narration length (both languages) once every clip exists.
  const est = complete ? Math.round(total) : null;
  if (s.estimatedDurationSec !== est) {
    s.estimatedDurationSec = est;
    fs.writeFileSync(path.join(CONTENT_DIR, file), JSON.stringify(s, null, 2) + '\n');
  }
}

// Registry (static imports / requires only)
const lines = [
  '// AUTO-GENERATED by scripts/online-stories.mjs — do not edit by hand.',
  '// Online story metadata + local cover PNGs. Narration MP3s are NOT bundled:',
  '// they are streamed from HOST_ONLINE (src/constants/onlineStories.ts).',
  '',
  "import type { ImageSourcePropType } from 'react-native';",
  ...stories.map((s, i) => `import c${i} from './content/${s.file}';`),
  '',
  `export const ONLINE_STORY_CONTENT = [${stories.map((_, i) => `c${i}`).join(', ')}];`,
  '',
  'export const ONLINE_STORY_COVERS: Record<string, ImageSourcePropType | undefined> = {',
  ...stories.map(({ data: s }) =>
    fs.existsSync(path.join(COVERS_DIR, s.id, 'cover.png'))
      ? `  '${s.id}': require('../../../assets/images/online-stories/${s.id}/cover.png'),`
      : `  '${s.id}': undefined,`
  ),
  '};',
  '',
];
fs.writeFileSync(REGISTRY, lines.join('\n'));
console.log(`wrote ${path.relative(ROOT, REGISTRY)} (${stories.length} online stories)`);

console.log(`audio folder: ${AUDIO_DIR}`);
if (errors.length) {
  console.error(`\n${errors.length} metadata error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
}
if (missingCovers.length) {
  console.warn(`\n${missingCovers.length} missing cover(s) (the palette placeholder is shown):`);
  for (const c of missingCovers) console.warn(`  - ${c}`);
}
if (missingUrls.length) {
  console.warn(`\n${missingUrls.length} sentence clip(s) without an exact audioUrl (HOST_ONLINE fallback):`);
  for (const u of missingUrls) console.warn(`  - ${u}`);
} else {
  console.log('every online sentence has an exact audioUrl in both languages');
}
if (missingAudio.length) {
  console.warn(`\n${missingAudio.length} missing MP3(s) under ${AUDIO_DIR}:`);
  for (const a of missingAudio) console.warn(`  - ${a}`);
} else {
  console.log('every online sentence has a valid MP3 in both languages');
}
if (errors.length || (check && (missingAudio.length || missingCovers.length))) process.exitCode = 1;
