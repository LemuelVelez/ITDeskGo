import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '../constants/theme';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: StyleProp<ViewStyle>;
};

export function AppButton({ title, onPress, variant = 'primary', style }: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, textStyles[variant]]}>{title}</Text>
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
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: colors.blue,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  primary: {
    backgroundColor: colors.blue,
  },
  primaryText: {
    color: colors.white,
  },
  secondary: {
    backgroundColor: colors.yellow,
  },
  secondaryText: {
    color: colors.blueDark,
  },
  text: {
    fontSize: typography.body,
    fontWeight: '800',
  },
});
