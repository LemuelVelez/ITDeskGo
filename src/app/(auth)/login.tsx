import { useState } from 'react';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { AppInput } from '../../components/AppInput';
import { RoleSwitcher } from '../../components/RoleSwitcher';
import { RoleKey } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';

const logoSource = require('../../../assets/images/logo.png');

const roleRoutes: Record<RoleKey, string> = {
  employee: '/(employee)/home',
  itStaff: '/(it-staff)/dashboard',
  admin: '/(admin)/dashboard',
};

export default function LoginScreen() {
  const router = useRouter();
  const [role, setRole] = useState<RoleKey>('employee');

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
          <Text style={styles.description}>Sign in to access IT helpdesk tickets, articles, and assets.</Text>
        </View>

        <AppCard style={styles.card}>
          <RoleSwitcher value={role} onChange={setRole} />
          <AppInput label="Email" placeholder="you@company.com" autoCapitalize="none" keyboardType="email-address" />
          <AppInput label="Password" placeholder="Enter password" secureTextEntry />
          <AppButton title="Login" onPress={() => router.replace(roleRoutes[role] as never)} />
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
