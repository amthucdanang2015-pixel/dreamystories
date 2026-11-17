/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { resolveScheme, SPLASH_BACKGROUND } from '../src/utils/appearanceScheme.ts';

const ROOT = path.resolve(import.meta.dirname, '..');

test('Light and Dark ignore the device; System follows it', () => {
  assert.equal(resolveScheme('light', 'dark'), 'light');
  assert.equal(resolveScheme('dark', 'light'), 'dark');
  assert.equal(resolveScheme('system', 'dark'), 'dark');
  assert.equal(resolveScheme('system', 'light'), 'light');
  assert.equal(resolveScheme('system', null), 'light');
});

const splashConfig = () => {
  const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
  const entry = appJson.expo.plugins.find((p: unknown) => Array.isArray(p) && p[0] === 'expo-splash-screen');
  return entry[1];
};

test('splash is Light only: one background and one image per platform, no dark variant', () => {
  const cfg = splashConfig();
  assert.equal(cfg.backgroundColor, SPLASH_BACKGROUND);
  for (const platform of ['ios', 'android']) {
    assert.equal(cfg[platform].backgroundColor, SPLASH_BACKGROUND, platform);
    assert.equal(cfg[platform].dark, undefined, `${platform} must not have a dark splash`);
  }
});

test('splash background is the app’s Light background', () => {
  const theme = fs.readFileSync(path.join(ROOT, 'src/constants/theme.ts'), 'utf8');
  assert.match(theme, new RegExp(`export const LightColors[\\s\\S]*?background: '${SPLASH_BACKGROUND}'`));
});

test('every splash image exists, including native sizes, and no dark set is left', () => {
  const cfg = splashConfig();
  for (const platform of ['ios', 'android']) {
    assert.ok(fs.existsSync(path.join(ROOT, cfg[platform].image)), cfg[platform].image);
  }
  for (const n of ['image.png', 'image@2x.png', 'image@3x.png']) {
    assert.ok(fs.existsSync(path.join(ROOT, 'assets/splash/native/ios', n)), `ios/${n}`);
  }
  for (const d of ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']) {
    assert.ok(fs.existsSync(path.join(ROOT, 'assets/splash/native/android', `drawable-${d}`, 'splashscreen_logo.png')), d);
  }
  for (const gone of ['assets/splash/native/ios-dark', 'assets/splash/native/android-dark']) {
    assert.ok(!fs.existsSync(path.join(ROOT, gone)), `${gone} should be removed`);
  }
  const plugin = fs.readFileSync(path.join(ROOT, 'plugins/withSplashNativeAssets.js'), 'utf8');
  assert.doesNotMatch(plugin, /-dark'|drawable-night|dark_/);
});

test('committed iOS launch screen has no dark colour or logo, and dark status-bar content', () => {
  const xc = path.join(ROOT, 'ios/StoryMoon/Images.xcassets');
  const colors = JSON.parse(fs.readFileSync(path.join(xc, 'SplashScreenBackground.colorset/Contents.json'), 'utf8'));
  assert.equal(colors.colors.length, 1);
  assert.equal(colors.colors[0].appearances, undefined);
  const hex = ['red', 'green', 'blue']
    .map((k) => Math.round(parseFloat(colors.colors[0].color.components[k]) * 255).toString(16).padStart(2, '0'))
    .join('');
  assert.equal(`#${hex}`.toUpperCase(), SPLASH_BACKGROUND.toUpperCase());
  const logo = JSON.parse(fs.readFileSync(path.join(xc, 'SplashScreenLogo.imageset/Contents.json'), 'utf8'));
  assert.ok(logo.images.every((i: { appearances?: unknown[] }) => !i.appearances), 'no dark logo entries');
  const files = fs.readdirSync(path.join(xc, 'SplashScreenLogo.imageset'));
  assert.ok(!files.some((f) => f.startsWith('dark_')), 'no dark logo files');
  // Light splash → dark status-bar text from the first frame, whatever the device.
  const plist = fs.readFileSync(path.join(ROOT, 'ios/StoryMoon/Info.plist'), 'utf8');
  assert.match(plist, /<key>UIStatusBarStyle<\/key>\s*<string>UIStatusBarStyleDarkContent<\/string>/);
  const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
  assert.equal(appJson.expo.ios.infoPlist.UIStatusBarStyle, 'UIStatusBarStyleDarkContent');
});
