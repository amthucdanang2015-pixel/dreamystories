// ============================================================
// StoryCard — collectible book covers for the library.
//   default  : portrait "book on a shelf" (cover, spine, title, meta, progress)
//   featured : editorial hero for tonight's story
//   compact  : list row with thumbnail and reading state
// ============================================================

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Check, Clock, Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Story } from '../../types/story';
import { BorderRadius, Palette, Spacing, Typography } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';
import { StoryIllustration } from '../illustrations/StoryIllustration';
import { getStoryPalette } from '../../data/stories';
import { StoryProgressInfo, useStoryProgress } from '../../hooks/useStoryProgress';
import { ProgressBar } from '../ui/ProgressBar';
import { MetaPill } from '../ui/MetaPill';
import { FreeBadge, PremiumBadge } from '../payment/PremiumBadge';
import { OnlineBadge } from './OnlineBadge';
import { useStoryAccess } from '../../hooks/usePremiumGate';
import { storyAge, storyCategory, storyDuration, storyPages } from '../../i18n/storyMeta';

interface StoryCardProps {
  story: Story;
  onPress: (story: Story) => void;
  variant?: 'default' | 'featured' | 'compact';
  /** Cover width for the default (shelf) variant; card width for the featured one. */
  width?: number;
  /** Eyebrow shown on the featured card. */
  eyebrow?: string;
}

const COVER_RATIO = 1.34;
/** From this card width the featured card lays its art beside the text (tablets). */
const FEATURED_SIDE_BY_SIDE_MIN = 640;

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onPress,
  variant = 'default',
  width,
  eyebrow,
}) => {
  const info = useStoryProgress(story);
  const { locked, premium } = useStoryAccess(story.id);
  const free = !premium;
  if (variant === 'compact') return <CompactCard story={story} onPress={onPress} info={info} locked={locked} free={free} />;
  if (variant === 'featured')
    return (
      <FeaturedCard story={story} onPress={onPress} info={info} eyebrow={eyebrow} locked={locked} free={free} width={width} />
    );
  return <ShelfCard story={story} onPress={onPress} info={info} width={width} locked={locked} free={free} />;
};

/** Screen-reader summary: a list of facts, read with a pause between each. */
function a11yLabel(t: TFunction, story: Story, info: StoryProgressInfo, locked: boolean, free: boolean) {
  return [
    story.title.en,
    story.title.vi,
    story.online ? t('online.badgeA11y') : null,
    locked ? t('story.premiumLocked') : free && !story.online ? t('story.free') : null,
    storyCategory(t, story.category),
    storyAge(t, story.ageRange),
    storyDuration(t, story.duration),
    info.label,
  ]
    .filter(Boolean)
    .join(', ');
}

/** "3–8 yrs · 5 min", or with a "Finished" prefix. */
function shortMeta(t: TFunction, story: Story, finished = false) {
  const vars = { age: storyAge(t, story.ageRange, true), duration: storyDuration(t, story.duration) };
  return finished ? t('story.metaFinished', vars) : t('story.metaShort', vars);
}

// ─── Book cover with spine ────────────────────────────────────

