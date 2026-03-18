import type { Locale } from '@/lib/i18n/config';
import type { PopularInsight } from '@/types/insight-explorer';

export const POPULAR_INSIGHTS: PopularInsight[] = [
  {
    id: 'population-trends',
    title: {
      'sr-Cyrl': 'Демографски трендови',
      'sr-Latn': 'Demografski trendovi',
      en: 'Demographic Trends',
    },
    subtitle: {
      'sr-Cyrl': 'Пратите промене у становништву Србије',
      'sr-Latn': 'Pratite promene u stanovništvu Srbije',
      en: "Track changes in Serbia's population",
    },
    chartType: 'line',
    searchParams: { topic: 'demographics' },
    datasetId: 'population-by-municipality',
    freshness: 'this-month',
  },
  {
    id: 'traffic-safety',
    title: {
      'sr-Cyrl': 'Саобраћајна безбедност',
      'sr-Latn': 'Saobracajna bezbednost',
      en: 'Traffic Safety',
    },
    subtitle: {
      'sr-Cyrl': 'Статистика саобраћајних незгода',
      'sr-Latn': 'Statistika saobracajnih nezgoda',
      en: 'Traffic accident statistics',
    },
    chartType: 'bar',
    searchParams: { topic: 'safety' },
    datasetId: 'traffic-accidents',
    freshness: 'this-week',
    badge: {
      type: 'trending',
      label: {
        'sr-Cyrl': 'Трендинг',
        'sr-Latn': 'Trending',
        en: 'Trending',
      },
    },
  },
];

export function getLocalizedInsightTitle(
  insight: PopularInsight,
  locale: Locale
): string {
  return insight.title[locale] ?? insight.title.en;
}
