import type { Locale } from '@/lib/i18n/config';
import type { GeneratedInsight } from '@/types/insight-explorer';

export function generateKeyInsights(
  data: Record<string, unknown>[],
  locale: Locale
): GeneratedInsight[] {
  if (!data || data.length === 0) return [];

  const insights: GeneratedInsight[] = [];
  const firstRow = data[0];
  const keys = Object.keys(firstRow);

  // Find numeric columns
  const numericKeys = keys.filter((key) => typeof firstRow[key] === 'number');

  if (numericKeys.length > 0) {
    const numericKey = numericKeys[0];
    const values = data
      .map((row) => Number(row[numericKey]))
      .filter((v) => !isNaN(v));

    if (values.length > 0) {
      const max = Math.max(...values);
      const min = Math.min(...values);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;

      insights.push({
        text:
          locale === 'sr-Cyrl'
            ? `Просек: ${avg.toFixed(1)}`
            : locale === 'sr-Latn'
              ? `Prosek: ${avg.toFixed(1)}`
              : `Average: ${avg.toFixed(1)}`,
        type: 'observation',
        confidence: 'high',
      });

      insights.push({
        text:
          locale === 'sr-Cyrl'
            ? `Опсег: ${min.toFixed(1)} - ${max.toFixed(1)}`
            : locale === 'sr-Latn'
              ? `Opseg: ${min.toFixed(1)} - ${max.toFixed(1)}`
              : `Range: ${min.toFixed(1)} - ${max.toFixed(1)}`,
        type: 'observation',
        confidence: 'high',
      });
    }
  }

  return insights;
}
