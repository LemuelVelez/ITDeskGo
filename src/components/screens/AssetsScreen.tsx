import { StyleSheet, Text, View } from 'react-native';

import type { Asset, RoleKey } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { authFromSession, fetchAssets } from '../../services/itdeskgo';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
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

type AssetsScreenProps = {
  role: RoleKey;
};

export function AssetsScreen({ role }: AssetsScreenProps) {
  const { session } = useAuth();
  const auth = authFromSession(session);
  const screenCopy = copy[role];
  const { data, error, loading, reload } = useAsyncResource(
    () => fetchAssets(role, auth),
    [role, session?.token, session?.user.id],
    [] as Asset[],
  );

  return (
    <Screen
      title={screenCopy.title}
      description={screenCopy.description}
      rightSlot={<AppButton title={screenCopy.action} variant="secondary" style={styles.actionButton} />}
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
          {data.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </View>
      ) : null}
    </Screen>
  );
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

function AssetCard({ asset }: { asset: Asset }) {
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
    </AppCard>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
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
