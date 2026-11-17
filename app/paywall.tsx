// ============================================================
// Paywall — Dreamy Stories Premium
// Opened from a premium story, after finishing a free story (once),
// or from Settings. Always closable; prices, currency and billing
// periods come from the App Store's localized product metadata.
// ============================================================

import React, { useEffect } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { PremiumColors, Spacing, TouchTarget, Typography, BorderRadius } from '../src/constants/theme';
import { Themes } from '../src/theme';
import { LEGAL_URLS, type PlanId } from '../src/constants/iap';
import { FREE_STORY_IDS } from '../src/constants/entitlements';
import { ALL_STORIES, getStoryById } from '../src/data/stories';
import { useSubscriptionStore } from '../src/store/subscriptionStore';
import type { PaywallSource, SubscriptionProduct } from '../src/types/subscription';
import { BenefitList } from '../src/components/payment/BenefitList';
import { PlanSelector } from '../src/components/payment/PlanSelector';
import { PaywallBackdrop } from '../src/components/payment/PaywallBackdrop';
import { useParentalGate } from '../src/components/payment/ParentalGate';
import { BrandMark, Button, IconButton, MoonMark } from '../src/components/ui';
import { toSupportedLanguage, FALLBACK_UI_LANGUAGE } from '../src/i18n';
import { storyTitleFor } from '../src/i18n/storyMeta';
import { formatDate } from '../src/i18n/format';

const MAX_W = 520;
const DEFAULT_ART = 'chu-cuoi/cover';
const SOURCES: PaywallSource[] = ['premium_story', 'completion', 'settings', 'library'];
/**
 * The paywall is always the moonlit night edition, whatever the app scheme, so it
 * borrows only the type scale (sizes/weights) and sets every colour from PremiumColors.
 */
const nightType = Themes.dark.type;

