import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Clock,
  Users,
  Languages,
  BookOpen,
  Play,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Lock,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import {
  Palette,
  Typography,
  Spacing,
  BorderRadius,
  PremiumColors,
  Layout,
} from '../../src/constants/theme';
import { createThemedStyles, useTheme } from '../../src/theme';
import { StoryIllustration } from '../../src/components/illustrations/StoryIllustration';
import { Button, EmptyState, IconButton, MetaPill, ProgressBar } from '../../src/components/ui';
import { ALL_STORIES, getStoryPalette } from '../../src/data/stories';
import { ReadingMode } from '../../src/types/story';
import { usePlaybackStore } from '../../src/store/playbackStore';
import { usePreferencesStore } from '../../src/store/preferencesStore';
import { describeProgress } from '../../src/hooks/useStoryProgress';
import { useProgressStore } from '../../src/store/progressStore';
import { paywallHref, useStoryAccess } from '../../src/hooks/usePremiumGate';
import { PremiumBadge } from '../../src/components/payment';
import { FREE_STORY_IDS } from '../../src/constants/entitlements';
import { storyAge, storyCategory, storyDuration, storyPages } from '../../src/i18n/storyMeta';
import { formatSpeed } from '../../src/i18n/format';
import { useShare } from '../../src/hooks/useShare';
import { ShareIcon } from '../../src/components/ui/ShareIcon';
import { useResponsiveLayout } from '../../src/hooks/useResponsiveLayout';
import { balancedColumns, gridColumns, gridItemWidth } from '../../src/utils/responsiveLayout';

const MODE_LABEL_KEY = {
  bilingual_parallel: 'readingModes.bilingual',
  vi_first_en_second: 'readingModes.viFirst',
  single_en: 'readingModes.englishOnly',
  single_vi: 'readingModes.vietnameseOnly',
} as const satisfies Record<ReadingMode, string>;