export function BookCover({
  story,
  width,
  height,
  info,
  radius = BorderRadius.lg,
  showDuration = true,
}: {
  story: Story;
  width: number;
  height: number;
  info?: StoryProgressInfo;
  radius?: number;
  showDuration?: boolean;
}) {
  const { t } = useTranslation();
  const coverStyles = useCoverStyles();
  const palette = getStoryPalette(story);
  const { locked, premium } = useStoryAccess(story.id);
  return (
    <View style={[coverStyles.frame, { width, height, borderRadius: radius, backgroundColor: palette.sky }]}>
      <StoryIllustration pageKey={story.coverImage} width={width} height={height} />
      {/* Spine: a darker strip and a hairline highlight make it read as a bound book. */}
      <View style={[coverStyles.spine, { backgroundColor: palette.ink }]} />
      <View style={coverStyles.spineLight} />
      {showDuration ? (
        <View style={coverStyles.duration}>
          <MetaPill
            tone="dark"
            icon={<Clock size={10} color={Palette.onOverlay} strokeWidth={2.2} />}
            label={storyDuration(t, story.duration)}
          />
        </View>
      ) : null}
      {locked ? (
        width >= 100 ? (
          <View style={coverStyles.premium}>
            <PremiumBadge locked />
          </View>
        ) : (
          <View style={coverStyles.lockDot} accessible accessibilityLabel={t('story.premiumLocked')}>
            <Lock size={10} color={Palette.moonGlow} strokeWidth={2.6} />
          </View>
        )
      ) : story.online && width >= 100 ? (
        // Online stories: "needs internet" matters more than "free".
        <View style={coverStyles.premium}>
          <OnlineBadge />
        </View>
      ) : !premium && width >= 100 ? (
        <View style={coverStyles.premium}>
          <FreeBadge />
        </View>
      ) : null}
      {info?.state === 'finished' ? (
        <View style={coverStyles.finished} accessibilityLabel={t('story.finished')}>
          <Check size={12} color={Palette.charcoal} strokeWidth={3} />
        </View>
      ) : null}
      {info?.state === 'reading' ? (
        <View style={coverStyles.progress}>
          <ProgressBar value={info.fraction} color={Palette.moonGlow} track="rgba(16,19,28,0.45)" height={3} />
        </View>
      ) : null}
    </View>
  );
}

// ─── Shelf (default) ──────────────────────────────────────────

function ShelfCard({
  story,
  onPress,
  info,
  width,
  locked,
  free,
}: {
  story: Story;
  onPress: (s: Story) => void;
  info: StoryProgressInfo;
  width?: number;
  locked: boolean;
  free: boolean;
}) {
  const { t } = useTranslation();
  const shelfStyles = useShelfStyles();
  const { type } = useTheme();
  const { width: SW } = useWindowDimensions();
  const w = width ?? Math.min(Math.round(SW * 0.42), 200);
  const palette = getStoryPalette(story);
  return (
    <Pressable
      style={({ pressed }) => [{ width: w }, pressed && styles.pressed]}
      onPress={() => onPress(story)}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel(t, story, info, locked, free)}
    >
      <BookCover story={story} width={w} height={Math.round(w * COVER_RATIO)} info={info} />
      <View style={shelfStyles.info}>
        <View style={shelfStyles.categoryRow}>
          <View style={[styles.dot, { backgroundColor: palette.accent }]} />
          <Text style={[type.eyebrow, shelfStyles.category]} numberOfLines={1}>
            {storyCategory(t, story.category)}
          </Text>
        </View>
        <Text style={[type.cardTitle, shelfStyles.title]} numberOfLines={3}>
          {story.title.en}
        </Text>
        <Text style={[type.viTitle, shelfStyles.vi]} numberOfLines={1}>
          {story.title.vi}
        </Text>
        <Text style={shelfStyles.meta} numberOfLines={1}>
          {info.state === 'reading' ? info.label : shortMeta(t, story)}
        </Text>
      </View>
    </Pressable>
  );
}

// ─── Featured ─────────────────────────────────────────────────

