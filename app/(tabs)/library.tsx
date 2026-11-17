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
  useWindowDimensions,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Spacing, Typography, TouchTarget } from '../../src/constants/theme';
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
  Segmented,
} from '../../src/components/ui';
import { ALL_STORIES } from '../../src/data/stories';
import { Story } from '../../src/types/story';
import { useProgressStore } from '../../src/store/progressStore';
import { describeProgress, ReadingState } from '../../src/hooks/useStoryProgress';
import { storyMatchesQuery } from '../../src/utils/storySearch';
import { storyCategory } from '../../src/i18n/storyMeta';

type StatusFilter = 'all' | 'reading' | 'finished';
/** Category filter: a story category from the data, or every category. */
const ALL_CATEGORIES = null;

const MAX_CONTENT = 960;

export default function LibraryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const styles = useStyles();
  const { colors, type } = useTheme();
  const { width: SW } = useWindowDimensions();
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
    for (const s of ALL_STORIES) counts.set(s.category, (counts.get(s.category) ?? 0) + 1);
    return [[ALL_CATEGORIES, ALL_STORIES.length] as const, ...Array.from(counts.entries())];
  }, []);

  const stateOf = (s: Story): ReadingState => describeProgress(s, progressMap[s.id] ?? null).state;
  const finished = ALL_STORIES.filter((s) => stateOf(s) === 'finished').length;
  const reading = ALL_STORIES.filter((s) => stateOf(s) === 'reading').length;

  // Search, status and category filters all apply together.
  const visibleStories = ALL_STORIES.filter(
    (s) =>
      (category === ALL_CATEGORIES || s.category === category) &&
      (status === 'all' || stateOf(s) === status) &&
      storyMatchesQuery(s, query)
  );
  const searching = query.trim().length > 0;
  const filtersActive = category !== ALL_CATEGORIES || status !== 'all';

  // Responsive grid: 2 columns on phones, more on tablets.
  const contentW = Math.min(SW, MAX_CONTENT) - Spacing.gutter * 2;
  const cols = contentW > 760 ? 4 : contentW > 520 ? 3 : 2;
  const gap = Spacing.md;
  const cardW = Math.floor((contentW - gap * (cols - 1)) / cols);

  const openStory = (story: Story) => router.push(`/story/${story.id}`);
  const subtitleVars = { count: ALL_STORIES.length, reading, finished };
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
        <View style={styles.statusRow}>
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
        contentContainerStyle={styles.filterRow}
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
          <View style={[styles.grid, { gap, paddingHorizontal: Spacing.gutter }]}>
            {visibleStories.map((story) => (
              <StoryCard key={story.id} story={story} onPress={openStory} width={cardW} />
            ))}
          </View>
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
  statusRow: { paddingHorizontal: Spacing.gutter },
  filterRow: { paddingHorizontal: Spacing.gutter, gap: Spacing.sm, paddingBottom: Spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: Spacing.lg },
  // Same box as ScreenHeader, so opening search never shifts the page.
  searchHeader: {
    paddingHorizontal: Spacing.gutter,
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
