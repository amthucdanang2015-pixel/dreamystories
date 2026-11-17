/// <reference types="node" />
// Native configuration that background narration depends on. These are only
// picked up by a new native build (TestFlight / Play), never by a JS update.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const ROOT = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
const plugins: unknown[] = appJson.expo.plugins;
const pluginOptions = (name: string) => {
  const entry = plugins.find((p) => (Array.isArray(p) ? p[0] : p) === name);
  return Array.isArray(entry) ? entry[1] : entry ? {} : undefined;
};

test('expo-audio plugin enables background playback (iOS UIBackgroundModes=audio, Android media service)', () => {
  assert.equal(pluginOptions('expo-audio')?.enableBackgroundPlayback, true);
});

test('committed iOS Info.plist declares the audio background mode', () => {
  const plist = fs.readFileSync(path.join(ROOT, 'ios/StoryMoon/Info.plist'), 'utf8');
  assert.match(plist, /<key>UIBackgroundModes<\/key>\s*<array>\s*<string>audio<\/string>/);
});

test('narration audio mode keeps playing in the background', () => {
  const src = fs.readFileSync(path.join(ROOT, 'src/services/narrationAudioService.ts'), 'utf8');
  assert.match(src, /shouldPlayInBackground: true/);
  assert.match(src, /keepAudioSessionActive: true/);
});

const { applyStopWithTask } = require('../plugins/withNarrationBackgroundAudio.js');
const SERVICE = 'expo.modules.audio.service.AudioControlsService';
const manifest = (services: unknown[] = []) => ({
  manifest: { application: [{ $: { 'android:name': '.MainApplication' }, service: services }] },
});

test('Android playback service stops with the task (force-quit ends narration): patches expo-audio’s entry', () => {
  const m = manifest([{ $: { 'android:name': SERVICE, 'android:exported': 'false', 'android:foregroundServiceType': 'mediaPlayback' } }]);
  const out = applyStopWithTask(m);
  const services = out.manifest.application[0].service;
  assert.equal(services.length, 1);
  assert.equal(services[0].$['android:stopWithTask'], 'true');
  assert.equal(services[0].$['android:foregroundServiceType'], 'mediaPlayback');
});

test('…and adds the service itself when it runs before expo-audio’s mod', () => {
  const out = applyStopWithTask(manifest());
  const [service] = out.manifest.application[0].service;
  assert.equal(service.$['android:name'], SERVICE);
  assert.equal(service.$['android:stopWithTask'], 'true');
});

test('the background-audio plugin is registered in app.json', () => {
  assert.ok(plugins.includes('./plugins/withNarrationBackgroundAudio'));
});
