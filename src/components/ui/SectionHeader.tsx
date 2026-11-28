import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Spacing, Typography, TouchTarget } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

/** Expand/collapse control for a section's content. */
export interface SectionCollapse {
  expanded: boolean;
  onToggle: () => void;
  /** Screen-reader label for the control, e.g. "Hide Free Stories". */
  accessibilityLabel: string;
}

/** Editorial section heading: small eyebrow, serif title, optional action. */
export function SectionHeader({
  eyebrow,
  title,
  actionLabel,
  onAction,
  inset,
  collapse,
}: {
  eyebrow?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Horizontal padding; defaults to the screen gutter. */
  inset?: number;
  /** Adds a chevron that collapses or expands the section. */
  collapse?: SectionCollapse;
}) {
  const { type, colors } = useTheme();
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
      {collapse ? (
        <Pressable
          onPress={collapse.onToggle}
          accessibilityRole="button"
          accessibilityLabel={collapse.accessibilityLabel}
          accessibilityState={{ expanded: collapse.expanded }}
          style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
        >
          <ChevronDown
            size={20}
            color={colors.textSecondary}
            strokeWidth={2.2}
            style={collapse.expanded ? styles.chevronUp : undefined}
          />
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
  toggle: {
    width: TouchTarget,
    height: TouchTarget,
    borderRadius: TouchTarget / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: t.colors.border,
    backgroundColor: t.colors.surface,
  },
  togglePressed: { opacity: 0.7 },
  chevronUp: { transform: [{ rotate: '180deg' }] },
}));
