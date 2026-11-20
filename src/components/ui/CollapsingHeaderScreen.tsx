// ============================================================
// CollapsingHeaderScreen — native-style large title for tab screens.
//
//   ┌──────────────────────────────┐  fixed compact bar (safe area aware):
//   │ Library          [⌕] [mark]  │  actions + brand mark always visible;
//   ├──────────────────────────────┤  title + paper fill fade in on scroll
//   │ THƯ VIỆN                     │
//   │ Library        ← large title │  scrolls up beneath the bar and fades
//   │ 11 stories …                 │
//   ├──────────────────────────────┤
//   │ [All | Reading | Finished]   │  optional `sticky` row: pins under the
//   ├──────────────────────────────┤  bar once it reaches it
//   │ content …                    │
//
// Everything is driven by one Animated scroll value on the native driver
// (opacity / transform only), so collapsing never re-renders or jumps.
// ============================================================

import React, { useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Typography } from '../../constants/theme';
import { createThemedStyles } from '../../theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { BrandMark } from './BrandMark';
import { PaperBackdrop } from './PaperBackdrop';

/** Height of the compact bar below the status bar / notch. */
export const COMPACT_BAR_HEIGHT = 52;
const BRAND_SIZE = 30;

interface CollapsingHeaderScreenProps {
  /** Shown in the compact bar once the large header has scrolled away. */
  compactTitle: string;
  /** The large editorial header (usually <ScreenHeader />). */
  header: React.ReactNode;
  /** Bar buttons, left of the brand mark (e.g. search). Always visible. */
  actions?: React.ReactNode;
  /** A row that pins beneath the compact bar (e.g. a primary filter). */
  sticky?: React.ReactNode;
  children: React.ReactNode;
  /** Max content width (centred on tablets). */
  maxWidth?: number;
  contentPaddingBottom?: number;
  /** For programmatic scrolling (e.g. back to the top to reveal search). */
  scrollRef?: React.Ref<ScrollView>;
  scrollViewProps?: Omit<ScrollViewProps, 'onScroll' | 'contentContainerStyle' | 'children'>;
}

export function CollapsingHeaderScreen({
  compactTitle,
  header,
  actions,
  sticky,
  children,
  maxWidth,
  contentPaddingBottom = Spacing.xxl,
  scrollRef,
  scrollViewProps,
}: CollapsingHeaderScreenProps) {
  const insets = useSafeAreaInsets();
  const styles = useStyles();
  const { gutter } = useResponsiveLayout();
  const barH = insets.top + COMPACT_BAR_HEIGHT;
  const scrollY = useRef(new Animated.Value(0)).current;
  // Measured once laid out; sensible defaults avoid a first-frame jump.
  const [headerH, setHeaderH] = useState(120);
  const [stickyY, setStickyY] = useState<number | null>(null);

  const onHeaderLayout = (e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h > 0 && h !== headerH) setHeaderH(h);
  };
  const onStickyLayout = (e: LayoutChangeEvent) => {
    const y = Math.round(e.nativeEvent.layout.y);
    if (y !== stickyY) setStickyY(y);
  };

  // The large header collapses over its own height: it fades as it slides
  // under the bar, then the compact title and the bar's paper fill arrive.
  const collapseEnd = Math.max(headerH * 0.8, 40);
  const largeOpacity = scrollY.interpolate({
    inputRange: [0, collapseEnd * 0.7],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const compactOpacity = scrollY.interpolate({
    inputRange: [collapseEnd * 0.6, collapseEnd],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const compactLift = scrollY.interpolate({
    inputRange: [collapseEnd * 0.6, collapseEnd],
    outputRange: [6, 0],
    extrapolate: 'clamp',
  });
  const barFill = scrollY.interpolate({
    inputRange: [0, collapseEnd * 0.5],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  // The bar's hairline appears once collapsed; with a sticky row the row
  // carries the hairline instead, so the two read as one surface.
  const hairline = scrollY.interpolate({
    inputRange: [collapseEnd * 0.8, collapseEnd],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Sticky row: rides with the content until its top meets the bar, then
  // counter-translates so it stays put (same technique as RN's sticky headers).
  // stickyY is measured inside the content (which starts with barH of padding),
  // so the row meets the bar's bottom edge at scrollY = stickyY - barH.
  const stickyStart = stickyY === null ? Number.MAX_SAFE_INTEGER / 4 : Math.max(stickyY - barH, 0);
  const stickyTranslate = scrollY.interpolate({
    inputRange: [stickyStart, stickyStart + 1],
    outputRange: [0, 1],
    extrapolateLeft: 'clamp',
  });
  const stickyFill = scrollY.interpolate({
    inputRange: [stickyStart - 12, stickyStart],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const centred = maxWidth ? { width: '100%' as const, maxWidth, alignSelf: 'center' as const } : null;

  return (
    <View style={styles.screen}>
      <PaperBackdrop />

      <Animated.ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        {...scrollViewProps}
        // Content scrolls beneath the bar and the status bar.
        scrollIndicatorInsets={{ top: barH }}
        contentContainerStyle={{ paddingTop: barH, paddingBottom: contentPaddingBottom }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
      >
        <Animated.View style={[centred, { opacity: largeOpacity }]} onLayout={onHeaderLayout}>
          {header}
        </Animated.View>

        {sticky ? (
          <Animated.View
            onLayout={onStickyLayout}
            style={[styles.sticky, { transform: [{ translateY: stickyTranslate }] }]}
          >
            <Animated.View style={[StyleSheet.absoluteFill, styles.stickyFill, { opacity: stickyFill }]} />
            <View style={centred}>{sticky}</View>
          </Animated.View>
        ) : null}

        {children}
      </Animated.ScrollView>

      {/* Compact bar, fixed above the content. */}
      <View style={[styles.bar, { height: barH, paddingTop: insets.top }]} pointerEvents="box-none">
        <Animated.View style={[StyleSheet.absoluteFill, styles.barFill, { opacity: barFill }]} />
        {sticky ? null : <Animated.View style={[styles.hairline, { opacity: hairline }]} />}
        <View style={[styles.barRow, { paddingLeft: gutter, paddingRight: gutter - 6 }, centred]} pointerEvents="box-none">
          <Animated.View
            style={[styles.compactTitleWrap, { opacity: compactOpacity, transform: [{ translateY: compactLift }] }]}
            // The large title is the screen's heading; this copy is visual only.
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
          >
            <Text style={styles.compactTitle} numberOfLines={1} maxFontSizeMultiplier={1.4}>
              {compactTitle}
            </Text>
          </Animated.View>
          <View style={styles.actions}>
            {actions}
            <View style={styles.brandSlot}>
              <BrandMark size={BRAND_SIZE} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const useStyles = createThemedStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  bar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, elevation: 0 },
  // Opaque: dark illustrations scrolling beneath must not show through.
  barFill: { backgroundColor: t.colors.background },
  hairline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: t.colors.border,
  },
  barRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  compactTitleWrap: { flex: 1 },
  compactTitle: {
    fontFamily: Typography.serif,
    fontSize: Typography.lg,
    fontWeight: '700',
    color: t.colors.textPrimary,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  // 44×44 slot so the mark lines up with 44pt buttons on every tab.
  brandSlot: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  sticky: { zIndex: 5, paddingVertical: Spacing.sm },
  stickyFill: {
    backgroundColor: t.colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: t.colors.border,
  },
}));
