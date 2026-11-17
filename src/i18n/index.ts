// ============================================================
// UI localisation (i18next + expo-localization)
//
// Scope: app chrome only — tabs, buttons, settings, reader controls,
// paywall, empty states, accessibility labels. Story text is NOT here:
// it lives in each story's `en` / `vi` fields and is chosen by the
// reading preferences (defaultLanguage / defaultReadingMode), which
// are independent of the UI language below.
//
// Adding a UI language: see the "Adding a UI language" section of
// src/i18n/README.md.
// ============================================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales, type Locale } from 'expo-localization';
import en from './locales/en.json';
import vi from './locales/vi.json';

export const SUPPORTED_UI_LANGUAGES = ['en', 'vi'] as const;
export type UILanguage = (typeof SUPPORTED_UI_LANGUAGES)[number];
/** Persisted preference: a fixed language, or follow the device. */
export type UILanguagePreference = UILanguage | 'system';

export const FALLBACK_UI_LANGUAGE: UILanguage = 'en';

export const resources = {
  en: { translation: en },
  vi: { translation: vi },
} as const;

/** "vi-VN" / "vi" / "VI_vn" → "vi"; anything unsupported → null. */
export function toSupportedLanguage(tag: string | null | undefined): UILanguage | null {
  if (!tag) return null;
  const primary = tag.split(/[-_]/)[0].toLowerCase();
  return (SUPPORTED_UI_LANGUAGES as readonly string[]).includes(primary) ? (primary as UILanguage) : null;
}

/**
 * The device's UI language: the first of the user's preferred languages
 * (in order) that StoryMoon supports, else English. e.g.
 *   [en-GB]        → en      [vi-VN]        → vi
 *   [fr-FR]        → en      [fr-FR, vi-VN] → vi
 */
export function getDeviceUILanguage(locales: Locale[] = safeLocales()): UILanguage {
  for (const l of locales) {
    const match = toSupportedLanguage(l.languageCode) ?? toSupportedLanguage(l.languageTag);
    if (match) return match;
  }
  return FALLBACK_UI_LANGUAGE;
}

export function resolveUILanguage(pref: UILanguagePreference, locales?: Locale[]): UILanguage {
  return pref === 'system' ? getDeviceUILanguage(locales) : pref;
}

/** Switches the whole UI immediately (every useTranslation() re-renders). */
export function applyUILanguage(pref: UILanguagePreference, locales?: Locale[]): void {
  const lng = resolveUILanguage(pref, locales);
  if (i18n.language !== lng) void i18n.changeLanguage(lng);
}

/** Current UI language, narrowed to the supported set. */
export function currentUILanguage(): UILanguage {
  return toSupportedLanguage(i18n.language) ?? FALLBACK_UI_LANGUAGE;
}

/**
 * BCP-47 tag for Intl formatting: the UI language plus the device region
 * (vi + US → "vi-US"), so dates and numbers read naturally in the chosen
 * language while respecting regional conventions.
 */
export function formattingLocale(): string {
  const region = safeLocales()[0]?.regionCode;
  const lng = currentUILanguage();
  return region ? `${lng}-${region}` : lng;
}

function safeLocales(): Locale[] {
  try {
    return getLocales();
  } catch {
    return [];
  }
}

void i18n.use(initReactI18next).init({
  resources,
  // Start in the device language; the saved preference is applied as soon
  // as preferences load (while the native splash is still up).
  lng: getDeviceUILanguage(),
  fallbackLng: FALLBACK_UI_LANGUAGE,
  supportedLngs: SUPPORTED_UI_LANGUAGES,
  load: 'languageOnly',
  // Resources are bundled, so init and changeLanguage complete synchronously.
  initAsync: false,
  interpolation: { escapeValue: false }, // React already escapes
  returnNull: false,
  returnEmptyString: false,
  react: { useSuspense: false },
  // A key missing from every language must never reach the screen raw.
  // Keys are type-checked (see i18next.d.ts), so this is a last resort.
  saveMissing: __DEV__,
  missingKeyHandler: (_lngs, _ns, key) => {
    if (__DEV__) console.warn(`[i18n] Missing translation key: ${key}`);
  },
  parseMissingKeyHandler: (_key, defaultValue) => defaultValue ?? '',
});

export default i18n;
