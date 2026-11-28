// ============================================================
// Settings → General: share the app, rate it, get support.
// Every row leaves the app (share sheet, store review, web page), so
// each one sits behind the grown-up check. Sharing keeps its own gate
// inside useShare; Rate and Support use this section's gate.
// ============================================================

import React, { useState } from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';
import { ExternalLink, LifeBuoy, Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme';
import { useShare } from '../../hooks/useShare';
import { useParentalGate } from '../payment/ParentalGate';
import { ShareIcon } from '../ui';
import { requestAppReview } from '../../services/reviewService';
import { resolveSupportUrl } from '../../constants/support';
import { SettingsItem, SettingsRow, SettingsSection } from './SettingsPanel';

type RateStatus = 'idle' | 'busy' | 'unavailable' | 'error';

export function GeneralSettingsSection() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const ICON = colors.accent;
  const { shareApp, sharing, gate: shareGate } = useShare();
  const { guard, gate } = useParentalGate();
  const [rateStatus, setRateStatus] = useState<RateStatus>('idle');
  const [supportFailed, setSupportFailed] = useState(false);
  const SUPPORT_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSc0jLMhV_aPoXjBIqf2DCDaOOGMgcANEIOda73kafkBmYs_cA/viewform?usp=dialog';
  const supportUrl = resolveSupportUrl(SUPPORT_URL);

  const rate = () =>
    guard(async () => {
      setRateStatus('busy');
      const outcome = await requestAppReview();
      setRateStatus(outcome === 'unavailable' ? 'unavailable' : outcome === 'error' ? 'error' : 'idle');
    }, t('parentalGate.reasonRate'));

  const openSupport = () => {
    if (!supportUrl) return;
    guard(async () => {
      setSupportFailed(false);
      try {
        await Linking.openURL(supportUrl);
      } catch {
        setSupportFailed(true);
      }
    }, t('parentalGate.reasonWebPage'));
  };

  const shareDescription = t('settings.shareAppDescription');
  const rateDescription =
    rateStatus === 'unavailable'
      ? t('settings.rateUsUnavailable')
      : rateStatus === 'error'
        ? t('settings.rateUsFailed')
        : t('settings.rateUsDescription');
  const supportDescription = supportFailed ? t('settings.supportFailed') : t('settings.supportDescription');

  return (
    <SettingsSection title={t('settings.sectionGeneral')}>
      <SettingsRow
        onPress={shareApp}
        disabled={sharing}
        accessibilityLabel={`${t('share.shareApp')}. ${shareDescription}`}
        accessibilityHint={t('share.shareAppHint')}
      >
        <SettingsItem
          icon={<ShareIcon size={17} color={ICON} />}
          label={t('share.shareApp')}
          description={shareDescription}
        />
      </SettingsRow>

      <SettingsRow
        onPress={rate}
        disabled={rateStatus === 'busy'}
        accessibilityLabel={`${t('settings.rateUs')}. ${rateDescription}`}
        accessibilityHint={t('settings.rateUsHint')}
      >
        <SettingsItem icon={<Star size={17} color={ICON} />} label={t('settings.rateUs')} description={rateDescription}>
          {rateStatus === 'busy' ? <ActivityIndicator size="small" color={ICON} /> : null}
        </SettingsItem>
      </SettingsRow>

      {supportUrl ? (
        <SettingsRow
          onPress={openSupport}
          accessibilityLabel={`${t('settings.support')}. ${supportDescription}`}
          accessibilityHint={t('settings.supportHint')}
        >
          <SettingsItem
            icon={<LifeBuoy size={17} color={ICON} />}
            label={t('settings.support')}
            description={supportDescription}
            last
          >
            <ExternalLink size={16} color={colors.textMuted} />
          </SettingsItem>
        </SettingsRow>
      ) : (
        // No support page yet: shown as information, not a button.
        <View accessible accessibilityLabel={`${t('settings.support')}. ${t('settings.supportUnavailable')}`}>
          <SettingsItem
            icon={<LifeBuoy size={17} color={colors.textMuted} />}
            label={t('settings.support')}
            description={t('settings.supportUnavailable')}
            last
          />
        </View>
      )}
      {/* Each gate keys itself by request id, so keep the two apart. */}
      <React.Fragment key="share-gate">{shareGate}</React.Fragment>
      <React.Fragment key="section-gate">{gate}</React.Fragment>
    </SettingsSection>
  );
}
