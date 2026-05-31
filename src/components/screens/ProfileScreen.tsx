import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { roleLabels, type RoleKey } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { Screen } from '../Screen';

type ProfileScreenProps = {
  role: RoleKey;
};

export function ProfileScreen({ role }: ProfileScreenProps) {
  const router = useRouter();
  const { session, signOut } = useAuth();
  const activeUser = session?.user;
  const profile = {
    name: displayName(activeUser),
    email: readString(activeUser, 'email') ?? 'Not provided',
    department: readString(activeUser, 'department') ?? readString(activeUser, 'department_name') ?? 'Not provided',
    id: readUserId(activeUser),
  };

  function handleSignOut() {
    signOut();
    router.replace('/login');
  }

  return (
    <Screen title="Profile" description="Manage your account, notification preferences, and helpdesk activity.">
      <AppCard style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.name.slice(0, 1)}</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
        <Badge label={roleLabels[role]} tone="yellow" />
      </AppCard>

      <View style={styles.stack}>
        <ProfileRow label="Department" value={profile.department} />
        <ProfileRow label="Role" value={roleLabels[role]} />
        <ProfileRow label="User ID" value={profile.id} />
      </View>

      <AppButton title="Sign Out" variant="ghost" onPress={handleSignOut} />
    </Screen>
  );
}

function readString(source: Record<string, unknown> | undefined, key: string) {
  const value = source?.[key];

  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function readUserId(user: Record<string, unknown> | undefined) {
  const id = user?.id;

  if (typeof id === 'string' || typeof id === 'number') {
    return String(id);
  }

  return 'Not provided';
}

function displayName(user: Record<string, unknown> | undefined) {
  const fullName = readString(user, 'name');
  const firstName = readString(user, 'first_name');
  const lastName = readString(user, 'last_name');
  const combinedName = [firstName, lastName].filter(Boolean).join(' ');

  return fullName ?? (combinedName.length > 0 ? combinedName : 'Account User');
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <AppCard>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  avatarText: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
  },
  email: {
    color: colors.muted,
    fontSize: typography.body,
    marginBottom: spacing.sm,
  },
  name: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    marginTop: spacing.md,
  },
  profileCard: {
    alignItems: 'center',
  },
  rowLabel: {
    color: colors.muted,
    fontSize: typography.label,
    fontWeight: '800',
  },
  rowValue: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  stack: {
    gap: spacing.md,
  },
});
