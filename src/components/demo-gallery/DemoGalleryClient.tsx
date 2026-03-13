'use client';

import { useState } from 'react';
import type {
  FeaturedExampleConfig,
  ShowcaseCategory,
} from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { DemoGalleryTabs } from './DemoGalleryTabs';
import { DemoGalleryCard } from './DemoGalleryCard';
import { DemoGalleryModal } from './DemoGalleryModal';

interface DemoGalleryClientProps {
  examples: FeaturedExampleConfig[];
  locale: Locale;
  labels: {
    title: string;
    subtitle: string;
    categories: Record<string, string>;
    modal: {
      close: string;
      viewData: string;
      hideData: string;
    };
  };
}

export function DemoGalleryClient({
  examples,
  locale,
  labels,
}: DemoGalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState<
    ShowcaseCategory | 'all'
  >('all');
  const [selectedExample, setSelectedExample] =
    useState<FeaturedExampleConfig | null>(null);

  const filteredExamples =
    activeCategory === 'all'
      ? examples
      : examples.filter((ex) => ex.category === activeCategory);

  return (
    <div>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          {labels.title}
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>{labels.subtitle}</p>
      </div>

      {/* Tabs */}
      <DemoGalleryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        locale={locale}
        labels={labels.categories}
      />

      {/* Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {filteredExamples.map((example) => (
          <DemoGalleryCard
            key={example.id}
            example={example}
            locale={locale}
            onClick={() => setSelectedExample(example)}
          />
        ))}
      </div>

      {filteredExamples.length === 0 && (
        <div className='text-center py-12 text-gray-500'>
          {locale === 'sr-Cyrl'
            ? 'Нема примера у овој категорији'
            : locale === 'sr-Latn'
              ? 'Nema primera u ovoj kategoriji'
              : 'No examples in this category'}
        </div>
      )}

      {/* Modal */}
      <DemoGalleryModal
        example={selectedExample}
        isOpen={!!selectedExample}
        onClose={() => setSelectedExample(null)}
        locale={locale}
        labels={labels.modal}
      />
    </div>
  );
}