/** Height of the floating back / share bar below the safe area. */
const HEADER_H = 56;
/** From this content width the cover sits beside the story information. */
const SIDE_BY_SIDE_MIN = 680;
const THUMB_GAP = Spacing.sm + 4;
/** Page art is 3:2, so preview thumbnails are never cropped. */
const THUMB_RATIO = 1.5;

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const layout = useResponsiveLayout();
  const { width: SW, height: SH } = layout;
  const setStory = usePlaybackStore((s) => s.setStory);
  const prefs = usePreferencesStore((s) => s.prefs);
  const savedProgress = useProgressStore((s) => (id ? s.progressMap[id] ?? null : null));
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const theme = useTheme();
  const { colors, type, isDark } = theme;
  const [isScrolled, setIsScrolled] = useState(false);

  // ── Layout ─────────────────────────────────────────────────
  //   phone  : full-bleed cover, one column, page strip (unchanged)
  //   medium : shorter cover, one reading-width column, page grid
  //   wide   : a short art band with the square cover lifted beside the
  //            title and "Begin", then a page grid and a two-column "about"
  const browse = layout.frame(Layout.maxWidth.browse);
  const sideBySide = !layout.isCompact && browse.contentWidth >= SIDE_BY_SIDE_MIN;
  const column = sideBySide ? browse : layout.frame(Layout.maxWidth.form);
  const coverHeight =
    Math.round(
      sideBySide
        ? Math.min(Math.max(SH * 0.24, 200), 300)
        : layout.isCompact
          ? // Keep the cover inside a sensible share of the screen on any phone size.
            Math.min(SW * 0.82, SH * 0.46, 460)
          : Math.min(SW * 0.62, SH * 0.4, 440)
    ) + insets.top;
  // Wide: the cover card starts just under the header bar and overlaps the band;
  // the text column starts below the band so it never sits on the art.
  const coverTop = insets.top + HEADER_H + Spacing.sm;
  const coverSize = Math.round(
    Math.min(Math.max(column.contentWidth * 0.4, 260), 440, Math.max(SH * 0.46, 260))
  );
  const infoOffset = coverHeight - coverTop + Spacing.md;

  const story = ALL_STORIES.find((s) => s.id === id);
  const access = useStoryAccess(story?.id);
  const { shareStory, sharing, gate } = useShare();

  if (!story) {
    return (
      <View style={[styles.screen, styles.missing, { paddingTop: insets.top }]}>
        <EmptyState
          title={t('storyDetail.notFoundTitle')}
          message={t('storyDetail.notFoundMessage')}
          action={
            <Button
              label={t('storyDetail.backToLibrary')}
              variant="secondary"
              // A shared link can open this screen cold, with nothing to go back to.
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/library'))}
            />
          }
        />
      </View>
    );
  }

  const info = describeProgress(story, savedProgress);
  const hasProgress = info.state === 'reading' && !!savedProgress;
  const palette = getStoryPalette(story);

  const handleStartReading = (pageOverride?: number) => {
    // Premium gate: browsing is free, reading a premium story needs a subscription.
    if (access.locked) {
      router.push(paywallHref('premium_story', story.id));
      return;
    }
    const pageToStart =
      typeof pageOverride === 'number' ? pageOverride : hasProgress ? savedProgress!.pageIndex : 0;
    // Reading preferences come from Settings; the reader applies them on open.
    setStory(story, pageToStart);
    router.push(`/reader/${story.id}?page=${pageToStart}`);
  };

  // A list of independent settings, so a separator join (not a sentence).
  const prefSummary = [
    t(MODE_LABEL_KEY[prefs.defaultReadingMode]),
    prefs.defaultLayout === 'horizontal' ? t('storyDetail.bookLayout') : t('storyDetail.scrollLayout'),
    formatSpeed(prefs.narrationSpeed),
    prefs.readingAppearance === 'moonlight' ? t('storyDetail.bedtime') : null,
    prefs.learningMode ? t('storyDetail.learning') : null,
  ]
    .filter(Boolean)
    .join(t('common.listSeparator'));

  const fadeH = 90;
  // Phone: a horizontal strip of small thumbs. Wider: every page in a grid.
  const thumbCols = layout.isCompact
    ? 0
    : balancedColumns(story.pages.length, gridColumns(column.contentWidth, 150, THUMB_GAP, { min: 3, max: 5 }), 3);
  const thumbW = layout.isCompact ? 132 : gridItemWidth(column.contentWidth, thumbCols, THUMB_GAP);
  const thumbH = Math.round(thumbW / THUMB_RATIO);
  const columnStyle = { width: column.contentWidth, alignSelf: 'center' as const };

  const titleBlock = (
    <>
      {/* Title */}
      <View style={styles.categoryRow}>
        <View style={[styles.dot, { backgroundColor: palette.accent }]} />
        <Text style={[type.eyebrow, { color: colors.textAccent }]}>{storyCategory(t, story.category)}</Text>
        {access.premium ? <PremiumBadge locked={access.locked} tone="light" /> : null}
      </View>
      <Text style={[type.display, styles.titleEn, sideBySide && styles.titleEnWide]} accessibilityRole="header">
        {story.title.en}
      </Text>
      <Text style={styles.titleVi}>{story.title.vi}</Text>

      <View style={styles.metaRow}>
        <MetaPill icon={<Clock size={12} color={colors.textMuted} />} label={storyDuration(t, story.duration)} />
        <MetaPill icon={<Users size={12} color={colors.textMuted} />} label={storyAge(t, story.ageRange)} />
        <MetaPill icon={<Languages size={12} color={colors.textMuted} />} label={t('storyDetail.languagesPill')} />
        <MetaPill icon={<BookOpen size={12} color={colors.textMuted} />} label={storyPages(t, story)} />
      </View>

      {/* Reading progress */}
      {info.state !== 'new' ? (
        <View style={styles.progress}>
          <ProgressBar value={info.fraction} />
          <Text style={styles.progressLabel}>
            {info.state === 'finished'
              ? t('storyDetail.finishedNote')
              : t('storyDetail.onPage', { page: info.page, total: info.total })}
          </Text>
        </View>
      ) : null}

      {/* Start / Resume — or unlock, for a premium story */}
      {access.locked ? (
        <>
          <Button
            // In Dark the indigo sits close to the night page, so a faint moon-gold edge keeps its shape.
            style={[styles.cta, isDark && styles.ctaPremiumEdge]}
            label={t('storyDetail.unlock')}
            // Unlocking is a premium moment: the paywall's moonlit indigo.
            color={PremiumColors.background}
            textColor={PremiumColors.moon}
            icon={<Lock size={17} color={PremiumColors.moon} strokeWidth={2.4} />}
            onPress={() => handleStartReading()}
            accessibilityHint={t('storyDetail.unlockHint')}
          />
          <Text style={styles.lockNote}>
            {t('storyDetail.lockNote', { count: FREE_STORY_IDS.length })}
          </Text>
        </>
      ) : (
        <Button
          style={styles.cta}
          label={
            hasProgress
              ? t('storyDetail.continue')
              : info.state === 'finished'
                ? t('storyDetail.readAgain')
                : t('storyDetail.begin')
          }
          icon={<Play size={18} color={colors.onPrimary} fill={colors.onPrimary} />}
          onPress={() => handleStartReading(info.state === 'finished' ? 0 : undefined)}
        />
      )}
      {hasProgress && !access.locked ? (
        <Button
          variant="ghost"
          label={t('storyDetail.restart')}
          icon={<RotateCcw size={15} color={colors.accent} />}
          onPress={() => handleStartReading(0)}
        />
      ) : null}
    </>
  );

  const thumb = (page: (typeof story.pages)[number], i: number) => {
    const current = hasProgress && savedProgress!.pageIndex === i;
    return (
      <Pressable
        key={page.id}
        onPress={() => handleStartReading(i)}
        accessibilityRole="button"
        accessibilityLabel={
          access.locked
            ? t('storyDetail.thumbLockedA11y', { page: i + 1 })
            : t('storyDetail.thumbA11y', { page: i + 1 })
        }
        style={({ pressed }) => [{ width: thumbW }, pressed && { opacity: 0.85 }]}
      >
        <View
          style={[
            styles.thumb,
            { width: thumbW, height: thumbH, backgroundColor: palette.sky },
            current && styles.thumbCurrent,
          ]}
        >
          <StoryIllustration pageKey={page.image} width={thumbW} height={thumbH} />
        </View>
        <Text style={[styles.thumbLabel, current && styles.thumbLabelCurrent]} numberOfLines={1}>
          {current ? t('storyDetail.thumbHere', { page: i + 1 }) : t('storyDetail.thumbPage', { page: i + 1 })}
        </Text>
      </Pressable>
    );
  };

  const aboutBlock = (
    <>
      <Text style={[type.eyebrow, styles.blockLabel]}>{t('storyDetail.about')}</Text>
      <Text style={styles.desc}>{story.description.en}</Text>
      <Text style={styles.descVi}>{story.description.vi}</Text>
    </>
  );

  const lessonBlock = story.theme ? (
    <View style={[styles.lesson, sideBySide && styles.flushTop]}>
      <View style={[styles.lessonRule, { backgroundColor: palette.accent }]} />
      <View style={{ flex: 1 }}>
        <Text style={[type.eyebrow, { marginBottom: 6 }]}>{t('storyDetail.heart')}</Text>
        <Text style={styles.lessonEn}>{story.theme.en}</Text>
        <Text style={styles.lessonVi}>{story.theme.vi}</Text>
      </View>
    </View>
  ) : null;

  const prefsBlock = (
    <Pressable
      style={({ pressed }) => [styles.prefsRow, sideBySide && styles.flushTop, pressed && { opacity: 0.85 }]}
      onPress={() => router.push('/reader-settings')}
      accessibilityRole="button"
      accessibilityLabel={t('storyDetail.readingSettingsA11y', { summary: prefSummary })}
    >
      <View style={styles.prefsIcon}>
        <SlidersHorizontal size={16} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.prefsLabel}>{t('storyDetail.readingSettings')}</Text>
        <Text style={styles.prefsSummary} numberOfLines={sideBySide ? 2 : 1}>
          {prefSummary}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.textMuted} />
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <StatusBar style={isScrolled ? theme.statusBar : 'light'} />

      {/* Status-bar scrim so system icons stay legible over any cover. */}
      {!isScrolled && (
        <View style={[styles.scrimContainer, { height: insets.top + 64 }]} pointerEvents="none">
          <Svg width={SW} height={insets.top + 64}>
            <Defs>
              <SvgLinearGradient id="statusScrim" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={palette.ink} stopOpacity="0.6" />
                <Stop offset="100%" stopColor={palette.ink} stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Rect width={SW} height={insets.top + 64} fill="url(#statusScrim)" />
          </Svg>
        </View>
      )}

      {/* Floating header */}
      <View
        style={[
          styles.fixedHeader,
          {
            paddingTop: insets.top + Spacing.xs,
            backgroundColor: isScrolled ? colors.surfaceTranslucent : 'transparent',
            borderBottomWidth: isScrolled ? StyleSheet.hairlineWidth : 0,
          },
        ]}
        pointerEvents="box-none"
      >
        <IconButton
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          accessibilityLabel={t('common.back')}
          variant={isScrolled ? 'outline' : 'overlay'}
        >
          <ArrowLeft size={20} color={isScrolled ? colors.textPrimary : Palette.onOverlay} strokeWidth={2.2} />
        </IconButton>
        {isScrolled ? (
          <Text style={styles.headerTitle} numberOfLines={1}>
            {story.title.en}
          </Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <IconButton
          onPress={() => shareStory(story)}
          accessibilityLabel={t('share.shareStory')}
          accessibilityHint={t('share.shareStoryHint')}
          variant={isScrolled ? 'outline' : 'overlay'}
          disabled={sharing}
        >
          <ShareIcon size={19} color={isScrolled ? colors.textPrimary : Palette.onOverlay} />
        </IconButton>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          const next = y > coverHeight - insets.top - HEADER_H;
          if (next !== isScrolled) setIsScrolled(next);
        }}
        scrollEventThrottle={16}
      >
        {/* Cover, fading into the paper below */}
        <View style={[styles.coverContainer, { height: coverHeight, backgroundColor: palette.sky }]}>
          <StoryIllustration pageKey={story.coverImage} width={SW} height={coverHeight} />
          <View style={[styles.coverFade, { height: fadeH + 1 }]} pointerEvents="none">
            <Svg width={SW} height={fadeH + 1}>
              <Defs>
                <SvgLinearGradient id="coverFade" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={colors.background} stopOpacity="0" />
                  <Stop offset="100%" stopColor={colors.background} stopOpacity="1" />
                </SvgLinearGradient>
              </Defs>
              <Rect width={SW} height={fadeH + 1} fill="url(#coverFade)" />
            </Svg>
          </View>
        </View>

        {sideBySide ? (
          // Cover lifted over the band, beside the title and the primary action.
          <View style={[columnStyle, styles.heroRow, { marginTop: coverTop - coverHeight }]}>
            <View style={[styles.coverCard, { width: coverSize, height: coverSize }]}>
              <View style={[styles.coverCardInner, { backgroundColor: palette.sky }]}>
                <StoryIllustration pageKey={story.coverImage} width={coverSize} height={coverSize} />
              </View>
            </View>
            <View style={[styles.heroInfo, { paddingTop: infoOffset }]}>{titleBlock}</View>
          </View>
        ) : (
          <View style={columnStyle}>{titleBlock}</View>
        )}

        {/* Pages: a strip on phones, every page at once on wider screens */}
        <Text style={[type.eyebrow, styles.stripLabel, columnStyle]}>{t('storyDetail.insideTheBook')}</Text>
        {layout.isCompact ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.strip, { paddingHorizontal: column.inset }]}
          >
            {story.pages.map(thumb)}
          </ScrollView>
        ) : (
          <View style={[columnStyle, styles.thumbGrid]}>{story.pages.map(thumb)}</View>
        )}

        {sideBySide ? (
          <View style={[columnStyle, styles.aboutRow]}>
            <View style={styles.aboutMain}>{aboutBlock}</View>
            <View style={styles.aside}>
              {lessonBlock}
              {prefsBlock}
            </View>
          </View>
        ) : (
          <View style={columnStyle}>
            {aboutBlock}
            {lessonBlock}
            {prefsBlock}
          </View>
        )}
      </ScrollView>
      {gate}
    </View>
  );
}

