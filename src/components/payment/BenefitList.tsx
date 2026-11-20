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

/**
 * Refined check list for the paywall.
 * `large` is the tablet size; `columns={2}` lays the items out as a 2×2 grid
 * (read row by row) so a wide tablet column isn't one long thin list.
 */
export function BenefitList({ compact, large, columns = 1 }: { compact?: boolean; large?: boolean; columns?: 1 | 2 }) {
  const { t } = useTranslation();
  const items = PREMIUM_BENEFIT_KEYS.map((key) => t(key));
  const item = (label: string) => (
    <View key={label} style={[styles.row, columns === 2 && styles.cell]} accessible accessibilityLabel={label}>
      <View style={[styles.check, large && styles.checkLarge]}>
        <Check size={large ? 14 : 12} color={PremiumColors.sage} strokeWidth={2.6} />
      </View>
      <Text style={[styles.text, compact && styles.textCompact, large && styles.textLarge]}>{label}</Text>
    </View>
  );
  if (columns === 2) {
    const rows: string[][] = [];
    for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
    return (
      <View style={[styles.list, styles.listLarge]} accessibilityRole="list">
        {rows.map((pair) => (
          <View key={pair.join('|')} style={styles.gridRow}>
            {pair.map(item)}
            {pair.length === 1 ? <View style={styles.cell} /> : null}
          </View>
        ))}
      </View>
    );
  }
  return (
    <View style={[styles.list, compact && styles.listCompact, large && styles.listLarge]} accessibilityRole="list">
      {items.map(item)}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.sm + 2 },
  listCompact: { gap: Spacing.sm },
  listLarge: { gap: Spacing.md },
  gridRow: { flexDirection: 'row', gap: Spacing.lg },
  cell: { flex: 1, alignItems: 'flex-start' },
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
  textLarge: { fontSize: Typography.md, lineHeight: 24 },
  checkLarge: { width: 26, height: 26, borderRadius: 13, marginTop: -1 },
});
