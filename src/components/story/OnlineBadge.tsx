import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Cloud } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { BorderRadius, Palette } from '../../constants/theme';

/**
 * "Online" mark for stories whose narration streams from HOST_ONLINE.
 * Same ink overlay pill as the Free / Premium marks so it reads on any cover.
 */
export function OnlineBadge() {
  const { t } = useTranslation();
  return (
    <View style={styles.pill} accessible accessibilityLabel={t('online.badgeA11y')}>
      <Cloud size={10} color={Palette.moonlight} strokeWidth={2.6} />
      <Text style={styles.text}>{t('online.badge')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-start',
    backgroundColor: Palette.overlayStrong,
  },
  text: { fontSize: 9.5, fontWeight: '800', letterSpacing: 1, color: Palette.moonlight },
});
