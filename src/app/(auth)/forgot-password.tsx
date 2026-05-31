import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { AppInput } from '../../components/AppInput';
import { colors, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../services/api';

export default function ForgotPasswordScreen() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && !loading;

  async function handleReset() {
    if (!canSubmit) {
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const nextMessage = await requestPasswordReset(email);
      setMessage(nextMessage);
    } catch (resetError) {
      setError(getErrorMessage(resetError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.keyboardView}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.kicker}>Account Recovery</Text>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.description}>Enter your email and ITDeskGo will prepare password reset instructions.</Text>
        </View>

        <AppCard style={styles.card}>
          <AppInput
            label="Email"
            placeholder="you@company.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            onSubmitEditing={handleReset}
            returnKeyType="send"
          />
          {message ? <Text style={styles.success}>{message}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <AppButton title={loading ? 'Sending...' : 'Send Reset Link'} onPress={handleReset} disabled={!canSubmit} />
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
  error: {
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    color: colors.danger,
    fontSize: typography.label,
    fontWeight: '800',
    lineHeight: 20,
    padding: spacing.md,
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
