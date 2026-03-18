'use client';

import type { ShowcaseCategory } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';

const categories: (ShowcaseCategory | 'all')[] = [
  'all',
  'demographics',
  'healthcare',
  'economy',
  'migration',
  'society',
];

interface CategoryFilterBarProps {
  activeCategory: ShowcaseCategory | 'all';
  counts: Partial<Record<ShowcaseCategory | 'all', number>>;
  onCategoryChange: (category: ShowcaseCategory | 'all') => void;
  locale: Locale;
  labels: Record<string, string>;
  heading: string;
}

export function CategoryFilterBar({
  activeCategory,
  counts,
  onCategoryChange,
  locale,
  labels,
  heading,
}: CategoryFilterBarProps) {
  return (
    <section
      aria-labelledby='demo-gallery-category-heading'
      className='rounded-[1.8rem] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.3)]'
    >
      <div className='mb-3 flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2
            id='demo-gallery-category-heading'
            className='text-sm font-semibold uppercase tracking-[0.16em] text-slate-500'
          >
            {heading}
          </h2>
          <p className='mt-1 text-sm text-slate-600'>
            {labels[activeCategory] ?? activeCategory} ·{' '}
            {counts[activeCategory] ?? 0}
          </p>
        </div>
        <p className='text-xs text-slate-500'>
          {locale === 'en'
            ? 'Filters update results immediately.'
            : locale === 'sr-Latn'
              ? 'Filteri odmah ažuriraju rezultate.'
              : 'Филтери одмах ажурирају резултате.'}
        </p>
      </div>
      <div className='relative'>
        <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-hide'>
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type='button'
                onClick={() => onCategoryChange(category)}
                aria-pressed={isActive}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gov-primary/20 ${
                  isActive
                    ? 'bg-gov-primary text-white shadow-md ring-2 ring-gov-primary/30 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>
                  {labels[category] ?? category}
                  {category === 'all' && <span className='ml-1 text-xs opacity-70'>★</span>}
                </span>
                <span className='ml-1.5 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-inherit px-1.5 py-0.5 text-xs font-semibold transition-all duration-200'>
                  {counts[category] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
        <div className='pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent' />
      </div>
    </section>
  );
}
