import { StyleSheet, Text, View } from 'react-native';

import { Asset, RoleKey, assets } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
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
  const screenCopy = copy[role];

  return (
    <Screen
      title={screenCopy.title}
      description={screenCopy.description}
      rightSlot={<AppButton title={screenCopy.action} variant="secondary" style={styles.actionButton} />}
    >
      <View style={styles.stack}>
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </View>
    </Screen>
  );
}

function AssetCard({ asset }: { asset: Asset }) {
  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.id}>{asset.id}</Text>
          <Text style={styles.name}>{asset.name}</Text>
        </View>
        <Badge
          label={asset.status}
          tone={asset.status === 'Assigned' ? 'blue' : asset.status === 'Available' ? 'green' : 'yellow'}
        />
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
