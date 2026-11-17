// ============================================================
// App Appearance → colour scheme, and the splash background.
// Pure (type-only imports) so it is unit-tested with `node --test`.
// ============================================================

import type { AppAppearance, ColorScheme } from '../constants/theme';

/** Follow System / Light / Dark resolved against the device setting. */
export function resolveScheme(pref: AppAppearance, system: string | null | undefined): ColorScheme {
  if (pref === 'light' || pref === 'dark') return pref;
  return system === 'dark' ? 'dark' : 'light';
}

/**
 * Splash background. The splash is always the Light design, whatever the
 * device or App Appearance (docs/SPLASH_APPEARANCE.md): this must equal the
 * expo-splash-screen backgroundColor in app.json and the background the
 * artwork in scripts/splash/generate-splash.swift is drawn for.
 */
export const SPLASH_BACKGROUND = '#F7F3E9'; // Palette.ivory / LightColors.background
