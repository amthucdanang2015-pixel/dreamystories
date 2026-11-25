import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
  Easing,
  Keyboard,
} from 'react-native';
import { Cloud, Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Layout, Spacing, Typography, TouchTarget } from '../../src/constants/theme';
import { createThemedStyles, useTheme } from '../../src/theme';
import { StoryCard } from '../../src/components/story/StoryCard';
import {
  Button,
  Chip,
  CollapsingHeaderScreen,
  EmptyState,
  IconButton,
  ScreenHeader,
  SearchField,
  SectionHeader,
  Segmented,
} from '../../src/components/ui';
import { ALL_STORIES, ONLINE_STORIES } from '../../src/data/stories';
import { Story } from '../../src/types/story';
import { useProgressStore } from '../../src/store/progressStore';
import { describeProgress, ReadingState } from '../../src/hooks/useStoryProgress';
import { storyMatchesQuery } from '../../src/utils/storySearch';
import { storyCategory } from '../../src/i18n/storyMeta';
import { useResponsiveLayout } from '../../src/hooks/useResponsiveLayout';
import { gridColumns, gridItemWidth } from '../../src/utils/responsiveLayout';
import { FREE_STORY_IDS, isFreeStory } from '../../src/constants/entitlements';

type StatusFilter = 'all' | 'reading' | 'finished';
/** Category filter: a story category from the data, or every category. */
const ALL_CATEGORIES = null;

const MAX_CONTENT = Layout.maxWidth.browse;
/** Bundled + online stories: what the Library's filters, counts and search cover. */
const LIBRARY_STORIES: Story[] = [...ALL_STORIES, ...ONLINE_STORIES];

