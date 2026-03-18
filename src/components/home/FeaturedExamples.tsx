'use client';

import { useState } from 'react';

import { demoGalleryExamples } from '@/lib/examples/demo-gallery-examples';
import type {
  FeaturedExampleConfig,
  ShowcaseCategory,
} from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';

import { ExampleCard } from './ExampleCard';

interface FeaturedExamplesProps {
  locale: Locale;
}

const CURATED_SHOWCASE_IDS = [
  'demo-population-pyramid',
  'demo-cancer-incidence',
  'demo-gdp-growth',
  'demo-diaspora-destinations',
  'demo-education-levels',
] as const;

const CURATED_EXAMPLES = CURATED_SHOWCASE_IDS.map((id) =>
  demoGalleryExamples.find((example) => example.id === id)
).filter(Boolean) as FeaturedExampleConfig[];

const categoryLabelByLocale: Record<
  Locale,
  Record<'all' | ShowcaseCategory, string>
> = {
  'sr-Cyrl': {
    all: 'Сви',
    demographics: 'Демографија',
    healthcare: 'Здравство',
    economy: 'Економија',
    migration: 'Миграције',
    society: 'Друштво',
  },
  'sr-Latn': {
    all: 'Svi',
    demographics: 'Demografija',
    healthcare: 'Zdravstvo',
    economy: 'Ekonomija',
    migration: 'Migracije',
    society: 'Društvo',
  },
  en: {
    all: 'All',
    demographics: 'Demographics',
    healthcare: 'Healthcare',
    economy: 'Economy',
    migration: 'Migration',
    society: 'Society',
  },
};

const sectionTitles: Record<
  Locale,
  {
    title: string;
    description: string;
    emptyCategory: string;
  }
> = {
  'sr-Cyrl': {
    title: 'Видите како то ради',
    description:
      'Истражите стварне визуелизације направљене од званичних података српске владе',
    emptyCategory: 'Нема примера у овој категорији',
  },
  'sr-Latn': {
    title: 'Vidite kako to radi',
    description:
      'Istražite stvarne vizuelizacije napravljene od zvaničnih podataka srpske vlade',
    emptyCategory: 'Nema primera u ovoj kategoriji',
  },
  en: {
    title: 'See It In Action',
    description:
      'Explore real visualizations built from official Serbian government data',
    emptyCategory: 'No examples in this category',
  },
};

export function FeaturedExamples({ locale }: FeaturedExamplesProps) {
  const texts = sectionTitles[locale];
  const labels = categoryLabelByLocale[locale];
  const [selectedCategory, setSelectedCategory] = useState<
    ShowcaseCategory | 'all'
  >('all');

  const availableCategories = Array.from(
    new Set(
      CURATED_EXAMPLES.map((example) => example.category).filter(
        (category): category is ShowcaseCategory => Boolean(category)
      )
    )
  );

  const visibleExamples =
    selectedCategory === 'all'
      ? CURATED_EXAMPLES
      : CURATED_EXAMPLES.filter(
          (example) => example.category === selectedCategory
        );

  return (
    <section className='py-12' aria-labelledby='solution-showcase-title'>
      <header className='mb-8 text-center'>
        <h2
          id='solution-showcase-title'
          className='text-2xl font-bold text-gray-900'
        >
          {texts.title}
        </h2>
        <p className='mt-2 max-w-2xl mx-auto text-gray-600'>
          {texts.description}
        </p>
      </header>

      <div className='mb-6 flex flex-wrap justify-center gap-2'>
        {(['all', ...availableCategories] as const).map((category) => (
          <button
            key={category}
            type='button'
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              selectedCategory === category
                ? 'bg-gov-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {labels[category]}
          </button>
        ))}
      </div>

      {visibleExamples.length === 0 ? (
        <div className='rounded-xl border border-gray-200 bg-gray-50 p-8 text-center'>
          <p className='text-gray-500'>{texts.emptyCategory}</p>
        </div>
      ) : (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {visibleExamples.map((config) => (
            <ExampleCard
              key={config.id}
              config={config}
              locale={locale}
              dataset={config.inlineData ?? null}
              status='success'
            />
          ))}
        </div>
      )}
    </section>
  );
}
