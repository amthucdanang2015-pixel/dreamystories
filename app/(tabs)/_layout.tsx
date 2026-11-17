import React from 'react';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { BookOpen, Library, Settings, type LucideIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme';
import { StoryTabBar } from '../../src/components/ui/StoryTabBar';

/** Selected icons are filled with a soft sage wash and drawn a touch heavier. */
function TabIcon({ Icon, focused, color, size }: { Icon: LucideIcon; focused: boolean; color: ColorValue; size: number }) {
  const { tabBar } = useTheme();
  return (
    <Icon
      size={size}
      color={color as string}
      strokeWidth={focused ? 2.2 : 1.7}
      fill={focused ? tabBar.activeIconFill : 'none'}
    />
  );
}

function tabIcon(Icon: LucideIcon) {
  return (props: { focused: boolean; color: ColorValue; size: number }) => <TabIcon Icon={Icon} {...props} />;
}

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <StoryTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: t('tabs.stories'), tabBarIcon: tabIcon(BookOpen) }} />
      <Tabs.Screen name="library" options={{ title: t('tabs.library'), tabBarIcon: tabIcon(Library) }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.settings'), tabBarIcon: tabIcon(Settings) }} />
    </Tabs>
  );
}
