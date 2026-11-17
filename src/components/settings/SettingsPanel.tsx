// ============================================================
// SettingsPanel — every persistent preference in one place.
// Used by the Settings tab and by the in-reader settings sheet.
// App Appearance (whole app) and Reading Appearance (reader canvas)
// are deliberately separate settings; the in-reader sheet shows only
// the reading one.
// Changes are saved immediately (AsyncStorage) and become the
// defaults for every reading session; an open reader picks them up live.
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Switch, useWindowDimensions } from 'react-native';
import {
  Globe,
  BookOpen,
  Columns,
  Gauge,
  Palette as PaletteIcon,
  SunMoon,
  Volume2,
  VolumeX,
  RefreshCw,
  Clock,
  GraduationCap,
  Languages,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useLocales } from 'expo-localization';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';
import { AppAppearancePicker, ReadingAppearancePicker } from './AppearancePicker';
import { Chip, Segmented } from '../ui/Chip';
import { usePreferencesStore } from '../../store/preferencesStore';
import { Language, ReadingMode, ReaderLayout } from '../../types/story';
import { getDeviceUILanguage, SUPPORTED_UI_LANGUAGES, type UILanguagePreference } from '../../i18n';
import { formatPercent, formatSpeed } from '../../i18n/format';

type ModeChoice = 'bilingual_parallel' | 'vi_first_en_second' | 'single';

const MODE_CHOICES = [
  ['bilingual_parallel', 'readingModes.bilingual', 'settings.modeBilingualDescription'],
  ['vi_first_en_second', 'readingModes.viFirst', 'settings.modeViFirstDescription'],
  ['single', 'readingModes.single', 'settings.modeSingleDescription'],
] as const satisfies readonly (readonly [ModeChoice, string, string])[];

const UI_LANGUAGE_CHOICES: UILanguagePreference[] = ['system', ...SUPPORTED_UI_LANGUAGES];

const SPEEDS = [0.7, 0.9, 1.0, 1.2];
const SLEEP_MINUTES = [0, 15, 30, 60];

/** `showAppSettings`: the Settings tab shows App Appearance and App Language;
 *  the in-reader sheet keeps to reading options. */
