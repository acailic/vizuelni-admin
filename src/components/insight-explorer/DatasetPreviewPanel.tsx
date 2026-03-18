'use client';

import { Loader2, ExternalLink, BarChart2, Table2, Calendar, Building2 } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { BrowseDataset } from '@/types/browse';
import type { Observation } from '@/types/observation';

const MAX_PREVIEW_ROWS = 6;
const MAX_PREVIEW_COLS = 6;

const LABELS = {
  loading: { 'sr-Cyrl': 'Учитавање...', 'sr-Latn': 'Učitavanje...', en: 'Loading...' },
  selectPrompt: {
    'sr-Cyrl': 'Изаберите скуп података за преглед',
    'sr-Latn': 'Izaberite skup podataka za pregled',
    en: 'Select a dataset to preview',
  },
  previewLabel: {
    'sr-Cyrl': 'Преглед података',
    'sr-Latn': 'Pregled podataka',
    en: 'Data preview',
  },
  rows: { 'sr-Cyrl': 'редова', 'sr-Latn': 'redova', en: 'rows' },
  cols: { 'sr-Cyrl': 'колона', 'sr-Latn': 'kolona', en: 'columns' },
  visualize: {
    'sr-Cyrl': 'Отвори пример',
    'sr-Latn': 'Otvori primer',
    en: 'Open example',
  },
  errorTitle: {
    'sr-Cyrl': 'Преглед недоступан',
    'sr-Latn': 'Pregled nedostupan',
    en: 'Preview unavailable',
  },
  updated: { 'sr-Cyrl': 'Ажурирано', 'sr-Latn': 'Ažurirano', en: 'Updated' },
} as const;

function label<K extends keyof typeof LABELS>(key: K, locale: Locale): string {
  return LABELS[key][locale] ?? LABELS[key].en;
}

interface DatasetPreviewPanelProps {
  locale: Locale;
  dataset: BrowseDataset | null;
  observations: Observation[] | null;
  isLoading: boolean;
  error: Error | null;
  basePath?: string;
}

export function DatasetPreviewPanel({
  locale,
  dataset,
  observations,
  isLoading,
  error,
  basePath = '',
}: DatasetPreviewPanelProps) {
  if (!dataset) {
    return (
      <div className='flex h-full min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6'>
        <Table2 className='h-10 w-10 text-slate-200' />
        <p className='text-sm text-slate-400'>{label('selectPrompt', locale)}</p>
      </div>
    );
  }

  const demoGalleryUrl = `${basePath}/${locale}/demo-gallery/?example=${dataset.id}`;

  return (
    <div className='flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6'>
      {/* Header */}
      <div className='flex flex-col gap-1'>
        {dataset.organization && (
          <div className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400'>
            <Building2 className='h-3.5 w-3.5' />
            <span>{dataset.organization.name}</span>
          </div>
        )}
        <h3 className='text-base font-semibold leading-tight text-slate-800'>
          {dataset.title}
        </h3>
        {dataset.last_modified && (
          <div className='flex items-center gap-1 text-xs text-slate-400'>
            <Calendar className='h-3 w-3' />
            <span>
              {label('updated', locale)}{' '}
              {new Date(dataset.last_modified).toLocaleDateString(
                locale === 'sr-Cyrl' || locale === 'sr-Latn' ? 'sr-RS' : 'en-US',
                { year: 'numeric', month: 'short', day: 'numeric' }
              )}
            </span>
          </div>
        )}
      </div>

      {/* Data preview */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
            {label('previewLabel', locale)}
          </span>
          {observations && (
            <span className='text-xs text-slate-400'>
              {observations.length.toLocaleString()} {label('rows', locale)}
              {' · '}
              {Object.keys(observations[0] ?? {}).length} {label('cols', locale)}
            </span>
          )}
        </div>

        {isLoading && (
          <div className='flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 py-8'>
            <Loader2 className='h-4 w-4 animate-spin text-gov-secondary' />
            <span className='text-sm text-slate-500'>{label('loading', locale)}</span>
          </div>
        )}

        {error && !isLoading && (
          <div className='rounded-xl border border-red-100 bg-red-50 px-4 py-3'>
            <p className='text-xs font-medium text-red-600'>{label('errorTitle', locale)}</p>
            <p className='mt-0.5 text-xs text-red-400'>{error.message}</p>
          </div>
        )}

        {observations && observations.length > 0 && (
          <PreviewTable observations={observations} />
        )}
      </div>

      {/* Action */}
      <a
        href={demoGalleryUrl}
        className='flex items-center justify-center gap-2 rounded-xl bg-gov-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gov-primary/90'
      >
        <BarChart2 className='h-4 w-4' />
        {label('visualize', locale)}
        <ExternalLink className='h-3.5 w-3.5 opacity-60' />
      </a>
    </div>
  );
}

function PreviewTable({ observations }: { observations: Observation[] }) {
  const cols = Object.keys(observations[0]).slice(0, MAX_PREVIEW_COLS);
  const rows = observations.slice(0, MAX_PREVIEW_ROWS);

  return (
    <div className='overflow-x-auto rounded-xl border border-slate-100'>
      <table className='w-full min-w-full text-xs'>
        <thead>
          <tr className='border-b border-slate-100 bg-slate-50'>
            {cols.map((col) => (
              <th
                key={col}
                className='whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide text-slate-500'
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
            >
              {cols.map((col) => (
                <td key={col} className='whitespace-nowrap px-3 py-1.5 text-slate-700'>
                  {row[col] == null ? (
                    <span className='text-slate-300'>—</span>
                  ) : (
                    String(row[col])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
