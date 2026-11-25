#!/usr/bin/env node
// ============================================================
// Generate StoryMoon sentence narration with a LOCAL VoiceStudio install.
// VoiceStudio is an authoring tool only — it is never bundled in the app.
//
// Uses VoiceStudio's OpenAI-compatible endpoint (backend/api/routers/openai_compat.py):
//   POST http://127.0.0.1:3900/v1/audio/speech
//   { model, input, voice, response_format: "mp3", speed, language }
// Loopback requests need no API key (docs/api-auth.md).
//
// Usage:
//   node scripts/voicestudio/generate-narration.mjs --story chu-cuoi \
//        --voice-en "<voice profile id or name>" --voice-vi "<voice profile id or name>"
//   node scripts/voicestudio/generate-narration.mjs --all --voice-en ... --voice-vi ...
//
// Options:
//   --story <id>[,<id>]   stories to generate (or --all)
//   --lang en|vi          only one language (default both)
//   --voice-en / --voice-vi   saved VoiceStudio voice profiles (required: a fixed
//                         profile keeps the narrator identical across sentences)
//   --model <engine>      VoiceStudio engine id (default: omnivoice)
//   --speed <n>           synthesis speed 0.25–4 (default 0.95, gentle bedtime pace)
//   --base-url <url>      default http://127.0.0.1:3900
//   --force               regenerate files that already exist
//   --dry-run             list what would be generated, call nothing
//   --online              generate the ONLINE catalog (src/data/onlineStories/content)
//                         instead of the bundled one. MP3s go to --out-dir (default
//                         ../online-stories, next to the repo), at each sentence's
//                         relative `audio` path, and are never bundled or required().
//   --out-dir <dir>       output root for --online (default ../online-stories)
//   --allow-voice <id>    use a profile listed in KNOWN_BAD_VOICES anyway
//
// Vietnamese: use profile abf73455 ("Vietnamese-voice-clean", 4.8 s reference).
//
// Each file is written to a temp path, verified with ffprobe, then renamed into
// place, so a failed request never leaves a broken MP3 behind.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BUNDLED_CONTENT_DIR = path.join(ROOT, 'src/data/stories/content');
const BUNDLED_LOG_FILE = path.join(ROOT, 'assets/audio/narration-log.json');
const ONLINE_CONTENT_DIR = path.join(ROOT, 'src/data/onlineStories/content');
const ONLINE_LOG_FILE = path.join(ROOT, 'src/data/onlineStories/narration-log.json');
const DEFAULT_ONLINE_OUT_DIR = path.resolve(ROOT, '../online-stories');
const pad = (n) => String(n).padStart(2, '0');

/**
 * Profiles that are known to produce bad audio, with the reason. 746d2063's
 * reference is a 67 s reading of the Tích Chu tale ("Tích Chu" ×16, ending
 * "…Tích Chu ơi, cho bà ngụm nước nào."); OmniVoice leaks the end of that
 * reference, so clips start with a spoken "Chu" (heard on 2026-11-22 in every
 * online-story Vietnamese clip). Use abf73455 instead.
 */
const KNOWN_BAD_VOICES = {
  '746d2063': 'its 67 s Tích Chu reference leaks a spoken "Chu" before each sentence; use abf73455 (Vietnamese-voice-clean)',
};

function parseArgs(argv) {
  const a = { langs: ['en', 'vi'], model: 'omnivoice', speed: 0.95, baseUrl: 'http://127.0.0.1:3900' };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const v = () => argv[++i];
    if (k === '--story') a.stories = v().split(',');
    else if (k === '--all') a.all = true;
    else if (k === '--lang') a.langs = [v()];
    else if (k === '--voice-en') a.voiceEn = v();
    else if (k === '--voice-vi') a.voiceVi = v();
    else if (k === '--model') a.model = v();
    else if (k === '--speed') a.speed = parseFloat(v());
    else if (k === '--base-url') a.baseUrl = v().replace(/\/$/, '');
    else if (k === '--force') a.force = true;
    else if (k === '--dry-run') a.dryRun = true;
    else if (k === '--online') a.online = true;
    else if (k === '--out-dir') a.outDir = path.resolve(v());
    else if (k === '--allow-voice') (a.allowVoices ??= []).push(v());
    else throw new Error(`Unknown option ${k}`);
  }
  return a;
}

