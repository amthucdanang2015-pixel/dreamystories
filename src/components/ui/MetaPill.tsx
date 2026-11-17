import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Palette, Typography } from '../../constants/theme';
import { createThemedStyles } from '../../theme';

/** Small icon + label fact (duration, age, pages…). */
export function MetaPill({
  icon,
  label,
  tone = 'paper',
}: {
  icon?: React.ReactNode;
  label: string;
  tone?: 'paper' | 'plain' | 'dark';
}) {
  const styles = useStyles();
  return (
    <View style={[styles.base, tone === 'paper' && styles.paper, tone === 'dark' && styles.dark]}>
      {icon}
      <Text style={[styles.text, tone === 'dark' && styles.textDark]}>{label}</Text>
    </View>
  );
}

const useStyles = createThemedStyles((t) => ({
  base: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  paper: {
    backgroundColor: t.colors.surfaceSunken,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
  },
  dark: {
    backgroundColor: Palette.overlay,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  text: { fontSize: Typography.xs, color: t.colors.textSecondary, fontWeight: '600' },
  textDark: { color: Palette.onOverlay },
}));
