import { PropsWithChildren } from 'react';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../constants/theme';

const logoSource = require('../../assets/images/logo.png');

type ScreenProps = PropsWithChildren<{
  title: string;
  description?: string;
  rightSlot?: React.ReactNode;
}>;

export function Screen({ title, description, rightSlot, children }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.brandRow}>
              <Image source={logoSource} style={styles.brandLogo} contentFit="contain" />
              <Text style={styles.kicker}>ITDeskGo</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
          </View>
          {rightSlot}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brandLogo: {
    height: 24,
    width: 24,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.md,
    paddingBottom: 116,
  },
  description: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  kicker: {
    color: colors.blue,
    fontSize: typography.label,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  safeArea: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  title: {
    color: colors.ink,
    fontSize: typography.title,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
});
