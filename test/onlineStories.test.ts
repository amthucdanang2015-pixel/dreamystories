/// <reference types="node" />
// Online stories: URL joining (HOST_ONLINE + relative path), catalogue
// conventions, separation from the bundled asset registry, and the
// narration policy for streamed clips (fail with a reason, never TTS).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildOnlineAudioUrl,
  checkOnlineHost,
  exactAudioUrl,
  normaliseRelativeAudioPath,
} from '../src/utils/onlineAudioUrl.ts';
import { narrateItem, type NarrationFailure, type NarrationItem } from '../src/services/narrationSequence.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const ONLINE_DIR = path.join(ROOT, 'src/data/onlineStories/content');
const PLACEHOLDER = 'https://REPLACE-WITH-YOUR-HOST.example.com/online-stories';

// ─── Host + URL joining ──────────────────────────────────────

test('host: trailing slashes are removed, scheme lower-cased', () => {
  assert.deepEqual(checkOnlineHost('https://cdn.example.org/stories///'), { ok: true, base: 'https://cdn.example.org/stories' });
  assert.deepEqual(checkOnlineHost('  HTTPS://cdn.example.org  '), { ok: true, base: 'https://cdn.example.org' });
  assert.deepEqual(checkOnlineHost('http://192.168.1.20:8080/'), { ok: true, base: 'http://192.168.1.20:8080' });
});

test('host: missing, placeholder and invalid values are rejected', () => {
  assert.deepEqual(checkOnlineHost(''), { ok: false, reason: 'missing' });
  assert.deepEqual(checkOnlineHost(undefined), { ok: false, reason: 'missing' });
  assert.deepEqual(checkOnlineHost(PLACEHOLDER, PLACEHOLDER), { ok: false, reason: 'placeholder' });
  for (const bad of ['cdn.example.org', 'ftp://cdn.example.org', 'https://', 'https://cdn.example.org/a?x=1', 'https://a b.org', 'https://cdn.example.org/#x']) {
    assert.deepEqual(checkOnlineHost(bad), { ok: false, reason: 'invalid' }, bad);
  }
});

test('join: exactly one slash between host and path, whatever the input', () => {
  const host = checkOnlineHost('https://cdn.example.org/online-stories/');
  const want = 'https://cdn.example.org/online-stories/chiec-o-mau-vang/page-01/sentence-01-en.mp3';
  for (const rel of [
    'chiec-o-mau-vang/page-01/sentence-01-en.mp3',
    '/chiec-o-mau-vang/page-01/sentence-01-en.mp3',
    '///chiec-o-mau-vang/page-01/sentence-01-en.mp3',
  ]) {
    assert.equal(buildOnlineAudioUrl(host, rel), want, rel);
  }
});

test('join: unsafe or empty relative paths and an unconfigured host give no URL', () => {
  const host = checkOnlineHost('https://cdn.example.org');
  for (const rel of ['', '  ', '../secret.mp3', 'a/../b.mp3', 'a//b.mp3', 'https://evil.example/x.mp3', '%2e%2e/x.mp3', 'a/%2E%2E/x.mp3', 'a%2F..%2Fb.mp3', null, undefined]) {
    assert.equal(buildOnlineAudioUrl(host, rel), null, String(rel));
  }
  assert.equal(buildOnlineAudioUrl(checkOnlineHost(PLACEHOLDER, PLACEHOLDER), 'a/b.mp3'), null);
});

test('join: a protocol-relative-looking path stays under the host', () => {
  assert.equal(buildOnlineAudioUrl(checkOnlineHost('https://cdn.example.org'), '//evil.example/x.mp3'), 'https://cdn.example.org/evil.example/x.mp3');
});

test('join: segments are URL-encoded once', () => {
  assert.equal(normaliseRelativeAudioPath('my story/page 01.mp3'), 'my%20story/page%2001.mp3');
  assert.equal(normaliseRelativeAudioPath('my%20story/a.mp3'), 'my%20story/a.mp3');
});

test('the shipped HOST_ONLINE is the placeholder or a valid URL, defined in one file', () => {
  const src = fs.readFileSync(path.join(ROOT, 'src/constants/onlineStories.ts'), 'utf8');
  const m = /export const HOST_ONLINE: string = (.+);/.exec(src);
  assert.ok(m, 'HOST_ONLINE declaration');
  const value = m[1].trim() === 'HOST_ONLINE_PLACEHOLDER' ? PLACEHOLDER : JSON.parse(m[1].replace(/'/g, '"'));
  const check = checkOnlineHost(value, PLACEHOLDER);
  assert.ok(check.ok || check.reason === 'placeholder', `HOST_ONLINE is ${value}`);

  // No other source file hardcodes a host or joins URLs itself.
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(e.name) && fs.readFileSync(p, 'utf8').includes('REPLACE-WITH-YOUR-HOST')) offenders.push(p);
    }
  };
  walk(path.join(ROOT, 'src'));
  walk(path.join(ROOT, 'app'));
  assert.deepEqual(offenders.map((p) => path.relative(ROOT, p)), ['src/constants/onlineStories.ts']);
});

// ─── Catalogue ───────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, '0');
const onlineStories = fs
  .readdirSync(ONLINE_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => ({ file: f, data: JSON.parse(fs.readFileSync(path.join(ONLINE_DIR, f), 'utf8')) }));

