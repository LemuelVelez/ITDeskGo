import { StyleSheet, Text, View } from 'react-native';

import type { RoleKey, Ticket } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { authFromSession, dashboardMetrics, fetchDashboard, fetchTickets, highPriorityTicket } from '../../services/itdeskgo';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { MetricCard } from '../MetricCard';
import { ResourceState } from '../ResourceState';
import { Screen } from '../Screen';
import { SectionHeader } from '../SectionHeader';

const dashboardCopy: Record<Exclude<RoleKey, 'employee'>, { title: string; description: string }> = {
  itStaff: {
    title: 'IT Dashboard',
    description: 'Prioritize requests, monitor SLA risk, and keep IT operations moving efficiently.',
  },
  admin: {
    title: 'Admin Dashboard',
    description: 'Manage users, tickets, assets, knowledge base content, and helpdesk settings.',
  },
};

type DashboardData = {
  summary: Awaited<ReturnType<typeof fetchDashboard>> | null;
  tickets: Ticket[];
};

const emptyDashboardData: DashboardData = {
  summary: null,
  tickets: [],
};

type DashboardScreenProps = {
  role: Exclude<RoleKey, 'employee'>;
};

export function DashboardScreen({ role }: DashboardScreenProps) {
  const { session } = useAuth();
  const auth = authFromSession(session);
  const copy = dashboardCopy[role];
  const { data, error, loading, reload } = useAsyncResource(
    async () => {
      const [summary, tickets] = await Promise.all([
        fetchDashboard(role, auth),
        fetchTickets(role, auth, 5),
      ]);

      return {
        summary,
        tickets: tickets.sort((a, b) => Number(highPriorityTicket(b)) - Number(highPriorityTicket(a))).slice(0, 3),
      };
    },
    [role, session?.token, session?.user.id],
    emptyDashboardData,
  );

  return (
    <Screen title={copy.title} description={copy.description}>
      <ResourceState loading={loading} error={error} onRetry={reload} />

      {!loading && !error ? (
        <>
          <View style={styles.metrics}>
            {dashboardMetrics(role, data.summary).map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </View>

          <View>
            <SectionHeader title="Priority Tickets" action="View all" />
            <ResourceState
              loading={false}
              error=""
              empty={data.tickets.length === 0}
              emptyMessage="No priority tickets found."
            />
            <View style={styles.stack}>
              {data.tickets.map((ticket) => (
                <TicketPreview key={ticket.id} ticket={ticket} />
              ))}
            </View>
          </View>
        </>
      ) : null}
    </Screen>
  );
}

function ticketPriorityTone(priority: string): 'red' | 'yellow' {
  return priority.toLowerCase() === 'high' ? 'red' : 'yellow';
}

function ticketStatusTone(status: string): 'green' | 'blue' {
  return status.toLowerCase() === 'resolved' || status.toLowerCase() === 'closed' ? 'green' : 'blue';
}

function TicketPreview({ ticket }: { ticket: Ticket }) {
  return (
    <AppCard>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleWrap}>
          <Text style={styles.ticketId}>{ticket.id}</Text>
          <Text style={styles.cardTitle}>{ticket.title}</Text>
        </View>
        <Badge label={ticket.priority} tone={ticketPriorityTone(ticket.priority)} />
      </View>
      <Text style={styles.meta}>{ticket.category} • {ticket.requester} • {ticket.updatedAt}</Text>
      <View style={styles.cardFooter}>
        <Badge label={ticket.status} tone={ticketStatusTone(ticket.status)} />
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
