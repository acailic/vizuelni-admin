'use client';

import type { Locale } from '@/lib/i18n/config';
import type { ShowcaseCategory } from '@/lib/examples/types';

interface DemoGalleryTabsProps {
  activeCategory: ShowcaseCategory | 'all';
  onCategoryChange: (category: ShowcaseCategory | 'all') => void;
  locale: Locale;
  labels: Record<string, string>;
}

const categories: (ShowcaseCategory | 'all')[] = [
  'all',
  'demographics',
  'healthcare',
  'economy',
  'migration',
  'society',
];

export function DemoGalleryTabs({
  activeCategory,
  onCategoryChange,
  locale,
  labels,
}: DemoGalleryTabsProps) {
  const groupLabel =
    locale === 'sr-Cyrl'
      ? 'Филтрирајте по категорији'
      : locale === 'sr-Latn'
        ? 'Filtrirajte po kategoriji'
        : 'Filter by category';

  return (
    <div
      className='mb-6 flex flex-wrap gap-3'
      role='toolbar'
      aria-label={groupLabel}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          type='button'
          onClick={() => onCategoryChange(cat)}
          aria-pressed={activeCategory === cat}
          className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2 ${
            activeCategory === cat
              ? 'border-gov-primary bg-gov-primary text-white shadow-sm'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100'
          }`}
        >
          {labels[cat] ?? cat}
        </button>
      ))}
    </div>
  );
}
