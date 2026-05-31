import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { RoleKey, roleLabels } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { Screen } from '../Screen';

const profileDetails: Record<RoleKey, { name: string; email: string; department: string }> = {
  employee: {
    name: 'Maria Santos',
    email: 'maria.santos@itdeskgo.local',
    department: 'Finance',
  },
  itStaff: {
    name: 'Daniel Cruz',
    email: 'daniel.cruz@itdeskgo.local',
    department: 'Information Technology',
  },
  admin: {
    name: 'Admin User',
    email: 'admin@itdeskgo.local',
    department: 'System Administration',
  },
};

type ProfileScreenProps = {
  role: RoleKey;
};

export function ProfileScreen({ role }: ProfileScreenProps) {
  const router = useRouter();
  const { session, signOut } = useAuth();
  const fallbackProfile = profileDetails[role];
  const activeUser = session?.role === role ? session.user : undefined;
  const profile = {
    name: displayName(activeUser, fallbackProfile.name),
    email: readString(activeUser, 'email') ?? fallbackProfile.email,
    department: readString(activeUser, 'department') ?? readString(activeUser, 'department_name') ?? fallbackProfile.department,
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
        <ProfileRow label="Notifications" value="Email and push enabled" />
        <ProfileRow label="Security" value="Password protected account" />
      </View>

      <AppButton title="Sign Out" variant="ghost" onPress={handleSignOut} />
    </Screen>
  );
}

function readString(source: Record<string, unknown> | undefined, key: string) {
  const value = source?.[key];

  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function displayName(user: Record<string, unknown> | undefined, fallback: string) {
  const fullName = readString(user, 'name');
  const firstName = readString(user, 'first_name');
  const lastName = readString(user, 'last_name');
  const combinedName = [firstName, lastName].filter(Boolean).join(' ');

  return fullName ?? (combinedName.length > 0 ? combinedName : fallback);
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