export default function LibraryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const styles = useStyles();
  const { colors, type } = useTheme();
  const layout = useResponsiveLayout();
  const { contentWidth: contentW, inset } = layout.frame(MAX_CONTENT);
  const progressMap = useProgressStore((s) => s.progressMap);
  const [category, setCategory] = useState<string | null>(ALL_CATEGORIES);
  const [status, setStatus] = useState<StatusFilter>('all');

  // ── Search mode ──────────────────────────────────────────────
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const reveal = useRef(new Animated.Value(0)).current;
  // The closed header's height, so the search row occupies exactly the same
  // space and the filters, chips and grid below never move.
  const [headerH, setHeaderH] = useState<number | null>(null);

  useEffect(() => {
    if (!searchOpen) return;
    reveal.setValue(0);
    Animated.timing(reveal, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // Focus after the first frame so the keyboard opens reliably on Android.
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [searchOpen, reveal]);

  // The search field lives in the large header: bring it back into view
  // when search is opened from the collapsed bar.
  const openSearch = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setSearchOpen(true);
  }, []);
  const closeSearch = useCallback(() => {
    Keyboard.dismiss();
    Animated.timing(reveal, {
      toValue: 0,
      duration: 160,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setQuery('');
      setSearchOpen(false);
    });
  }, [reveal]);

  // Filters come from the stories' real categories, in first-seen order.
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of LIBRARY_STORIES) counts.set(s.category, (counts.get(s.category) ?? 0) + 1);
    return [[ALL_CATEGORIES, LIBRARY_STORIES.length] as const, ...Array.from(counts.entries())];
  }, []);

  const stateOf = (s: Story): ReadingState => describeProgress(s, progressMap[s.id] ?? null).state;
  const finished = LIBRARY_STORIES.filter((s) => stateOf(s) === 'finished').length;
  const reading = LIBRARY_STORIES.filter((s) => stateOf(s) === 'reading').length;

  // Search, status and category filters all apply together.
  const visibleStories = LIBRARY_STORIES.filter(
    (s) =>
      (category === ALL_CATEGORIES || s.category === category) &&
      (status === 'all' || stateOf(s) === status) &&
      storyMatchesQuery(s, query)
  );
  // Free stories always come first, in their own section, in the order
  // FREE_STORY_IDS lists them; Premium stories follow in catalogue order.
  // Online stories (narration streamed from HOST_ONLINE) have their own section.
  const bundledVisible = visibleStories.filter((s) => !s.online);
  const onlineStories = visibleStories.filter((s) => !!s.online);
  const freeStories = bundledVisible
    .filter((s) => isFreeStory(s.id))
    .sort((a, b) => FREE_STORY_IDS.indexOf(a.id) - FREE_STORY_IDS.indexOf(b.id));
  const premiumStories = bundledVisible.filter((s) => !isFreeStory(s.id));
  const searching = query.trim().length > 0;
  const filtersActive = category !== ALL_CATEGORIES || status !== 'all';

  // Responsive grid: 2 columns on phones, as many readable covers as fit on tablets.
  const gap = Spacing.md;
  const cols = gridColumns(contentW, Layout.minCoverWidth, gap, { min: 2 });
  const cardW = gridItemWidth(contentW, cols, gap);

  const openStory = (story: Story) => router.push(`/story/${story.id}`);
  const subtitleVars = { count: LIBRARY_STORIES.length, reading, finished };
  const subtitle =
    reading && finished
      ? t('library.subtitleReadingFinished', subtitleVars)
      : reading
        ? t('library.subtitleReading', subtitleVars)
        : finished
          ? t('library.subtitleFinished', subtitleVars)
          : t('library.subtitle', subtitleVars);

  return (
    <CollapsingHeaderScreen
      compactTitle={t('library.title')}
      maxWidth={MAX_CONTENT}
      scrollRef={scrollRef}
      scrollViewProps={{ keyboardShouldPersistTaps: 'handled', keyboardDismissMode: 'on-drag' }}
      header={
        searchOpen ? (
          <Animated.View
            style={[
              styles.searchHeader,
              { paddingHorizontal: layout.gutter },
              headerH ? { minHeight: headerH } : null,
              {
                opacity: reveal,
                transform: [
                  { translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) },
                  { scale: reveal.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) },
                ],
              },
            ]}
          >
            <Text style={[type.eyebrow, styles.searchEyebrow]}>{t('library.searchEyebrow')}</Text>
            <View style={styles.searchRow}>
              <SearchField
                ref={inputRef}
                value={query}
                onChangeText={setQuery}
                placeholder={t('library.searchPlaceholder')}
                accessibilityLabel={t('library.searchA11y')}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <Pressable
                onPress={closeSearch}
                hitSlop={6}
                style={({ pressed }) => [styles.cancel, pressed && { opacity: 0.6 }]}
                accessibilityRole="button"
                accessibilityLabel={t('library.closeSearch')}
              >
                <Text style={styles.cancelText}>{t('common.cancel')}</Text>
              </Pressable>
            </View>
            <Text style={styles.resultText} numberOfLines={1} accessibilityLiveRegion="polite">
              {searching ? t('library.results', { count: visibleStories.length }) : t('library.searchHint')}
            </Text>
          </Animated.View>
        ) : (
          <View onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}>
            <ScreenHeader eyebrow={t('library.eyebrow')} title={t('library.title')} subtitle={subtitle} />
          </View>
        )
      }
      actions={
        searchOpen ? null : (
          <IconButton
            onPress={openSearch}
            accessibilityLabel={t('library.openSearch')}
            variant="outline"
            size={TouchTarget}
          >
            <Search size={20} color={colors.textPrimary} strokeWidth={2} />
          </IconButton>
        )
      }
      // The primary filter stays reachable: it pins under the compact bar.
      sticky={
        <View style={[{ paddingHorizontal: layout.gutter }, !layout.isCompact && styles.statusRowWide]}>
          <Segmented
            accessibilityLabel={t('library.statusA11y')}
            options={[
              ['all', t('library.statusAll')],
              ['reading', t('library.statusReading')],
              ['finished', t('library.statusFinished')],
            ]}
            value={status}
            onChange={(v) => setStatus(v as StatusFilter)}
          />
        </View>
      }
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // Scrolls edge to edge, but starts in line with the grid.
        contentContainerStyle={[styles.filterRow, { paddingHorizontal: inset }]}
      >
        {categories.map(([cat, count]) => (
          <Chip
            key={cat ?? 'all'}
            label={cat === ALL_CATEGORIES ? t('library.categoryAll') : storyCategory(t, cat)}
            count={count}
            active={cat === category}
            onPress={() => setCategory(cat)}
          />
        ))}
      </ScrollView>

      <View style={styles.center}>
        {visibleStories.length > 0 ? (
          <>
            {freeStories.length > 0 ? (
              <View style={styles.section}>
                <SectionHeader
                  eyebrow={t('library.freeEyebrow', { count: freeStories.length })}
                  title={t('library.freeTitle')}
                />
                <View style={[styles.grid, { gap, paddingHorizontal: layout.gutter }]}>
                  {freeStories.map((story) => (
                    <StoryCard key={story.id} story={story} onPress={openStory} width={cardW} />
                  ))}
                </View>
              </View>
            ) : null}
            {onlineStories.length > 0 ? (
              <View style={styles.section}>
                <SectionHeader
                  eyebrow={t('online.sectionEyebrow', { count: onlineStories.length })}
                  title={t('online.sectionTitle')}
                />
                <View style={[styles.onlineNote, { marginHorizontal: layout.gutter }]}>
                  <Cloud size={14} color={colors.textMuted} strokeWidth={2.2} />
                  <Text style={styles.onlineNoteText}>{t('online.needsInternet')}</Text>
                </View>
                <View style={[styles.grid, { gap, paddingHorizontal: layout.gutter }]}>
                  {onlineStories.map((story) => (
                    <StoryCard key={story.id} story={story} onPress={openStory} width={cardW} />
                  ))}
                </View>
              </View>
            ) : null}
            {premiumStories.length > 0 ? (
              <View style={styles.section}>
                <SectionHeader eyebrow={t('library.premiumEyebrow')} title={t('library.premiumTitle')} />
                <View style={[styles.grid, { gap, paddingHorizontal: layout.gutter }]}>
                  {premiumStories.map((story) => (
                    <StoryCard key={story.id} story={story} onPress={openStory} width={cardW} />
                  ))}
                </View>
              </View>
            ) : null}
          </>
        ) : (
          searching ? (
            <EmptyState
              title={t('library.noMatchTitle', { query: query.trim() })}
              message={filtersActive ? t('library.noMatchFilteredMessage') : t('library.noMatchMessage')}
              action={
                <View style={styles.emptyActions}>
                  <Button
                    label={t('library.clearSearch')}
                    variant="secondary"
                    onPress={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                  />
                  {filtersActive ? (
                    <Button
                      label={t('library.searchAllShelves')}
                      variant="ghost"
                      onPress={() => {
                        setCategory(ALL_CATEGORIES);
                        setStatus('all');
                      }}
                    />
                  ) : null}
                </View>
              }
            />
          ) : (
            <EmptyState
              title={
                status === 'finished'
                  ? t('library.emptyFinishedTitle')
                  : status === 'reading'
                    ? t('library.emptyReadingTitle')
                    : t('library.emptyTitle')
              }
              message={
                status === 'finished'
                  ? t('library.emptyFinishedMessage')
                  : status === 'reading'
                    ? t('library.emptyReadingMessage')
                    : t('library.emptyMessage')
              }
              action={
                <Button
                  label={t('library.showAll')}
                  variant="secondary"
                  onPress={() => {
                    setCategory(ALL_CATEGORIES);
                    setStatus('all');
                  }}
                />
              }
            />
          )
        )}
      </View>
    </CollapsingHeaderScreen>
  );
}

const useStyles = createThemedStyles((t) => ({
  center: { width: '100%', maxWidth: MAX_CONTENT, alignSelf: 'center' },
  // Three short options don't need the whole width of a tablet.
  statusRowWide: { maxWidth: 520 },
  filterRow: { gap: Spacing.sm, paddingBottom: Spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: Spacing.lg },
  section: { marginBottom: Spacing.xl },
  onlineNote: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xs, marginBottom: Spacing.md },
  onlineNoteText: { flex: 1, fontSize: Typography.sm, lineHeight: Typography.sm * 1.4, color: t.colors.textMuted },
  // Same box as ScreenHeader, so opening search never shifts the page.
  searchHeader: {
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  searchEyebrow: { color: t.colors.textAccent, marginBottom: Spacing.sm },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cancel: { minHeight: TouchTarget, minWidth: TouchTarget, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: Typography.base, fontWeight: '600', color: t.colors.accent },
  resultText: { fontSize: Typography.sm, color: t.colors.textMuted, marginTop: Spacing.sm + 2, paddingHorizontal: 4 },
  emptyActions: { alignItems: 'center', gap: Spacing.xs },
}));
