import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Typography, Spacing, BorderRadius, Layout } from '../../src/constants/theme';
import { createThemedStyles, useTheme } from '../../src/theme';
import { BookCover, StoryCard } from '../../src/components/story/StoryCard';
import {
  CollapsingHeaderScreen,
  MoonMark,
  ProgressBar,
  ScreenHeader,
  SectionHeader,
} from '../../src/components/ui';
import { ALL_STORIES } from '../../src/data/stories';
import { Story } from '../../src/types/story';
import { usePlaybackStore } from '../../src/store/playbackStore';
import { useProgressStore } from '../../src/store/progressStore';
import { describeProgress } from '../../src/hooks/useStoryProgress';
import { usePremiumGate } from '../../src/hooks/usePremiumGate';
import { useResponsiveLayout } from '../../src/hooks/useResponsiveLayout';
import { gridColumns, gridItemWidth, shelfItemWidth } from '../../src/utils/responsiveLayout';

const MAX_CONTENT = Layout.maxWidth.browse;
const SHELF_GAP = Spacing.md;
/** Story rows (legends, fables) flow into columns once each can be this wide. */
const MIN_ROW_W = 320;

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const styles = useStyles();
  const { colors, type } = useTheme();
  const layout = useResponsiveLayout();
  // Sections sit in a centred column; the shelf scrolls edge to edge but starts at the column.
  const { contentWidth, inset } = layout.frame(MAX_CONTENT);
  const pad = { paddingHorizontal: inset };
  const setStory = usePlaybackStore((s) => s.setStory);
  // Subscribe to the progress map so the Continue card updates after reading.
  const progressMap = useProgressStore((s) => s.progressMap);
  const getActiveProgress = useProgressStore((s) => s.getActiveProgress);

  const openStory = (story: Story) => router.push(`/story/${story.id}`);
  const premiumGate = usePremiumGate();

  const activeProgress = useMemo(() => getActiveProgress(), [progressMap, getActiveProgress]);
  const activeStory = activeProgress
    ? ALL_STORIES.find((s) => s.id === activeProgress.storyId) ?? null
    : null;
  const continueInfo = activeStory && activeProgress ? describeProgress(activeStory, activeProgress) : null;

  // A different story each night, never the one already being read.
  const featuredStory = useMemo(() => {
    const day = Math.floor(Date.now() / 86_400_000);
    const pool = ALL_STORIES.filter((s) => s.id !== activeStory?.id);
    return pool[day % pool.length] ?? ALL_STORIES[0];
  }, [activeStory?.id]);

  const legends = ALL_STORIES.filter((s) => s.category === 'Legend' || s.category === 'Tết Tale');
  const fables = ALL_STORIES.filter((s) => s.category === 'Fable');
  const finishedCount = Object.values(progressMap).filter((p) => p.completed).length;
  const greeting = greetingPeriod(new Date().getHours());
  // Phones keep the original shelf; wider windows fit whole covers plus a peek.
  const shelfW = layout.isCompact
    ? Math.min(Math.round(layout.width * 0.4), 190)
    : shelfItemWidth(contentWidth, gridColumns(contentWidth, Layout.minCoverWidth, SHELF_GAP, { min: 3 }), SHELF_GAP);
  const rowCols = gridColumns(contentWidth, MIN_ROW_W, Spacing.md, { max: 3 });
  const rowW = gridItemWidth(contentWidth, rowCols, Spacing.md);
  const storyRows = (stories: Story[]) => (
    <View style={[styles.list, pad]}>
      {stories.map((story) => (
        <View key={story.id} style={{ width: rowW }}>
          <StoryCard story={story} onPress={openStory} variant="compact" />
        </View>
      ))}
    </View>
  );

  const resume = () => {
    if (!activeStory || !activeProgress) return;
    premiumGate(activeStory.id, () => {
      setStory(activeStory, activeProgress.pageIndex);
      router.push(`/reader/${activeStory.id}?page=${activeProgress.pageIndex}`);
    });
  };

  return (
    <CollapsingHeaderScreen
      compactTitle={t('tabs.stories')}
      maxWidth={MAX_CONTENT}
      header={
        <ScreenHeader
          eyebrow={t(`home.greeting.${greeting}.eyebrow`)}
          title={t(`home.greeting.${greeting}.title`)}
          subtitle={t('home.subtitle')}
        />
      }
    >

      {/* Continue reading */}
      {activeStory && continueInfo?.state === 'reading' ? (
        <Pressable
          style={({ pressed }) => [
            styles.continueCard,
            { marginHorizontal: inset },
            pressed && { opacity: 0.92 },
          ]}
          onPress={resume}
          accessibilityRole="button"
          accessibilityLabel={t('home.continueA11y', { title: activeStory.title.en, progress: continueInfo.label })}
        >
          <BookCover story={activeStory} width={58} height={78} radius={BorderRadius.md} showDuration={false} />
          <View style={styles.continueText}>
            <Text style={[type.eyebrow, { color: colors.textAccent }]}>{t('home.continueEyebrow')}</Text>
            <Text style={type.cardTitle} numberOfLines={1}>
              {activeStory.title.en}
            </Text>
            <View style={styles.continueProgress}>
              <View style={{ flex: 1 }}>
                <ProgressBar value={continueInfo.fraction} />
              </View>
              <Text style={styles.continueLabel}>{continueInfo.label}</Text>
            </View>
          </View>
          <View style={styles.playDisc}>
            <Play size={18} color={colors.onPrimary} fill={colors.onPrimary} />
          </View>
        </Pressable>
      ) : null}

      {/* Tonight's story */}
      <View style={styles.section}>
        <SectionHeader eyebrow={t('home.featuredEyebrow')} title={t('home.featuredTitle')} inset={inset} />
        <StoryCard
          story={featuredStory}
          onPress={openStory}
          variant="featured"
          width={layout.isCompact ? Math.min(contentWidth, 640) : contentWidth}
          eyebrow={t('home.featuredCardEyebrow')}
        />
      </View>

      {/* Bookshelf */}
      <View style={styles.section}>
        <SectionHeader
          eyebrow={
            finishedCount
              ? t('home.shelfEyebrowFinished', { count: ALL_STORIES.length, finished: finishedCount })
              : t('home.shelfEyebrow', { count: ALL_STORIES.length })
          }
          title={t('home.shelfTitle')}
          actionLabel={t('home.seeAll')}
          onAction={() => router.push('/library')}
          inset={inset}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.shelf, pad]}
          decelerationRate="fast"
          snapToInterval={shelfW + SHELF_GAP}
        >
          {ALL_STORIES.map((story) => (
            <StoryCard key={story.id} story={story} onPress={openStory} width={shelfW} />
          ))}
        </ScrollView>
        <View style={[styles.shelfLedge, { marginHorizontal: inset }]} />
      </View>

      {/* Legends */}
      {legends.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader eyebrow={t('home.legendsEyebrow')} title={t('home.legendsTitle')} inset={inset} />
          {storyRows(legends)}
        </View>
      ) : null}

      {/* Fables */}
      {fables.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader eyebrow={t('home.fablesEyebrow')} title={t('home.fablesTitle')} inset={inset} />
          {storyRows(fables)}
        </View>
      ) : null}

      <View style={styles.footer}>
        <MoonMark size={28} />
        <Text style={styles.footerText}>{t('home.footer')}</Text>
        <Text style={styles.footerSub}>{t('home.footerSub')}</Text>
      </View>
    </CollapsingHeaderScreen>
  );
}

