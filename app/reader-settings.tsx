// ============================================================
// Reading settings sheet — opened from the reader (and story detail)
// as a modal on top of the current screen, so the open story and
// page stay exactly where they were. Preferences save immediately.
// ============================================================

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react-native';
import { Typography, Spacing, BorderRadius } from '../src/constants/theme';
import { createThemedStyles, useReaderTheme, useTheme } from '../src/theme';
import { SettingsPanel } from '../src/components/settings/SettingsPanel';
import { IconButton } from '../src/components/ui';
import { usePreferencesStore } from '../src/store/preferencesStore';
import { formatSpeed } from '../src/i18n/format';

export default function ReaderSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors, type } = useTheme();
  const styles = useStyles();
  // iOS page sheets already sit below the status bar.
  const topPad = Platform.OS === 'ios' ? Spacing.sm : insets.top + Spacing.sm;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View style={styles.grabber} />
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            {/* The header doesn't scroll: cap its growth so large text leaves room for the settings. */}
            <Text style={type.heading} accessibilityRole="header" maxFontSizeMultiplier={1.6}>
              {t('readerSettings.title')}
            </Text>
            <Text style={styles.subtitle} maxFontSizeMultiplier={1.6}>
              {t('readerSettings.subtitle')}
            </Text>
          </View>
          <IconButton onPress={() => router.back()} accessibilityLabel={t('readerSettings.close')} variant="outline">
            <X size={20} color={colors.textPrimary} strokeWidth={2} />
          </IconButton>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.center}>
          <ReaderPreview />
          <SettingsPanel showAppSettings={false} />
        </View>
      </ScrollView>
    </View>
  );
}

/** A live sample of how the page will look with the current mode and theme. */
function ReaderPreview() {
  // `t` is the reader theme here, so the translator is `tr`.
  const { t: tr } = useTranslation();
  const { type } = useTheme();
  const styles = useStyles();
  const prefs = usePreferencesStore((s) => s.prefs);
  // The preview shows the Reading Appearance, not the app's Light/Dark.
  const t = useReaderTheme();
  const mode = prefs.defaultReadingMode;
  const showEn = mode !== 'single_vi';
  const showVi = mode !== 'single_en';
  const viFirst = mode === 'vi_first_en_second';
  const en = (
    <Text style={[styles.sampleEn, { color: t.text }]}>The moon smiled down at the little village.</Text>
  );
  const vi = <Text style={[styles.sampleVi, { color: t.vi }]}>Mặt trăng mỉm cười nhìn xuống ngôi làng nhỏ.</Text>;
  return (
    <View style={styles.previewWrap}>
      <Text style={[type.eyebrow, styles.previewLabel]}>{tr('readerSettings.preview')}</Text>
      <View style={[styles.preview, { backgroundColor: t.page, borderColor: t.pageEdge }]}>
        <View style={[styles.previewHighlight, { backgroundColor: t.highlightBg }]}>
          <View style={[styles.previewBar, { backgroundColor: t.highlightBar }]} />
          <View style={{ flex: 1, gap: 6 }}>
            {viFirst ? (showVi ? vi : null) : showEn ? en : null}
            {viFirst ? (showEn ? en : null) : showVi ? vi : null}
          </View>
        </View>
        <Text style={[styles.previewMeta, { color: t.textMuted }]}>
          {tr(t.name === 'moonlight' ? 'readerSettings.previewMoonlight' : 'readerSettings.previewPaper', {
            speed: formatSpeed(prefs.narrationSpeed),
          })}
        </Text>
      </View>
    </View>
  );
}

const useStyles = createThemedStyles((th) => ({
  container: { flex: 1, backgroundColor: th.colors.background },
  center: { width: '100%', maxWidth: 680, alignSelf: 'center' },
  header: {
    paddingHorizontal: Spacing.gutter,
    paddingBottom: Spacing.sm + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: th.colors.border,
    backgroundColor: th.colors.surface,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: th.colors.borderStrong,
    marginBottom: Spacing.sm + 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headerText: { flex: 1 },
  subtitle: { fontSize: Typography.xs, color: th.colors.textMuted, marginTop: 3 },
  previewWrap: { paddingHorizontal: Spacing.gutter, marginTop: Spacing.lg },
  previewLabel: { marginBottom: Spacing.sm, paddingHorizontal: 4 },
  preview: { borderRadius: BorderRadius.xl, borderWidth: 1, padding: Spacing.md, gap: Spacing.sm + 2 },
  previewHighlight: { flexDirection: 'row', gap: Spacing.sm + 4, borderRadius: BorderRadius.lg, padding: Spacing.sm + 4 },
  previewBar: { width: 3, borderRadius: 2 },
  sampleEn: { fontFamily: Typography.serif, fontSize: Typography.md, lineHeight: Typography.md * 1.5 },
  sampleVi: { fontSize: Typography.base, lineHeight: Typography.base * 1.55, fontWeight: '500' },
  previewMeta: { fontSize: Typography.xs, fontWeight: '600', paddingHorizontal: 4 },
}));
