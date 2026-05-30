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
        tabBarItemStyle: {
          borderRadius: radius.lg,
          paddingVertical: spacing.xs,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
          marginTop: 2,
        },
        tabBarStyle: {
          ...shadow,
          backgroundColor: colors.white,
          borderRadius: radius.lg,
          borderTopWidth: 0,
          bottom: spacing.md,
          height: 72,
          left: spacing.md,
          paddingBottom: spacing.sm,
          paddingHorizontal: spacing.xs,
          paddingTop: spacing.sm,
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
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name={tab.icon} color={color} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
