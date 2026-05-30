import { StyleSheet, Text, View } from 'react-native';

import { User, users } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { Screen } from '../Screen';

export function UsersScreen() {
  return (
    <Screen
      title="Users"
      description="Create accounts, assign roles, and control access for employees, IT staff, and admins."
      rightSlot={<AppButton title="Add User" variant="secondary" style={styles.actionButton} />}
    >
      <View style={styles.stack}>
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </View>
    </Screen>
  );
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
        <Badge label={user.status} tone={user.status === 'Active' ? 'green' : 'yellow'} />
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
