import React from 'react';
import { Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { BorderRadius, Palette, PremiumColors } from '../../constants/theme';
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
}));
