// ============================================================
// useSentenceAutoScroll — keeps the sentence being read near the top of a
// ScrollView while narration plays.
//
//   const auto = useSentenceAutoScroll(isNarrating);
//   <ScrollView ref={auto.scrollRef} {...auto.scrollViewProps}>
//     <SentenceAutoScrollProvider value={auto.context}>
//       <View ref={auto.contentRef} onLayout={auto.onContentLayout}>…</View>
//     </SentenceAutoScrollProvider>
//   </ScrollView>
//
// SentenceHighlight reports its active sentence through the nearest
// provider, so the paged layout (text scrolls inside each page) and the
// scroll layout (the whole story scrolls) share the same behaviour.
// The decisions themselves live in src/utils/sentenceAutoScroll.ts.
// ============================================================

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import {
  AccessibilityInfo,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {
  computeSentenceScrollTarget,
  decideAutoScroll,
  initialAutoScrollState,
  NEAR_TOP_BAND,
  PAGE_START_BAND,
} from '../utils/sentenceAutoScroll';

export interface ActiveSentenceReport {
  /** Unique within the scroll container (page id + sentence id). */
  key: string;
  node: View | null;
  /** First sentence of a page: keep the page's art in view when it fits. */
  pageStart?: boolean;
}

export interface SentenceAutoScrollContextValue {
  reportActiveSentence: (report: ActiveSentenceReport) => void;
  clearActiveSentence: (key: string) => void;
}

const SentenceAutoScrollContext = createContext<SentenceAutoScrollContextValue | null>(null);
export const SentenceAutoScrollProvider = SentenceAutoScrollContext.Provider;
export const useSentenceAutoScrollContext = () => useContext(SentenceAutoScrollContext);

/** How long an animated programmatic scroll is assumed to take. */
const PROGRAMMATIC_SCROLL_MS = 650;
/** A momentum scroll starting this soon after a drag ends is the reader's fling. */
const FLING_WINDOW_MS = 150;

export function useSentenceAutoScroll(enabled: boolean) {
  const scrollRef = useRef<ScrollView>(null);
  const contentRef = useRef<View>(null);

  const state = useRef(initialAutoScrollState());
  const active = useRef<ActiveSentenceReport | null>(null);
  const enabledRef = useRef(enabled);

  const offset = useRef(0);
  const programmatic = useRef<{ y: number; until: number } | null>(null);
  const viewportHeight = useRef(0);
  const contentHeight = useRef(0);
  /** Top of the content wrapper inside the scroll content (container padding). */
  const contentTop = useRef(0);
  const dragEndedAt = useRef(0);
  const userMomentum = useRef(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (mounted) reduceMotion.current = v;
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => {
      reduceMotion.current = v;
    });
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  const inProgrammaticScroll = () => {
    const p = programmatic.current;
    return !!p && Date.now() < p.until;
  };

  /** Where the list is, or where an in-flight programmatic scroll will land. */
  const effectiveOffset = () =>
    inProgrammaticScroll() ? programmatic.current!.y : offset.current;

  /** Programmatic scroll that is not mistaken for the reader's own. */
  const scrollTo = useCallback((y: number, animated = true) => {
    const anim = animated && !reduceMotion.current;
    programmatic.current = { y, until: Date.now() + (anim ? PROGRAMMATIC_SCROLL_MS : 120) };
    scrollRef.current?.scrollTo({ y, animated: anim });
    if (!anim) offset.current = y;
  }, []);

  const markInteraction = () => {
    state.current.lastInteractionAt = Date.now();
  };

  const process = useCallback(() => {
    const report = active.current;
    const content = contentRef.current;
    if (!enabledRef.current || !report?.node || !content) return;

    const decision = decideAutoScroll(state.current, report.key, Date.now());
    if (decision === 'same') return;
    if (decision === 'blocked') {
      // The reader is looking around: leave this sentence, resume on the next one.
      state.current.lastKey = report.key;
      return;
    }
    if (viewportHeight.current <= 0) return; // not laid out yet; retried on layout

    const { key, node, pageStart } = report;
    node.measureLayout(
      content,
      (_x, y, _w, h) => {
        if (!enabledRef.current || active.current?.key !== key) return;
        const again = decideAutoScroll(state.current, key, Date.now());
        if (again === 'same') return;
        state.current.lastKey = key;
        if (again === 'blocked') return;
        const target = computeSentenceScrollTarget({
          sentenceTop: contentTop.current + y,
          sentenceHeight: h,
          offset: effectiveOffset(),
          viewportHeight: viewportHeight.current,
          contentHeight: contentHeight.current,
          band: pageStart ? PAGE_START_BAND : NEAR_TOP_BAND,
        });
        if (target !== null) scrollTo(target);
      },
      () => {
        // Measurement can fail mid-transition; the next layout pass retries.
      }
    );
  }, [scrollTo]);

  // Narration (re)started: follow the current sentence again right away,
  // even if the reader had scrolled away while it was paused.
  useEffect(() => {
    enabledRef.current = enabled;
    state.current = initialAutoScrollState();
    if (enabled) process();
  }, [enabled, process]);

  const context = useMemo<SentenceAutoScrollContextValue>(
    () => ({
      reportActiveSentence: (report) => {
        active.current = report;
        process();
      },
      clearActiveSentence: (key) => {
        if (active.current?.key === key) active.current = null;
      },
    }),
    [process]
  );

  const onContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      contentTop.current = e.nativeEvent.layout.y;
      process();
    },
    [process]
  );

  const scrollViewProps = useMemo(
    () => ({
      scrollEventThrottle: 32,
      onLayout: (e: LayoutChangeEvent) => {
        const h = e.nativeEvent.layout.height;
        if (h <= 0) return; // hidden behind a sheet: keep the last real size
        if (viewportHeight.current > 0 && Math.abs(h - viewportHeight.current) >= 1) {
          // Rotation / resize: place the current sentence again for the new size.
          state.current.lastKey = null;
        }
        viewportHeight.current = h;
        process();
      },
      onContentSizeChange: (_w: number, h: number) => {
        contentHeight.current = h;
      },
      onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        offset.current = e.nativeEvent.contentOffset.y;
        // Web has no drag events for wheel/trackpad scrolling: any scroll we
        // did not start ourselves is the reader's.
        if (Platform.OS === 'web' && !inProgrammaticScroll()) markInteraction();
      },
      onTouchStart: markInteraction,
      onTouchEnd: markInteraction,
      onScrollBeginDrag: () => {
        programmatic.current = null;
        state.current.interacting = true;
        markInteraction();
      },
      onScrollEndDrag: () => {
        state.current.interacting = false;
        dragEndedAt.current = Date.now();
        markInteraction();
      },
      onMomentumScrollBegin: () => {
        if (Date.now() - dragEndedAt.current < FLING_WINDOW_MS) {
          userMomentum.current = true;
          state.current.interacting = true;
        }
      },
      onMomentumScrollEnd: () => {
        if (!userMomentum.current) return;
        userMomentum.current = false;
        state.current.interacting = false;
        markInteraction();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [process]
  );

  return { scrollRef, contentRef, context, onContentLayout, scrollViewProps, scrollTo };
}
