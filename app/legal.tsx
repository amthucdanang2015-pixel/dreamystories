// ============================================================
// Legal — in-app summary of Terms / Privacy.
// DRAFT: replace with the final documents (or link out via
// LEGAL_URLS in src/constants/iap.ts) before release.
// ============================================================

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { BorderRadius, Layout, Palette, Spacing, Typography } from '../src/constants/theme';
import { createThemedStyles, useTheme } from '../src/theme';
import { IconButton, PaperBackdrop } from '../src/components/ui';
import { useResponsiveLayout } from '../src/hooks/useResponsiveLayout';

const DOCS = {
  terms: {
    eyebrow: 'legal.termsEyebrow',
    title: 'legal.termsTitle',
    sections: [
      ['legal.termsPlansHeading', 'legal.termsPlansText'],
      ['legal.termsRenewalHeading', 'legal.termsRenewalText'],
      ['legal.termsCancelHeading', 'legal.termsCancelText'],
      ['legal.termsFreeHeading', 'legal.termsFreeText'],
    ],
  },
  privacy: {
    eyebrow: 'legal.privacyEyebrow',
    title: 'legal.privacyTitle',
    sections: [
      ['legal.privacyNoAccountHeading', 'legal.privacyNoAccountText'],
      ['legal.privacyDeviceHeading', 'legal.privacyDeviceText'],
      ['legal.privacyPurchasesHeading', 'legal.privacyPurchasesText'],
    ],
  },
} as const;

export default function LegalScreen() {
  const { doc } = useLocalSearchParams<{ doc?: string }>();
  const content = DOCS[doc === 'privacy' ? 'privacy' : 'terms'];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const styles = useStyles();
  const { colors, type } = useTheme();
  const { gutter } = useResponsiveLayout();

  return (
    <View style={styles.screen}>
      <PaperBackdrop />
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xs, paddingHorizontal: Math.max(Spacing.md, gutter - 4) }]}>
        <IconButton onPress={() => router.back()} accessibilityLabel={t('common.close')} variant="outline">
          <X size={20} color={colors.textPrimary} strokeWidth={2.2} />
        </IconButton>
      </View>
      <ScrollView
        contentContainerStyle={[styles.body, { paddingHorizontal: gutter, paddingBottom: insets.bottom + Spacing.xxl }]}
      >
        <Text style={[type.eyebrow, styles.eyebrow]}>{t(content.eyebrow)}</Text>
        <Text style={type.title} accessibilityRole="header">
          {t(content.title)}
        </Text>
        <View style={styles.draft}>
          <Text style={styles.draftText}>{t('legal.draft')}</Text>
        </View>
        {content.sections.map(([heading, text]) => (
          <View key={heading} style={styles.section}>
            <Text style={type.heading}>{t(heading)}</Text>
            <Text style={styles.text}>{t(text)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const useStyles = createThemedStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: Spacing.md },
  body: { width: '100%', maxWidth: Layout.maxWidth.form, alignSelf: 'center' },
  eyebrow: { color: t.colors.textAccent, marginBottom: 6 },
  draft: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: t.isDark ? t.colors.borderStrong : Palette.goldLight,
    backgroundColor: t.colors.surfaceSunken,
  },
  draftText: { fontSize: Typography.sm, color: t.colors.textSecondary, lineHeight: 19 },
  section: { marginTop: Spacing.lg, gap: 6 },
  text: { ...t.type.body },
}));
