// ============================================================
// App appearance — resolves Follow System / Light / Dark into one
// scheme and serves the matching tokens to every screen.
//
//   const { colors, type, shadow } = useTheme();
//   const styles = useStyles();   // from createThemedStyles(t => ({ … }))
//
// The Reading Appearance (Paper / Moonlight) is separate: the reader
// asks useReaderTheme() and ignores the app scheme entirely.
// ============================================================

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Appearance, Platform, StyleSheet, useColorScheme } from 'react-native';
import {
  AppColors,
  ColorScheme,
  DarkColors,
  LightColors,
  makeShadows,
  makeTabBarColors,
  makeTextStyles,
  getReaderTheme,
  ReaderTheme,
  ShadowName,
  TabBarColors,
  TextStyleName,
} from '../constants/theme';
import type { TextStyle, ViewStyle } from 'react-native';
import { usePreferencesStore } from '../store/preferencesStore';
import { resolveScheme } from '../utils/appearanceScheme';

export { APP_APPEARANCES, type AppAppearance } from '../constants/theme';

export interface AppTheme {
  scheme: ColorScheme;
  isDark: boolean;
  colors: AppColors;
  type: Record<TextStyleName, TextStyle>;
  shadow: Record<ShadowName, ViewStyle>;
  tabBar: TabBarColors;
  /** For StatusBar `style`: content colour that reads on `colors.background`. */
  statusBar: 'light' | 'dark';
}

function buildTheme(scheme: ColorScheme): AppTheme {
  const colors = scheme === 'dark' ? DarkColors : LightColors;
  return {
    scheme,
    isDark: scheme === 'dark',
    colors,
    type: makeTextStyles(colors),
    shadow: makeShadows(scheme),
    tabBar: makeTabBarColors(colors, scheme),
    statusBar: scheme === 'dark' ? 'light' : 'dark',
  };
}

/** Built once: themes are plain data and never change at runtime. */
export const Themes: Record<ColorScheme, AppTheme> = {
  light: buildTheme('light'),
  dark: buildTheme('dark'),
};

const ThemeContext = createContext<AppTheme>(Themes.light);

/** Pure resolution of the preference against the device setting. */
export { resolveScheme };

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const pref = usePreferencesStore((s) => s.prefs.appAppearance);
  const system = useColorScheme();
  const scheme = resolveScheme(pref, system);

  // Tell the OS which appearance the app chose, so native pieces we don't draw
  // (alerts, action sheets, the keyboard, pickers) match. 'unspecified' hands
  // control back to the device, which keeps useColorScheme() honest for "system".
  useEffect(() => {
    if (Platform.OS === 'web') return;
    try {
      Appearance.setColorScheme(pref === 'system' ? 'unspecified' : pref);
    } catch {
      // Older runtimes without overrides simply follow the device.
    }
  }, [pref]);

  return <ThemeContext.Provider value={Themes[scheme]}>{children}</ThemeContext.Provider>;
}

/** The active app theme (Light or Dark). */
export function useTheme(): AppTheme {
  return useContext(ThemeContext);
}

/** The reading canvas theme (Paper or Moonlight), independent of the app scheme. */
export function useReaderTheme(): ReaderTheme {
  const appearance = usePreferencesStore((s) => s.prefs.readingAppearance);
  return getReaderTheme(appearance);
}

type NamedStyles<T> = StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>;

/**
 * Declare a component's styles once, as a function of the theme:
 *
 *   const useStyles = createThemedStyles((t) => ({
 *     card: { backgroundColor: t.colors.surface, ...t.shadow.paper },
 *   }));
 *
 * Each scheme's StyleSheet is created on first use and cached, so switching
 * appearance costs nothing per render.
 */
export function createThemedStyles<T extends NamedStyles<T>>(factory: (theme: AppTheme) => T & NamedStyles<any>) {
  const cache: Partial<Record<ColorScheme, T>> = {};
  return function useThemedStyles(): T {
    const theme = useTheme();
    return useMemo(() => {
      const hit = cache[theme.scheme];
      if (hit) return hit;
      const made = StyleSheet.create(factory(theme)) as T;
      cache[theme.scheme] = made;
      return made;
    }, [theme]);
  };
}
