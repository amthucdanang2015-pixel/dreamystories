// ============================================================
// Responsive layout for the segmented control — pure logic (no React
// Native imports, so it runs under `node --test`).
//
// The control fills its row with equal-width segments. Each label may
// wrap onto two lines at word breaks, so a segment only has to fit the
// longest single word ("phút", "Tiếng"). When even that doesn't fit —
// narrow phones, Display Zoom, large / accessibility text sizes — the
// options flow into fewer columns (4 → 2×2 → one per row), never
// clipped, never hidden and never shrunk below the user's text size.
// ============================================================

export interface SegmentLayoutInput {
  /** Option labels, already translated. */
  labels: string[];
  /** Width available to the whole control, in points (0 = not measured yet). */
  width: number;
  /** Base font size of a label in points (before Dynamic Type scaling). */
  fontSize: number;
  /** PixelRatio / useWindowDimensions().fontScale. */
  fontScale: number;
  /** Horizontal padding inside one segment, both sides together. */
  segmentPadding: number;
  /** Space between segments plus the control's own inner padding per column. */
  gap: number;
}

/** Average advance of a semibold UI glyph relative to font size (conservative, covers Vietnamese diacritics). */
export const GLYPH_WIDTH = 0.62;

/** Widest single word of a label, estimated in points. */
export function longestWordWidth(label: string, fontSize: number, fontScale: number): number {
  const words = label.split(/\s+/).filter(Boolean);
  const chars = words.reduce((max, w) => Math.max(max, [...w].length), 0);
  return chars * fontSize * fontScale * GLYPH_WIDTH;
}

/** Widest whole label on one line, estimated in points. */
export function labelWidth(label: string, fontSize: number, fontScale: number): number {
  return [...label.trim()].length * fontSize * fontScale * GLYPH_WIDTH;
}

/**
 * Columns for equal-width segments, given how wide each option must be
 * (its longest word on one line and its whole label within two lines,
 * plus padding). Prefers one row, then an even grid (2×2 rather than
 * 3 + 1), then one option per row.
 */
export function columnsForNeeds(needs: number[], width: number, gap: number): number {
  const n = needs.length;
  if (n <= 1 || width <= 0) return Math.max(1, n);
  const need = Math.max(...needs);
  for (let cols = n; cols > 1; cols--) {
    if (cols !== n && n % cols !== 0) continue;
    const each = (width - gap * (cols - 1)) / cols;
    if (each >= need) return cols;
  }
  return 1;
}

/** Width one option needs, from measured (or estimated) text widths. */
export function segmentNeed(longestWord: number, fullLabel: number, segmentPadding: number): number {
  return Math.max(longestWord, fullLabel / 2) + segmentPadding;
}

/**
 * Number of columns (1…labels.length) from estimated text widths. Used
 * before the real text has been measured, and in tests. Before the
 * control itself has been measured (`width` 0) it returns one column
 * per option.
 */
export function segmentColumns(input: SegmentLayoutInput): number {
  const { labels, width, fontSize, fontScale, segmentPadding, gap } = input;
  const needs = labels.map((l) =>
    segmentNeed(longestWordWidth(l, fontSize, fontScale), labelWidth(l, fontSize, fontScale), segmentPadding)
  );
  return columnsForNeeds(needs, width, gap);
}

/** Distinct words of the labels, for measuring. */
export function labelWords(labels: string[]): string[] {
  return [...new Set(labels.flatMap((l) => l.split(/\s+/).filter(Boolean)))];
}