export function SettingsPanel({ showAppSettings = true }: { showAppSettings?: boolean }) {
  const { t } = useTranslation();
  const { colors, scheme } = useTheme();
  const styles = useStyles();
  const { prefs, updatePrefs, setUILanguage } = usePreferencesStore();
  const deviceLocales = useLocales();

  const modeChoice: ModeChoice =
    prefs.defaultReadingMode === 'single_en' || prefs.defaultReadingMode === 'single_vi'
      ? 'single'
      : prefs.defaultReadingMode;

  const singleMode = (lang: Language): ReadingMode => (lang === 'vi' ? 'single_vi' : 'single_en');

  const chooseMode = (choice: ModeChoice) => {
    updatePrefs({
      defaultReadingMode: choice === 'single' ? singleMode(prefs.defaultLanguage) : choice,
    });
  };

  const chooseLanguage = (lang: Language) => {
    updatePrefs(
      modeChoice === 'single'
        ? { defaultLanguage: lang, defaultReadingMode: singleMode(lang) }
        : { defaultLanguage: lang }
    );
  };

  // Language names are shown in their own language (endonyms), as is standard.
  const uiLanguageLabel = (choice: UILanguagePreference) =>
    choice === 'system' ? t('settings.appLanguageSystem') : t(`languageNames.${choice}`);

  const switchProps = {
    trackColor: { false: colors.borderStrong, true: colors.primary },
    thumbColor: scheme === 'dark' ? colors.textPrimary : colors.surface,
    ios_backgroundColor: colors.borderStrong,
  };
  const icon = colors.accent;

  const schemeName = t(scheme === 'dark' ? 'settings.appearanceDark' : 'settings.appearanceLight');

  return (
    <View>
      {showAppSettings ? (
        <SettingsSection title={t('settings.sectionAppearance')}>
          <SettingsItem
            icon={<SunMoon size={18} color={icon} />}
            label={t('settings.appAppearance')}
            description={
              prefs.appAppearance === 'system'
                ? t('settings.appAppearanceSystemDescription', { scheme: schemeName })
                : t('settings.appAppearanceDescription')
            }
            last
            below={<AppAppearancePicker />}
          />
        </SettingsSection>
      ) : null}

      {showAppSettings ? (
        <SettingsSection title={t('settings.sectionLanguage')}>
          <SettingsItem
            icon={<Languages size={18} color={icon} />}
            label={t('settings.appLanguage')}
            description={
              prefs.uiLanguage === 'system'
                ? t('settings.appLanguageSystemDescription', {
                    language: t(`languageNames.${getDeviceUILanguage(deviceLocales)}`),
                  })
                : t('settings.appLanguageDescription')
            }
            last
            below={
              <View style={styles.chipRow} accessibilityRole="radiogroup" accessibilityLabel={t('settings.appLanguage')}>
                {UI_LANGUAGE_CHOICES.map((choice) => (
                  <Chip
                    key={choice}
                    label={uiLanguageLabel(choice)}
                    active={prefs.uiLanguage === choice}
                    onPress={() => setUILanguage(choice)}
                  />
                ))}
              </View>
            }
          />
        </SettingsSection>
      ) : null}

      <SettingsSection title={t('settings.sectionReading')}>
        <SettingsItem
          icon={<BookOpen size={18} color={icon} />}
          label={t('settings.readingMode')}
          description={t(MODE_CHOICES.find(([m]) => m === modeChoice)![2])}
          below={
            <View style={styles.chipRow} accessibilityRole="radiogroup" accessibilityLabel={t('settings.readingMode')}>
              {MODE_CHOICES.map(([choice, label]) => (
                <Chip key={choice} label={t(label)} active={modeChoice === choice} onPress={() => chooseMode(choice)} />
              ))}
            </View>
          }
        />

        <SettingsItem
          icon={<Globe size={18} color={icon} />}
          label={t('settings.storyLanguage')}
          description={
            modeChoice === 'single'
              ? t('settings.storyLanguageSingleDescription')
              : t('settings.storyLanguageDescription')
          }
          stackControl
        >
          <Segmented
            accessibilityLabel={t('settings.storyLanguage')}
            options={[
              ['en', t('settings.storyLanguageEn')],
              ['vi', t('settings.storyLanguageVi')],
            ]}
            value={prefs.defaultLanguage}
            onChange={(v) => chooseLanguage(v as Language)}
          />
        </SettingsItem>

        <SettingsItem
          icon={<Columns size={18} color={icon} />}
          label={t('settings.layout')}
          description={
            prefs.defaultLayout === 'horizontal'
              ? t('settings.layoutBookDescription')
              : t('settings.layoutScrollDescription')
          }
          stackControl
        >
          <Segmented
            accessibilityLabel={t('settings.layout')}
            options={[
              ['horizontal', t('settings.layoutBook')],
              ['vertical', t('settings.layoutScroll')],
            ]}
            value={prefs.defaultLayout}
            onChange={(v) => updatePrefs({ defaultLayout: v as ReaderLayout })}
          />
        </SettingsItem>

        <SettingsItem
          icon={<GraduationCap size={18} color={icon} />}
          label={t('settings.learningMode')}
          description={t('settings.learningModeDescription')}
        >
          <Switch
            value={prefs.learningMode}
            onValueChange={(v) => updatePrefs({ learningMode: v })}
            accessibilityLabel={t('settings.learningMode')}
            {...switchProps}
          />
        </SettingsItem>

        <SettingsItem
          icon={<PaletteIcon size={18} color={icon} />}
          label={t('settings.readingAppearance')}
          description={t('settings.readingAppearanceDescription')}
          last
          below={<ReadingAppearancePicker />}
        />
      </SettingsSection>

      <SettingsSection title={t('settings.sectionNarration')}>
        <SettingsItem
          icon={<Gauge size={18} color={icon} />}
          label={t('settings.speed')}
          description={t('settings.speedDescription', { percent: formatPercent(prefs.narrationSpeed) })}
          below={
            <Segmented
              accessibilityLabel={t('settings.speed')}
              options={SPEEDS.map((s) => [String(s), formatSpeed(s)])}
              value={String(SPEEDS.find((s) => Math.abs(s - prefs.narrationSpeed) < 0.05) ?? '')}
              onChange={(v) => updatePrefs({ narrationSpeed: parseFloat(v) })}
            />
          }
        />

        <SettingsItem
          icon={<RefreshCw size={18} color={icon} />}
          label={t('settings.autoTurn')}
          description={t('settings.autoTurnDescription')}
        >
          <Switch
            value={prefs.autoTurnPage}
            onValueChange={(v) => updatePrefs({ autoTurnPage: v })}
            accessibilityLabel={t('settings.autoTurn')}
            {...switchProps}
          />
        </SettingsItem>

        <SettingsItem
          icon={
            prefs.pageSoundEnabled ? (
              <Volume2 size={18} color={icon} />
            ) : (
              <VolumeX size={18} color={colors.textMuted} />
            )
          }
          label={t('settings.pageSound')}
          description={t('settings.pageSoundDescription')}
          last
        >
          <Switch
            value={prefs.pageSoundEnabled}
            onValueChange={(v) => updatePrefs({ pageSoundEnabled: v })}
            accessibilityLabel={t('settings.pageSound')}
            {...switchProps}
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title={t('settings.sectionBedtime')}>
        <SettingsItem
          icon={<Clock size={18} color={icon} />}
          label={t('settings.sleepTimer')}
          description={
            prefs.sleepTimerMinutes === 0
              ? t('settings.sleepOff')
              : t('settings.sleepDescription', { count: prefs.sleepTimerMinutes })
          }
          last
          below={
            <Segmented
              accessibilityLabel={t('settings.sleepTimer')}
              options={SLEEP_MINUTES.map((m) => [
                String(m),
                m === 0 ? t('settings.sleepOff') : t('settings.sleepMinutes', { count: m }),
              ])}
              value={String(prefs.sleepTimerMinutes)}
              onChange={(v) => updatePrefs({ sleepTimerMinutes: parseInt(v, 10) })}
            />
          }
        />
      </SettingsSection>
    </View>
  );
}

