import { StyleSheet, Text, View } from 'react-native';

import { Metric } from '../constants/app';
import { colors, radius, spacing, typography } from '../constants/theme';

type MetricCardProps = {
  metric: Metric;
};

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <View style={[styles.card, styles[metric.tone]]}>
      <Text style={[styles.value, metric.tone === 'blue' && styles.blueValue]}>{metric.value}</Text>
      <Text style={[styles.label, metric.tone === 'blue' && styles.blueLabel]}>{metric.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  blue: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  blueLabel: {
    color: colors.white,
    opacity: 0.88,
  },
  blueValue: {
    color: colors.white,
  },
  card: {
    borderColor: colors.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    minWidth: 104,
    padding: spacing.md,
  },
  label: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  value: {
    color: colors.blueDark,
    fontSize: 26,
    fontWeight: '900',
  },
  white: {
    backgroundColor: colors.white,
  },
  yellow: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellow,
  },
});
