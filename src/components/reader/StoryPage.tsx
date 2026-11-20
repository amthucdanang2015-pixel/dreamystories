// ============================================================
// StoryPageView — one page of the book.
//   paged (book layout): fixed height; text scrolls under the art.
//     On wide pages (tablets) it opens into a two-page spread.
//   flow (scroll layout): natural height, art above the full text.
// ============================================================

import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StoryPage as StoryPageType, ReadingMode } from '../../types/story';
import { BorderRadius, Spacing, Typography, ReaderTheme } from '../../constants/theme';
import { ReaderShadow } from './readerShadow';
import { StoryIllustration } from '../illustrations/StoryIllustration';
import { SentenceHighlight } from './SentenceHighlight';
import { WordDefinition } from '../../data/vocabulary';
import { SentenceAutoScrollProvider, useSentenceAutoScroll } from '../../hooks/useSentenceAutoScroll';

interface StoryPageProps {
  page: StoryPageType;
  pageNumber?: number;
  totalPages?: number;
  activeSentenceIndex: number;
  activeBilingualPhase: 'en' | 'vi';
  readingMode: ReadingMode;
  /** Active Reading Appearance (Paper · Moonlight). */
  readerTheme: ReaderTheme;
  isLearningMode?: boolean;
  isNarrating?: boolean;
  pageWidth: number;
  /** Omit (or use variant "flow") for a natural-height page. */
  pageHeight?: number;
  variant?: 'paged' | 'flow';
  onWordSelect?: (definition: WordDefinition) => void;
  onReplaySentence?: (sentenceIndex: number, phase: 'en' | 'vi') => void;
}

const SPREAD_MIN_WIDTH = 700;
/** Longest comfortable line for the story text (pt): roughly 55–65 characters at the tablet size. */
const READING_MEASURE = 600;

