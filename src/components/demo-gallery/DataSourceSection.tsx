'use client';

import { Database, Download, ExternalLink } from 'lucide-react';

import type { Locale } from '@/lib/i18n/config';
import { formatGalleryDate } from './galleryUtils';

export interface DataSourceSectionProps {
  /** Institution name (e.g., "РЗС - Републички завод за статистику") */
  dataSource?: string;
  /** URL to data.gov.rs dataset page */
  dataSourceUrl?: string;
  /** Direct download URL */
  resourceUrl?: string;
  /** Last updated date string */
  lastUpdated?: string;
  /** Locale for date formatting */
  locale: Locale;
}

/**
 * DataSourceSection - Displays data source information with action buttons
 *
 * Shows institution name, optional "View on data.gov.rs" and "Download" buttons,
 * and last updated date. Conditionally renders only when URLs are available.
 */
export function DataSourceSection({
  dataSource,
  dataSourceUrl,
  resourceUrl,
  lastUpdated,
  locale,
}: DataSourceSectionProps) {
  // Hide entire section if no URLs are available or no dataSource
  if (!dataSource || (!dataSourceUrl && !resourceUrl)) {
    return null;
  }

  // i18n strings (inline for now, will move to locale files)
  const i18n = {
    dataSource: {
      'sr-Cyrl': 'Извор података',
      'sr-Latn': 'Izvor podataka',
      en: 'Data source',
    },
    viewOnDataGov: {
      'sr-Cyrl': 'Погледај на data.gov.rs',
      'sr-Latn': 'Pogledaj na data.gov.rs',
      en: 'View on data.gov.rs',
    },
    downloadData: {
      'sr-Cyrl': 'Преузми податке',
      'sr-Latn': 'Preuzmi podatke',
      en: 'Download data',
    },
    lastUpdated: {
      'sr-Cyrl': 'Ажурирано',
      'sr-Latn': 'Ažurirano',
      en: 'Last updated',
    },
    opensInNewTab: {
      'sr-Cyrl': 'отвара се у новом језичку',
      'sr-Latn': 'otvara se u novom jezičku',
      en: 'opens in new tab',
    },
  };

  const labels = {
    dataSource: i18n.dataSource[locale],
    viewOnDataGov: i18n.viewOnDataGov[locale],
    downloadData: i18n.downloadData[locale],
    lastUpdated: i18n.lastUpdated[locale],
    opensInNewTab: i18n.opensInNewTab[locale],
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Database
          className="h-4 w-4 text-slate-500"
          aria-hidden="true"
        />
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {labels.dataSource}
        </h3>
      </div>

      <p className="mb-3 text-sm font-medium text-slate-900">{dataSource}</p>

      <div className="mb-3 flex flex-wrap gap-2">
        {dataSourceUrl && (
          <a
            href={dataSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gov-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gov-secondary focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2"
            aria-label={`${labels.viewOnDataGov} - ${labels.opensInNewTab}`}
          >
            {labels.viewOnDataGov}
            <ExternalLink
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
          </a>
        )}

        {resourceUrl && (
          <a
            href={resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2"
            aria-label={`${labels.downloadData} - ${labels.opensInNewTab}`}
          >
            <Download
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            {labels.downloadData}
          </a>
        )}
      </div>

      {lastUpdated && (
        <p className="text-xs text-slate-500">
          {labels.lastUpdated}: {formatGalleryDate(lastUpdated, locale)}
        </p>
      )}
    </div>
  );
}
