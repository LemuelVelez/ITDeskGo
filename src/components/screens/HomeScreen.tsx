import { StyleSheet, Text, View } from 'react-native';

import { employeeMetrics, knowledgeArticles, tickets } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { MetricCard } from '../MetricCard';
import { Screen } from '../Screen';
import { SectionHeader } from '../SectionHeader';

export function HomeScreen() {
  const latestTicket = tickets[0];
  const featuredArticle = knowledgeArticles[0];

  return (
    <Screen
      title="Employee Home"
      description="Create helpdesk tickets, view asset assignments, and find answers from the knowledge base."
    >
      <View style={styles.metrics}>
        {employeeMetrics.map((metric) => (
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
        <AppCard>
          <Text style={styles.itemId}>{latestTicket.id}</Text>
          <Text style={styles.itemTitle}>{latestTicket.title}</Text>
          <Text style={styles.itemDescription}>{latestTicket.status} • {latestTicket.updatedAt}</Text>
        </AppCard>
      </View>

      <View>
        <SectionHeader title="Recommended Article" />
        <AppCard>
          <Badge label={featuredArticle.category} tone="blue" />
          <Text style={styles.itemTitle}>{featuredArticle.title}</Text>
          <Text style={styles.itemDescription}>{featuredArticle.summary}</Text>
        </AppCard>
      </View>
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
