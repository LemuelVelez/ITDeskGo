import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { colors, radius } from '../constants/theme';

type SymbolName = SymbolViewProps['name'];

export type TabIconName =
  | 'home'
  | 'dashboard'
  | 'tickets'
  | 'assets'
  | 'knowledge'
  | 'profile'
  | 'users'
  | 'settings';

type TabIconProps = {
  name: TabIconName;
  color: SymbolViewProps['tintColor'];
  focused: boolean;
};

type TabIconConfig = {
  active: SymbolName;
  inactive: SymbolName;
};

const icons: Record<TabIconName, TabIconConfig> = {
  home: {
    active: { ios: 'house.fill', android: 'home', web: 'home' },
    inactive: { ios: 'house', android: 'home', web: 'home' },
  },
  dashboard: {
    active: { ios: 'chart.bar.fill', android: 'dashboard', web: 'dashboard' },
    inactive: { ios: 'chart.bar', android: 'dashboard', web: 'dashboard' },
  },
  tickets: {
    active: { ios: 'ticket.fill', android: 'confirmation_number', web: 'confirmation_number' },
    inactive: { ios: 'ticket', android: 'confirmation_number', web: 'confirmation_number' },
  },
  assets: {
    active: { ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' },
    inactive: { ios: 'shippingbox', android: 'inventory_2', web: 'inventory_2' },
  },
  knowledge: {
    active: { ios: 'book.closed.fill', android: 'menu_book', web: 'menu_book' },
    inactive: { ios: 'book.closed', android: 'menu_book', web: 'menu_book' },
  },
  profile: {
    active: { ios: 'person.crop.circle.fill', android: 'account_circle', web: 'account_circle' },
    inactive: { ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' },
  },
  users: {
    active: { ios: 'person.2.fill', android: 'group', web: 'group' },
    inactive: { ios: 'person.2', android: 'group', web: 'group' },
  },
  settings: {
    active: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
    inactive: { ios: 'gearshape', android: 'settings', web: 'settings' },
  },
};

export function TabIcon({ name, color, focused }: TabIconProps) {
  const icon = icons[name];

  return (
    <View style={[styles.wrap, focused && styles.focused]}>
      <SymbolView
        name={focused ? icon.active : icon.inactive}
        tintColor={color}
        size={22}
        type={focused ? 'hierarchical' : 'monochrome'}
        style={styles.symbol}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  focused: {
    backgroundColor: colors.yellowSoft,
  },
  symbol: {
    height: 22,
    width: 22,
  },
  wrap: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 34,
    justifyContent: 'center',
    width: 46,
  },
});
