import { StyleSheet, Text, View } from 'react-native';

import type { User } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { authFromSession, fetchUsers } from '../../services/itdeskgo';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { ResourceState } from '../ResourceState';
import { Screen } from '../Screen';

export function UsersScreen() {
  const { session } = useAuth();
  const auth = authFromSession(session);
  const { data, error, loading, reload } = useAsyncResource(
    () => fetchUsers(auth),
    [session?.token, session?.user.id],
    [] as User[],
  );

  return (
    <Screen
      title="Users"
      description="Create accounts, assign roles, and control access for employees, IT staff, and admins."
      rightSlot={<AppButton title="Add User" variant="secondary" style={styles.actionButton} />}
    >
      <ResourceState
        loading={loading}
        error={error}
        empty={data.length === 0}
        emptyMessage="No users found from the backend."
        onRetry={reload}
      />
      {!loading && !error ? (
        <View style={styles.stack}>
          {data.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

function userTone(status: string): 'green' | 'red' | 'yellow' {
  const normalized = status.toLowerCase();

  if (normalized === 'active') {
    return 'green';
  }

  if (normalized === 'suspended' || normalized === 'inactive') {
    return 'red';
  }

  return 'yellow';
}

function UserCard({ user }: { user: User }) {
  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.slice(0, 1)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.meta}>{user.role} • {user.department}</Text>
        </View>
        <Badge label={user.status} tone={userTone(user.status)} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.blueSoft,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  avatarText: {
    color: colors.blue,
    fontSize: 18,
    fontWeight: '900',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  meta: {
    color: colors.muted,
    fontSize: typography.label,
  },
  name: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
  },
  stack: {
    gap: spacing.md,
  },
});
