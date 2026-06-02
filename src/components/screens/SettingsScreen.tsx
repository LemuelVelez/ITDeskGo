import { StyleSheet, Text, View } from 'react-native';

import type { SettingsItem } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { authFromSession, fetchSettingsItems } from '../../services/itdeskgo';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { ResourceState } from '../ResourceState';
import { Screen } from '../Screen';
import { SignOutButton } from '../SignOutButton';

export function SettingsScreen() {
  const { session } = useAuth();
  const auth = authFromSession(session);
  const { data, error, loading, reload } = useAsyncResource(
    () => fetchSettingsItems(auth),
    [session?.token, session?.user.id],
    [] as SettingsItem[],
  );

  return (
    <Screen
      title="Settings"
      description="Configure the helpdesk workflow, knowledge-base publishing, asset rules, and system preferences."
    >
      <ResourceState
        loading={loading}
        error={error}
        empty={data.length === 0}
        emptyMessage="No settings found from the backend."
        onRetry={reload}
      />
      {!loading && !error ? (
        <View style={styles.stack}>
          {data.map((setting) => (
            <SettingCard key={setting.id} setting={setting} />
          ))}
        </View>
      ) : null}

      <SignOutButton style={styles.signOutButton} />
    </Screen>
  );
}

function SettingCard({ setting }: { setting: SettingsItem }) {
  return (
    <AppCard>
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
  signOutButton: {
    marginTop: spacing.sm,
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
