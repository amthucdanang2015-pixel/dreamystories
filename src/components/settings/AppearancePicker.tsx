// ============================================================
// Appearance pickers — two separate choices, shown as tiles with a
// live miniature of each palette:
//
//   App Appearance      [ System ] [ Light ] [ Dark ]   → all app chrome
//   Reading Appearance  [ Paper ]  [ Moonlight ]        → reader canvas only
//
// Each tile is a radio: selection is carried by a sage ring, a check
// badge and a bold label (never colour alone), and announced via
// accessibilityState.checked.
// ============================================================

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Moon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import {
  AppColors,
  AppAppearance,
  APP_APPEARANCES,
  BorderRadius,
  DarkColors,
  LightColors,
  READING_APPEARANCES,
  ReaderThemes,
  ReadingAppearance,
  Typography,
} from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';
import { usePreferencesStore } from '../../store/preferencesStore';

const PREVIEW_H = 68;

// ─── App Appearance ───────────────────────────────────────────

export function AppAppearancePicker() {
  const { t } = useTranslation();
  const value = usePreferencesStore((s) => s.prefs.appAppearance);
  const setAppAppearance = usePreferencesStore((s) => s.setAppAppearance);
  const styles = useStyles();

  const label: Record<AppAppearance, string> = {
    system: t('settings.appearanceSystem'),
    light: t('settings.appearanceLight'),
    dark: t('settings.appearanceDark'),
  };
  const hint: Record<AppAppearance, string> = {
    system: t('settings.appearanceSystemHint'),
    light: t('settings.appearanceLightHint'),
    dark: t('settings.appearanceDarkHint'),
  };

  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={t('settings.appAppearance')}>
      {APP_APPEARANCES.map((choice) => (
        <OptionTile
          key={choice}
          label={label[choice]}
          hint={hint[choice]}
          selected={value === choice}
          onPress={() => setAppAppearance(choice)}
          preview={
            choice === 'system' ? (
              <View style={StyleSheet.absoluteFill}>
                <AppMiniature colors={LightColors} />
                {/* Right half shows Dark: the device decides. */}
                <View style={[StyleSheet.absoluteFill, styles.half]}>
                  <View style={styles.halfInner}>
                    <AppMiniature colors={DarkColors} />
                  </View>
                </View>
              </View>
            ) : (
              <AppMiniature colors={choice === 'dark' ? DarkColors : LightColors} />
            )
          }
        />
      ))}
    </View>
  );
}

/** A tiny screen: a card with a title line, a caption line and a sage button. */
function AppMiniature({ colors }: { colors: AppColors }) {
  return (
    <View style={[StyleSheet.absoluteFill, mini.screen, { backgroundColor: colors.background }]}>
      <View style={[mini.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[mini.line, { width: '70%', backgroundColor: colors.textPrimary }]} />
        <View style={[mini.line, mini.thin, { width: '48%', backgroundColor: colors.textMuted }]} />
      </View>
      <View style={mini.footer}>
        <View style={[mini.pill, { backgroundColor: colors.primary }]} />
        <View style={[mini.dot, { backgroundColor: colors.gold }]} />
      </View>
    </View>
  );
}

// ─── Reading Appearance ───────────────────────────────────────

export function ReadingAppearancePicker() {
  const { t } = useTranslation();
  const value = usePreferencesStore((s) => s.prefs.readingAppearance);
  const setReadingAppearance = usePreferencesStore((s) => s.setReadingAppearance);
  const styles = useStyles();

  const label: Record<ReadingAppearance, string> = {
    paper: t('settings.readingPaper'),
    moonlight: t('settings.readingMoonlight'),
  };
  const hint: Record<ReadingAppearance, string> = {
    paper: t('settings.readingPaperHint'),
    moonlight: t('settings.readingMoonlightHint'),
  };

  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={t('settings.readingAppearance')}>
      {READING_APPEARANCES.map((choice) => (
        <OptionTile
          key={choice}
          label={label[choice]}
          hint={hint[choice]}
          selected={value === choice}
          onPress={() => setReadingAppearance(choice)}
          preview={<PageMiniature appearance={choice} />}
        />
      ))}
    </View>
  );
}

