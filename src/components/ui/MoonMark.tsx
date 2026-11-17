import React from 'react';
import Svg, { Circle, Defs, Mask, Rect } from 'react-native-svg';
import { useTheme } from '../../theme';

/** The StoryMoon crescent: a quiet brand mark (not an emoji, not a stock icon). */
export function MoonMark({
  size = 40,
  color,
  halo,
}: {
  size?: number;
  color?: string;
  halo?: string;
}) {
  const { colors } = useTheme();
  const fill = color ?? colors.gold;
  const glow = halo ?? colors.goldHalo;
  const id = 'mm' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Defs>
        <Mask id={id}>
          <Rect x={0} y={0} width={40} height={40} fill="#fff" />
          <Circle cx={25} cy={15} r={11} fill="#000" />
        </Mask>
      </Defs>
      <Circle cx={20} cy={20} r={19} fill={glow} />
      <Circle cx={20} cy={20} r={12} fill={fill} mask={`url(#${id})`} />
      <Circle cx={30} cy={11} r={1.2} fill={fill} />
      <Circle cx={33} cy={18} r={0.8} fill={fill} />
    </Svg>
  );
}
