import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { AppInput } from '../../components/AppInput';
import { colors, spacing, typography } from '../../constants/theme';

export default function ForgotPasswordScreen() {
  const [sent, setSent] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.keyboardView}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.kicker}>Account Recovery</Text>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.description}>Enter your email and ITDeskGo will send password reset instructions.</Text>
        </View>

        <AppCard style={styles.card}>
          <AppInput label="Email" placeholder="you@company.com" autoCapitalize="none" keyboardType="email-address" />
          {sent ? <Text style={styles.success}>Reset instructions are ready to be sent to your email.</Text> : null}
          <AppButton title="Send Reset Link" onPress={() => setSent(true)} />
          <Link href="/login" style={styles.link}>Back to Login</Link>
        </AppCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  container: {
    backgroundColor: colors.surface,
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  description: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  keyboardView: {
    flex: 1,
  },
  kicker: {
    color: colors.blue,
    fontSize: typography.label,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  link: {
    color: colors.blue,
    fontSize: typography.body,
    fontWeight: '800',
    textAlign: 'center',
  },
  success: {
    backgroundColor: colors.yellowSoft,
    borderRadius: 14,
    color: colors.blueDark,
    fontSize: typography.label,
    fontWeight: '800',
    lineHeight: 20,
    padding: spacing.md,
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
});
