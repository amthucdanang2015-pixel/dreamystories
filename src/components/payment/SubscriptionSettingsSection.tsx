// ============================================================
// Settings → Dreamy Stories Premium
//   free users : upgrade entry, restore, manage subscription
//   subscribers: current plan status, restore, manage subscription
// Restore and Manage sit behind the grown-up check.
// ============================================================

import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, CreditCard, ExternalLink, RefreshCw } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { PremiumColors, Spacing, TouchTarget, Typography } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';
import { FREE_STORY_IDS } from '../../constants/entitlements';
import { ALL_STORIES } from '../../data/stories';
import { iapService } from '../../services/iapService';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { paywallHref } from '../../hooks/usePremiumGate';
import { SettingsItem, SettingsSection } from '../settings/SettingsPanel';
import { PremiumStatusPill } from './PremiumBadge';
import { MoonMark } from '../ui/MoonMark';
import { useParentalGate } from './ParentalGate';
import { formatDate } from '../../i18n/format';

export function SubscriptionSettingsSection() {
  const router = useRouter();
  const { t } = useTranslation();
  const styles = useStyles();
  const { colors, isDark } = useTheme();
  const ICON = colors.accent;
  const entitlement = useSubscriptionStore((s) => s.entitlement);
  const restoreState = useSubscriptionStore((s) => s.restoreState);
  const restore = useSubscriptionStore((s) => s.restore);
  const manageSubscription = useSubscriptionStore((s) => s.manageSubscription);
  const canManage = iapService.canManageSubscriptions;
  const [manageFailed, setManageFailed] = React.useState(false);
  const { guard, gate } = useParentalGate();

  const openManage = () =>
    guard(async () => {
      setManageFailed(false);
      const opened = await manageSubscription();
      setManageFailed(!opened);
    }, t('parentalGate.reasonManage'));

  const restoreDescription =
    restoreState.status === 'restoring'
      ? t('premiumSettings.restoreChecking')
      : restoreState.status === 'restored'
        ? t('premiumSettings.restoreDone')
        : restoreState.status === 'nothing_to_restore'
          ? t('premiumSettings.restoreNothing')
          : restoreState.status === 'error'
            ? restoreState.error ?? t('premiumSettings.restoreErrorDefault')
            : entitlement.isPremium
              ? t('premiumSettings.restoreIdleSubscriber')
              : t('premiumSettings.restoreIdle');

  const renewal = entitlement.expiresAt ? formatDate(entitlement.expiresAt) : null;
  const activeLabel =
    entitlement.plan === 'yearly'
      ? t('premiumSettings.activeYearly')
      : entitlement.plan === 'weekly'
        ? t('premiumSettings.activeWeekly')
        : t('premiumSettings.active');
  const renewsText = renewal ? t('premiumSettings.renews', { date: renewal }) : undefined;
  const statusLabel = t('premiumSettings.statusActive');
  // Light mode: the moon is drawn in textAccent, since plain gold is only 2.2:1 on paper.
  const moonColor = isDark ? colors.gold : colors.textAccent;

  return (
    <SettingsSection title={t('premiumSettings.section')}>
      {entitlement.isPremium ? (
        // Status, not an action: no chevron, no pressed state. One VoiceOver stop.
        <View accessible accessibilityLabel={[activeLabel, renewsText, statusLabel].filter(Boolean).join('. ')}>
          <SettingsItem
            tone="premium"
            icon={(size) => <MoonMark size={size} color={moonColor} halo={colors.goldHalo} />}
            label={activeLabel}
            description={renewsText}
          >
            <PremiumStatusPill label={statusLabel} />
          </SettingsItem>
        </View>
      ) : (
        // A glimpse of the paywall's moonlit edition, so the two read as one.
        <Pressable
          onPress={() => router.push(paywallHref('settings'))}
          accessibilityRole="button"
          accessibilityLabel={t('premiumSettings.seePlans')}
          accessibilityHint={t('premiumSettings.unlockDescription', {
            free: FREE_STORY_IDS.length,
            count: ALL_STORIES.length,
          })}
          style={({ pressed }) => [styles.moonlit, pressed && styles.moonlitPressed]}
        >
          <MoonMark size={38} color={PremiumColors.moon} halo={PremiumColors.cardSelected} />
          <View style={styles.moonlitText}>
            <Text style={styles.moonlitTitle}>{t('premiumSettings.unlock')}</Text>
            <Text style={styles.moonlitBody}>
              {t('premiumSettings.unlockDescription', {
                free: FREE_STORY_IDS.length,
                count: ALL_STORIES.length,
              })}
            </Text>
          </View>
          <ChevronRight size={18} color={PremiumColors.moon} />
        </Pressable>
      )}

      <Row
        onPress={() => guard(restore, t('parentalGate.reasonRestore'))}
        disabled={restoreState.status === 'restoring'}
        accessibilityLabel={t('premiumSettings.restoreA11y', { status: restoreDescription })}
      >
        <SettingsItem
          icon={<RefreshCw size={17} color={ICON} />}
          label={t('premiumSettings.restore')}
          description={restoreDescription}
        >
          {restoreState.status === 'restoring' ? <ActivityIndicator size="small" color={ICON} /> : null}
        </SettingsItem>
      </Row>

      {canManage ? (
        <Row onPress={openManage} accessibilityLabel={t('premiumSettings.manageA11y')}>
          <SettingsItem
            icon={<CreditCard size={17} color={ICON} />}
            label={t('premiumSettings.manage')}
            description={manageFailed ? t('premiumSettings.manageFailed') : t('premiumSettings.manageDescription')}
            last
          >
            <ExternalLink size={16} color={colors.textMuted} />
          </SettingsItem>
        </Row>
      ) : (
        <View accessible accessibilityLabel={t('premiumSettings.manageUnavailable')}>
          <SettingsItem
            icon={<CreditCard size={17} color={colors.textMuted} />}
            label={t('premiumSettings.manage')}
            description={t('premiumSettings.manageUnavailable')}
            last
          />
        </View>
      )}
      {gate}
    </SettingsSection>
  );
}

function Row({
  onPress,
  disabled,
  accessibilityLabel,
  children,
}: {
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [pressed && { backgroundColor: colors.surfaceSunken }]}
    >
      {children}
    </Pressable>
  );
}

const useStyles = createThemedStyles(() => ({
  moonlit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md - 4,
    minHeight: TouchTarget + 28,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: PremiumColors.background,
  },
  moonlitPressed: { opacity: 0.9 },
  moonlitText: { flex: 1, gap: 3 },
  moonlitTitle: { fontFamily: Typography.serif, fontSize: Typography.md, fontWeight: '700', color: PremiumColors.text },
  moonlitBody: { fontSize: Typography.sm, lineHeight: 18, color: PremiumColors.textSecondary },
}));
