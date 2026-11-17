import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '../../theme';

/**
 * Warm paper (or night ink, in Dark) with a faint pool of moonlight in the
 * top corner. Sits behind tab screens; purely decorative.
 */
export function PaperBackdrop({ glow }: { glow?: string }) {
  const { colors } = useTheme();
  const tint = glow ?? colors.backdropGlow;
  const peak = colors.backdropGlowOpacity;
  const id = 'pb' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id={id} cx="88%" cy="0%" r="70%">
            <Stop offset="0" stopColor={tint} stopOpacity={peak} />
            <Stop offset="0.6" stopColor={tint} stopOpacity={peak * 0.22} />
            <Stop offset="1" stopColor={tint} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={100} height={100} fill={colors.background} />
        <Rect x={0} y={0} width={100} height={60} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
