import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '../constants/theme';

type AppInputProps = TextInputProps & {
  label: string;
  inputStyle?: StyleProp<TextStyle>;
  showPasswordToggle?: boolean;
};

export function AppInput({
  label,
  inputStyle,
  secureTextEntry,
  showPasswordToggle,
  ...props
}: AppInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const canTogglePassword = Boolean(showPasswordToggle ?? secureTextEntry);
  const isSecureEntry = canTogglePassword ? !passwordVisible : secureTextEntry;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputShell}>
        <TextInput
          placeholderTextColor={colors.muted}
          secureTextEntry={isSecureEntry}
          style={[styles.input, canTogglePassword && styles.passwordInput, inputStyle]}
          {...props}
        />
        {canTogglePassword ? (
          <Pressable
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => setPasswordVisible((current) => !current)}
            style={styles.passwordToggle}
          >
            <Ionicons
              color={colors.muted}
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  input: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.body,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 52,
  },
  label: {
    color: colors.blueDark,
    fontSize: typography.label,
    fontWeight: '800',
  },
  passwordInput: {
    paddingRight: spacing.sm,
  },
  passwordToggle: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
});
