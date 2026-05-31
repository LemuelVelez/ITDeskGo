import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../constants/theme';
import { AppButton } from './AppButton';

type ResourceStateProps = {
  loading: boolean;
  error: string;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
};

export function ResourceState({ loading, error, empty = false, emptyMessage = 'No records found.', onRetry }: ResourceStateProps) {
  if (loading) {
    return <Text style={styles.message}>Loading records...</Text>;
  }

  if (error) {
    return (
      <View style={styles.panel}>
        <Text style={styles.error}>{error}</Text>
        {onRetry ? <AppButton title="Retry" variant="secondary" onPress={onRetry} style={styles.button} /> : null}
      </View>
    );
  }

  if (empty) {
    return <Text style={styles.message}>{emptyMessage}</Text>;
  }

  return null;
}

const styles = StyleSheet.create({
  button: {
    minHeight: 42,
  },
  error: {
    color: colors.danger,
    fontSize: typography.label,
    fontWeight: '800',
    lineHeight: 20,
  },
  message: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.muted,
    fontSize: typography.body,
    fontWeight: '700',
    padding: spacing.md,
    textAlign: 'center',
  },
  panel: {
    backgroundColor: '#FEE2E2',
    borderRadius: radius.md,
    gap: spacing.md,
    padding: spacing.md,
  },
});
