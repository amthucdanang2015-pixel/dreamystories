import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Typography, Spacing, BorderRadius, Layout } from '../../src/constants/theme';
import { createThemedStyles, useTheme } from '../../src/theme';
import { SettingsPanel } from '../../src/components/settings/SettingsPanel';
import { SubscriptionSettingsSection } from '../../src/components/payment';
import { GeneralSettingsSection } from '../../src/components/settings/GeneralSettingsSection';
import { BrandMark, CollapsingHeaderScreen, ScreenHeader } from '../../src/components/ui';
import { useResponsiveLayout } from '../../src/hooks/useResponsiveLayout';
import { ALL_STORIES } from '../../src/data/stories';
import { useProgressStore } from '../../src/store/progressStore';

const APP_VERSION = '1.0.6';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const styles = useStyles();
  const { type } = useTheme();
  const progressMap = useProgressStore((s) => s.progressMap);
  const finished = Object.values(progressMap).filter((p) => p.completed).length;
  const { gutter, sizeClass } = useResponsiveLayout();
  const settingsMaxWidth = sizeClass === 'expanded' ? 920 : Layout.maxWidth.form;

  return (
    <CollapsingHeaderScreen
      compactTitle={t('settings.title')}
      maxWidth={settingsMaxWidth}
      contentPaddingBottom={Spacing.xxl + 20}
      header={<ScreenHeader eyebrow={t('settings.eyebrow')} title={t('settings.title')} subtitle={t('settings.subtitle')} />}
    >
      <View style={[styles.center, { maxWidth: settingsMaxWidth }]}>
        <SubscriptionSettingsSection />

        <SettingsPanel />

        <GeneralSettingsSection />

        <View style={[styles.about, { marginHorizontal: gutter }]}>
          <BrandMark size={44} />
          <Text style={[type.heading, styles.aboutTitle]}>{t('share.appTitle')}</Text>
          <Text style={styles.aboutText}>{t('settings.aboutText')}</Text>
          <Text style={styles.aboutStat}>
            {t('settings.aboutStat', { finished, count: ALL_STORIES.length })}
          </Text>
          <Text style={styles.aboutVersion}>{t('settings.version', { version: APP_VERSION })}</Text>
        </View>
      </View>
    </CollapsingHeaderScreen>
  );
}

const useStyles = createThemedStyles((t) => ({
  center: { width: '100%', maxWidth: Layout.maxWidth.form, alignSelf: 'center' },
  about: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: 6,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: t.colors.border,
    borderStyle: 'dashed',
  },
  aboutTitle: { marginTop: 4 },
  aboutText: { fontSize: Typography.sm, color: t.colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  aboutStat: { fontSize: Typography.sm, color: t.colors.textAccent, fontWeight: '600', marginTop: 4 },
  aboutVersion: { fontSize: Typography.xs, color: t.colors.textMuted, letterSpacing: 0.5, marginTop: 2 },
}));