type GreetingPeriod = 'lateNight' | 'morning' | 'afternoon' | 'evening' | 'night';

function greetingPeriod(hour: number): GreetingPeriod {
  if (hour < 5) return 'lateNight';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 20) return 'evening';
  return 'night';
}


const useStyles = createThemedStyles((t) => ({
  section: { marginTop: Spacing.lg },
  shelf: { gap: SHELF_GAP, paddingBottom: Spacing.sm },
  shelfLedge: {
    height: 1,
    backgroundColor: t.colors.border,
    marginTop: Spacing.sm,
  },
  list: { flexDirection: 'row', flexWrap: 'wrap', columnGap: Spacing.md },
  continueCard: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.sm + 4,
    backgroundColor: t.colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: t.colors.border,
    ...t.shadow.paper,
  },
  continueText: { flex: 1, gap: 3 },
  continueProgress: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 6 },
  continueLabel: { fontSize: Typography.xs, color: t.colors.textMuted, fontWeight: '600' },
  playDisc: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: t.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  },
  footer: { alignItems: 'center', paddingTop: Spacing.xl, paddingHorizontal: Spacing.lg, gap: 6 },
  footerText: {
    fontFamily: Typography.serif,
    fontSize: Typography.base,
    color: t.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footerSub: { fontSize: Typography.xs, color: t.colors.textMuted, letterSpacing: 0.4 },
}));
