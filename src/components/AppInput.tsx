import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors, radius, spacing, typography } from '../constants/theme';

type AppInputProps = TextInputProps & {
  label: string;
};

export function AppInput({ label, ...props }: AppInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: typography.body,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  label: {
    color: colors.blueDark,
    fontSize: typography.label,
    fontWeight: '800',
  },
});
