# Splash screen and appearance

The splash screen always uses the **Light** design, whatever the device appearance or **Settings → App Appearance**. Inside the app, Light/Dark works as before (`AppThemeProvider`, `Appearance.setColorScheme`).

## Why Light only

On iOS, the system draws the launch screen (`SplashScreen.storyboard`) before the app runs any code. It renders and caches the snapshot ahead of time, picking the light or dark variant from the **device** appearance, and it can't read the app's saved preference. While the splash had a dark variant, a Dark device with App Appearance set to Light (or a mismatch either way) showed the dark launch screen first and then switched. Android 8–11 has the same limit for its first window.

With a single Light design there's nothing to choose, so the OS launch screen, the native splash view and the JS launch overlay all look the same on every device and setting.

## Launch phases (all Light)

1. **OS launch screen.** iOS draws `SplashScreen.storyboard`, and Android draws its system or starting splash, from Light-only resources.
2. **Native splash view.** expo-splash-screen shows a copy of the storyboard on iOS, and the `Theme.App.SplashScreen` window on Android. It stays up until JS has drawn the matching splash artwork.
3. **`LaunchTransition` overlay.** It draws the same Light artwork on `SPLASH_BACKGROUND` (`#F7F3E9`), hides the native splash underneath, and gently breathes while preferences and reading progress load. Once the app is ready, it fades into the first screen in the user's App Appearance. Reduced Motion skips the breathing animation. While the overlay is up it keeps dark status-bar content. When it unmounts, the app's own status-bar style takes over.

The status bar shows dark content from the first frame on iOS (`UIStatusBarStyleDarkContent` in Info.plist / `app.json` `ios.infoPlist`), so it stays readable on the light splash even when the device is Dark. Once the app runs, `expo-status-bar` controls it (`UIViewControllerBasedStatusBarAppearance` is `false`).

## Where it's configured

| What | Where |
|---|---|
| Background and image, both platforms | `app.json` → `expo-splash-screen` (no `dark` key) |
| Exact-size native PNGs | `assets/splash/native/{ios,android}`, rendered by `scripts/splash/generate-splash.swift` |
| Copying the PNGs over Expo's generated ones | `plugins/withSplashNativeAssets.js` (list it before `expo-splash-screen`) |
| Committed iOS project | `ios/StoryMoon/Images.xcassets/SplashScreenBackground.colorset` and `SplashScreenLogo.imageset` (no dark entries), `ios/StoryMoon/Info.plist` |
| Splash colour in JS | `SPLASH_BACKGROUND` in `src/utils/appearanceScheme.ts`, the same as `LightColors.background` |
| Guard rails | `test/appearanceScheme.test.ts` fails if a dark splash variant comes back |

## Release: native build required

The launch screen, asset catalog, Info.plist and Android splash resources are all compiled into the binary. **An OTA / JS-only update can't change them.** Ship a new build (`eas build`, or Xcode archive → TestFlight) and a new Android release. Android has no committed `android/` folder, so `expo prebuild` / EAS regenerates its resources from `app.json`.

iOS can keep showing an old cached launch screen right after an app update. If a device still shows the dark launch screen after installing the new build, delete and reinstall the app, or restart the device, to clear the cache.

## Verifying

Use a Release / TestFlight build. Set the device to **Dark** and try each App Appearance setting (System, Light, Dark). Each cold launch should show only the Light splash (ivory background, Light artwork, dark status-bar text), then fade into the app in the chosen appearance. Screen-record the launch and step through the frames to confirm there's no dark splash frame.