/** A tiny reader page: highlighted English line over its Vietnamese pair. */
function PageMiniature({ appearance }: { appearance: ReadingAppearance }) {
  const r = ReaderThemes[appearance];
  return (
    <View style={[StyleSheet.absoluteFill, mini.screen, { backgroundColor: r.background }]}>
      <View style={[mini.page, { backgroundColor: r.page, borderColor: r.pageEdge }]}>
        <View style={[mini.highlight, { backgroundColor: r.highlightBg }]}>
          <View style={[mini.bar, { backgroundColor: r.highlightBar }]} />
          <View style={{ flex: 1, gap: 4 }}>
            <View style={[mini.line, { width: '82%', backgroundColor: r.text }]} />
            <View style={[mini.line, mini.thin, { width: '64%', backgroundColor: r.vi }]} />
          </View>
        </View>
        <View style={[mini.line, mini.thin, { width: '56%', marginLeft: 6, backgroundColor: r.textMuted }]} />
      </View>
      {appearance === 'moonlight' ? (
        <View style={mini.moon}>
          <Moon size={11} color={r.accent} fill={r.accent} strokeWidth={1.5} />
        </View>
      ) : null}
    </View>
  );
}

// ─── Shared tile ──────────────────────────────────────────────

function OptionTile({
  label,
  hint,
  selected,
  onPress,
  preview,
}: {
  label: string;
  hint: string;
  selected: boolean;
  onPress: () => void;
  preview: React.ReactNode;
}) {
  const { colors } = useTheme();
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, selected }}
      accessibilityLabel={label}
      accessibilityHint={hint}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <View style={[styles.preview, selected ? styles.previewSelected : null]}>
        <View style={styles.previewClip}>{preview}</View>
        {selected ? (
          <View style={styles.check} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
            <Check size={11} color={colors.onPrimary} strokeWidth={3.2} />
          </View>
        ) : null}
      </View>
      <Text
        style={[styles.label, selected ? styles.labelSelected : null]}
        numberOfLines={1}
        maxFontSizeMultiplier={1.6}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const useStyles = createThemedStyles((t) => ({
  row: { flexDirection: 'row', gap: 10 },
  tile: { flex: 1, minWidth: 0, alignItems: 'stretch', gap: 7 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  preview: {
    height: PREVIEW_H,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    padding: 2,
  },
  previewSelected: { borderColor: t.colors.primary, borderWidth: 2.5, padding: 1 },
  previewClip: { flex: 1, borderRadius: BorderRadius.lg - 3, overflow: 'hidden' },
  // Clip the dark copy to the right half (System tile).
  half: { left: '50%', overflow: 'hidden' },
  halfInner: { position: 'absolute', top: 0, bottom: 0, right: 0, width: '200%' },
  check: {
    position: 'absolute',
    top: -7,
    right: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: t.colors.primary,
    borderWidth: 2,
    borderColor: t.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: '500',
    color: t.colors.textSecondary,
    textAlign: 'center',
  },
  labelSelected: { fontWeight: '700', color: t.colors.textPrimary },
}));

// Miniature drawings are fixed palettes, not the active theme.
const mini = StyleSheet.create({
  screen: { padding: 7, gap: 6 },
  card: { borderRadius: 5, borderWidth: 1, padding: 6, gap: 4 },
  line: { height: 4, borderRadius: 2 },
  thin: { height: 3, opacity: 0.9 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: { width: 26, height: 8, borderRadius: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  page: { flex: 1, borderRadius: 4, borderWidth: 1, padding: 4, gap: 4 },
  highlight: { flexDirection: 'row', gap: 4, borderRadius: 3, padding: 4 },
  bar: { width: 2, borderRadius: 1 },
  // Bottom-right, clear of the selection check badge at the top-right corner.
  moon: { position: 'absolute', bottom: 5, right: 6 },
});
