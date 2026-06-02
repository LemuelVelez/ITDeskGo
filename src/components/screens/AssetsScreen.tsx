import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import type { Asset, RoleKey } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { authFromSession, createAsset, deleteAsset, fetchAssets, updateAsset, type AssetMutationPayload } from '../../services/itdeskgo';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { CrudDialog, type CrudDialogField } from '../CrudDialog';
import { ResourceState } from '../ResourceState';
import { Screen } from '../Screen';

const copy: Record<RoleKey, { title: string; description: string; action: string }> = {
  employee: {
    title: 'My Assets',
    description: 'View assigned laptops, accessories, software access, and return responsibilities.',
    action: 'Request Asset',
  },
  itStaff: {
    title: 'Assets',
    description: 'Track assigned devices, maintenance status, and available equipment inventory.',
    action: 'Scan Asset',
  },
  admin: {
    title: 'Assets',
    description: 'Manage asset inventory, assignments, maintenance rules, and lifecycle reporting.',
    action: 'Add Asset',
  },
};

type ManagedAsset = Asset & {
  backendId?: string;
  assetTag?: string;
  assetTypeId?: string;
  assignedToId?: string;
  brand?: string;
  model?: string;
  location?: string;
  notes?: string;
};

type AssetDialogMode = 'create' | 'edit' | null;

type AssetFormState = Record<string, string> & {
  assetTag: string;
  name: string;
  serialNumber: string;
  assetTypeId: string;
  assignedTo: string;
  status: string;
  brand: string;
  model: string;
  location: string;
  notes: string;
};

const defaultAssetForm: AssetFormState = {
  assetTag: '',
  name: '',
  serialNumber: '',
  assetTypeId: '',
  assignedTo: '',
  status: 'available',
  brand: '',
  model: '',
  location: '',
  notes: '',
};

const assetFields: CrudDialogField[] = [
  { name: 'assetTag', label: 'Asset Tag', placeholder: 'AST-001', autoCapitalize: 'characters' },
  { name: 'name', label: 'Asset Name', placeholder: 'Laptop, Monitor, Printer' },
  { name: 'serialNumber', label: 'Serial Number', placeholder: 'Serial number' },
  { name: 'assetTypeId', label: 'Asset Type ID', placeholder: 'Example: 1' },
  { name: 'assignedTo', label: 'Assigned User ID', placeholder: 'Leave blank if available' },
  { name: 'status', label: 'Status', placeholder: 'available, assigned, maintenance, retired', autoCapitalize: 'none' },
  { name: 'brand', label: 'Brand', placeholder: 'Optional' },
  { name: 'model', label: 'Model', placeholder: 'Optional' },
  { name: 'location', label: 'Location', placeholder: 'Optional' },
  { name: 'notes', label: 'Notes', placeholder: 'Optional notes', multiline: true },
];

type AssetsScreenProps = {
  role: RoleKey;
};

