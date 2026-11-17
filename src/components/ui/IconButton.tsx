import React from 'react';
import { Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Palette, TouchTarget } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';

type Variant = 'plain' | 'outline' | 'soft' | 'overlay';

interface IconButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: number;
  disabled?: boolean;
  /** Override colours for themed surfaces (e.g. bedtime reader). */
  borderColor?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

/** Round icon button with a guaranteed 44pt touch target. */
export function IconButton({
  onPress,
  accessibilityLabel,
  accessibilityHint,
  children,
  variant = 'plain',
  size = 40,
  disabled,
  borderColor,
  backgroundColor,
  style,
}: IconButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const pad = Math.max(0, (TouchTarget - size) / 2);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={pad}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        variant === 'outline' && [styles.outline, borderColor ? { borderColor } : null],
        variant === 'soft' && { backgroundColor: backgroundColor ?? colors.surfaceSunken },
        variant === 'overlay' && styles.overlay,
        backgroundColor && variant !== 'soft' ? { backgroundColor } : null,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const useStyles = createThemedStyles((t) => ({
  base: { alignItems: 'center', justifyContent: 'center' },
  outline: { borderWidth: 1, borderColor: t.colors.border },
  // Over illustrations: always a dark ink disc, whatever the scheme.
  overlay: { backgroundColor: Palette.overlaySoft },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  disabled: { opacity: 0.4 },
}));
