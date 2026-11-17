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
//
// Each file is written to a temp path, verified with ffprobe, then renamed into
// place, so a failed request never leaves a broken MP3 behind.
// ============================================================

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CONTENT_DIR = path.join(ROOT, 'src/data/stories/content');
const LOG_FILE = path.join(ROOT, 'assets/audio/narration-log.json');
const pad = (n) => String(n).padStart(2, '0');

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
  const all = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), 'utf8')));
  const stories = args.all ? all : all.filter((s) => args.stories?.includes(s.id));
  if (!stories.length) throw new Error('No stories selected (use --story <id> or --all).');

  const voice = { en: args.voiceEn, vi: args.voiceVi };
  for (const lang of args.langs) {
    if (!voice[lang]) throw new Error(`--voice-${lang} is required (a saved VoiceStudio voice profile id or name).`);
  }

  const jobs = [];
  for (const s of stories) {
    s.pages.forEach((page, pi) => {
      page.sentences.forEach((pair, si) => {
        for (const lang of args.langs) {
          const rel = `assets/audio/${s.id}/page-${pad(pi + 1)}/sentence-${pad(si + 1)}-${lang}.mp3`;
          const text = lang === 'en' ? pair[0] : pair[1];
          if (!args.force && fs.existsSync(path.join(ROOT, rel))) continue;
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
    const abs = path.join(ROOT, job.rel);
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
  console.log('Now run: node scripts/story-assets.mjs');
  if (failed) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
