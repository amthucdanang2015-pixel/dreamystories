import { useEffect } from 'react';
import { useLocales } from 'expo-localization';
import { applyUILanguage } from '../i18n';
import { usePreferencesStore } from '../store/preferencesStore';

/**
 * Keeps the UI language in step with the preference and, when it is
 * 'system', with the device: changing the phone's language (or the
 * per-app language in iOS / Android settings) updates the UI live.
 */
export function useUILanguageSync() {
  const pref = usePreferencesStore((s) => s.prefs.uiLanguage);
  const locales = useLocales();
  useEffect(() => {
    applyUILanguage(pref, locales);
  }, [pref, locales]);
}
