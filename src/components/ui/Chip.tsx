import React, { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { BorderRadius, Typography } from '../../constants/theme';
import { createThemedStyles } from '../../theme';
import { columnsForNeeds, labelWidth, labelWords, longestWordWidth, segmentNeed } from '../../utils/segmentLayout';

/** Selectable pill used for filters and multi-choice settings. */
export function Chip({
  label,
  active,
  onPress,
  count,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  count?: number;
}) {
  const styles = useStyles();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      hitSlop={4}
      style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && { opacity: 0.8 }]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
      {typeof count === 'number' ? (
        <Text style={[styles.count, active && styles.countActive]}>{count}</Text>
      ) : null}
    </Pressable>
  );
}

const SEGMENT_FONT = Typography.sm;
const SEGMENT_PAD_X = 12;
const ROW_PAD = 3;
const ROW_GAP = 2;
const FILL_PAD_X = 8;

/**
 * Segmented control (2–4 short options).
 *
 * Hugs its labels when they fit on one line. When they don't (narrow
 * phone, Display Zoom, large text, long Vietnamese labels) it fills the
 * row with equal-width segments whose labels may wrap onto two lines,
 * and if even that is too tight the options flow into a 2×2 grid or
 * one per row (see utils/segmentLayout). Nothing is clipped or hidden
 * and the text is never shrunk below the user's text size.
 */
export function Segmented({
  options,
  value,
  onChange,
  accessibilityLabel,
}: {
  options: [string, string][];
  value: string;
  onChange: (v: string) => void;
  accessibilityLabel?: string;
}) {
  const styles = useStyles();
  const { fontScale } = useWindowDimensions();
  const [width, setWidth] = useState(0);
  // Real rendered widths (labels and single words), measured off-screen.
  // Text size settings, fonts and diacritics all make estimates unreliable.
  const [measured, setMeasured] = useState<Record<string, number>>({});
  const labels = options.map(([, l]) => l);
  const words = labelWords(labels);
  const keys = [...labels.map((l) => `l:${l}`), ...words.map((w) => `w:${w}`)];
  const ready = keys.every((k) => measured[k] !== undefined);

  const record = (key: string, w: number) =>
    setMeasured((m) => (m[key] !== undefined && Math.abs(m[key] - w) < 0.5 ? m : { ...m, [key]: w }));

  const labelW = (l: string) => (ready ? measured[`l:${l}`] : labelWidth(l, SEGMENT_FONT, fontScale));
  const wordW = (l: string) =>
    ready
      ? Math.max(...l.split(/\s+/).filter(Boolean).map((w) => measured[`w:${w}`]))
      : longestWordWidth(l, SEGMENT_FONT, fontScale);

  const inner = width - ROW_PAD * 2;
  const natural =
    labels.reduce((sum, l) => sum + labelW(l) + SEGMENT_PAD_X * 2 + 1, 0) + ROW_GAP * (labels.length - 1);
  const hug = width > 0 && natural <= inner;
  const columns = hug
    ? labels.length
    : columnsForNeeds(
        labels.map((l) => segmentNeed(wordW(l) + 1, labelW(l), FILL_PAD_X * 2)),
        inner,
        ROW_GAP
      );
  const grid = !hug && columns < labels.length;
  // Equal columns in points (percentage flexBasis is not reliable in a wrapping row).
  const segmentW = Math.floor((inner - ROW_GAP * (columns - 1)) / columns);

  return (
    <View style={styles.segmentWrap} onLayout={(e) => setWidth(Math.round(e.nativeEvent.layout.width))}>
      <View
        style={[styles.segmentRow, !hug && styles.segmentRowFill, grid && styles.segmentRowGrid]}
        accessibilityRole="radiogroup"
        accessibilityLabel={accessibilityLabel}
      >
        {options.map(([v, label]) => {
          const active = v === value;
          return (
            <Pressable
              key={v}
              style={[
                styles.segment,
                !hug && (width > 0 ? { width: segmentW } : { flex: 1 }),
                !hug && { paddingHorizontal: FILL_PAD_X },
                grid && styles.segmentGrid,
                active && styles.segmentActive,
              ]}
              onPress={() => onChange(v)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active, checked: active }}
              accessibilityLabel={label}
            >
              <Text
                style={[styles.segmentText, !hug && styles.segmentTextWrap, active && styles.segmentTextActive]}
                numberOfLines={hug ? 1 : 2}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Invisible measuring row: same font as the labels, never wraps. */}
      <View
        style={styles.measure}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {keys.map((k) => (
          <Text
            key={k}
            style={[styles.segmentText, styles.segmentTextActive, styles.measureText]}
            numberOfLines={1}
            onLayout={(e) => record(k, e.nativeEvent.layout.width)}
          >
            {k.slice(2)}
          </Text>
        ))}
      </View>
    </View>
  );
}

const useStyles = createThemedStyles((t) => ({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.pill,
    backgroundColor: t.colors.surface,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  chipActive: { backgroundColor: t.colors.primary, borderColor: t.colors.primary },
  chipText: { fontSize: Typography.sm, color: t.colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: t.colors.onPrimary },
  count: { fontSize: Typography.xs, color: t.colors.textMuted, fontWeight: '600' },
  countActive: { color: t.colors.onPrimaryMuted },
  segmentWrap: { alignSelf: 'stretch' },
  measure: { position: 'absolute', top: 0, left: 0, width: 4000, opacity: 0, alignItems: 'flex-start' },
  measureText: { alignSelf: 'flex-start' },
  segmentRow: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: t.colors.surfaceSunken,
    borderRadius: BorderRadius.pill,
    padding: ROW_PAD,
    gap: ROW_GAP,
  },
  segmentRowFill: { alignSelf: 'stretch', flexWrap: 'wrap', borderRadius: BorderRadius.xl },
  segmentRowGrid: { rowGap: ROW_GAP },
  segment: {
    minHeight: 34,
    minWidth: 44,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    // Dark: the thumb lifts by tone (a lighter chip), not by shadow.
    backgroundColor: t.isDark ? t.colors.borderStrong : t.colors.surface,
    ...t.shadow.hairline,
  },
  segmentGrid: { borderRadius: BorderRadius.lg },
  segmentText: { fontSize: SEGMENT_FONT, fontWeight: '600', color: t.colors.textMuted },
  segmentTextWrap: { textAlign: 'center', paddingVertical: 6 },
  segmentTextActive: { color: t.colors.textPrimary },
}));