function probeDuration(file) {
  const out = execFileSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file],
    { encoding: 'utf8' }
  );
  return parseFloat(out.trim());
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const CONTENT_DIR = args.online ? ONLINE_CONTENT_DIR : BUNDLED_CONTENT_DIR;
  const LOG_FILE = args.online ? ONLINE_LOG_FILE : BUNDLED_LOG_FILE;
  // Bundled clips live under the repo; online clips under the upload folder.
  const OUT_ROOT = args.online ? args.outDir ?? DEFAULT_ONLINE_OUT_DIR : ROOT;
  const all = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8')));
  const stories = args.all ? all : all.filter((s) => args.stories?.includes(s.id));
  if (!stories.length) throw new Error('No stories selected (use --story <id> or --all).');

  const voice = { en: args.voiceEn, vi: args.voiceVi };
  for (const lang of args.langs) {
    if (!voice[lang]) throw new Error(`--voice-${lang} is required (a saved VoiceStudio voice profile id or name).`);
    const bad = KNOWN_BAD_VOICES[voice[lang]];
    if (bad && !args.allowVoices?.includes(voice[lang])) {
      throw new Error(`Voice profile ${voice[lang]} is blocked: ${bad}. Pass --allow-voice ${voice[lang]} to use it anyway.`);
    }
  }

  const jobs = [];
  for (const s of stories) {
    s.pages.forEach((page, pi) => {
      page.sentences.forEach((pair, si) => {
        for (const lang of args.langs) {
          // Online sentences are { en, vi, audio: { en, vi } } with paths relative
          // to the upload root; bundled sentences are [en, vi] pairs.
          const rel = args.online
            ? pair.audio?.[lang]
            : `assets/audio/${s.id}/page-${pad(pi + 1)}/sentence-${pad(si + 1)}-${lang}.mp3`;
          const text = args.online ? pair[lang] : lang === 'en' ? pair[0] : pair[1];
          if (!rel || !text) throw new Error(`${s.id} page ${pi + 1} sentence ${si + 1}: missing ${lang} text or audio path`);
          if (!args.force && fs.existsSync(path.join(OUT_ROOT, rel))) continue;
          jobs.push({ rel, text, lang });
        }
      });
    });
  }
  console.log(`${jobs.length} clip(s) to generate.`);
  if (args.dryRun) {
    for (const j of jobs) console.log(`  ${j.rel}  ${j.text}`);
    return;
  }
  if (!jobs.length) return;

  // Refuse to run (and never fabricate audio) if VoiceStudio is not reachable.
  let models;
  try {
    const r = await fetch(`${args.baseUrl}/v1/models`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    models = await r.json();
  } catch (e) {
    console.error(`VoiceStudio is not reachable at ${args.baseUrl} (${e.message}).`);
    console.error('Start the VoiceStudio app (or backend) first. No audio was generated.');
    process.exit(2);
  }

  const log = fs.existsSync(LOG_FILE)
    ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'))
    : { settings: {}, files: {} };
  log.settings = {
    tool: 'VoiceStudio (https://github.com/debpalash/VoiceStudio, AGPL-3.0 app)',
    endpoint: `${args.baseUrl}/v1/audio/speech`,
    model: args.model,
    availableModels: (models?.data ?? []).map((m) => m.id),
    voiceEn: voice.en ?? log.settings.voiceEn,
    voiceVi: voice.vi ?? log.settings.voiceVi,
    speed: args.speed,
    lastRunAt: new Date().toISOString(),
    licenseNote:
      'Check the per-model licence in VoiceStudio Model Manager. Default k2-fsa/OmniVoice weights are CC-BY-NC (non-commercial).',
  };

  let ok = 0;
  let failed = 0;
  for (const [i, job] of jobs.entries()) {
    const abs = path.join(OUT_ROOT, job.rel);
    const tmp = abs + '.part';
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    try {
      const r = await fetch(`${args.baseUrl}/v1/audio/speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: args.model,
          input: job.text,
          voice: voice[job.lang],
          response_format: 'mp3',
          speed: args.speed,
          language: job.lang,
        }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${(await r.text()).slice(0, 300)}`);
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 1024) throw new Error(`response too small (${buf.length} bytes)`);
      fs.writeFileSync(tmp, buf);
      const dur = probeDuration(tmp);
      if (!(dur > 0.3)) throw new Error(`invalid audio duration ${dur}`);
      fs.renameSync(tmp, abs);
      log.files[job.rel] = {
        lang: job.lang,
        text: job.text,
        voice: voice[job.lang],
        model: args.model,
        bytes: buf.length,
        durationSec: Math.round(dur * 100) / 100,
        generatedAt: new Date().toISOString(),
      };
      ok++;
      console.log(`[${i + 1}/${jobs.length}] ✓ ${job.rel} (${dur.toFixed(2)}s)`);
    } catch (e) {
      failed++;
      fs.rmSync(tmp, { force: true });
      console.error(`[${i + 1}/${jobs.length}] ✗ ${job.rel}: ${e.message}`);
    }
    fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2) + '\n');
  }

  console.log(`Done: ${ok} generated, ${failed} failed.`);
  console.log(args.online
    ? `Online clips are in ${OUT_ROOT}. Upload that folder to HOST_ONLINE, then run: node scripts/online-stories.mjs`
    : 'Now run: node scripts/story-assets.mjs');
  if (failed) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
