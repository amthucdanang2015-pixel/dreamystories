import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { PremiumColors } from '../../constants/theme';
import { StoryIllustration } from '../illustrations/StoryIllustration';

/**
 * A story's moonlit cover melting into the night sky: the art fills
 * the top of the paywall and fades out before the text begins.
 */
export function PaywallBackdrop({ coverKey, width, height }: { coverKey: string; width: number; height: number }) {
  const id = 'pw' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <View style={[styles.wrap, { height }]} pointerEvents="none">
      <View style={{ opacity: 0.78 }}>
        <StoryIllustration pageKey={coverKey} width={width} height={height} />
      </View>
      <View style={StyleSheet.absoluteFill}>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={PremiumColors.background} stopOpacity="0.35" />
              <Stop offset="45%" stopColor={PremiumColors.background} stopOpacity="0.15" />
              <Stop offset="90%" stopColor={PremiumColors.background} stopOpacity="1" />
              <Stop offset="100%" stopColor={PremiumColors.background} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width={width} height={height} fill={`url(#${id})`} />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' },
});
