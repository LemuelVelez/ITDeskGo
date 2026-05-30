import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../constants/theme';

type SectionHeaderProps = {
  title: string;
  action?: string;
};

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    color: colors.blue,
    fontSize: typography.label,
    fontWeight: '800',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontSize: typography.subtitle,
    fontWeight: '900',
  },
});
