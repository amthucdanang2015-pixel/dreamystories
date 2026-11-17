import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Typography, Spacing, BorderRadius } from '../../src/constants/theme';
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

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const styles = useStyles();
  const { colors, type } = useTheme();
  const { width: SW } = useWindowDimensions();
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
  const shelfW = Math.min(Math.round(SW * 0.4), 190);

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
          style={({ pressed }) => [styles.continueCard, pressed && { opacity: 0.92 }]}
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
        <SectionHeader eyebrow={t('home.featuredEyebrow')} title={t('home.featuredTitle')} />
        <StoryCard
          story={featuredStory}
          onPress={openStory}
          variant="featured"
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
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shelf}
          decelerationRate="fast"
          snapToInterval={shelfW + Spacing.md}
        >
          {ALL_STORIES.map((story) => (
            <StoryCard key={story.id} story={story} onPress={openStory} width={shelfW} />
          ))}
        </ScrollView>
        <View style={styles.shelfLedge} />
      </View>

      {/* Legends */}
      {legends.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader eyebrow={t('home.legendsEyebrow')} title={t('home.legendsTitle')} />
          <View style={styles.list}>
            {legends.map((story) => (
              <StoryCard key={story.id} story={story} onPress={openStory} variant="compact" />
            ))}
          </View>
        </View>
      ) : null}

      {/* Fables */}
      {fables.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader eyebrow={t('home.fablesEyebrow')} title={t('home.fablesTitle')} />
          <View style={styles.list}>
            {fables.map((story) => (
              <StoryCard key={story.id} story={story} onPress={openStory} variant="compact" />
            ))}
          </View>
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
  shelf: { paddingHorizontal: Spacing.gutter, gap: Spacing.md, paddingBottom: Spacing.sm },
  shelfLedge: {
    height: 1,
    marginHorizontal: Spacing.gutter,
    backgroundColor: t.colors.border,
    marginTop: Spacing.sm,
  },
  list: { paddingHorizontal: Spacing.gutter },
  continueCard: {
    marginHorizontal: Spacing.gutter,
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
