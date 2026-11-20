// ============================================================
// Responsive layout — pure logic (no React Native imports, so it
// runs under `node --test`). Screens use it through
// useResponsiveLayout() (src/hooks), which feeds it the window size.
//
// Everything keys off the *window* width, not the device: an iPad in
// Split View or Stage Manager can be as narrow as a phone, and gets
// the phone layout.
//
//   compact  < 600   phones, narrow split views   → existing phone layouts
//   medium   600–899 iPad mini / 11" portrait, wide split views
//   expanded ≥ 900   large iPads, landscape, desktop web
// ============================================================

export const Layout = {
  breakpoints: { medium: 600, expanded: 900 },
  /** Screen gutter on phones / on tablets. */
  gutter: { compact: 20, regular: 32 },
  /** Outer column widths (gutters included), centred on wider windows. */
  maxWidth: {
    /** Browsing screens: home, library, story detail. */
    browse: 1120,
    /** Forms and documents: settings, legal, sheets. Comfortable line length. */
    form: 680,
    /** Reader, book layout: a portrait page / a landscape two-page spread. */
    readerPage: 860,
    readerSpread: 1200,
    /** Reader, scroll layout: one comfortable reading column. */
    readerFlow: 760,
    /** Paywall on a tablet: the stacked composition's column. */
    paywall: 660,
  },
  /** Reader side margin on phones (unchanged phone layout) / on tablets. */
  readerMargin: { compact: 16, regular: 32 },
  /** Smallest comfortable book-cover width in a grid or shelf. */
  minCoverWidth: 168,
} as const;

export type SizeClass = 'compact' | 'medium' | 'expanded';

export function sizeClassFor(width: number): SizeClass {
  if (width >= Layout.breakpoints.expanded) return 'expanded';
  if (width >= Layout.breakpoints.medium) return 'medium';
  return 'compact';
}

export function gutterFor(width: number): number {
  return width >= Layout.breakpoints.medium ? Layout.gutter.regular : Layout.gutter.compact;
}

export interface ContentFrame {
  /** Width of the content column (between the gutters). */
  contentWidth: number;
  /**
   * Horizontal padding that lines content up with the centred column. Use it
   * on full-bleed rows (horizontal shelves) so they scroll edge to edge but
   * start where the column starts.
   */
  inset: number;
}

/**
 * A centred column at most `maxWidth` wide (gutters included), matching
 * `{ width: '100%', maxWidth, alignSelf: 'center', paddingHorizontal: gutter }`.
 */
export function contentFrame(windowWidth: number, maxWidth: number, gutter: number): ContentFrame {
  const outer = Math.min(windowWidth, maxWidth);
  const contentWidth = Math.max(0, Math.floor(outer - gutter * 2));
  return { contentWidth, inset: Math.floor((windowWidth - contentWidth) / 2) };
}

/** How many columns of at least `minItem` fit, clamped to [min, max]. */
export function gridColumns(
  contentWidth: number,
  minItem: number,
  gap: number,
  { min = 1, max = 6 }: { min?: number; max?: number } = {}
): number {
  const fit = Math.floor((contentWidth + gap) / (minItem + gap));
  return Math.max(min, Math.min(max, fit));
}

/**
 * Columns for a short, known number of items (e.g. a book's pages) that
 * avoid a lonely last row: among `maxCols` and up to two fewer, pick the one
 * that leaves the fewest empty slots (ties keep more, smaller columns).
 */
export function balancedColumns(count: number, maxCols: number, minCols = 1): number {
  if (count <= maxCols) return Math.max(minCols, Math.min(maxCols, count));
  let best = maxCols;
  let bestEmpty = Number.POSITIVE_INFINITY;
  for (let cols = maxCols; cols >= Math.max(minCols, maxCols - 2); cols--) {
    const empty = (cols - (count % cols)) % cols;
    if (empty < bestEmpty) {
      best = cols;
      bestEmpty = empty;
    }
  }
  return best;
}

/** Width of one item in a `cols`-column grid. */
export function gridItemWidth(contentWidth: number, cols: number, gap: number): number {
  return Math.floor((contentWidth - gap * (cols - 1)) / cols);
}

/**
 * Width of a card in a horizontal shelf: `cols` whole cards plus a peek of
 * the next one, so it reads as scrollable.
 */
export function shelfItemWidth(contentWidth: number, cols: number, gap: number, peek = 0.3): number {
  return Math.floor((contentWidth - gap * cols) / (cols + peek));
}

// ─── Reader ───────────────────────────────────────────────────

export type ReaderLayoutMode = 'horizontal' | 'vertical';

export interface ReaderColumn {
  /** Side margin between the window edge and the page. */
  margin: number;
  /** Widest the page (and the header and dock lined up with it) may be. */
  maxWidth: number;
  /** Width the page actually gets in this window. */
  width: number;
}

/**
 * The reading column shared by the reader's header, page and narration dock,
 * so their edges line up. Phones keep the original full-width page; tablets
 * get a book-sized portrait page, a wider two-page spread in landscape, and a
 * comfortable reading column in the scroll layout.
 */
export function readerColumn(windowWidth: number, windowHeight: number, mode: ReaderLayoutMode): ReaderColumn {
  const regular = windowWidth >= Layout.breakpoints.medium;
  const margin = regular ? Layout.readerMargin.regular : Layout.readerMargin.compact;
  let maxWidth: number;
  if (!regular) maxWidth = mode === 'vertical' ? 620 : 980; // the phone layout, as before
  else if (mode === 'vertical') maxWidth = Layout.maxWidth.readerFlow;
  else maxWidth = windowWidth > windowHeight ? Layout.maxWidth.readerSpread : Layout.maxWidth.readerPage;
  return { margin, maxWidth, width: Math.max(0, Math.min(windowWidth - margin * 2, maxWidth)) };
}

// ─── Paywall ──────────────────────────────────────────────────

/**
 * phone   — the original phone paywall (plans anchored at the bottom).
 * stacked — tablet portrait / medium windows: art band, promise, plans in one wider column.
 * split   — tablet landscape: the story art and promise on one side, the decision on the other.
 */
export type PaywallArrangement = 'phone' | 'stacked' | 'split';

export function paywallArrangement(width: number, height: number): PaywallArrangement {
  if (width < Layout.breakpoints.medium) return 'phone';
  if (width >= 1000 && width > height * 1.05) return 'split';
  return 'stacked';
}
