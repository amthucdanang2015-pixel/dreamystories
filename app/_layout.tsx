// Initialise UI translations before any screen renders.
import '../src/i18n';
import React, { useEffect } from 'react';
import { Stack, ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppState, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { usePreferencesStore } from '../src/store/preferencesStore';
import { useProgressStore } from '../src/store/progressStore';
import { useSubscriptionStore } from '../src/store/subscriptionStore';
import { Palette } from '../src/constants/theme';
import { AppThemeProvider, useTheme, type AppTheme } from '../src/theme';
import { LaunchTransition } from '../src/components/ui/LaunchTransition';
import { SPLASH_BACKGROUND } from '../src/utils/appearanceScheme';
import { useUILanguageSync } from '../src/hooks/useUILanguageSync';

// Hand off to the matching JS splash as soon as it has drawn. The JS splash
// animates subtly while saved preferences and reading progress are loading.
SplashScreen.preventAutoHideAsync();
// <LaunchTransition> draws an identical frame first, so there is no flash
// when the native splash is hidden.
SplashScreen.setOptions({ fade: false });

export default function RootLayout() {
  const prefsLoaded = usePreferencesStore((s) => s.isLoaded);
  const progressLoaded = useProgressStore((s) => s.isLoaded);
  const subscriptionHydrated = useSubscriptionStore((s) => s.isHydrated);
  const isReady = prefsLoaded && progressLoaded && subscriptionHydrated;
  useUILanguageSync();

  useEffect(() => {
    // Both loaders swallow storage errors and still flip isLoaded.
    usePreferencesStore.getState().loadPreferences();
    useProgressStore.getState().loadProgress();
    // Cached entitlement first (fast, so locks don't flicker), then the
    // store connection refreshes it in the background.
    useSubscriptionStore
      .getState()
      .hydrate()
      .then(() => useSubscriptionStore.getState().initialize());
    // Back from the background (e.g. after cancelling in Apple's subscription
    // settings, or a renewal/expiry while away): re-read the entitlement.
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') useSubscriptionStore.getState().refreshEntitlement();
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.root}>
      {isReady ? (
        <AppThemeProvider>
          <ThemedRoot />
        </AppThemeProvider>
      ) : (
        // Same colour as the splash background: no flash on web or Android.
        <View style={styles.splash} />
      )}
      <LaunchTransition isReady={isReady} />
    </View>
  );
}

/** React Navigation's own theme, so headers, cards and transitions never flash white. */
function navigationTheme(theme: AppTheme) {
  const base = theme.isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: theme.isDark,
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      notification: theme.colors.gold,
    },
  };
}

function ThemedRoot() {
  const theme = useTheme();
  const navTheme = React.useMemo(() => navigationTheme(theme), [theme]);

  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <NavigationThemeProvider value={navTheme}>
      <StatusBar style={theme.statusBar} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="story/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="reader/[id]"
          options={{
            headerShown: false,
            animation: 'fade_from_bottom',
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="reader-settings"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="paywall"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
            contentStyle: { backgroundColor: Palette.night },
          }}
        />
        <Stack.Screen
          name="legal"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
      </NavigationThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  // Same colour as the native splash (always the Light design).
  splash: { flex: 1, backgroundColor: SPLASH_BACKGROUND },
});

