import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '../constants/theme';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function AppButton({ title, onPress, variant = 'primary', style, disabled = false }: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, textStyles[variant], disabled && styles.disabledText]}>{title}</Text>
    </Pressable>
  );
}

const textStyles = {
  ghost: {
    color: colors.blue,
  },
  primary: {
    color: colors.white,
  },
  secondary: {
    color: colors.blueDark,
  },
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  disabled: {
    opacity: 0.52,
  },
  disabledText: {
    opacity: 0.8,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  primary: {
    backgroundColor: colors.blue,
  },
  secondary: {
    backgroundColor: colors.yellow,
  },
  text: {
    fontSize: typography.body,
    fontWeight: '800',
  },
});
