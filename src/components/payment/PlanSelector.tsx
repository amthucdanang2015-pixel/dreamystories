// ============================================================
// PlanSelector — Weekly and Yearly side by side.
// Yearly is the value plan: strongest border, tinted surface and an
// attached BEST VALUE badge. Weekly stays a readable, fair option.
// The selected plan's radio is StoryMoon sage, as in the day app;
// moon-gold is kept for the value story (badge, ONLY price, savings).
// ============================================================

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { BorderRadius, PremiumColors, Spacing, Typography } from '../../constants/theme';
import type { PlanId } from '../../constants/iap';
import type { ProductsState, SubscriptionProduct } from '../../types/subscription';
import { effectiveWeeklyPrice, yearlySavingsPercent } from '../../utils/subscriptionPricing';
import { formatPercent } from '../../i18n/format';
import { Button } from '../ui/Button';

interface PlanSelectorProps {
  products: SubscriptionProduct[];
  state: ProductsState;
  selected: PlanId;
  onSelect: (plan: PlanId) => void;
  onRetry: () => void;
  disabled?: boolean;
  /** Shorter cards for small phones. */
  compact?: boolean;
}

const ORDER: PlanId[] = ['weekly', 'yearly'];
const CARD_MIN_H = 138;

export function PlanSelector({ products, state, selected, onSelect, onRetry, disabled, compact }: PlanSelectorProps) {
  const { t } = useTranslation();
  const minHeight = compact ? CARD_MIN_H - 12 : CARD_MIN_H;
  if (state.status === 'error') {
    return (
      <View style={[styles.error, { minHeight }]} accessibilityLiveRegion="polite">
        <Text style={styles.errorTitle}>{t('plans.loadErrorTitle')}</Text>
        <Text style={styles.errorText}>
          {t('plans.loadErrorBody', { reason: state.error ?? t('plans.loadErrorDefault') })}
        </Text>
        <Button
          label={t('common.tryAgain')}
          variant="ghost"
          textColor={PremiumColors.moon}
          onPress={onRetry}
          style={styles.retry}
        />
      </View>
    );
  }

  if (state.status !== 'ready') {
    return (
      <View style={styles.row} accessible accessibilityLabel={t('plans.loading')}>
        {ORDER.map((p) => (
          <View key={p} style={[styles.card, styles.skeleton, { minHeight }]}>
            <View style={[styles.bar, { width: '45%' }]} />
            <View style={[styles.bar, styles.barTall, { width: '70%' }]} />
            <View style={[styles.bar, { width: '55%' }]} />
          </View>
        ))}
      </View>
    );
  }

  const weekly = products.find((p) => p.plan === 'weekly');
  const yearly = products.find((p) => p.plan === 'yearly');
  const savings = yearlySavingsPercent(yearly, weekly);

  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={t('plans.choose')}>
      {ORDER.map((plan) => {
        const product = plan === 'yearly' ? yearly : weekly;
        if (!product) return null;
        return (
          <PlanCard
            key={plan}
            product={product}
            selected={selected === plan}
            savings={plan === 'yearly' ? savings : null}
            disabled={disabled}
            minHeight={minHeight}
            onPress={() => onSelect(plan)}
          />
        );
      })}
    </View>
  );
}

