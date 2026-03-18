'use client';

import { Clock, ChevronRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { BrowseDataset } from '@/types/browse';
import { getInsightBullets } from '@/lib/insight-explorer';
import { isPreviewableFormat } from '@/lib/data-gov-api';
import { formatRelativeTime } from '@/lib/i18n/config';

interface CitizenDatasetCardProps {
  locale: Locale;
  dataset: BrowseDataset;
  isSelected: boolean;
  onSelect: () => void;
}

export function CitizenDatasetCard({
  locale,
  dataset,
  isSelected,
  onSelect,
}: CitizenDatasetCardProps) {
  const previewableCount = dataset.resources.filter((r) =>
    isPreviewableFormat(r.format)
  ).length;
  const insightBullets = getInsightBullets(dataset.id, locale);

  const labels = {
    readyToVisualize:
      locale === 'sr-Cyrl'
        ? 'Спремно за визуализацију'
        : locale === 'sr-Latn'
          ? 'Spremno za vizualizaciju'
          : 'Ready to visualize',
    dataOnly:
      locale === 'sr-Cyrl'
        ? 'Само подаци'
        : locale === 'sr-Latn'
          ? 'Samo podaci'
          : 'Data only',
    updated:
      locale === 'sr-Cyrl'
        ? 'Ажурирано'
        : locale === 'sr-Latn'
          ? 'Ažurirano'
          : 'Updated',
    view:
      locale === 'sr-Cyrl'
        ? 'Преглед'
        : locale === 'sr-Latn'
          ? 'Pregled'
          : 'View',
  };

  return (
    <button
      onClick={onSelect}
      className={`group w-full rounded-2xl border px-5 py-5 text-left transition ${
        isSelected
          ? 'border-gov-secondary bg-gov-secondary/5 ring-2 ring-gov-secondary/20'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <p className='truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-400'>
            {dataset.organization?.name ?? 'data.gov.rs'}
          </p>
          <h3 className='mt-1 text-lg font-semibold text-slate-900'>
            {dataset.title}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            previewableCount > 0
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {previewableCount > 0 ? labels.readyToVisualize : labels.dataOnly}
        </span>
      </div>

      {insightBullets.length > 0 && (
        <div className='mt-4 space-y-1.5'>
          {insightBullets.slice(0, 3).map((bullet, i) => (
            <p
              key={i}
              className='flex items-start gap-2 text-sm text-slate-600'
            >
              <span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gov-secondary' />
              {bullet}
            </p>
          ))}
        </div>
      )}

      <div className='mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm'>
        <span className='flex items-center gap-1.5 text-slate-500'>
          <Clock className='h-4 w-4' />
          {labels.updated}{' '}
          {formatRelativeTime(dataset.last_modified ?? '', locale)}
        </span>
        <span
          className={`flex items-center gap-1 font-medium ${
            isSelected
              ? 'text-gov-secondary'
              : 'text-slate-400 group-hover:text-gov-secondary'
          }`}
        >
          {labels.view}
          <ChevronRight className='h-4 w-4 transition group-hover:translate-x-0.5' />
        </span>
      </div>
    </button>
  );
}
