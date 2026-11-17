import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Spacing, Typography } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';

/** Editorial section heading: small eyebrow, serif title, optional action. */
export function SectionHeader({
  eyebrow,
  title,
  actionLabel,
  onAction,
}: {
  eyebrow?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { type } = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={type.eyebrow}>{eyebrow}</Text> : null}
        <Text style={[type.heading, styles.title]} accessibilityRole="header">
          {title}
        </Text>
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={10} accessibilityRole="button">
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
  action: { fontSize: Typography.sm, fontWeight: '700', color: t.colors.textLink, paddingBottom: 2 },
}));
