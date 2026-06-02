import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import type { User } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { authFromSession, createUser, deleteUser, fetchUsers, updateUser, type UserMutationPayload } from '../../services/itdeskgo';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { CrudDialog, type CrudDialogField } from '../CrudDialog';
import { ResourceState } from '../ResourceState';
import { Screen } from '../Screen';

type ManagedUser = User & {
  email?: string;
  phone?: string;
  roleId?: string;
  departmentId?: string;
};

type UserDialogMode = 'create' | 'edit' | null;

type UserFormState = Record<string, string> & {
  name: string;
  email: string;
  password: string;
  roleId: string;
  departmentId: string;
  status: string;
  phone: string;
};

const defaultUserForm: UserFormState = {
  name: '',
  email: '',
  password: '',
  roleId: '',
  departmentId: '',
  status: 'active',
  phone: '',
};

const userFields: CrudDialogField[] = [
  { name: 'name', label: 'Full Name', placeholder: 'Juan Dela Cruz' },
  { name: 'email', label: 'Email', placeholder: 'user@example.com', keyboardType: 'email-address', autoCapitalize: 'none' },
  { name: 'password', label: 'Password', placeholder: 'Required for new users only', secureTextEntry: true, autoCapitalize: 'none' },
  { name: 'roleId', label: 'Role ID', placeholder: 'Example: 1' },
  { name: 'departmentId', label: 'Department ID', placeholder: 'Example: 2' },
  { name: 'status', label: 'Status', placeholder: 'active, inactive, or suspended', autoCapitalize: 'none' },
  { name: 'phone', label: 'Phone', placeholder: 'Optional' },
];

export function UsersScreen() {
  const { session } = useAuth();
  const auth = authFromSession(session);
  const [dialogMode, setDialogMode] = useState<UserDialogMode>(null);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState<UserFormState>(defaultUserForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data, error, loading, reload } = useAsyncResource(
    () => fetchUsers(auth),
    [session?.token, session?.user.id],
    [] as User[],
  );

  const openCreateDialog = () => {
    setSelectedUser(null);
    setForm(defaultUserForm);
    setDialogMode('create');
  };

  const openEditDialog = (user: ManagedUser) => {
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email ?? '',
      password: '',
      roleId: user.roleId ?? '',
      departmentId: user.departmentId ?? '',
      status: statusValue(user.status),
      phone: user.phone ?? '',
    });
    setDialogMode('edit');
  };

  const closeDialog = () => {
    if (submitting) {
      return;
    }

    resetDialog();
  };

  const resetDialog = () => {
    setDialogMode(null);
    setSelectedUser(null);
    setForm(defaultUserForm);
  };

  const updateForm = (name: string, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitUserForm = async () => {
    if (submitting || dialogMode === null) {
      return;
    }

    const isCreate = dialogMode === 'create';

    if (form.name.trim() === '' || (isCreate && (form.email.trim() === '' || form.password.trim() === ''))) {
      Alert.alert('Missing Information', isCreate ? 'Please provide the user name, email, and password.' : 'Please provide the user name.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = userPayload(form, isCreate);

      if (isCreate) {
        await createUser(payload, auth);
      } else if (selectedUser) {
        await updateUser(selectedUser.id, payload, auth);
      }

      Alert.alert('Success', isCreate ? 'User created successfully.' : 'User updated successfully.');
      resetDialog();
      reload();
    } catch (submitError) {
      Alert.alert('Action Failed', submitError instanceof Error ? submitError.message : 'Unable to save user.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteUser = (user: ManagedUser) => {
    Alert.alert('Delete User', `Delete ${user.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeUser(user) },
    ]);
  };

  const removeUser = async (user: ManagedUser) => {
    if (deletingId !== null) {
      return;
    }

    setDeletingId(user.id);

    try {
      await deleteUser(user.id, auth);
      Alert.alert('Success', 'User deleted successfully.');
      reload();
    } catch (deleteError) {
      Alert.alert('Action Failed', deleteError instanceof Error ? deleteError.message : 'Unable to delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Screen
      title="Users"
      description="Create accounts, assign roles, and control access for employees, IT staff, and admins."
      rightSlot={<AppButton title="Add User" variant="secondary" style={styles.actionButton} onPress={openCreateDialog} />}
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
          {data.map((user) => {
            const managedUser = user as ManagedUser;

            return (
              <UserCard
                key={managedUser.id}
                user={managedUser}
                deleting={deletingId === managedUser.id}
                onEdit={openEditDialog}
                onDelete={confirmDeleteUser}
              />
            );
          })}
        </View>
      ) : null}

      <CrudDialog
        visible={dialogMode !== null}
        title={dialogMode === 'edit' ? 'Edit User' : 'Add User'}
        description={dialogMode === 'edit' ? 'Update valid user fields and save the changes.' : 'Create a new user account from the mobile app.'}
        fields={userFields}
        values={form}
        submitting={submitting}
        submitLabel={dialogMode === 'edit' ? 'Update User' : 'Create User'}
        onChange={updateForm}
        onCancel={closeDialog}
        onSubmit={submitUserForm}
      />
    </Screen>
  );
}

function userPayload(form: UserFormState, includePassword: boolean): UserMutationPayload {
  const payload: UserMutationPayload = {
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    role_id: form.roleId.trim(),
    department_id: form.departmentId.trim(),
    status: form.status.trim().toLowerCase(),
    phone: form.phone.trim(),
  };

  if (includePassword || form.password.trim() !== '') {
    payload.password = form.password;
  }

  return payload;
}

function statusValue(status: string) {
  return status.toLowerCase().replace(/\s+/g, '_') || 'active';
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

function UserCard({
  user,
  deleting,
  onEdit,
  onDelete,
}: {
  user: ManagedUser;
  deleting: boolean;
  onEdit: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
}) {
  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.slice(0, 1)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.meta}>{user.role} • {user.department}</Text>
          {user.email ? <Text style={styles.email}>{user.email}</Text> : null}
        </View>
        <Badge label={user.status} tone={userTone(user.status)} />
      </View>
      <View style={styles.cardActions}>
        <AppButton title="Edit" variant="ghost" style={styles.cardButton} onPress={() => onEdit(user)} />
        <AppButton title={deleting ? 'Deleting...' : 'Delete'} variant="ghost" style={styles.cardButton} onPress={() => onDelete(user)} />
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
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    marginTop: spacing.md,
  },
  cardButton: {
    minHeight: 38,
    paddingHorizontal: spacing.sm,
  },
  email: {
    color: colors.blueDark,
    fontSize: typography.small,
    fontWeight: '700',
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
