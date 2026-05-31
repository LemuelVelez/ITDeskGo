import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import {
  authFromSession,
  dashboardMetrics,
  fetchDashboard,
  fetchKnowledgeArticles,
  fetchTickets,
} from '../../services/itdeskgo';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { MetricCard } from '../MetricCard';
import { ResourceState } from '../ResourceState';
import { Screen } from '../Screen';
import { SectionHeader } from '../SectionHeader';

type HomeData = {
  dashboard: Awaited<ReturnType<typeof fetchDashboard>> | null;
  tickets: Awaited<ReturnType<typeof fetchTickets>>;
  articles: Awaited<ReturnType<typeof fetchKnowledgeArticles>>;
};

const emptyHomeData: HomeData = {
  dashboard: null,
  tickets: [],
  articles: [],
};

export function HomeScreen() {
  const { session } = useAuth();
  const auth = authFromSession(session);
  const { data, error, loading, reload } = useAsyncResource(
    async () => {
      const [dashboard, tickets, articles] = await Promise.all([
        fetchDashboard('employee', auth),
        fetchTickets('employee', auth, 1),
        fetchKnowledgeArticles('employee', auth, 1),
      ]);

      return { dashboard, tickets, articles };
    },
    [session?.token, session?.user.id],
    emptyHomeData,
  );
  const latestTicket = data.tickets[0];
  const featuredArticle = data.articles[0];

  return (
    <Screen
      title="Employee Home"
      description="Create helpdesk tickets, view asset assignments, and find answers from the knowledge base."
    >
      <ResourceState loading={loading} error={error} onRetry={reload} />

      {!loading && !error ? (
        <>
          <View style={styles.metrics}>
            {dashboardMetrics('employee', data.dashboard).map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </View>

          <AppCard style={styles.heroCard}>
            <View style={styles.heroText}>
              <Badge label="Need help?" tone="yellow" />
              <Text style={styles.heroTitle}>Report an IT issue quickly</Text>
              <Text style={styles.heroDescription}>
                Submit a ticket with category, priority, screenshots, and asset details for faster support.
              </Text>
            </View>
            <AppButton title="Create Ticket" variant="secondary" />
          </AppCard>

          <View>
            <SectionHeader title="Latest Ticket" />
            {latestTicket ? (
              <AppCard>
                <Text style={styles.itemId}>{latestTicket.id}</Text>
                <Text style={styles.itemTitle}>{latestTicket.title}</Text>
                <Text style={styles.itemDescription}>{latestTicket.status} • {latestTicket.updatedAt}</Text>
              </AppCard>
            ) : (
              <ResourceState loading={false} error="" empty emptyMessage="No submitted tickets found." />
            )}
          </View>

          <View>
            <SectionHeader title="Recommended Article" />
            {featuredArticle ? (
              <AppCard>
                <Badge label={featuredArticle.category} tone="blue" />
                <Text style={styles.itemTitle}>{featuredArticle.title}</Text>
                <Text style={styles.itemDescription}>{featuredArticle.summary}</Text>
              </AppCard>
            ) : (
              <ResourceState loading={false} error="" empty emptyMessage="No published articles found." />
            )}
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
    gap: spacing.lg,
  },
  heroDescription: {
    color: colors.white,
    fontSize: typography.body,
    lineHeight: 22,
    opacity: 0.9,
  },
  heroText: {
    gap: spacing.sm,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  itemDescription: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  itemId: {
    color: colors.blue,
    fontSize: typography.small,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  itemTitle: {
    color: colors.ink,
    fontSize: typography.subtitle,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