test('online catalogue: complete bilingual metadata, local cover, conventional relative audio paths', () => {
  assert.ok(onlineStories.length > 0);
  const bundled = new Set(fs.readdirSync(path.join(ROOT, 'src/data/stories/content')).map((f) => f.replace(/\.json$/, '')));
  for (const { file, data: s } of onlineStories) {
    assert.equal(file, `${s.id}.json`);
    assert.ok(!bundled.has(s.id), `${s.id} clashes with a bundled story`);
    for (const k of ['title', 'description']) assert.ok(s[k].en && s[k].vi, `${s.id} ${k}`);
    assert.ok(s.category && s.ageRange && s.duration, `${s.id} meta`);
    assert.ok(fs.existsSync(path.join(ROOT, `assets/images/online-stories/${s.id}/cover.png`)), `${s.id} cover`);
    s.pages.forEach((page: any, pi: number) =>
      page.sentences.forEach((sen: any, si: number) => {
        for (const lang of ['en', 'vi']) {
          assert.ok(sen[lang], `${s.id} p${pi + 1}s${si + 1} ${lang} text`);
          assert.equal(sen.audio[lang], `${s.id}/page-${pad(pi + 1)}/sentence-${pad(si + 1)}-${lang}.mp3`);
        }
      })
    );
  }
});

test('online MP3s are never bundled: not in the static registries or the app audio folder', () => {
  const bundledRegistry = fs.readFileSync(path.join(ROOT, 'src/data/stories/storyAssets.generated.ts'), 'utf8');
  const onlineRegistry = fs.readFileSync(path.join(ROOT, 'src/data/onlineStories/catalog.generated.ts'), 'utf8');
  assert.ok(!/\.mp3/.test(onlineRegistry), 'catalog.generated.ts must not require MP3s');
  for (const { data: s } of onlineStories) {
    assert.ok(!bundledRegistry.includes(`/${s.id}/`), `${s.id} appears in storyAssets.generated.ts`);
    assert.ok(!fs.existsSync(path.join(ROOT, 'assets/audio', s.id)), `${s.id} has a bundled audio folder`);
    assert.ok(onlineRegistry.includes(`'${s.id}': require('../../../assets/images/online-stories/${s.id}/cover.png')`));
  }
});

// ─── Narration policy for streamed clips ─────────────────────

const item: NarrationItem = { sentenceIndex: 0, text: 'Hello.', phase: 'en', audio: { uri: 'https://cdn.example.org/a.mp3' } };
const where = { storyId: 'online', pageIndex: 0 };

test('remote clip failure: reported as failed with its reason, no text-to-speech', async () => {
  const spoken: string[] = [];
  const failure: NarrationFailure = { reason: '' };
  const result = await narrateItem(
    item,
    1,
    where,
    {
      playClip: async () => ({ result: 'failed', reason: 'did not start', progress: 0 }),
      speak: async (t) => void spoken.push(t),
      isCurrent: () => true,
      report: () => {},
      fallbackToSpeech: false,
    },
    failure
  );
  assert.equal(result, 'failed');
  assert.equal(failure.reason, 'did not start');
  assert.deepEqual(spoken, []);
});

test('remote sentence without a URL (host not configured): failed, no text-to-speech', async () => {
  const spoken: string[] = [];
  const failure: NarrationFailure = { reason: '' };
  const result = await narrateItem(
    { ...item, audio: undefined },
    1,
    where,
    { playClip: async () => ({ result: 'finished' }), speak: async (t) => void spoken.push(t), isCurrent: () => true, report: () => {}, fallbackToSpeech: false },
    failure
  );
  assert.equal(result, 'failed');
  assert.equal(failure.reason, 'no recording');
  assert.deepEqual(spoken, []);
});

test('bundled default is unchanged: a failed clip still falls back to text-to-speech', async () => {
  const spoken: string[] = [];
  const result = await narrateItem({ ...item, audio: 101 }, 1, where, {
    playClip: async () => ({ result: 'failed', reason: 'x', progress: 0 }),
    speak: async (t) => void spoken.push(t),
    isCurrent: () => true,
    report: () => {},
  });
  assert.equal(result, 'tts');
  assert.deepEqual(spoken, ['Hello.']);
});

// ─── Exact host URLs (Cloudinary Secure URLs) ────────────────

test('exact audio URL is returned verbatim; non-https or malformed values are rejected', () => {
  const u = 'https://res.cloudinary.com/demo/video/upload/v1795350382/a/page-01/sentence-01-en_jmyze9.mp3';
  assert.equal(exactAudioUrl(u), u);
  for (const bad of ['', 'http://res.cloudinary.com/x.mp3', 'res.cloudinary.com/x.mp3', 'https://', 'https://a.com/x y.mp3', undefined, null]) {
    assert.equal(exactAudioUrl(bad as string), null, String(bad));
  }
});

test('every online sentence has an exact https audioUrl for its own story, page, sentence and language', () => {
  const re = /^https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\/v\d+\/([a-z0-9-]+)\/page-(\d\d)\/sentence-(\d\d)-(en|vi)_[a-z0-9]+\.mp3$/;
  const seen = new Set<string>();
  for (const { data: s } of onlineStories) {
    s.pages.forEach((page: any, pi: number) =>
      page.sentences.forEach((sen: any, si: number) => {
        for (const lang of ['en', 'vi']) {
          const url = sen.audioUrl?.[lang];
          const m = re.exec(url ?? '');
          assert.ok(m, `${s.id} p${pi + 1}s${si + 1} ${lang}: ${url}`);
          assert.deepEqual([m![1], +m![2], +m![3], m![4]], [s.id, pi + 1, si + 1, lang], url);
          assert.ok(!seen.has(url), `duplicate URL ${url}`);
          seen.add(url);
        }
      })
    );
  }
});
