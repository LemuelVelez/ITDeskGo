import { StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography } from '../constants/theme';

type BadgeTone = 'blue' | 'yellow' | 'green' | 'red' | 'neutral';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return <Text style={[styles.badge, styles[tone]]}>{label}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    fontSize: typography.small,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  blue: {
    backgroundColor: colors.blueSoft,
    color: colors.blue,
  },
  green: {
    backgroundColor: '#DCFCE7',
    color: colors.success,
  },
  neutral: {
    backgroundColor: colors.surface,
    color: colors.muted,
  },
  red: {
    backgroundColor: '#FEE2E2',
    color: colors.danger,
  },
  yellow: {
    backgroundColor: colors.yellowSoft,
    color: colors.blueDark,
  },
});
