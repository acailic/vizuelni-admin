'use client';

import { Search, RefreshCw, CloudOff } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';

export type EmptyStateType =
  | 'no-results'
  | 'api-unavailable'
  | 'preview-failed';

interface EmptySearchResultsProps {
  locale: Locale;
  type?: EmptyStateType;
  searchQuery?: string;
  onRetry?: () => void;
  onClearFilters?: () => void;
}

const LABELS = {
  'no-results': {
    title: {
      'sr-Cyrl': 'Нема резултата',
      'sr-Latn': 'Nema rezultata',
      en: 'No results found',
    },
    description: {
      'sr-Cyrl': 'Покушајте са другим појмом',
      'sr-Latn': 'Pokušajte sa drugim pojmom',
      en: 'Try a different search term',
    },
    action: {
      'sr-Cyrl': 'Очисти филтере',
      'sr-Latn': 'Očisti filtere',
      en: 'Clear filters',
    },
  },
  'api-unavailable': {
    title: {
      'sr-Cyrl': 'Каталог недоступан',
      'sr-Latn': 'Katalog nedostupan',
      en: 'Catalog unavailable',
    },
    description: {
      'sr-Cyrl': 'Покушајте поново касније',
      'sr-Latn': 'Pokušajte ponovo kasnije',
      en: 'Please try again later',
    },
    action: {
      'sr-Cyrl': 'Покушај поново',
      'sr-Latn': 'Pokušaj ponovo',
      en: 'Try again',
    },
  },
  'preview-failed': {
    title: {
      'sr-Cyrl': 'Преглед није доступан',
      'sr-Latn': 'Pregled nije dostupan',
      en: 'Preview unavailable',
    },
    description: {
      'sr-Cyrl': 'Подаци не могу бити учитани',
      'sr-Latn': 'Podaci ne mogu biti učitani',
      en: 'Data could not be loaded',
    },
    action: {
      'sr-Cyrl': 'Покушај поново',
      'sr-Latn': 'Pokušaj ponovo',
      en: 'Try again',
    },
  },
} as const;

export function EmptySearchResults({
  locale,
  type = 'no-results',
  searchQuery,
  onRetry,
  onClearFilters,
}: EmptySearchResultsProps) {
  const labels = LABELS[type] ?? LABELS['no-results'];

  const Icon =
    type === 'api-unavailable'
      ? CloudOff
      : type === 'preview-failed'
        ? RefreshCw
        : Search;
  const handleAction = type === 'no-results' ? onClearFilters : onRetry;

  return (
    <div className='flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center'>
      <div className='rounded-full bg-slate-100 p-4'>
        <Icon className='h-6 w-6 text-slate-400' />
      </div>
      <h3 className='mt-4 text-lg font-semibold text-slate-900'>
        {labels.title[locale]}
      </h3>
      <p className='mt-2 text-sm text-slate-500'>
        {searchQuery
          ? `${labels.description[locale]} "${searchQuery}"`
          : labels.description[locale]}
      </p>
      {handleAction && (
        <button
          onClick={handleAction}
          className='mt-6 rounded-xl bg-gov-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-gov-secondary'
        >
          {labels.action[locale]}
        </button>
      )}
    </div>
  );
}
