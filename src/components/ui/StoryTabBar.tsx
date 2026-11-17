// ============================================================
// StoryTabBar — the bottom bar for Stories · Library · Settings.
//
// The selected tab never relies on colour alone. It gets:
//   • a soft sage pill behind the icon (shape cue)
//   • a filled icon with a heavier stroke (form cue)
//   • a bold label (weight cue)
//   • the richer ink-sage colour (colour cue)
// and `accessibilityState.selected`, so screen readers announce it.
// Inactive tabs are a quiet warm grey at regular weight.
// ============================================================

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Tabs } from 'expo-router';
import { Spacing, TouchTarget, Typography, BorderRadius } from '../../constants/theme';
import { createThemedStyles, useTheme } from '../../theme';

/** Props expo-router passes to a custom `tabBar`. */
export type StoryTabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

const ICON_SIZE = 22;
const PILL_W = 58;
const PILL_H = 30;

export function StoryTabBar({ state, descriptors, navigation, insets }: StoryTabBarProps) {
  const styles = useStyles();
  return (
    <View
      accessibilityRole="tablist"
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const label = typeof options.title === 'string' ? options.title : route.name;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

        return (
          <TabItem
            key={route.key}
            label={label}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            focused={focused}
            onPress={onPress}
            onLongPress={onLongPress}
            renderIcon={(color) =>
              options.tabBarIcon?.({ focused, color, size: ICON_SIZE }) ?? null
            }
          />
        );
      })}
    </View>
  );
}

function TabItem({
  label,
  accessibilityLabel,
  focused,
  onPress,
  onLongPress,
  renderIcon,
}: {
  label: string;
  accessibilityLabel: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  renderIcon: (color: string) => React.ReactNode;
}) {
  // The pill grows in from the icon's centre: a calm 180ms settle.
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: focused ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [focused, progress]);

  const { tabBar } = useTheme();
  const styles = useStyles();
  const color = focused ? tabBar.active : tabBar.inactive;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      aria-selected={focused}
      accessibilityLabel={accessibilityLabel}
      style={styles.item}
    >
      {({ pressed }) => (
        <>
          <View style={styles.iconWrap}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.pill,
                {
                  opacity: progress,
                  transform: [{ scaleX: progress.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }) }],
                },
              ]}
            />
            {pressed && !focused ? <View pointerEvents="none" style={[styles.pill, styles.pillPressed]} /> : null}
            {/* Own layer, so the icon always paints above the pill. */}
            <View style={styles.icon}>{renderIcon(color)}</View>
          </View>
          <Text
            style={[styles.label, { color }, focused ? styles.labelActive : styles.labelInactive]}
            numberOfLines={1}
            allowFontScaling
            maxFontSizeMultiplier={1.4}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const useStyles = createThemedStyles((t) => ({
  bar: {
    flexDirection: 'row',
    backgroundColor: t.tabBar.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.tabBar.border,
    paddingTop: 6,
    paddingHorizontal: Spacing.sm,
  },
  item: {
    flex: 1,
    minHeight: TouchTarget + 8,
    minWidth: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    // Web: show a pointer, and never show the browser's blue tap flash.
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : null),
  },
  iconWrap: {
    width: PILL_W,
    height: PILL_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.pill,
    backgroundColor: t.tabBar.indicator,
  },
  pillPressed: { backgroundColor: t.tabBar.pressed },
  icon: { zIndex: 1, alignItems: 'center', justifyContent: 'center' },
  label: {
    fontSize: Typography.xs - 0.5,
    letterSpacing: 0.2,
  },
  labelActive: { fontWeight: '700' },
  labelInactive: { fontWeight: '500' },
}));
