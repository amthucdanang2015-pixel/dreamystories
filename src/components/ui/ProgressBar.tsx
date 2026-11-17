import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme';

/** Thin rounded reading-progress track. value: 0..1 */
export function ProgressBar({
  value,
  color,
  track,
  height = 4,
}: {
  value: number;
  color?: string;
  track?: string;
  height?: number;
}) {
  const { colors } = useTheme();
  const fill = color ?? colors.gold;
  const trackColor = track ?? colors.track;
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      style={[styles.track, { backgroundColor: trackColor, height, borderRadius: height / 2 }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
    >
      <View style={{ width: `${pct * 100}%`, height, borderRadius: height / 2, backgroundColor: fill }} />
    </View>
  );
}

/** One segment per page; the current page is drawn longer. */
export function PageTrack({
  total,
  current,
  active,
  inactive,
  done,
}: {
  total: number;
  current: number;
  active: string;
  inactive: string;
  done?: string;
}) {
  return (
    <View style={styles.pageTrack}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.seg,
            {
              flex: i === current ? 2.4 : 1,
              backgroundColor: i === current ? active : i < current ? done ?? active : inactive,
              opacity: i < current ? 0.45 : 1,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  pageTrack: { flexDirection: 'row', gap: 4, alignItems: 'center', width: '100%' },
  seg: { height: 4, borderRadius: 2 },
});
