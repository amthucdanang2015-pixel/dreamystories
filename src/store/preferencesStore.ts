import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, DEFAULT_PREFERENCES, Language, ReadingMode, ReaderLayout } from '../types/story';
import { applyUILanguage, SUPPORTED_UI_LANGUAGES, type UILanguagePreference } from '../i18n';
import {
  APP_APPEARANCES,
  READING_APPEARANCES,
  type AppAppearance,
  type ReadingAppearance,
} from '../constants/theme';

const PREFS_KEY = '@storymoon_preferences_v1';

interface PreferencesStore {
  prefs: UserPreferences;
  isLoaded: boolean;
  loadPreferences: () => Promise<void>;
  updatePrefs: (updates: Partial<UserPreferences>) => Promise<void>;
  setDefaultLanguage: (lang: Language) => Promise<void>;
  setReadingMode: (mode: ReadingMode) => Promise<void>;
  setLayout: (layout: ReaderLayout) => Promise<void>;
  setNarrationSpeed: (speed: number) => Promise<void>;
  /** Whole-app Light / Dark / Follow System. */
  setAppAppearance: (appearance: AppAppearance) => Promise<void>;
  /** Reading canvas only: Paper or Moonlight. */
  setReadingAppearance: (appearance: ReadingAppearance) => Promise<void>;
  setAutoTurnPage: (enabled: boolean) => Promise<void>;
  setPageSoundEnabled: (enabled: boolean) => Promise<void>;
  setSleepTimer: (minutes: number) => Promise<void>;
  /** App UI language. Does not touch the story reading language. */
  setUILanguage: (pref: UILanguagePreference) => Promise<void>;
}

const isAppAppearance = (v: unknown): v is AppAppearance => (APP_APPEARANCES as readonly unknown[]).includes(v);
const isReadingAppearance = (v: unknown): v is ReadingAppearance =>
  (READING_APPEARANCES as readonly unknown[]).includes(v);

/** Brings a save from any earlier version up to the current shape. */
function migratePrefs(parsed: Partial<UserPreferences> & { bedtimeMode?: unknown }): UserPreferences {
  const { bedtimeMode, ...rest } = parsed;
  const prefs: UserPreferences = { ...DEFAULT_PREFERENCES, ...rest };
  // Older saves have no uiLanguage; a corrupt value falls back to the device.
  if (!isUILanguagePreference(prefs.uiLanguage)) prefs.uiLanguage = DEFAULT_PREFERENCES.uiLanguage;
  if (!isAppAppearance(prefs.appAppearance)) prefs.appAppearance = DEFAULT_PREFERENCES.appAppearance;
  // v1 stored the Moonlight Reading Theme as a boolean `bedtimeMode`.
  if (!isReadingAppearance(prefs.readingAppearance)) {
    prefs.readingAppearance = bedtimeMode === true ? 'moonlight' : DEFAULT_PREFERENCES.readingAppearance;
  }
  return prefs;
}

const isUILanguagePreference = (v: unknown): v is UILanguagePreference =>
  v === 'system' || (SUPPORTED_UI_LANGUAGES as readonly unknown[]).includes(v);

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  prefs: { ...DEFAULT_PREFERENCES },
  isLoaded: false,

  loadPreferences: async () => {
    try {
      const stored = await AsyncStorage.getItem(PREFS_KEY);
      if (stored) {
        const prefs = migratePrefs(JSON.parse(stored));
        applyUILanguage(prefs.uiLanguage);
        set({ prefs, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  updatePrefs: async (updates) => {
    const next = { ...get().prefs, ...updates };
    if (updates.uiLanguage !== undefined) applyUILanguage(next.uiLanguage);
    set({ prefs: next });
    try {
      await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch {}
  },

  setDefaultLanguage: async (lang) => get().updatePrefs({ defaultLanguage: lang }),
  setReadingMode: async (mode) => get().updatePrefs({ defaultReadingMode: mode }),
  setLayout: async (layout) => get().updatePrefs({ defaultLayout: layout }),
  setNarrationSpeed: async (speed) => get().updatePrefs({ narrationSpeed: speed }),
  setAppAppearance: async (appearance) => get().updatePrefs({ appAppearance: appearance }),
  setReadingAppearance: async (appearance) => get().updatePrefs({ readingAppearance: appearance }),
  setAutoTurnPage: async (enabled) => get().updatePrefs({ autoTurnPage: enabled }),
  setPageSoundEnabled: async (enabled) => get().updatePrefs({ pageSoundEnabled: enabled }),
  setSleepTimer: async (minutes) => get().updatePrefs({ sleepTimerMinutes: minutes }),
  setUILanguage: async (pref) => get().updatePrefs({ uiLanguage: pref }),
}));

