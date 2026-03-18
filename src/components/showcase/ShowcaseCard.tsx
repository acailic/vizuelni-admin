'use client';

import Link from 'next/link';
import type {
  FeaturedExampleConfig,
  ShowcaseCategory,
} from '@/lib/examples/types';
import { getLocalizedText } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { CategoryBadge } from './CategoryBadge';
import { ChartRenderer } from '@/components/charts/ChartRenderer';

interface ShowcaseCardProps {
  example: FeaturedExampleConfig;
  locale: Locale;
  showEditButton?: boolean;
}

const chartTypeLabels: Record<string, Record<Locale, string>> = {
  line: {
    'sr-Cyrl': 'Линијски',
    'sr-Latn': 'Linijski',
    en: 'Line',
  },
  bar: {
    'sr-Cyrl': 'Тракасти',
    'sr-Latn': 'Trakasti',
    en: 'Bar',
  },
  column: {
    'sr-Cyrl': 'Стубасти',
    'sr-Latn': 'Stubasti',
    en: 'Column',
  },
  pie: {
    'sr-Cyrl': 'Пита',
    'sr-Latn': 'Pita',
    en: 'Pie',
  },
  scatterplot: {
    'sr-Cyrl': 'Расејање',
    'sr-Latn': 'Rasejanje',
    en: 'Scatter',
  },
  area: {
    'sr-Cyrl': 'Површински',
    'sr-Latn': 'Površinski',
    en: 'Area',
  },
};

export function ShowcaseCard({
  example,
  locale,
  showEditButton = true,
}: ShowcaseCardProps) {
  const title = getLocalizedText(example.title, locale);
  const description = getLocalizedText(example.description, locale);
  const chartTypeLabel =
    chartTypeLabels[example.chartConfig.type]?.[locale] ??
    example.chartConfig.type;

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow'>
      {/* Chart Preview */}
      <div className='h-48 bg-gray-50 dark:bg-gray-900 p-2'>
        {example.inlineData ? (
          <ChartRenderer
            config={example.chartConfig}
            data={example.inlineData.observations}
            locale={locale}
            previewMode={true}
          />
        ) : (
          <div className='h-full flex items-center justify-center text-gray-400'>
            No preview available
          </div>
        )}
      </div>

      {/* Content */}
      <div className='p-4'>
        <div className='flex items-start justify-between gap-2 mb-2'>
          <h3 className='font-semibold text-gray-900 dark:text-white text-sm line-clamp-1'>
            {title}
          </h3>
          <span className='text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded'>
            {chartTypeLabel}
          </span>
        </div>

        <p className='text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3'>
          {description}
        </p>

        <div className='flex items-center justify-between'>
          {example.category && (
            <CategoryBadge
              category={example.category as ShowcaseCategory}
              locale={locale}
            />
          )}

          {showEditButton && (
            <Link
              href={`/${locale}/create?template=${example.id}`}
              className='text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium'
            >
              {locale === 'sr-Cyrl'
                ? 'Уреди'
                : locale === 'sr-Latn'
                  ? 'Uredi'
                  : 'Edit'}{' '}
              →
            </Link>
          )}
        </div>

        {example.dataSource && (
          <div className='mt-3 pt-3 border-t border-gray-100 dark:border-gray-700'>
            <p className='text-xs text-gray-400 dark:text-gray-500'>
              {example.dataSource}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
