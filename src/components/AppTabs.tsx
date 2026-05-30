import { Tabs } from 'expo-router';

import { colors, radius, shadow, spacing } from '../constants/theme';
import { TabIcon, type TabIconName } from './TabIcon';

type AppTabItem = {
  name: string;
  title: string;
  icon: TabIconName;
};

type AppTabsProps = {
  tabs: readonly AppTabItem[];
};

export function AppTabs({ tabs }: AppTabsProps) {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          alignItems: 'center',
          borderRadius: radius.lg,
          justifyContent: 'center',
          paddingVertical: 0,
        },
        tabBarStyle: {
          ...shadow,
          backgroundColor: colors.white,
          borderRadius: radius.lg,
          borderTopWidth: 0,
          bottom: spacing.md,
          height: 64,
          left: spacing.md,
          paddingBottom: spacing.xs,
          paddingHorizontal: spacing.xs,
          paddingTop: spacing.xs,
          position: 'absolute',
          right: spacing.md,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarAccessibilityLabel: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name={tab.icon} color={color} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
