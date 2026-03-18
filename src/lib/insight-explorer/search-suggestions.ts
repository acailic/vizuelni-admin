import type { Locale } from '@/lib/i18n/config';
import type { SearchSuggestion } from '@/types/insight-explorer';

export const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  {
    id: 'health-nearby',
    query: 'health nearby',
    label: {
      'sr-Cyrl': 'Здравствени сервиси у близини',
      'sr-Latn': 'Zdravstveni servisi u blizini',
      en: 'Health services nearby',
    },
    icon: 'health',
  },
  {
    id: 'school-ratings',
    query: 'education ratings',
    label: {
      'sr-Cyrl': 'Оцене школа у мојој општини',
      'sr-Latn': 'Ocene škola u mojoj opštini',
      en: 'School ratings in my municipality',
    },
    icon: 'education',
  },
  {
    id: 'traffic-accidents',
    query: 'traffic accidents',
    label: {
      'sr-Cyrl': 'Саобраћајне незгоде ове године',
      'sr-Latn': 'Saobraćajne nezgode ove godine',
      en: 'Traffic accidents this year',
    },
    icon: 'safety',
  },
  {
    id: 'employment-stats',
    query: 'employment statistics',
    label: {
      'sr-Cyrl': 'Статистика запослености',
      'sr-Latn': 'Statistika zaposlenosti',
      en: 'Employment statistics',
    },
    icon: 'economy',
  },
];

export function getLocalizedSuggestionLabel(
  suggestion: SearchSuggestion,
  locale: Locale
): string {
  return suggestion.label[locale] ?? suggestion.label.en;
}
