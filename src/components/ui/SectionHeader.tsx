import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

/** Editorial section heading: small eyebrow, serif title, optional action. */
export function SectionHeader({
  eyebrow,
  title,
  actionLabel,
  onAction,
  inset,
}: {
  eyebrow?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Horizontal padding; defaults to the screen gutter. */
  inset?: number;
}) {
  const { type } = useTheme();
  const styles = useStyles();
  const { gutter } = useResponsiveLayout();
  return (
    <View style={[styles.row, { paddingHorizontal: inset ?? gutter }]}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={type.eyebrow}>{eyebrow}</Text> : null}
        <Text style={[type.heading, styles.title]} accessibilityRole="header">
          {title}
        </Text>
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={12} accessibilityRole="button" style={styles.actionHit}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const useStyles = createThemedStyles((t) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.gutter,
    marginBottom: Spacing.md - 2,
    gap: Spacing.md,
  },
  title: { marginTop: 3 },
  actionHit: { minHeight: 32, justifyContent: 'flex-end' },
  action: { fontSize: Typography.sm, fontWeight: '700', color: t.colors.textLink, paddingBottom: 2 },
}));
