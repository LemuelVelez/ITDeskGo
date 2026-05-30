import { StyleSheet, Text, View } from 'react-native';

import { settings } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { Screen } from '../Screen';

export function SettingsScreen() {
  return (
    <Screen
      title="Settings"
      description="Configure the helpdesk workflow, knowledge-base publishing, asset rules, and system preferences."
    >
      <View style={styles.stack}>
        {settings.map((setting) => (
          <AppCard key={setting.id}>
            <View style={styles.row}>
              <View style={styles.iconWrap}>
                <Text style={styles.icon}>⚙</Text>
              </View>
              <View style={styles.content}>
                <Badge label={setting.id} tone="blue" />
                <Text style={styles.title}>{setting.title}</Text>
                <Text style={styles.description}>{setting.description}</Text>
              </View>
            </View>
          </AppCard>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  description: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  icon: {
    color: colors.blueDark,
    fontSize: 22,
    fontWeight: '900',
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.yellow,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  stack: {
    gap: spacing.md,
  },
  title: {
    color: colors.ink,
    fontSize: typography.subtitle,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
});
