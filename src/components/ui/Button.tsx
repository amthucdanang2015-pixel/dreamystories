import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { BorderRadius, Spacing, TouchTarget } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Small line under the label, e.g. "Page 3 of 8". */
  detail?: string;
  color?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  disabled?: boolean;
  /** Shows a spinner in place of the icon and blocks presses. */
  loading?: boolean;
}

export function Button({
  label,
  onPress,
  icon,
  variant = 'primary',
  detail,
  color,
  textColor,
  style,
  accessibilityHint,
  disabled,
  loading,
}: ButtonProps) {
  const { colors, type } = useTheme();
  const styles = useStyles();
  const inactive = !!disabled || !!loading;
  const fg = textColor ?? (variant === 'primary' ? colors.onPrimary : colors.accent);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={detail ? `${label}, ${detail}` : label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: !!loading }}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && [styles.primary, color ? { backgroundColor: color } : null],
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        pressed && !inactive && styles.pressed,
        disabled && !loading && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : icon ? (
        <View style={styles.icon}>{icon}</View>
      ) : null}
      <View style={styles.labels}>
        <Text style={[type.button, styles.label, { color: fg }]} numberOfLines={2}>
          {label}
        </Text>
        {detail ? (
          <Text style={[styles.detail, styles.label, { color: fg }]} numberOfLines={2}>
            {detail}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const useStyles = createThemedStyles((t) => ({
  base: {
    minHeight: TouchTarget + 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.pill,
  },
  primary: {
    backgroundColor: t.colors.primary,
    ...t.shadow.button,
  },
  secondary: {
    backgroundColor: t.colors.surface,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  ghost: { backgroundColor: 'transparent', minHeight: TouchTarget },
  pressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.45 },
  icon: { alignItems: 'center', justifyContent: 'center' },
  // Shrinks next to the icon and lets long (Vietnamese / large-text) labels take two lines.
  labels: { alignItems: 'center', flexShrink: 1 },
  label: { textAlign: 'center' },
  detail: { fontSize: 12, opacity: 0.82, marginTop: 1, fontWeight: '500' },
}));
