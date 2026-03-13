'use client';

import type { ShowcaseCategory } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';

interface CategoryBadgeProps {
  category: ShowcaseCategory;
  locale: Locale;
  className?: string;
}

const categoryLabels: Record<ShowcaseCategory, Record<Locale, string>> = {
  demographics: {
    'sr-Cyrl': 'Демографија',
    'sr-Latn': 'Demografija',
    en: 'Demographics',
  },
  healthcare: {
    'sr-Cyrl': 'Здравство',
    'sr-Latn': 'Zdravstvo',
    en: 'Healthcare',
  },
  economy: {
    'sr-Cyrl': 'Економија',
    'sr-Latn': 'Ekonomija',
    en: 'Economy',
  },
  migration: {
    'sr-Cyrl': 'Миграција',
    'sr-Latn': 'Migracija',
    en: 'Migration',
  },
  society: {
    'sr-Cyrl': 'Друштво',
    'sr-Latn': 'Društvo',
    en: 'Society',
  },
};

const categoryColors: Record<ShowcaseCategory, string> = {
  demographics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  healthcare:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  economy: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  migration:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  society: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export function CategoryBadge({
  category,
  locale,
  className = '',
}: CategoryBadgeProps) {
  const label = categoryLabels[category]?.[locale] ?? category;
  const colorClass = categoryColors[category] ?? 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}
    >
      {label}
    </span>
  );
}
