import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { colors, radius, spacing, typography } from '../../constants/theme';

const logoSource = require('../../../assets/images/logo.png');

const highlights = [
  'Create and track IT tickets',
  'Access self-service help articles',
  'Monitor assigned assets securely',
] as const;

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.logoWrap}>
            <Image source={logoSource} style={styles.logoImage} contentFit="contain" />
          </View>
          <Text style={styles.kicker}>ITDeskGo</Text>
          <Text style={styles.title}>Welcome to your IT helpdesk hub</Text>
          <Text style={styles.description}>
            Submit requests, follow ticket progress, browse knowledge base articles, and manage assets from one clean workspace.
          </Text>
        </View>

        <AppCard style={styles.card}>
          {highlights.map((highlight) => (
            <View key={highlight} style={styles.highlightRow}>
              <View style={styles.dot} />
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </AppCard>

        <View style={styles.actions}>
          <AppButton title="Get Started" onPress={() => router.replace('/login')} />
          <Link href="/forgot-password" style={styles.link}>
            Forgot Password?
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
  },
  card: {
    gap: spacing.md,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  description: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 23,
    textAlign: 'center',
  },
  dot: {
    backgroundColor: colors.yellow,
    borderRadius: radius.pill,
    height: 12,
    width: 12,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xl,
  },
  highlightRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  highlightText: {
    color: colors.ink,
    flex: 1,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 22,
  },
  kicker: {
    color: colors.blue,
    fontSize: typography.label,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  link: {
    color: colors.blue,
    fontSize: typography.body,
    fontWeight: '800',
    textAlign: 'center',
  },
  logoImage: {
    height: 72,
    width: 72,
  },
  logoWrap: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.yellow,
    borderRadius: radius.lg,
    borderWidth: 3,
    height: 96,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: 96,
  },
  safeArea: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
    lineHeight: 39,
    maxWidth: 340,
    textAlign: 'center',
  },
});
