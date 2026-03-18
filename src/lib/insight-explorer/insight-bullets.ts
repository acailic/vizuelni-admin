import type { Locale } from '@/lib/i18n/config';
import type { InsightBullets } from '@/types/insight-explorer';

export const INSIGHT_BULLETS: InsightBullets[] = [
  {
    datasetId: 'population-by-municipality',
    bullets: {
      'sr-Cyrl': [
        'Видите колико људи живи у вашој општини',
        'Упоредите величину општина у Србији',
        'Пратите демографске промене',
      ],
      'sr-Latn': [
        'Vidite koliko ljudi živi u vašoj opštini',
        'Uporedite veličinu opština u Srbiji',
        'Pratite demografske promene',
      ],
      en: [
        'See how many people live in your municipality',
        'Compare municipality sizes across Serbia',
        'Track demographic changes',
      ],
    },
  },
  {
    datasetId: 'traffic-accidents',
    bullets: {
      'sr-Cyrl': [
        'Сазнајте најопаснија раскрсница',
        'Видите статистику саобраћајних незгода',
        'Проверите безбедност у вашем крају',
      ],
      'sr-Latn': [
        'Saznajte najopasnije raskrsnice',
        'Vidite statistiku saobraćajnih nezgoda',
        'Proverite bezbednost u vašem kraju',
      ],
      en: [
        'Learn about the most dangerous intersections',
        'See traffic accident statistics',
        'Check safety in your area',
      ],
    },
  },
];

export function getInsightBullets(datasetId: string, locale: Locale): string[] {
  const bullets = INSIGHT_BULLETS.find((b) => b.datasetId === datasetId);
  if (!bullets) return [];
  return bullets.bullets[locale] ?? bullets.bullets.en ?? [];
}
