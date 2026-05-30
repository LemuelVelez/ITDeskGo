import { StyleSheet, Text, View } from 'react-native';

import { KnowledgeArticle, RoleKey, knowledgeArticles } from '../../constants/app';
import { colors, spacing, typography } from '../../constants/theme';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { Badge } from '../Badge';
import { Screen } from '../Screen';

const copy: Record<Extract<RoleKey, 'employee' | 'itStaff'>, { title: string; description: string; action: string }> = {
  employee: {
    title: 'Knowledge Base',
    description: 'Search self-service guides for common IT requests, troubleshooting, and asset policies.',
    action: 'Search',
  },
  itStaff: {
    title: 'Knowledge Base',
    description: 'Maintain support articles that reduce repeat tickets and improve employee self-service.',
    action: 'New Article',
  },
};

type KnowledgeBaseScreenProps = {
  role: Extract<RoleKey, 'employee' | 'itStaff'>;
};

export function KnowledgeBaseScreen({ role }: KnowledgeBaseScreenProps) {
  const screenCopy = copy[role];

  return (
    <Screen
      title={screenCopy.title}
      description={screenCopy.description}
      rightSlot={<AppButton title={screenCopy.action} variant="secondary" style={styles.actionButton} />}
    >
      <View style={styles.stack}>
        {knowledgeArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </View>
    </Screen>
  );
}

function ArticleCard({ article }: { article: KnowledgeArticle }) {
  return (
    <AppCard>
      <View style={styles.header}>
        <Badge label={article.category} tone="blue" />
        <Text style={styles.readTime}>{article.readTime}</Text>
      </View>
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.summary}>{article.summary}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  readTime: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  stack: {
    gap: spacing.md,
  },
  summary: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontSize: typography.subtitle,
    fontWeight: '900',
    marginTop: spacing.md,
  },
});