export default function PaywallScreen() {
  const params = useLocalSearchParams<{ source?: string; storyId?: string }>();
  const source: PaywallSource = SOURCES.includes(params.source as PaywallSource)
    ? (params.source as PaywallSource)
    : 'settings';
  const story = params.storyId ? getStoryById(params.storyId) : undefined;

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const uiLanguage = toSupportedLanguage(i18n.language) ?? FALLBACK_UI_LANGUAGE;
  const { width: SW, height: SH } = useWindowDimensions();

  const {
    entitlement,
    products,
    productsState,
    selectedPlan,
    purchaseState,
    restoreState,
    initialize,
    loadProducts,
    selectPlan,
    purchaseSelected,
    restore,
    resetTransientState,
    getProduct,
  } = useSubscriptionStore();

  useEffect(() => {
    resetTransientState();
    initialize();
    loadProducts();
    return () => resetTransientState();
  }, []);

  const { guard, gate } = useParentalGate();

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const openLegal = (doc: 'terms' | 'privacy') => {
    const url = LEGAL_URLS[doc];
    // Leaving the app needs a grown-up; the in-app summary does not.
    if (url)
      guard(() => Linking.openURL(url).catch(() => router.push(`/legal?doc=${doc}`)), t('parentalGate.reasonWebPage'));
    else router.push(`/legal?doc=${doc}`);
  };

  // Short phones (iPhone SE / mini) get tighter type and plan cards.
  const compact = SH < 740;
  const artH = Math.round(Math.min(SH * 0.3, SW * 0.9, 320));
  const coverKey = story?.coverImage ?? DEFAULT_ART;
  const purchasing = purchaseState.status === 'purchasing';
  const restoring = restoreState.status === 'restoring';
  const busy = purchasing || restoring;
  const product = getProduct(selectedPlan);
  const premiumCount = ALL_STORIES.length - FREE_STORY_IDS.length;

  const copy = entitlement.isPremium
    ? { title: t('paywall.premiumTitle'), body: t('paywall.defaultBody'), short: undefined }
    : headline(t, source, story ? storyTitleFor(story, uiLanguage) : undefined, premiumCount);
  const yearlySelected = selectedPlan === 'yearly';

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* The story: art, promise and benefits. Scrolls if a small screen needs it. */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top + TouchTarget + Spacing.sm, artH - (compact ? 110 : 96)) }]}
        showsVerticalScrollIndicator={false}
      >
        <PaywallBackdrop coverKey={coverKey} width={SW} height={artH} />
        <View style={styles.column}>
          {/* Same moon-over-book mark as the app icon: the premium edition of the same book. */}
          <View style={styles.eyebrowRow}>
            <BrandMark size={22} />
            <Text style={[nightType.eyebrow, styles.eyebrow]}>{t('paywall.eyebrow')}</Text>
          </View>
          <Text style={[styles.title, compact && styles.titleCompact]} accessibilityRole="header">
            {copy.title}
          </Text>
          <Text style={[styles.description, compact && styles.descriptionCompact]}>
            {compact && copy.short ? copy.short : copy.body}
          </Text>
          {entitlement.isPremium ? null : (
            <View style={[styles.benefits, compact && styles.benefitsCompact]}>
              <BenefitList compact={compact} />
            </View>
          )}
        </View>
      </ScrollView>

      {/* The decision: anchored at the bottom, above the safe area. */}
      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}>
        <FadeEdge width={SW} />
        {/* Scrolls on its own when plans + disclosure + links outgrow ~60% of
            the screen (small phones, large text), so nothing is pushed off. */}
        <ScrollView
          style={{ flexGrow: 0, maxHeight: Math.round(SH * 0.62) }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.column}>
          {entitlement.isPremium ? (
            <PremiumWelcome
              justPurchased={purchaseState.status === 'purchased'}
              justRestored={restoreState.status === 'restored'}
              plan={entitlement.plan}
              expiresAt={entitlement.expiresAt}
              actionLabel={story && source === 'premium_story' ? t('paywall.readTheStory') : t('paywall.startReading')}
              onDone={close}
            />
          ) : (
            <>
              <PlanSelector
                products={products}
                state={productsState}
                selected={selectedPlan}
                onSelect={selectPlan}
                onRetry={() => loadProducts(true)}
                disabled={busy}
                compact={compact}
              />

              <Button
                style={styles.cta}
                label={
                  productsState.status === 'ready'
                    ? purchasing
                      ? t('paywall.ctaOpening')
                      : yearlySelected
                        ? t('paywall.ctaContinueYearly')
                        : t('paywall.ctaContinueWeekly')
                    : productsState.status === 'error'
                      ? t('paywall.ctaUnavailable')
                      : t('paywall.ctaLoading')
                }
                color={PremiumColors.moon}
                textColor={PremiumColors.onMoon}
                onPress={() =>
                  guard(
                    purchaseSelected,
                    yearlySelected ? t('parentalGate.reasonSubscribeYearly') : t('parentalGate.reasonSubscribeWeekly')
                  )
                }
                loading={purchasing}
                disabled={productsState.status !== 'ready' || !product || restoring || purchaseState.status === 'pending'}
                accessibilityHint={
                  product
                    ? t(yearlySelected ? 'paywall.ctaHintYearly' : 'paywall.ctaHintWeekly', { price: product.displayPrice })
                    : undefined
                }
              />

              <StatusNote />

              <Text style={styles.disclosure}>
                {product ? `${billingLine(t, product)} ` : null}
                {t('paywall.renewal')}
              </Text>
            </>
          )}

          {/* Restore · Terms · Privacy */}
          <View style={styles.links}>
            {entitlement.isPremium ? null : (
              <>
                <LinkButton
                  label={restoring ? t('paywall.restoring') : t('paywall.restore')}
                  onPress={() => guard(restore, t('parentalGate.reasonRestore'))}
                  disabled={busy}
                />
                <Text style={styles.linkDot}>·</Text>
              </>
            )}
            <LinkButton label={t('paywall.terms')} onPress={() => openLegal('terms')} />
            <Text style={styles.linkDot}>·</Text>
            <LinkButton label={t('paywall.privacy')} onPress={() => openLegal('privacy')} />
          </View>
          {!entitlement.isPremium ? <RestoreNote /> : null}
        </View>
        </ScrollView>
      </View>

      {/* Close stays reachable at all times */}
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.xs }]} pointerEvents="box-none">
        <View />

        <IconButton onPress={close} accessibilityLabel={t('common.close')} variant="overlay" size={TouchTarget}>
          <X size={20} color={PremiumColors.text} strokeWidth={2.2} />
        </IconButton>
      </View>

      {gate}
    </View>
  );
}

