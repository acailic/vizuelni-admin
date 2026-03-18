'use client';

import {
  BarChart3,
  Calendar,
  Database,
  ExternalLink,
  LineChart,
  PieChart,
} from 'lucide-react';
import Link from 'next/link';

import { ChartRenderer } from '@/components/charts/ChartRenderer';
import { getDemoExampleById } from '@/lib/examples/demo-gallery-examples';
import type {
  FeaturedExampleConfig,
  ShowcaseCategory,
} from '@/lib/examples/types';
import { getLocalizedText } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';

interface FeaturedExamplesCuratedProps {
  locale: Locale;
}

// Hardcoded IDs for curated featured examples
const CURATED_EXAMPLE_IDS = [
  'demo-population-pyramid',
  'demo-cancer-incidence',
  'demo-gdp-growth',
  'demo-diaspora-destinations',
] as const;

// Chart type icons map
const chartTypeIcons: Record<string, typeof LineChart> = {
  line: LineChart,
  bar: BarChart3,
  column: BarChart3,
  area: BarChart3,
  pie: PieChart,
  scatterplot: BarChart3,
  table: BarChart3,
  combo: BarChart3,
  map: BarChart3,
  'population-pyramid': BarChart3,
};

// Category labels by locale
const categoryLabels: Record<Locale, Record<ShowcaseCategory, string>> = {
  'sr-Cyrl': {
    demographics: 'Демографија',
    healthcare: 'Здравство',
    economy: 'Економија',
    migration: 'Миграције',
    society: 'Друштво',
  },
  'sr-Latn': {
    demographics: 'Demografija',
    healthcare: 'Zdravstvo',
    economy: 'Ekonomija',
    migration: 'Migracije',
    society: 'Društvo',
  },
  en: {
    demographics: 'Demographics',
    healthcare: 'Healthcare',
    economy: 'Economy',
    migration: 'Migration',
    society: 'Society',
  },
};

// Section titles by locale
const sectionTitles: Record<
  Locale,
  { title: string; description: string; viewAll: string }
> = {
  'sr-Cyrl': {
    title: 'Истражите примере',
    description: 'Видите како званични подаци могу да се визуелизују',
    viewAll: 'Види све примере',
  },
  'sr-Latn': {
    title: 'Istražite primere',
    description: 'Vidite kako zvanični podaci mogu da se vizuelizuju',
    viewAll: 'Vidi sve primere',
  },
  en: {
    title: 'Explore Examples',
    description: 'See how official data can be visualized',
    viewAll: 'View all examples',
  },
};

// Updated labels by locale
const updatedLabels: Record<Locale, string> = {
  'sr-Cyrl': 'Ажурирано',
  'sr-Latn': 'Ažurirano',
  en: 'Updated',
};

// Source labels by locale
const sourceLabels: Record<Locale, string> = {
  'sr-Cyrl': 'Извор',
  'sr-Latn': 'Izvor',
  en: 'Source',
};

/**
 * Get the data period from the inlineData observations
 */
function getDataPeriod(config: FeaturedExampleConfig): string | null {
  if (!config.inlineData?.observations?.length) return null;

  const observations = config.inlineData.observations;
  const yearField = observations[0]?.year;
  const dateField = observations[0]?.date;

  if (yearField) {
    const years = observations
      .map((o) => (o.year ? Number(o.year) : null))
      .filter(Boolean) as number[];
    if (years.length > 0) {
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      return minYear === maxYear ? String(minYear) : `${minYear} - ${maxYear}`;
    }
  }

  if (dateField) {
    const dates = observations
      .map((o) => (o.date ? String(o.date) : null))
      .filter(Boolean) as string[];
    if (dates.length > 0) {
      dates.sort();
      const minDate = dates[0].slice(0, 4);
      const maxDate = dates[dates.length - 1].slice(0, 4);
      return minDate === maxDate ? minDate : `${minDate} - ${maxDate}`;
    }
  }

  return null;
}

/**
 * FeaturedExamplesCurated component
 * Displays 4 curated examples with chart previews and data trust information
 */
export function FeaturedExamplesCurated({
  locale,
}: FeaturedExamplesCuratedProps) {
  const texts = sectionTitles[locale];
  const catLabels = categoryLabels[locale];

  // Get curated examples by ID
  const curatedExamples = CURATED_EXAMPLE_IDS.map((id) =>
    getDemoExampleById(id)
  ).filter(Boolean) as FeaturedExampleConfig[];

  return (
    <section className='py-12' aria-labelledby='featured-examples-title'>
      <header className='mb-8 text-center'>
        <h2
          id='featured-examples-title'
          className='text-2xl font-bold text-gray-900'
        >
          {texts.title}
        </h2>
        <p className='mt-2 max-w-2xl mx-auto text-gray-600'>
          {texts.description}
        </p>
      </header>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {curatedExamples.map((config) => {
          const title = getLocalizedText(config.title, locale);
          const description = getLocalizedText(config.description, locale);
          const chartType = config.chartConfig.type as string;
          const ChartIcon = chartTypeIcons[chartType] || BarChart3;
          const category = config.category;
          const period = getDataPeriod(config);

          return (
            <Link
              key={config.id}
              href={`/${locale}/demo-gallery?example=${config.id}`}
              className='group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md flex flex-col'
              aria-label={title}
            >
              {/* Chart area */}
              <div className='aspect-video bg-gray-50 shrink-0'>
                {config.inlineData && (
                  <ChartRenderer
                    config={config.chartConfig}
                    data={config.inlineData.observations}
                    height={180}
                    locale={locale}
                    previewMode={true}
                    preselectedFilters={config.preselectedFilters}
                  />
                )}
              </div>

              {/* Content area */}
              <div className='p-4 flex flex-col flex-1'>
                <h3 className='line-clamp-1 font-semibold text-gray-900 group-hover:text-blue-600'>
                  {title}
                </h3>
                <p className='mt-1 line-clamp-2 text-sm text-gray-600 flex-1'>
                  {description}
                </p>

                {/* Badges row */}
                <div className='mt-3 flex flex-wrap items-center gap-2'>
                  {/* Chart type badge */}
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'>
                    <ChartIcon className='h-3 w-3' />
                    {chartType.charAt(0).toUpperCase() +
                      chartType.slice(1).replace('-', ' ')}
                  </span>

                  {/* Category badge */}
                  {category && (
                    <span className='inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700'>
                      {catLabels[category]}
                    </span>
                  )}
                </div>

                {/* Data trust row */}
                <div className='mt-3 pt-3 border-t border-gray-100 space-y-1.5'>
                  {/* Source */}
                  {config.dataSource && (
                    <div className='flex items-center gap-1.5 text-xs text-gray-500'>
                      <Database className='h-3 w-3 shrink-0' />
                      <span className='truncate' title={config.dataSource}>
                        {sourceLabels[locale]}: {config.dataSource}
                      </span>
                    </div>
                  )}

                  {/* Period and Last Updated row */}
                  <div className='flex items-center gap-3 text-xs text-gray-500'>
                    {period && (
                      <span className='flex items-center gap-1'>
                        <Calendar className='h-3 w-3' />
                        {period}
                      </span>
                    )}
                    {config.lastUpdated && (
                      <span className='flex items-center gap-1'>
                        {updatedLabels[locale]}: {config.lastUpdated}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View all link */}
      <div className='mt-8 text-center'>
        <Link
          href={`/${locale}/demo-gallery`}
          className='inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline'
        >
          {texts.viewAll}
          <ExternalLink className='h-4 w-4' />
        </Link>
      </div>
    </section>
  );
}
