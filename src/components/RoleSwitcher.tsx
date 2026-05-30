import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RoleKey, roleLabels } from '../constants/app';
import { colors, radius, spacing, typography } from '../constants/theme';

const roles: RoleKey[] = ['employee', 'itStaff', 'admin'];

type RoleSwitcherProps = {
  value: RoleKey;
  onChange: (role: RoleKey) => void;
};

export function RoleSwitcher({ value, onChange }: RoleSwitcherProps) {
  return (
    <View style={styles.wrap}>
      {roles.map((role) => {
        const selected = value === role;

        return (
          <Pressable
            key={role}
            onPress={() => onChange(role)}
            style={[styles.option, selected && styles.selectedOption]}
          >
            <Text style={[styles.optionText, selected && styles.selectedText]}>
              {roleLabels[role]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    alignItems: 'center',
    borderRadius: radius.pill,
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  optionText: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '800',
  },
  selectedOption: {
    backgroundColor: colors.blue,
  },
  selectedText: {
    color: colors.white,
  },
  wrap: {
    backgroundColor: colors.blueSoft,
    borderRadius: radius.pill,
    flexDirection: 'row',
    padding: 4,
  },
});
