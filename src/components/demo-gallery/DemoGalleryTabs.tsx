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
  locale: _locale,
  labels,
}: DemoGalleryTabsProps) {
  return (
    <div className='flex flex-wrap gap-2 mb-6'>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === cat
              ? 'bg-gov-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {labels[cat] ?? cat}
        </button>
      ))}
    </div>
  );
}
