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

const tabBarInset = spacing.md;
const tabBarPadding = spacing.xs;
const tabBarHeight = 64;

export function AppTabs({ tabs }: AppTabsProps) {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted,
        tabBarShowLabel: false,
        tabBarIconStyle: {
          alignItems: 'center',
          flex: 1,
          height: '100%',
          justifyContent: 'center',
          marginTop: 0,
          width: '100%',
        },
        tabBarItemStyle: {
          alignItems: 'center',
          borderRadius: radius.lg,
          height: '100%',
          justifyContent: 'center',
          padding: 0,
        },
        tabBarLabelStyle: {
          display: 'none',
        },
        tabBarStyle: {
          ...shadow,
          backgroundColor: colors.white,
          borderRadius: radius.lg,
          borderTopWidth: 0,
          bottom: tabBarInset,
          height: tabBarHeight,
          left: 0,
          marginHorizontal: tabBarInset,
          padding: tabBarPadding,
          position: 'absolute',
          right: 0,
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
