'use client';

import { Loader2, Database } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { BrowseDataset } from '@/types/browse';
import { CitizenDatasetCard } from './CitizenDatasetCard';
import { EmptySearchResults } from './EmptySearchResults';

interface CitizenDatasetListProps {
  locale: Locale;
  datasets: BrowseDataset[];
  isLoading: boolean;
  error: Error | null;
  totalDatasets: number;
  selectedDatasetId: string | null;
  onSelectDataset: (datasetId: string) => void;
  onClearFilters: () => void;
}

export function CitizenDatasetList({
  locale,
  datasets,
  isLoading,
  error,
  totalDatasets,
  selectedDatasetId,
  onSelectDataset,
  onClearFilters,
}: CitizenDatasetListProps) {
  const labels = {
    results:
      locale === 'sr-Cyrl'
        ? 'резултата'
        : locale === 'sr-Latn'
          ? 'rezultata'
          : 'results',
    loading:
      locale === 'sr-Cyrl'
        ? 'Учитавање...'
        : locale === 'sr-Latn'
          ? 'Učitavanje...'
          : 'Loading...',
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16'>
        <Loader2 className='h-6 w-6 animate-spin text-gov-secondary' />
        <span className='ml-3 text-slate-500'>{labels.loading}</span>
      </div>
    );
  }

  if (error || datasets.length === 0) {
    return (
      <EmptySearchResults
        locale={locale}
        type={error ? 'api-unavailable' : 'no-results'}
        onRetry={onClearFilters}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4'>
        <Database className='h-5 w-5 text-gov-secondary' />
        <span className='text-sm text-slate-600'>
          {totalDatasets.toLocaleString()} {labels.results}
        </span>
      </div>
      <div className='grid gap-4'>
        {datasets.map((dataset) => (
          <CitizenDatasetCard
            key={dataset.id}
            locale={locale}
            dataset={dataset}
            isSelected={dataset.id === selectedDatasetId}
            onSelect={() => onSelectDataset(dataset.id)}
          />
        ))}
      </div>
    </div>
  );
}