function PlanCard({
  product,
  selected,
  savings,
  disabled,
  minHeight,
  onPress,
}: {
  product: SubscriptionProduct;
  selected: boolean;
  savings: number | null;
  disabled?: boolean;
  minHeight: number;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const yearly = product.plan === 'yearly';
  const perWeek = yearly ? effectiveWeeklyPrice(product) : null;
  const savingsText = savings ? formatPercent(savings / 100) : null;
  // Screen-reader facts, read as a list.
  const a11y = yearly
    ? [
        t('plans.a11yYearly', { price: product.displayPrice }),
        perWeek ? t('plans.a11yYearlyPerWeek', { price: perWeek }) : null,
        savingsText ? t('plans.a11ySave', { percent: savingsText }) : null,
        t('plans.a11yBestValue'),
      ]
    : [t('plans.a11yWeekly', { price: product.displayPrice })];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled: !!disabled }}
      accessibilityLabel={a11y.filter(Boolean).join(', ')}
      style={({ pressed }) => [
        styles.card,
        { minHeight },
        yearly ? styles.cardYearly : null,
        selected ? (yearly ? styles.selectedYearly : styles.selectedWeekly) : null,
        pressed && styles.pressed,
      ]}
    >
      {yearly ? (
        <View style={styles.badgeWrap} pointerEvents="none">
          <View style={styles.badge}>
            {/* Stays one line inside the card on a 320 pt phone, at any text size. */}
            <Text
              style={styles.badgeText}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              maxFontSizeMultiplier={1.2}
            >
              {t('plans.bestValue')}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.headRow}>
        <Text style={[styles.planLabel, yearly && styles.planLabelYearly]}>
          {yearly ? t('plans.yearlyCaps') : t('plans.weeklyCaps')}
        </Text>
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected ? <Check size={12} color={PremiumColors.onSage} strokeWidth={3} /> : null}
        </View>
      </View>

      <Text
        style={[styles.price, !yearly && styles.priceWeekly]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {product.displayPrice}
      </Text>

      {yearly ? (
        <>
          {perWeek ? (
            <>
              <Text style={styles.only}>{t('plans.only')}</Text>
              <Text style={styles.perWeek} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                {t('plans.perWeekShort', { price: perWeek })}
              </Text>
            </>
          ) : (
            <Text style={styles.only}>{t('plans.perYearCaps')}</Text>
          )}
          {savingsText ? <Text style={styles.footYearly}>{t('plans.save', { percent: savingsText })}</Text> : null}
        </>
      ) : (
        <>
          <Text style={styles.only}>{t('plans.perWeekCaps')}</Text>
          <Text style={styles.foot}>{t('plans.billedWeekly')}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.sm + 4, paddingTop: 12 },
  card: {
    flex: 1,
    minHeight: CARD_MIN_H,
    paddingHorizontal: Spacing.md - 2,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm + 6,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: PremiumColors.border,
    backgroundColor: PremiumColors.card,
  },
  cardYearly: { borderColor: PremiumColors.borderGold },
  selectedWeekly: { borderColor: PremiumColors.sage, borderWidth: 1.5, backgroundColor: PremiumColors.sageSoft },
  selectedYearly: {
    borderColor: PremiumColors.borderStrong,
    borderWidth: 2,
    backgroundColor: PremiumColors.cardSelected,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
  badgeWrap: { position: 'absolute', top: -11, left: 8, right: 8, alignItems: 'flex-end' },
  badge: {
    maxWidth: '100%',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    backgroundColor: PremiumColors.moon,
  },
  badgeText: { fontSize: 10.5, fontWeight: '800', letterSpacing: 1, color: PremiumColors.onMoon },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  planLabel: { fontSize: Typography.xs, fontWeight: '800', letterSpacing: Typography.wider_ls, color: PremiumColors.textSecondary },
  planLabelYearly: { color: PremiumColors.gold },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: PremiumColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: PremiumColors.sage, borderColor: PremiumColors.sage },
  price: {
    fontFamily: Typography.serif,
    fontSize: Typography.xl,
    fontWeight: '700',
    color: PremiumColors.text,
    letterSpacing: -0.3,
  },
  priceWeekly: { fontSize: Typography.lg + 1, color: PremiumColors.textSecondary },
  only: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: PremiumColors.textMuted,
    marginTop: 4,
  },
  perWeek: { fontSize: Typography.sm, fontWeight: '800', letterSpacing: 0.6, color: PremiumColors.moon, marginTop: 1 },
  foot: { fontSize: Typography.xs, color: PremiumColors.textMuted, marginTop: 'auto', paddingTop: Spacing.sm },
  footYearly: { fontSize: Typography.xs, fontWeight: '700', color: PremiumColors.gold, marginTop: 'auto', paddingTop: Spacing.sm },
  skeleton: { backgroundColor: PremiumColors.skeleton, gap: 10 },
  bar: { height: 10, borderRadius: 5, backgroundColor: PremiumColors.skeletonBar },
  barTall: { height: 22 },
  error: {
    minHeight: CARD_MIN_H,
    marginTop: 12,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: PremiumColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    gap: 4,
  },
  errorTitle: { fontFamily: Typography.serif, fontSize: Typography.md, fontWeight: '700', color: PremiumColors.text },
  errorText: { fontSize: Typography.sm, color: PremiumColors.textSecondary, textAlign: 'center', lineHeight: 19 },
  retry: { marginTop: 2 },
});
