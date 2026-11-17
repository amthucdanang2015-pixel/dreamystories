import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';
import { MoonMark } from './MoonMark';

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message?: string;
  action?: React.ReactNode;
}) {
  const { type } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.wrap} accessibilityRole="summary">
      <MoonMark size={56} />
      <Text style={[type.heading, styles.title]}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {action}
    </View>
  );
}

const useStyles = createThemedStyles((t) => ({
  wrap: { alignItems: 'center', paddingVertical: Spacing.xxl, paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  title: { textAlign: 'center', marginTop: Spacing.sm },
  message: {
    fontSize: Typography.base,
    color: t.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
}));
