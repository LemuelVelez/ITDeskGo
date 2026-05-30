import { StyleSheet, Text, View } from 'react-native';

import { Metric, RoleKey, Ticket, adminMetrics, staffMetrics, tickets } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { AppCard } from '../AppCard';
import { AppButton } from '../AppButton';
import { Badge } from '../Badge';
import { MetricCard } from '../MetricCard';
import { Screen } from '../Screen';
import { SectionHeader } from '../SectionHeader';

const dashboardCopy: Record<RoleKey, { title: string; description: string; metrics: Metric[] }> = {
  employee: {
    title: 'Home',
    description: 'Submit tickets, check assigned assets, and search self-service articles in one place.',
    metrics: [],
  },
  itStaff: {
    title: 'IT Dashboard',
    description: 'Prioritize requests, monitor SLA risk, and keep IT operations moving efficiently.',
    metrics: staffMetrics,
  },
  admin: {
    title: 'Admin Dashboard',
    description: 'Manage users, tickets, assets, knowledge base content, and helpdesk settings.',
    metrics: adminMetrics,
  },
};

type DashboardScreenProps = {
  role: Exclude<RoleKey, 'employee'>;
};

export function DashboardScreen({ role }: DashboardScreenProps) {
  const copy = dashboardCopy[role];

  return (
    <Screen title={copy.title} description={copy.description}>
      <View style={styles.metrics}>
        {copy.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </View>

      <View>
        <SectionHeader title="Priority Tickets" action="View all" />
        <View style={styles.stack}>
          {tickets.map((ticket) => (
            <TicketPreview key={ticket.id} ticket={ticket} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

function TicketPreview({ ticket }: { ticket: Ticket }) {
  return (
    <AppCard>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleWrap}>
          <Text style={styles.ticketId}>{ticket.id}</Text>
          <Text style={styles.cardTitle}>{ticket.title}</Text>
        </View>
        <Badge label={ticket.priority} tone={ticket.priority === 'High' ? 'red' : 'yellow'} />
      </View>
      <Text style={styles.meta}>{ticket.category} • {ticket.requester} • {ticket.updatedAt}</Text>
      <View style={styles.cardFooter}>
        <Badge label={ticket.status} tone={ticket.status === 'Resolved' ? 'green' : 'blue'} />
        <AppButton title="Open" variant="ghost" style={styles.openButton} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  cardFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: colors.ink,
    fontSize: typography.body,
    fontWeight: '900',
    lineHeight: 21,
  },
  cardTitleWrap: {
    flex: 1,
    gap: 3,
  },
  meta: {
    color: colors.muted,
    fontSize: typography.label,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  openButton: {
    minHeight: 38,
    paddingHorizontal: spacing.sm,
  },
  stack: {
    gap: spacing.md,
  },
  ticketId: {
    color: colors.blue,
    fontSize: typography.small,
    fontWeight: '900',
  },
});
