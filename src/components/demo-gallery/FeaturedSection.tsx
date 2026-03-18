'use client';

import type { FeaturedExampleConfig } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { VisualizationCard } from './VisualizationCard';
import type { GalleryPanel } from './galleryUtils';

interface FeaturedSectionProps {
  examples: FeaturedExampleConfig[];
  locale: Locale;
  labels: {
    title: string;
    description: string;
    openExample: string;
    previewLoading: string;
    previewUnavailable: string;
    previewFailed: string;
    preview: string;
    open: string;
    embed: string;
    embedCopied: string;
    metadataLabel: string;
    officialLabel: string;
    trustedSourceLabel: string;
    updatedLabel: string;
  };
  onOpenExample: (example: FeaturedExampleConfig, panel?: GalleryPanel) => void;
}

export function FeaturedSection({
  examples,
  locale,
  labels,
  onOpenExample,
}: FeaturedSectionProps) {
  if (examples.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby='featured-visualizations'
      className='rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(241,245,249,0.78),rgba(255,255,255,0.98))] p-5 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.45)]'
    >
      <div className='mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-gov-primary'>
            {labels.title}
          </p>
          <h2
            id='featured-visualizations'
            className='mt-2 text-2xl font-semibold text-slate-950'
          >
            {labels.description}
          </h2>
        </div>
        <p className='max-w-xl text-sm leading-6 text-slate-600'>
          {locale === 'en'
            ? 'A curated starting point for journalists, analysts, and public-sector teams.'
            : locale === 'sr-Latn'
              ? 'Kurirani početak za novinare, analitičare i javni sektor.'
              : 'Курирани почетак за новинаре, аналитичаре и јавни сектор.'}
        </p>
      </div>
      <div className='grid gap-4 xl:grid-cols-3'>
        {examples.map((example, index) => (
          <VisualizationCard
            key={example.id}
            example={example}
            locale={locale}
            variant={index === 0 ? 'featured-primary' : 'featured'}
            onOpenExample={onOpenExample}
            labels={labels}
          />
        ))}
      </div>
    </section>
  );
}
