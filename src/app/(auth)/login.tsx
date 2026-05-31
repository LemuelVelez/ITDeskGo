import { useState } from 'react';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { AppInput } from '../../components/AppInput';
import { colors, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../services/api';

const logoSource = require('../../../assets/images/logo.png');

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  async function handleLogin() {
    if (!canSubmit) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const session = await signIn({ email, password });
      router.replace(session.route as never);
    } catch (loginError) {
      setError(getErrorMessage(loginError));
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
          <View style={styles.logo}>
            <Image source={logoSource} style={styles.logoImage} contentFit="contain" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.description}>Sign in once and ITDeskGo will open the correct workspace for your account role.</Text>
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
          />
          <AppInput
            label="Password"
            placeholder="Enter password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <AppButton title={loading ? 'Signing in...' : 'Login'} onPress={handleLogin} disabled={!canSubmit} />
          <Link href="/forgot-password" style={styles.link}>Forgot Password?</Link>
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
  link: {
    color: colors.blue,
    fontSize: typography.body,
    fontWeight: '800',
    textAlign: 'center',
  },
  logo: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.yellow,
    borderRadius: 24,
    borderWidth: 2,
    height: 78,
    justifyContent: 'center',
    width: 78,
  },
  logoImage: {
    height: 58,
    width: 58,
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
});
