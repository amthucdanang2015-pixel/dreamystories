// Copies StoryMoon's pre-rendered, exact-size splash PNGs over the ones
// expo-splash-screen generates during `expo prebuild` / EAS builds.
//
// Why: Expo's image resizer (@expo/image-utils, jimp path) premultiplies
// semi-transparent pixels without un-premultiplying, which turns the splash's
// soft lunar halo into a grey smudge. The files under assets/splash/native are
// rendered at their final pixel sizes by scripts/splash/generate-splash.swift.
//
// Light only: the splash is the same Light design whatever the device or App
// Appearance (see docs/SPLASH_APPEARANCE.md), so there are no dark variants.
//
// ORDER MATTERS: list this plugin BEFORE "expo-splash-screen" in app.json.
// Dangerous mods registered earlier run later, so these copies win.
const fs = require('fs');
const path = require('path');
const { withDangerousMod } = require('expo/config-plugins');

const SOURCE = path.join('assets', 'splash', 'native');
const ANDROID_DENSITIES = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];

function copy(from, to) {
  if (!fs.existsSync(from)) {
    throw new Error(`[withSplashNativeAssets] Missing ${from}. Run: swift scripts/splash/generate-splash.swift`);
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

const withIos = (config) =>
  withDangerousMod(config, [
    'ios',
    async (config) => {
      const { projectRoot, platformProjectRoot, projectName } = config.modRequest;
      const imageset = path.join(platformProjectRoot, projectName, 'Images.xcassets', 'SplashScreenLogo.imageset');
      for (const name of ['image.png', 'image@2x.png', 'image@3x.png']) {
        copy(path.join(projectRoot, SOURCE, 'ios', name), path.join(imageset, name));
      }
      return config;
    },
  ]);

const withAndroid = (config) =>
  withDangerousMod(config, [
    'android',
    async (config) => {
      const { projectRoot, platformProjectRoot } = config.modRequest;
      const res = path.join(platformProjectRoot, 'app', 'src', 'main', 'res');
      for (const density of ANDROID_DENSITIES) {
        const rel = path.join(`drawable-${density}`, 'splashscreen_logo.png');
        copy(path.join(projectRoot, SOURCE, 'android', rel), path.join(res, rel));
      }
      return config;
    },
  ]);

module.exports = (config) => withAndroid(withIos(config));
