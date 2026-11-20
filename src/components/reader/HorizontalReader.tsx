import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, ViewToken, LayoutChangeEvent } from 'react-native';
import { StoryPage as StoryPageType, ReadingMode } from '../../types/story';
import { StoryPageView } from './StoryPage';
import { Spacing, ReaderTheme } from '../../constants/theme';
import { WordDefinition } from '../../data/vocabulary';

interface HorizontalReaderProps {
  pages: StoryPageType[];
  currentPageIndex: number;
  activeSentenceIndex: number;
  activeBilingualPhase: 'en' | 'vi';
  readingMode: ReadingMode;
  /** Active Reading Appearance (Paper · Moonlight). */
  readerTheme: ReaderTheme;
  isLearningMode?: boolean;
  /** Narration is speaking (drives the "reading aloud" indicator). */
  isNarrating?: boolean;
  /** Widest the page may be (the screen's reading column). */
  maxPageWidth?: number;
  /** Side margin between the window edge and the page. */
  margin?: number;
  /** Called only for pages the reader swiped to (not programmatic scrolls). */
  onPageChange: (index: number) => void;
  onWordSelect?: (definition: WordDefinition) => void;
  onReplaySentence?: (sentenceIndex: number, phase: 'en' | 'vi') => void;
}

const MAX_PAGE_WIDTH = 980;

export const HorizontalReader = React.forwardRef<FlatList, HorizontalReaderProps>(
  (
    {
      pages,
      currentPageIndex,
      activeSentenceIndex,
      activeBilingualPhase,
      readingMode,
      readerTheme,
      isLearningMode = false,
      isNarrating = false,
      maxPageWidth = MAX_PAGE_WIDTH,
      margin = Spacing.md,
      onPageChange,
      onWordSelect,
      onReplaySentence,
    },
    ref
  ) => {
    const flatListRef = useRef<FlatList>(null);
    React.useImperativeHandle(ref, () => flatListRef.current as FlatList);

    // Size pages from the space actually available between header and controls.
    const [size, setSize] = useState<{ width: number; height: number } | null>(null);
    const onLayout = useCallback((e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      // A hidden screen (e.g. behind the settings sheet) reports 0x0: keep the last real size.
      if (width <= 0 || height <= 0) return;
      setSize((prev) =>
        prev && Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1
          ? prev
          : { width, height }
      );
    }, []);

    // While the list scrolls programmatically (initial page, buttons, auto-turn),
    // ignore viewability updates until the target page is reached, so the pages
    // passed on the way are not mistaken for swipes.
    const programmaticTarget = useRef<number | null>(currentPageIndex);
    const targetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const setProgrammaticTarget = (index: number) => {
      programmaticTarget.current = index;
      if (targetTimer.current) clearTimeout(targetTimer.current);
      targetTimer.current = setTimeout(() => {
        programmaticTarget.current = null;
      }, 900);
    };

    const lastScrolledIndex = useRef(currentPageIndex);
    React.useEffect(() => {
      if (!size) return;
      if (lastScrolledIndex.current === currentPageIndex) return;
      lastScrolledIndex.current = currentPageIndex;
      setProgrammaticTarget(currentPageIndex);
      flatListRef.current?.scrollToIndex({ index: currentPageIndex, animated: true });
    }, [currentPageIndex, size]);

    React.useEffect(() => {
      // Initial positioning is also programmatic.
      setProgrammaticTarget(currentPageIndex);
      return () => {
        if (targetTimer.current) clearTimeout(targetTimer.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // FlatList forbids changing onViewableItemsChanged after mount: keep one
    // stable callback and read the latest props through refs.
    const currentPageRef = useRef(currentPageIndex);
    currentPageRef.current = currentPageIndex;
    const onPageChangeRef = useRef(onPageChange);
    onPageChangeRef.current = onPageChange;

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (!first || first.index === null) return;
      const newIdx = first.index;
      if (programmaticTarget.current !== null) {
        if (newIdx === programmaticTarget.current) programmaticTarget.current = null;
        return;
      }
      if (newIdx !== currentPageRef.current) {
        lastScrolledIndex.current = newIdx;
        onPageChangeRef.current(newIdx);
      }
    }).current;

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const itemWidth = size?.width ?? 0;
    const pageWidth = Math.min(itemWidth - margin * 2, maxPageWidth);
    const pageHeight = (size?.height ?? 0) - Spacing.sm * 3;

    const renderPage = useCallback(
      ({ item, index }: { item: StoryPageType; index: number }) => (
        <View style={[styles.pageWrapper, { width: itemWidth }]}>
          <StoryPageView
            page={item}
            pageNumber={index + 1}
            totalPages={pages.length}
            isNarrating={isNarrating && index === currentPageIndex}
            activeSentenceIndex={index === currentPageIndex ? activeSentenceIndex : -1}
            activeBilingualPhase={activeBilingualPhase}
            readingMode={readingMode}
            readerTheme={readerTheme}
            isLearningMode={isLearningMode}
            pageWidth={pageWidth}
            pageHeight={pageHeight}
            onWordSelect={onWordSelect}
            onReplaySentence={onReplaySentence}
          />
        </View>
      ),
      [
        itemWidth,
        pageWidth,
        pageHeight,
        currentPageIndex,
        activeSentenceIndex,
        activeBilingualPhase,
        readingMode,
        readerTheme,
        isLearningMode,
        isNarrating,
        pages.length,
        onWordSelect,
        onReplaySentence,
      ]
    );

    return (
      <View style={styles.container} onLayout={onLayout}>
        {size && size.width > 0 && size.height > 0 ? (
          <FlatList
            key={`${Math.round(size.width)}`}
            ref={flatListRef}
            data={pages}
            renderItem={renderPage}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onScrollBeginDrag={() => {
              // The reader took over: their swipe is not programmatic.
              programmaticTarget.current = null;
            }}
            getItemLayout={(_, index) => ({ length: itemWidth, offset: itemWidth * index, index })}
            initialScrollIndex={currentPageIndex}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
              }, 100);
            }}
            style={styles.list}
            decelerationRate="fast"
            snapToInterval={itemWidth}
            snapToAlignment="start"
          />
        ) : null}
      </View>
    );
  }
);

HorizontalReader.displayName = 'HorizontalReader';

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1 },
  pageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
});
