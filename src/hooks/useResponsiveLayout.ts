import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { contentFrame, gutterFor, sizeClassFor, type ContentFrame, type SizeClass } from '../utils/responsiveLayout';

export interface ResponsiveLayout {
  width: number;
  height: number;
  fontScale: number;
  sizeClass: SizeClass;
  /** Phone-sized window: keep the original phone layouts. */
  isCompact: boolean;
  isLandscape: boolean;
  /** Screen gutter for this window (20 on phones, 32 on tablets). */
  gutter: number;
  /** A centred column at most `maxWidth` wide (gutters included). */
  frame: (maxWidth: number) => ContentFrame;
}

/** Window-size classes, gutters and centred columns for the current window. */
export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height, fontScale } = useWindowDimensions();
  return useMemo(() => {
    const sizeClass = sizeClassFor(width);
    const gutter = gutterFor(width);
    return {
      width,
      height,
      fontScale,
      sizeClass,
      isCompact: sizeClass === 'compact',
      isLandscape: width > height,
      gutter,
      frame: (maxWidth: number) => contentFrame(width, maxWidth, gutter),
    };
  }, [width, height, fontScale]);
}
