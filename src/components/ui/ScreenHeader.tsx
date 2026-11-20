import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

/** Large editorial title block of a tab screen (sits under CollapsingHeaderScreen's compact bar). */
export function ScreenHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  const { type } = useTheme();
  const styles = useStyles();
  const { gutter } = useResponsiveLayout();
  return (
    <View style={[styles.block, { paddingHorizontal: gutter }]}>
      {eyebrow ? <Text style={[type.eyebrow, styles.eyebrow]}>{eyebrow}</Text> : null}
      <Text style={type.title} accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const useStyles = createThemedStyles((t) => ({
  block: {
    paddingHorizontal: Spacing.gutter,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  eyebrow: { color: t.colors.textAccent, marginBottom: 6 },
  subtitle: { fontSize: Typography.base, color: t.colors.textSecondary, marginTop: 6, lineHeight: 22 },
}));
