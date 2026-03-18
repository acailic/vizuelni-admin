/**
 * @file insight-generator.ts
 * @description Generate AI-powered insights
 */

import type { Insight } from '@/components/ai/InsightDisplay';
import { trendAnalyzer } from './trend-analyzer';

export class InsightGenerator {
  async generateInsights(
    data: number[],
    locale: string = 'en'
  ): Promise<Insight[]> {
    const insights: Insight[] = [];

    const trend = trendAnalyzer.analyzeTrend(data);

    if (trend.direction !== 'stable') {
      insights.push({
        type: 'trend',
        title: locale === 'sr-Cyrl' ? 'Тренд' : 'Trend Analysis',
        description:
          locale === 'sr-Cyrl'
            ? `${trend.direction === 'increasing' ? 'Растући' : 'Опадајући'} тренд од ${Math.abs(trend.magnitude).toFixed(1)}%`
            : `${trend.direction === 'increasing' ? 'Increasing' : 'Decreasing'} trend of ${Math.abs(trend.magnitude).toFixed(1)}%`,
        confidence: trend.confidence,
        importance: Math.abs(trend.magnitude) > 20 ? 'high' : 'medium',
      });
    }

    return insights;
  }
}

export const insightGenerator = new InsightGenerator();