export function AssetsScreen({ role }: AssetsScreenProps) {
  const { session } = useAuth();
  const auth = authFromSession(session);
  const screenCopy = copy[role];
  const [dialogMode, setDialogMode] = useState<AssetDialogMode>(null);
  const [selectedAsset, setSelectedAsset] = useState<ManagedAsset | null>(null);
  const [form, setForm] = useState<AssetFormState>(defaultAssetForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data, error, loading, reload } = useAsyncResource(
    () => fetchAssets(role, auth),
    [role, session?.token, session?.user.id],
    [] as Asset[],
  );

  const openCreateDialog = () => {
    setSelectedAsset(null);
    setForm(defaultAssetForm);
    setDialogMode('create');
  };

  const openEditDialog = (asset: ManagedAsset) => {
    setSelectedAsset(asset);
    setForm({
      assetTag: asset.assetTag ?? asset.id,
      name: asset.name,
      serialNumber: asset.serial === 'No serial number' ? '' : asset.serial,
      assetTypeId: asset.assetTypeId ?? '',
      assignedTo: asset.assignedToId ?? '',
      status: assetStatusValue(asset.status),
      brand: asset.brand ?? '',
      model: asset.model ?? '',
      location: asset.location ?? '',
      notes: asset.notes ?? '',
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
    setSelectedAsset(null);
    setForm(defaultAssetForm);
  };

  const updateForm = (name: string, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleHeaderAction = () => {
    if (role !== 'admin') {
      Alert.alert('Action Unavailable', `${screenCopy.action} is not available for this role yet.`);
      return;
    }

    openCreateDialog();
  };

  const submitAssetForm = async () => {
    if (submitting || dialogMode === null) {
      return;
    }

    if (form.name.trim() === '') {
      Alert.alert('Missing Information', 'Please provide the asset name.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = assetPayload(form);

      if (dialogMode === 'create') {
        await createAsset(payload, auth);
      } else if (selectedAsset) {
        await updateAsset(assetRecordId(selectedAsset), payload, auth);
      }

      Alert.alert('Success', dialogMode === 'create' ? 'Asset created successfully.' : 'Asset updated successfully.');
      resetDialog();
      reload();
    } catch (submitError) {
      Alert.alert('Action Failed', submitError instanceof Error ? submitError.message : 'Unable to save asset.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteAsset = (asset: ManagedAsset) => {
    Alert.alert('Delete Asset', `Delete ${asset.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeAsset(asset) },
    ]);
  };

  const removeAsset = async (asset: ManagedAsset) => {
    if (deletingId !== null) {
      return;
    }

    const id = assetRecordId(asset);
    setDeletingId(id);

    try {
      await deleteAsset(id, auth);
      Alert.alert('Success', 'Asset deleted successfully.');
      reload();
    } catch (deleteError) {
      Alert.alert('Action Failed', deleteError instanceof Error ? deleteError.message : 'Unable to delete asset.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Screen
      title={screenCopy.title}
      description={screenCopy.description}
      rightSlot={<AppButton title={screenCopy.action} variant="secondary" style={styles.actionButton} onPress={handleHeaderAction} />}
    >
      <ResourceState
        loading={loading}
        error={error}
        empty={data.length === 0}
        emptyMessage="No assets found from the backend."
        onRetry={reload}
      />
      {!loading && !error ? (
        <View style={styles.stack}>
          {data.map((asset) => {
            const managedAsset = asset as ManagedAsset;

            return (
              <AssetCard
                key={assetRecordId(managedAsset)}
                asset={managedAsset}
                canManage={role === 'admin'}
                deleting={deletingId === assetRecordId(managedAsset)}
                onEdit={openEditDialog}
                onDelete={confirmDeleteAsset}
              />
            );
          })}
        </View>
      ) : null}

      <CrudDialog
        visible={dialogMode !== null}
        title={dialogMode === 'edit' ? 'Edit Asset' : 'Add Asset'}
        description={dialogMode === 'edit' ? 'Update valid asset fields and save the changes.' : 'Create a new asset inventory record.'}
        fields={assetFields}
        values={form}
        submitting={submitting}
        submitLabel={dialogMode === 'edit' ? 'Update Asset' : 'Create Asset'}
        onChange={updateForm}
        onCancel={closeDialog}
        onSubmit={submitAssetForm}
      />
    </Screen>
  );
}

function assetPayload(form: AssetFormState): AssetMutationPayload {
  return {
    asset_tag: form.assetTag.trim(),
    name: form.name.trim(),
    asset_name: form.name.trim(),
    serial_number: form.serialNumber.trim(),
    asset_type_id: form.assetTypeId.trim(),
    assigned_to: form.assignedTo.trim(),
    status: form.status.trim().toLowerCase(),
    brand: form.brand.trim(),
    model: form.model.trim(),
    location: form.location.trim(),
    notes: form.notes.trim(),
  };
}

function assetRecordId(asset: ManagedAsset) {
  return asset.backendId && asset.backendId.trim() !== '' ? asset.backendId : asset.id;
}

function assetStatusValue(status: string) {
  return status.toLowerCase().replace(/\s+/g, '_') || 'available';
}

function assetTone(status: string): 'blue' | 'green' | 'yellow' {
  const normalized = status.toLowerCase();

  if (normalized === 'assigned') {
    return 'blue';
  }

  if (normalized === 'available') {
    return 'green';
  }

  return 'yellow';
}

function AssetCard({
  asset,
  canManage,
  deleting,
  onEdit,
  onDelete,
}: {
  asset: ManagedAsset;
  canManage: boolean;
  deleting: boolean;
  onEdit: (asset: ManagedAsset) => void;
  onDelete: (asset: ManagedAsset) => void;
}) {
  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.id}>{asset.id}</Text>
          <Text style={styles.name}>{asset.name}</Text>
        </View>
        <Badge label={asset.status} tone={assetTone(asset.status)} />
      </View>
      <Text style={styles.meta}>Assigned to {asset.assignedTo}</Text>
      <Text style={styles.serial}>Serial: {asset.serial}</Text>
      {canManage ? (
        <View style={styles.cardActions}>
          <AppButton title="Edit" variant="ghost" style={styles.cardButton} onPress={() => onEdit(asset)} />
          <AppButton title={deleting ? 'Deleting...' : 'Delete'} variant="ghost" style={styles.cardButton} onPress={() => onDelete(asset)} />
        </View>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
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
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  id: {
    color: colors.blue,
    fontSize: typography.small,
    fontWeight: '900',
  },
  meta: {
    color: colors.muted,
    fontSize: typography.body,
    marginTop: spacing.md,
  },
  name: {
    color: colors.ink,
    fontSize: typography.subtitle,
    fontWeight: '900',
  },
  serial: {
    color: colors.blueDark,
    fontSize: typography.label,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  stack: {
    gap: spacing.md,
  },
  titleWrap: {
    flex: 1,
    gap: spacing.xs,
  },
});