function FeaturedCard({
  story,
  onPress,
  info,
  eyebrow,
  locked,
  free,
  width,
}: {
  story: Story;
  onPress: (s: Story) => void;
  info: StoryProgressInfo;
  eyebrow?: string;
  locked: boolean;
  free: boolean;
  width?: number;
}) {
  const { t } = useTranslation();
  const featuredStyles = useFeaturedStyles();
  const shelfStyles = useShelfStyles();
  const coverStyles = useCoverStyles();
  const { colors, type } = useTheme();
  const { width: SW, height: SH } = useWindowDimensions();
  // Sized by the column it sits in (falls back to the phone column).
  const cardW = width ?? Math.min(SW - Spacing.gutter * 2, 640);
  // Tablets: art beside the text, so the card stays a calm height and the
  // square cover is only gently cropped (a 2:1 banner would slice it).
  const sideBySide = cardW >= FEATURED_SIDE_BY_SIDE_MIN;
  const artW = sideBySide ? Math.round(cardW * 0.5) : cardW;
  const minArtH = sideBySide
    ? // Landscape tablets: leave room for the bookshelf above the fold.
      Math.round(Math.min(Math.max(cardW * 0.36, 260), 380, Math.max(SH * 0.34, 260)))
    : Math.round(Math.min(cardW * 0.56, 300));
  // With large text the body can outgrow the art: the art then grows with it.
  const [bodyH, setBodyH] = useState(0);
  const artH = sideBySide ? Math.max(minArtH, bodyH) : minArtH;
  const palette = getStoryPalette(story);
  return (
    <Pressable
      style={({ pressed }) => [
        featuredStyles.card,
        { width: cardW },
        sideBySide && featuredStyles.cardRow,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(story)}
      accessibilityRole="button"
      accessibilityLabel={
        eyebrow
          ? t('story.a11yWithEyebrow', { eyebrow, label: a11yLabel(t, story, info, locked, free) })
          : a11yLabel(t, story, info, locked, free)
      }
    >
      <View style={{ width: artW, height: artH, backgroundColor: palette.sky }}>
        <StoryIllustration pageKey={story.coverImage} width={artW} height={artH} />
        {locked ? (
          <View style={coverStyles.premium}>
            <PremiumBadge locked />
          </View>
        ) : free ? (
          <View style={coverStyles.premium}>
            <FreeBadge />
          </View>
        ) : null}
      </View>
      <View
        style={[featuredStyles.body, sideBySide && featuredStyles.bodySide]}
        onLayout={sideBySide ? (e) => setBodyH(Math.ceil(e.nativeEvent.layout.height)) : undefined}
      >
        <View style={shelfStyles.categoryRow}>
          <View style={[styles.dot, { backgroundColor: palette.accent }]} />
          <Text style={[type.eyebrow, { color: colors.textAccent }]} numberOfLines={1}>
            {eyebrow
              ? t('story.eyebrowWithCategory', { eyebrow, category: storyCategory(t, story.category) })
              : storyCategory(t, story.category)}
          </Text>
        </View>
        <Text style={[type.title, featuredStyles.title, sideBySide && featuredStyles.titleSide]} numberOfLines={sideBySide ? 3 : 2}>
          {story.title.en}
        </Text>
        <Text style={[type.viTitle, featuredStyles.vi, sideBySide && featuredStyles.viSide]} numberOfLines={sideBySide ? 2 : 1}>
          {story.title.vi}
        </Text>
        <Text style={featuredStyles.desc} numberOfLines={sideBySide ? 4 : 2}>
          {story.description.en}
        </Text>
        <View style={featuredStyles.metaRow}>
          <MetaPill label={storyAge(t, story.ageRange)} />
          <MetaPill label={storyDuration(t, story.duration)} />
          <MetaPill label={storyPages(t, story)} />
        </View>
        {info.state === 'reading' ? (
          <View style={featuredStyles.progress}>
            <ProgressBar value={info.fraction} />
            <Text style={featuredStyles.progressLabel}>{info.label}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

// ─── Compact row ──────────────────────────────────────────────

function CompactCard({
  story,
  onPress,
  info,
  locked,
  free,
}: {
  story: Story;
  onPress: (s: Story) => void;
  info: StoryProgressInfo;
  locked: boolean;
  free: boolean;
}) {
  const { t } = useTranslation();
  const compactStyles = useCompactStyles();
  const shelfStyles = useShelfStyles();
  const { type } = useTheme();
  const palette = getStoryPalette(story);
  return (
    <Pressable
      style={({ pressed }) => [compactStyles.card, pressed && styles.pressed]}
      onPress={() => onPress(story)}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel(t, story, info, locked, free)}
    >
      <BookCover story={story} width={64} height={86} info={info} radius={BorderRadius.md} showDuration={false} />
      <View style={compactStyles.info}>
        <View style={shelfStyles.categoryRow}>
          <View style={[styles.dot, { backgroundColor: palette.accent }]} />
          <Text style={type.eyebrow} numberOfLines={1}>
            {storyCategory(t, story.category)}
          </Text>
        </View>
        <Text style={[type.cardTitle, compactStyles.title]} numberOfLines={2}>
          {story.title.en}
        </Text>
        <Text style={type.viTitle} numberOfLines={1}>
          {story.title.vi}
        </Text>
        {info.state === 'reading' ? (
          <View style={compactStyles.progressRow}>
            <View style={{ flex: 1 }}>
              <ProgressBar value={info.fraction} height={3} />
            </View>
            <Text style={compactStyles.meta}>{info.label}</Text>
          </View>
        ) : (
          <Text style={compactStyles.meta}>{shortMeta(t, story, info.state === 'finished')}</Text>
        )}
      </View>
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  pressed: { opacity: 0.9, transform: [{ scale: 0.985 }] },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
});

const useCoverStyles = createThemedStyles((t) => ({
  // Everything laid on the cover is art-side: it stays the same in both schemes.
  frame: { overflow: 'hidden', ...t.shadow.cover },
  spine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 7, opacity: 0.32 },
  spineLight: {
    position: 'absolute',
    left: 7,
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth * 2,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  duration: { position: 'absolute', right: 8, bottom: 10 },
  finished: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.moonGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: { position: 'absolute', left: 12, right: 8, bottom: 6 },
  premium: { position: 'absolute', top: 8, left: 12 },
  lockDot: {
    position: 'absolute',
    top: 5,
    left: 11,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Palette.overlayStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const useShelfStyles = createThemedStyles((t) => ({
  info: { paddingTop: Spacing.sm + 4, paddingHorizontal: 2 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  category: { flexShrink: 1 },
  title: { marginBottom: 3, fontSize: Typography.base + 1, lineHeight: (Typography.base + 1) * 1.25 },
  vi: { marginBottom: 4 },
  meta: { fontSize: Typography.xs, color: t.colors.textMuted, fontWeight: '500' },
}));

const useFeaturedStyles = createThemedStyles((t) => ({
  card: {
    alignSelf: 'center',
    backgroundColor: t.colors.surface,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    ...t.shadow.card,
  },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  body: { padding: Spacing.gutter, paddingTop: Spacing.md },
  bodySide: { flex: 1, alignSelf: 'center', padding: Spacing.xl },
  title: { fontSize: Typography.xl, lineHeight: Typography.xl * 1.18, marginTop: 2 },
  titleSide: { fontSize: Typography.xxl, lineHeight: Typography.xxl * 1.15, marginTop: 4 },
  vi: { fontSize: Typography.base, marginTop: 4 },
  viSide: { fontSize: Typography.md, lineHeight: Typography.md * 1.4 },
  desc: { ...t.type.body, marginTop: Spacing.sm + 2 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing.md },
  progress: { marginTop: Spacing.md, gap: 6 },
  progressLabel: { fontSize: Typography.xs, color: t.colors.textMuted, fontWeight: '600' },
}));

const useCompactStyles = createThemedStyles((t) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm + 2,
    backgroundColor: t.colors.surface,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm + 2,
    ...t.shadow.paper,
  },
  info: { flex: 1, gap: 1 },
  title: { marginBottom: 1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 6 },
  meta: { fontSize: Typography.xs, color: t.colors.textMuted, fontWeight: '500', marginTop: 5 },
}));
