import { useEffect } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '../../components/AppButton';
import { colors, radius, spacing, typography } from '../../constants/theme';

const logoSource = require('../../../assets/images/logo.png');

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/welcome'), 900);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrap}>
        <View style={styles.logo}>
          <Image source={logoSource} style={styles.logoImage} contentFit="contain" />
        </View>
        <Text style={styles.title}>ITDeskGo</Text>
        <Text style={styles.subtitle}>Helpdesk, knowledge base, and asset tracking for modern IT teams.</Text>
      </View>
      <AppButton title="Continue" variant="secondary" onPress={() => router.replace('/welcome')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue,
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  logo: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.yellow,
    borderRadius: radius.lg,
    borderWidth: 3,
    height: 108,
    justifyContent: 'center',
    width: 108,
  },
  logoImage: {
    height: 82,
    width: 82,
  },
  logoWrap: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
  },
  subtitle: {
    color: colors.white,
    fontSize: typography.body,
    lineHeight: 23,
    maxWidth: 320,
    opacity: 0.9,
    textAlign: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
});
