import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { PremiumColors } from '../../constants/theme';
import { StoryIllustration } from '../illustrations/StoryIllustration';

/**
 * A story's moonlit cover melting into the night sky.
 *   band  — fills the top of the paywall and fades out before the text begins.
 *   panel — fills a tablet's story side top to bottom; darkens toward the
 *           bottom (where the promise sits) and melts into the plans side.
 */
export function PaywallBackdrop({
  coverKey,
  width,
  height,
  variant = 'band',
}: {
  coverKey: string;
  width: number;
  height: number;
  variant?: 'band' | 'panel';
}) {
  const id = 'pw' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const panel = variant === 'panel';
  return (
    <View style={[styles.wrap, { height }, panel && styles.panel]} pointerEvents="none">
      <View style={{ opacity: 0.78 }}>
        <StoryIllustration pageKey={coverKey} width={width} height={height} />
      </View>
      <View style={StyleSheet.absoluteFill}>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              {(panel ? PANEL_STOPS : BAND_STOPS).map(([offset, opacity]) => (
                <Stop key={offset} offset={offset} stopColor={PremiumColors.background} stopOpacity={opacity} />
              ))}
            </LinearGradient>
          </Defs>
          {panel ? (
            <Defs>
              <LinearGradient id={`${id}x`} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor={PremiumColors.background} stopOpacity="0" />
                <Stop offset="78%" stopColor={PremiumColors.background} stopOpacity="0" />
                <Stop offset="100%" stopColor={PremiumColors.background} stopOpacity="1" />
              </LinearGradient>
            </Defs>
          ) : null}
          <Rect width={width} height={height} fill={`url(#${id})`} />
          {panel ? <Rect width={width} height={height} fill={`url(#${id}x)`} /> : null}
        </Svg>
      </View>
    </View>
  );
}

const BAND_STOPS: [string, string][] = [
  ['0%', '0.35'],
  ['45%', '0.15'],
  ['90%', '1'],
  ['100%', '1'],
];
// The promise and benefits sit on the lower part of the panel: keep it dark there.
const PANEL_STOPS: [string, string][] = [
  ['0%', '0.3'],
  ['25%', '0.06'],
  ['45%', '0.55'],
  ['65%', '0.9'],
  ['100%', '1'],
];

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' },
  panel: { bottom: 0 },
});
