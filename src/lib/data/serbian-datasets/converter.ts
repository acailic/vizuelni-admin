// src/lib/data/serbian-datasets/converter.ts

import type { SerbianDataset } from './types';
import type { ParsedDataset } from '@/types/observation';
import type { Locale } from '@/lib/i18n/config';

/**
 * Convert a SerbianDataset to ParsedDataset for use in configurator
 */
export function convertToParsedDataset(
  dataset: SerbianDataset,
  locale: Locale
): ParsedDataset {
  const columns = [
    ...dataset.dimensions.map((d) => d.key),
    ...dataset.measures.map((m) => m.key),
  ];

  // Map locale to title key
  const titleKey = locale === 'sr-Cyrl' ? 'sr' : locale === 'sr-Latn' ? 'lat' : 'en';

  return {
    observations: dataset.observations,
    dimensions: dataset.dimensions,
    measures: dataset.measures,
    metadataColumns: [],
    columns,
    rowCount: dataset.observations.length,
    source: {
      datasetId: dataset.id,
      format: 'json',
      fetchedAt: new Date().toISOString(),
      name: dataset.title[titleKey as keyof typeof dataset.title] || dataset.title.en,
    },
  };
}
