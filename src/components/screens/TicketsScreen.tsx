import { StyleSheet, Text, View } from 'react-native';

import { RoleKey, Ticket, tickets } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { Screen } from '../Screen';

const screenCopy: Record<RoleKey, { title: string; description: string; action: string }> = {
  employee: {
    title: 'My Tickets',
    description: 'Track your submitted requests, status updates, and IT staff responses.',
    action: 'New Ticket',
  },
  itStaff: {
    title: 'Ticket Queue',
    description: 'Review, assign, prioritize, and resolve incoming helpdesk requests.',
    action: 'Assign Ticket',
  },
  admin: {
    title: 'All Tickets',
    description: 'Monitor ticket volume, resolution performance, categories, and escalation trends.',
    action: 'Export Report',
  },
};

type TicketsScreenProps = {
  role: RoleKey;
};

export function TicketsScreen({ role }: TicketsScreenProps) {
  const copy = screenCopy[role];

  return (
    <Screen
      title={copy.title}
      description={copy.description}
      rightSlot={<AppButton title={copy.action} variant="secondary" style={styles.actionButton} />}
    >
      <View style={styles.stack}>
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </View>
    </Screen>
  );
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <AppCard>
      <View style={styles.rowTop}>
        <View style={styles.titleWrap}>
          <Text style={styles.id}>{ticket.id}</Text>
          <Text style={styles.title}>{ticket.title}</Text>
        </View>
        <Badge label={ticket.priority} tone={ticket.priority === 'High' ? 'red' : 'yellow'} />
      </View>
      <Text style={styles.meta}>{ticket.category} • Requested by {ticket.requester}</Text>
      <View style={styles.footer}>
        <Badge label={ticket.status} tone={ticket.status === 'Resolved' ? 'green' : 'blue'} />
        <Text style={styles.updated}>{ticket.updatedAt}</Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  id: {
    color: colors.blue,
    fontSize: typography.small,
    fontWeight: '900',
  },
  meta: {
    color: colors.muted,
    fontSize: typography.label,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  rowTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  stack: {
    gap: spacing.md,
  },
  title: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: 22,
  },
  titleWrap: {
    flex: 1,
    gap: spacing.xs,
  },
  updated: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '700',
  },
});