// ─── Building blocks ──────────────────────────────────────────

export function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const sectionStyles = useSectionStyles();
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title} accessibilityRole="header">{title}</Text>
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

export function SettingsItem({
  icon,
  label,
  description,
  children,
  below,
  last,
  stackControl,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  children?: React.ReactNode;
  below?: React.ReactNode;
  last?: boolean;
  /** A wide control (segmented) that moves under the text when the row gets tight. */
  stackControl?: boolean;
}) {
  const itemStyles = useItemStyles();
  const { compact, roomy } = useSettingsDensity();
  const stacked = !!children && !!stackControl && compact;
  return (
    <View style={[itemStyles.container, last && itemStyles.last]}>
      <View style={itemStyles.top}>
        <View style={itemStyles.iconWrapper}>{icon}</View>
        <View style={itemStyles.textBlock}>
          <Text style={itemStyles.label}>{label}</Text>
          {description ? <Text style={itemStyles.description}>{description}</Text> : null}
        </View>
        {children && !stacked ? <View style={itemStyles.control}>{children}</View> : null}
      </View>
      {stacked ? <View style={[itemStyles.below, !roomy && itemStyles.belowFull]}>{children}</View> : null}
      {below ? <View style={[itemStyles.below, !roomy && itemStyles.belowFull]}>{below}</View> : null}
    </View>
  );
}

/**
 * compact: inline segmented controls move under their text (narrow
 * screens, Display Zoom, larger text sizes).
 * roomy: controls under a row may keep the icon indent; otherwise they
 * use the full card width so options aren't squeezed.
 */
function useSettingsDensity() {
  const { width, fontScale } = useWindowDimensions();
  const effective = width / Math.max(1, fontScale);
  return { compact: effective < 400, roomy: effective >= 330 };
}

const useSectionStyles = createThemedStyles((t) => ({
  container: { marginTop: Spacing.lg, paddingHorizontal: Spacing.gutter },
  title: { ...t.type.eyebrow, marginBottom: Spacing.sm, paddingHorizontal: 4 },
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: t.colors.border,
    overflow: 'hidden',
    ...t.shadow.paper,
  },
}));

const ICON_SIZE = 34;

const useItemStyles = createThemedStyles((t) => ({
  container: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.colors.border },
  last: { borderBottomWidth: 0 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 6,
    gap: Spacing.sm + 4,
    minHeight: 60,
  },
  iconWrapper: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    backgroundColor: t.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { flex: 1 },
  label: { fontSize: Typography.base, fontWeight: '600', color: t.colors.textPrimary },
  description: { fontSize: Typography.xs, color: t.colors.textMuted, marginTop: 3, lineHeight: Typography.xs * 1.45 },
  control: { alignItems: 'flex-end' },
  below: {
    paddingRight: Spacing.md,
    paddingBottom: Spacing.md,
    paddingLeft: Spacing.md + ICON_SIZE + Spacing.sm + 4,
  },
  belowFull: { paddingLeft: Spacing.md },
}));

const useStyles = createThemedStyles(() => ({
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
}));
