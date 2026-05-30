import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, shadow, spacing } from '../constants/theme';

type AppCardProps = PropsWithChildren<{
  style?: ViewStyle;
}>;

export function AppCard({ children, style }: AppCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    ...shadow,
  },
});