/** Soft edge where the scrolling story meets the anchored plans. */
function FadeEdge({ width }: { width: number }) {
  const id = 'pwf' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <View style={styles.fade} pointerEvents="none">
      <Svg width={width} height={28}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={PremiumColors.background} stopOpacity="0" />
            <Stop offset="100%" stopColor={PremiumColors.background} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect width={width} height={28} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

/** Paywall copy; `short` is used on small phones. */
function headline(
  t: TFunction,
  source: PaywallSource,
  storyTitle: string | undefined,
  premiumCount: number
): { title: string; body: string; short?: string } {
  switch (source) {
    case 'premium_story':
      return {
        title: t('paywall.storyTitle'),
        body: storyTitle
          ? t('paywall.storyBody', { title: storyTitle, count: premiumCount - 1 })
          : t('paywall.storyBodyNoTitle', { count: premiumCount }),
        short: t('paywall.storyShort', { count: premiumCount }),
      };
    case 'completion':
      return {
        title: t('paywall.defaultTitle'),
        body: storyTitle ? t('paywall.completionBody', { title: storyTitle }) : t('paywall.completionBodyNoTitle'),
        short: t('paywall.completionShort'),
      };
    default:
      return { title: t('paywall.defaultTitle'), body: t('paywall.defaultBody') };
  }
}

/** "$29.99 billed every year." — period and price exactly as the App Store reports them. */
function billingLine(t: TFunction, product: SubscriptionProduct): string {
  const { unit, count } = product.period;
  const price = product.displayPrice;
  if (count === 1 && unit === 'year') return t('paywall.billedYearly', { price });
  if (count === 1 && unit === 'week') return t('paywall.billedWeekly', { price });
  if (count === 1 && unit === 'month') return t('paywall.billedMonthly', { price });
  return t('paywall.billedEvery', { price, count, unit: t(`paywall.periodUnit.${unit}`, { count }) });
}

function StatusNote() {
  const { t } = useTranslation();
  const purchaseState = useSubscriptionStore((s) => s.purchaseState);
  let text: string | null = null;
  let tone: 'muted' | 'error' = 'muted';
  if (purchaseState.status === 'cancelled') text = t('paywall.cancelled');
  else if (purchaseState.status === 'pending') text = t('paywall.pending');
  else if (purchaseState.status === 'unavailable') text = purchaseState.error;
  else if (purchaseState.status === 'error') {
    text = purchaseState.error;
    tone = 'error';
  }
  if (!text) return null;
  return (
    <Text style={[styles.note, tone === 'error' && styles.noteError]} accessibilityLiveRegion="polite">
      {text}
    </Text>
  );
}

function RestoreNote() {
  const { t } = useTranslation();
  const restoreState = useSubscriptionStore((s) => s.restoreState);
  const text =
    restoreState.status === 'nothing_to_restore'
      ? t('paywall.nothingToRestore')
      : restoreState.status === 'error'
        ? restoreState.error
        : null;
  if (!text) return null;
  return (
    <Text
      style={[styles.note, restoreState.status === 'error' && styles.noteError]}
      accessibilityLiveRegion="polite"
    >
      {text}
    </Text>
  );
}

function PremiumWelcome({
  justPurchased,
  justRestored,
  plan,
  expiresAt,
  actionLabel,
  onDone,
}: {
  justPurchased: boolean;
  justRestored: boolean;
  plan: PlanId | null;
  expiresAt: number | null;
  actionLabel: string;
  onDone: () => void;
}) {
  const { t } = useTranslation();
  const title = justPurchased
    ? t('paywall.welcomePurchasedTitle')
    : justRestored
      ? t('paywall.welcomeRestoredTitle')
      : t('paywall.welcomeTitle');
  const body = t('paywall.welcomeBody');
  const date = expiresAt ? formatDate(expiresAt) : null;
  const yearly = plan === 'yearly';
  const planText = !plan
    ? null
    : date
      ? t(yearly ? 'paywall.welcomePlanYearlyRenews' : 'paywall.welcomePlanWeeklyRenews', { date })
      : t(yearly ? 'paywall.welcomePlanYearly' : 'paywall.welcomePlanWeekly');
  return (
    <View style={styles.welcome} accessibilityLiveRegion="polite">
      <MoonMark size={48} color={PremiumColors.moon} halo={PremiumColors.cardSelected} />
      <Text style={styles.welcomeTitle} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.welcomeBody}>{body}</Text>
      {planText ? (
        <Text style={styles.welcomeMeta}>{planText}</Text>
      ) : null}
      <Button
        style={[styles.cta, styles.welcomeCta]}
        label={actionLabel}
        color={PremiumColors.moon}
        textColor={PremiumColors.onMoon}
        onPress={onDone}
      />
    </View>
  );
}

function LinkButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [styles.link, (pressed || disabled) && { opacity: 0.6 }]}
    >
      <Text style={styles.linkText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PremiumColors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.gutter, paddingBottom: Spacing.md },
  column: { width: '100%', maxWidth: MAX_W, alignSelf: 'center' },
  bottom: { paddingHorizontal: Spacing.gutter, backgroundColor: PremiumColors.background },
  fade: { position: 'absolute', top: -28, left: 0, right: 0, height: 28 },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  eyebrow: { color: PremiumColors.gold },
  title: {
    ...nightType.display,
    fontSize: 30,
    lineHeight: 35,
    color: PremiumColors.text,
  },
  titleCompact: { fontSize: 27, lineHeight: 32 },
  description: {
    fontSize: Typography.base,
    lineHeight: Typography.base * 1.55,
    color: PremiumColors.textSecondary,
    marginTop: Spacing.sm + 2,
  },
  descriptionCompact: { fontSize: Typography.sm + 1, lineHeight: 20, marginTop: Spacing.sm },
  benefits: { marginTop: Spacing.md + 4 },
  benefitsCompact: { marginTop: Spacing.md },
  cta: { marginTop: Spacing.md - 2 },
  note: {
    fontSize: Typography.sm,
    lineHeight: 19,
    color: PremiumColors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm + 2,
  },
  noteError: { color: PremiumColors.error },
  disclosure: {
    fontSize: Typography.xs,
    lineHeight: Typography.xs * 1.5,
    color: PremiumColors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  // Wraps: "Khôi phục giao dịch · Điều khoản · Quyền riêng tư" is wider than a 375 pt phone.
  links: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' },
  link: { minHeight: TouchTarget, minWidth: TouchTarget, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' },
  linkText: { fontSize: Typography.sm, fontWeight: '600', color: PremiumColors.textSecondary, textDecorationLine: 'underline' },
  linkDot: { color: PremiumColors.textMuted, fontSize: Typography.sm },
  welcome: {
    alignItems: 'center',
    gap: 6,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: PremiumColors.border,
    backgroundColor: PremiumColors.card,
  },
  welcomeTitle: {
    fontFamily: Typography.serif,
    fontSize: Typography.lg + 2,
    fontWeight: '700',
    color: PremiumColors.text,
    textAlign: 'center',
    marginTop: 4,
  },
  welcomeBody: { fontSize: Typography.sm + 1, lineHeight: 21, color: PremiumColors.textSecondary, textAlign: 'center' },
  welcomeCta: { alignSelf: 'stretch' },
  welcomeMeta: { fontSize: Typography.xs, fontWeight: '700', letterSpacing: 0.4, color: PremiumColors.gold, marginTop: 2 },
});
