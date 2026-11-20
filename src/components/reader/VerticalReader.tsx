import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, LayoutChangeEvent } from 'react-native';
import { StoryPage as StoryPageType, ReadingMode } from '../../types/story';
import { StoryPageView } from './StoryPage';
import { Spacing, ReaderTheme } from '../../constants/theme';
import { WordDefinition } from '../../data/vocabulary';
import { SentenceAutoScrollProvider, useSentenceAutoScroll } from '../../hooks/useSentenceAutoScroll';

interface VerticalReaderProps {
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
  onWordSelect?: (definition: WordDefinition) => void;
  onReplaySentence?: (sentenceIndex: number, phase: 'en' | 'vi') => void;
}

const MAX_PAGE_WIDTH = 620;

export const VerticalReader: React.FC<VerticalReaderProps> = ({
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
  onWordSelect,
  onReplaySentence,
}) => {
  // While narrating, the sentence being read is kept near the top.
  const autoScroll = useSentenceAutoScroll(isNarrating);
  const scrollRef = autoScroll.scrollRef;
  const pageY = useRef<number[]>([]);
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

  // Keep the page being read in view (first positioning is not animated and
  // waits until the content is tall enough for the target offset).
  const positioned = useRef(false);
  const contentHeight = useRef(0);
  const scrollToPage = useCallback((index: number) => {
    const y = pageY.current[index];
    if (y === undefined || contentHeight.current < y) return;
    // Page offsets are measured inside the padded content wrapper, so the
    // page top lands one Spacing.md below the top edge.
    // Through the auto-scroll hook, so it is not mistaken for the reader scrolling.
    autoScroll.scrollTo(Math.max(y, 0), positioned.current);
    positioned.current = true;
  }, [autoScroll.scrollTo]);

  // A layout effect, so the page is positioned before the new page's first
  // sentence is reported: auto-scroll then only moves if that sentence is not
  // already near the top (keeping the page's art in view when it fits).
  useLayoutEffect(() => {
    scrollToPage(currentPageIndex);
  }, [currentPageIndex, size, scrollToPage]);

  const currentRef = useRef(currentPageIndex);
  currentRef.current = currentPageIndex;

  // Pages flow at their natural height: art above the full text, no nested scrolling.
  const pageWidth = size ? Math.min(size.width - margin * 2, maxPageWidth) : 0;

  return (
    <View style={styles.container} onLayout={onLayout}>
      {size ? (
        <ScrollView
          ref={scrollRef}
          {...autoScroll.scrollViewProps}
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingHorizontal: margin }]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={(w, h) => {
            autoScroll.scrollViewProps.onContentSizeChange(w, h);
            contentHeight.current = h;
            if (!positioned.current) scrollToPage(currentRef.current);
          }}
        >
          <SentenceAutoScrollProvider value={autoScroll.context}>
            <View ref={autoScroll.contentRef} onLayout={autoScroll.onContentLayout} style={styles.pages}>
              {pages.map((page, index) => (
                <View
                  key={page.id}
                  onLayout={(e) => {
                    pageY.current[index] = e.nativeEvent.layout.y;
                    if (index === currentRef.current && !positioned.current) scrollToPage(index);
                  }}
                >
                  <StoryPageView
                    page={page}
                    variant="flow"
                    pageNumber={index + 1}
                    totalPages={pages.length}
                    isNarrating={isNarrating && index === currentPageIndex}
                    activeSentenceIndex={index === currentPageIndex ? activeSentenceIndex : -1}
                    activeBilingualPhase={activeBilingualPhase}
                    readingMode={readingMode}
                    readerTheme={readerTheme}
                    isLearningMode={isLearningMode}
                    pageWidth={pageWidth}
                    onWordSelect={onWordSelect}
                    onReplaySentence={onReplaySentence}
                  />
                </View>
              ))}
            </View>
          </SentenceAutoScrollProvider>
        </ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  /** Measured wrapper for sentence positions; pages keep their spacing here. */
  pages: { alignItems: 'center', gap: Spacing.xl },
});
