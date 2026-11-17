import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { PremiumColors, Spacing, Typography } from '../../constants/theme';

/** What every Premium plan unlocks, in display order. */
export const PREMIUM_BENEFIT_KEYS = [
  'benefits.allStories',
  'benefits.narration',
  'benefits.newStories',
  'benefits.calm',
] as const;

/** Refined check list for the paywall. */
export function BenefitList({ compact }: { compact?: boolean }) {
  const { t } = useTranslation();
  const items = PREMIUM_BENEFIT_KEYS.map((key) => t(key));
  return (
    <View style={[styles.list, compact && styles.listCompact]} accessibilityRole="list">
      {items.map((item) => (
        <View key={item} style={styles.row} accessible accessibilityLabel={item}>
          <View style={styles.check}>
            <Check size={12} color={PremiumColors.sage} strokeWidth={2.6} />
          </View>
          <Text style={[styles.text, compact && styles.textCompact]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.sm + 2 },
  listCompact: { gap: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm + 4 },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: PremiumColors.sage,
    backgroundColor: PremiumColors.sageSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, fontSize: Typography.base, lineHeight: 21, color: PremiumColors.text, fontWeight: '500' },
  textCompact: { fontSize: Typography.sm + 1, lineHeight: 19 },
});
