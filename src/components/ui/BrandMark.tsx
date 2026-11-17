import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Mask, Path, Rect } from 'react-native-svg';
import { Palette } from '../../constants/theme';
import { useTheme } from '../../theme';

const SAGE = Palette.sage; // the mark's book cover (app icon / splash)

/**
 * The StoryMoon mark: crescent moon over an open storybook, the same
 * drawing as the app icon and splash (scripts/splash/generate-splash.swift),
 * simplified for small sizes. Decorative: hidden from screen readers.
 */
export function BrandMark({ size = 30 }: { size?: number }) {
  const { isDark } = useTheme();
  // Pages stay paper-white on light; at night they soften to candlelight so the mark doesn't glare.
  const pages = isDark ? Palette.candle : Palette.warmWhite;
  const id = 'bm' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <View
      style={{ width: size, height: size }}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
    >
      {/* Icon space is 1024 units; the mark spans x 160–864, y 40–790. */}
      <Svg width={size} height={size} viewBox="137 40 750 750">
        <Defs>
          <Mask id={id}>
            <Rect x={0} y={0} width={1024} height={1024} fill="#fff" />
            <Circle cx={590} cy={172} r={160} fill="#000" />
          </Mask>
        </Defs>
        <Circle cx={512} cy={230} r={190} fill={Palette.gold} mask={`url(#${id})`} />
        {/* Cover, then pages, mirrored about the spine. */}
        <Path d="M160 488 C290 456 420 476 512 523 L512 760 C420 738 280 748 160 790 Z" fill={SAGE} />
        <Path d="M864 488 C734 456 604 476 512 523 L512 760 C604 738 744 748 864 790 Z" fill={SAGE} />
        <Path d="M200 520 C310 496 430 516 508 560 L508 738 C430 702 310 704 200 736 Z" fill={pages} />
        <Path d="M824 520 C714 496 594 516 516 560 L516 738 C594 702 714 704 824 736 Z" fill={pages} />
        <Rect x={504} y={556} width={16} height={184} fill={Palette.gold} />
      </Svg>
    </View>
  );
}
