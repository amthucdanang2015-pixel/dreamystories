import React from 'react';
import { Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { BorderRadius, Palette, PremiumColors, Typography } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';

/**
 * Small "Premium" mark for covers and headers.
 *   locked  : the user can't open it yet (lock icon)
 *   unlocked: a subscriber's premium story (quiet moon-gold label)
 */
export function PremiumBadge({ locked, tone = 'dark' }: { locked: boolean; tone?: 'dark' | 'light' }) {
  const { t } = useTranslation();
  const styles = useStyles();
  const { colors } = useTheme();
  const dark = tone === 'dark';
  return (
    <View
      style={[styles.pill, dark ? styles.dark : styles.light]}
      accessible
      accessibilityLabel={locked ? t('story.premiumLocked') : t('story.premium')}
    >
      {locked ? <Lock size={10} color={dark ? PremiumColors.moon : colors.textAccent} strokeWidth={2.6} /> : null}
      <Text style={[styles.text, { color: dark ? PremiumColors.moon : colors.textAccent }]}>PREMIUM</Text>
    </View>
  );
}

/**
 * Small "Free" mark for always-free stories, the counterpart of PremiumBadge.
 * Moonlight sage on the same ink overlay, so it reads clearly on any cover
 * art but never looks like the gold Premium mark.
 */
export function FreeBadge() {
  const { t } = useTranslation();
  const styles = useStyles();
  return (
    <View style={[styles.pill, styles.dark]} accessible accessibilityLabel={t('story.free')}>
      <Text style={[styles.text, { color: Palette.moonlight }]}>{t('story.freeBadge')}</Text>
    </View>
  );
}

/**
 * Subscription state pill for the Settings status row ("Active").
 * Drawn on `surface` so the gold text keeps AA contrast in light mode
 * (5.2:1; on surfaceSunken it would be 4.45:1). Decorative for VoiceOver:
 * the row announces the state in its own label.
 */
export function PremiumStatusPill({ label }: { label: string }) {
  const styles = useStyles();
  return (
    <View
      style={[styles.pill, styles.status]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text style={styles.statusText} maxFontSizeMultiplier={1.8} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const useStyles = createThemedStyles((t) => ({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-start',
  },
  // `dark` sits on cover art: fixed ink overlay in both schemes.
  dark: { backgroundColor: Palette.overlayStrong },
  // `light` is the paper-chrome version: follows the app scheme.
  light: {
    backgroundColor: t.colors.surfaceSunken,
    borderWidth: 1,
    borderColor: t.isDark ? t.colors.borderStrong : Palette.goldLight,
  },
  text: { fontSize: 9.5, fontWeight: '800', letterSpacing: 1 },
  status: {
    alignSelf: 'flex-start',
    flexShrink: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: t.colors.surface,
    borderWidth: 1,
    borderColor: t.isDark ? t.colors.borderStrong : Palette.goldLight,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: t.colors.textAccent,
  },
}));