export const StoryPageView: React.FC<StoryPageProps> = ({
  page,
  pageNumber,
  totalPages,
  activeSentenceIndex,
  activeBilingualPhase,
  readingMode,
  readerTheme,
  isLearningMode = false,
  isNarrating = false,
  pageWidth,
  pageHeight,
  variant = 'paged',
  onWordSelect,
  onReplaySentence,
}) => {
  const t = readerTheme;
  const { t: tr } = useTranslation(); // `t` is the reader theme here
  const flow = variant === 'flow' || !pageHeight;
  // A two-page spread only when the page is genuinely landscape (tablet landscape,
  // desktop web); portrait tablets keep the stacked layout so the art isn't cropped.
  const spread = !flow && pageWidth >= SPREAD_MIN_WIDTH && pageWidth > (pageHeight ?? 0) * 1.1;
  const large = pageWidth >= 520;
  // Tablet pages get wider inner margins, like a printed book.
  const textPadH = large ? Spacing.xl : Spacing.lg;

  // Book layout: the text scrolls inside the page, so the page follows the
  // sentence being read. (In the scroll layout the whole story scrolls, and
  // VerticalReader provides the auto-scroll instead.)
  const autoScroll = useSentenceAutoScroll(!flow && isNarrating && activeSentenceIndex >= 0);

  const text = (
    <SentenceHighlight
      sentences={page.sentences}
      activeSentenceIndex={activeSentenceIndex}
      activeBilingualPhase={activeBilingualPhase}
      readingMode={readingMode}
      readerTheme={readerTheme}
      isLearningMode={isLearningMode}
      isNarrating={isNarrating && activeSentenceIndex >= 0}
      large={large}
      onWordSelect={onWordSelect}
      onReplaySentence={onReplaySentence}
      scrollKeyPrefix={page.id}
    />
  );

  /** Paged text area: a ScrollView that keeps the sentence being read near the top. */
  const pagedText = (style: object, contentStyle: object | object[], children: React.ReactNode) => (
    <ScrollView
      ref={autoScroll.scrollRef}
      {...autoScroll.scrollViewProps}
      style={style}
      contentContainerStyle={contentStyle}
      showsVerticalScrollIndicator={false}
    >
      <SentenceAutoScrollProvider value={autoScroll.context}>
        <View ref={autoScroll.contentRef} onLayout={autoScroll.onContentLayout} style={styles.pagedTextInner}>
          {children}
        </View>
      </SentenceAutoScrollProvider>
    </ScrollView>
  );

  const folio =
    typeof pageNumber === 'number' ? (
      <Text
        style={[styles.folio, { color: t.textMuted }]}
        accessibilityLabel={
          totalPages
            ? tr('reader.pageA11y', { page: pageNumber, total: totalPages })
            : tr('reader.pageA11yNoTotal', { page: pageNumber })
        }
      >
        — {pageNumber} —
      </Text>
    ) : null;

  const art = (w: number, h: number, style?: object) => (
    <View style={[{ width: w, height: h, backgroundColor: t.pageEdge }, styles.art, style]}>
      <StoryIllustration pageKey={page.image} width={w} height={h} />
      {/* Moonlight: the art is gently dimmed so a bright page never flashes in a dark room. */}
      {t.artDim ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: t.artDim }]} pointerEvents="none" />
      ) : null}
    </View>
  );

  const cardStyle = [
    styles.page,
    { width: pageWidth, backgroundColor: t.page, borderColor: t.pageEdge },
    t.pageShadow ? null : styles.pageNoShadow,
  ];

  // ── Scroll layout: natural height ───────────────────────────
  if (flow) {
    const artH = Math.round(pageWidth * 0.62);
    return (
      <View style={cardStyle}>
        {art(pageWidth, artH)}
        <View style={[styles.flowText, large && styles.flowTextLarge, { paddingHorizontal: textPadH }]}>
          {text}
          {folio}
        </View>
      </View>
    );
  }

  // ── Book layout, wide: two-page spread ─────────────────────
  if (spread) {
    const half = Math.floor(pageWidth / 2);
    // Keep the right-hand page's lines at a book measure on very wide spreads.
    const spreadPadH = Math.max(Spacing.xl, Math.floor((pageWidth - half - READING_MEASURE) / 2));
    return (
      <View style={[cardStyle, { height: pageHeight, flexDirection: 'row' }]}>
        {art(half, pageHeight!)}
        <View style={[styles.gutterShade, { left: half - 10 }]} pointerEvents="none" />
        {pagedText(
          { width: pageWidth - half },
          [styles.spreadText, { minHeight: pageHeight, paddingHorizontal: spreadPadH }],
          <>
            {text}
            <View style={styles.folioSpacer} />
            {folio}
          </>
        )}
      </View>
    );
  }

  // ── Book layout, phone ─────────────────────────────────────
  // The 140 pt floor yields to the text on short pages (small phones,
  // large text): the art never takes more than 30% of such a page.
  const artH = Math.round(
    Math.max(Math.min(pageHeight! * 0.46, pageWidth * 0.68), Math.min(140, pageHeight! * 0.3))
  );
  return (
    <View style={[cardStyle, { height: pageHeight }]}>
      {art(pageWidth, artH)}
      {pagedText(
        styles.textArea,
        [styles.textContent, large && styles.textContentLarge],
        <>
          {text}
          <View style={styles.folioSpacer} />
          {folio}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    overflow: 'hidden',
    borderRadius: BorderRadius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    ...ReaderShadow.page,
  },
  pageNoShadow: { shadowOpacity: 0, elevation: 0 },
  art: { overflow: 'hidden' },
  textArea: { flex: 1 },
  /** Wraps the paged text so sentence positions can be measured. */
  pagedTextInner: { flexGrow: 1 },
  /** Fills the ScrollView viewport so its inner spacer can pin the folio to the bottom. */
  textContent: {
    width: '100%',
    maxWidth: READING_MEASURE + Spacing.xl * 2,
    alignSelf: 'center',
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md + 4,
    paddingBottom: 12,
  },
  textContentLarge: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  /** Pushes the folio down when space remains and collapses when text overflows. */
  folioSpacer: { flexGrow: 1 },
  flowText: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md + 4,
    paddingBottom: Spacing.md,
  },
  flowTextLarge: { paddingTop: Spacing.lg, paddingBottom: Spacing.lg },
  spreadText: {
    paddingTop: Spacing.xl,
    paddingBottom: 12,
    flexGrow: 1,
    justifyContent: 'center',
  },
  gutterShade: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 20,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  folio: {
    fontFamily: Typography.serif,
    fontSize: Typography.xs,
    textAlign: 'center',
    marginTop: Spacing.md,
    letterSpacing: 1,
  },
});