const useStyles = createThemedStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  missing: { justifyContent: 'center' },
  container: { flex: 1, backgroundColor: t.colors.background },
  scrimContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomColor: t.colors.border,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Typography.serif,
    fontSize: Typography.md,
    fontWeight: '700',
    color: t.colors.textPrimary,
  },
  coverContainer: { width: '100%', overflow: 'hidden' },
  coverFade: { position: 'absolute', left: 0, right: 0, bottom: -1 },
  heroRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xl },
  coverCard: { borderRadius: BorderRadius.xxl, backgroundColor: t.colors.surface, ...t.shadow.cover },
  coverCardInner: { flex: 1, borderRadius: BorderRadius.xxl, overflow: 'hidden' },
  heroInfo: { flex: 1, minWidth: 0 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  titleEn: { marginTop: Spacing.sm, fontSize: 32, lineHeight: 37 },
  titleEnWide: { fontSize: Typography.display, lineHeight: Typography.display * 1.12 },
  titleVi: {
    fontSize: Typography.lg,
    lineHeight: Typography.lg * 1.35,
    color: t.colors.textSecondary,
    fontWeight: '500',
    marginTop: 6,
  },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing.md },
  progress: { marginTop: Spacing.lg, gap: 8 },
  progressLabel: { fontSize: Typography.sm, color: t.colors.textSecondary, fontWeight: '500' },
  cta: { marginTop: Spacing.lg },
  ctaPremiumEdge: { borderWidth: 1, borderColor: PremiumColors.borderGold },
  lockNote: {
    fontSize: Typography.sm,
    lineHeight: 19,
    color: t.colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm + 2,
  },
  stripLabel: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm + 4,
  },
  strip: { gap: THUMB_GAP },
  thumbGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: THUMB_GAP, rowGap: Spacing.md },
  thumb: { borderRadius: BorderRadius.lg, overflow: 'hidden', ...t.shadow.paper },
  thumbCurrent: { borderWidth: 2, borderColor: t.colors.gold },
  thumbLabel: { fontSize: Typography.xs, color: t.colors.textMuted, marginTop: 6, fontWeight: '600' },
  thumbLabelCurrent: { color: t.colors.textAccent },
  blockLabel: { marginTop: Spacing.xl, marginBottom: Spacing.sm + 2 },
  aboutRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xl },
  aboutMain: { flex: 3, minWidth: 0 },
  // Starts level with the "About" label.
  aside: { flex: 2, minWidth: 0, marginTop: Spacing.xl, gap: Spacing.md },
  flushTop: { marginTop: 0 },
  desc: {
    fontFamily: Typography.serif,
    fontSize: Typography.md,
    lineHeight: Typography.md * 1.6,
    color: t.colors.textPrimary,
  },
  descVi: {
    fontSize: Typography.base,
    lineHeight: Typography.base * 1.6,
    color: t.colors.textSecondary,
    marginTop: Spacing.sm + 2,
  },
  lesson: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: t.colors.surfaceSunken,
    borderRadius: BorderRadius.xl,
  },
  lessonRule: { width: 3, borderRadius: 2 },
  lessonEn: {
    fontFamily: Typography.serif,
    fontSize: Typography.md,
    lineHeight: Typography.md * 1.45,
    color: t.colors.textPrimary,
    fontStyle: 'italic',
  },
  lessonVi: { fontSize: Typography.sm, lineHeight: Typography.sm * 1.5, color: t.colors.textSecondary, marginTop: 4 },
  prefsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    backgroundColor: t.colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  prefsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: t.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefsLabel: { fontSize: Typography.base, fontWeight: '700', color: t.colors.textPrimary },
  prefsSummary: { fontSize: Typography.xs, color: t.colors.textMuted, marginTop: 2 },
}));
