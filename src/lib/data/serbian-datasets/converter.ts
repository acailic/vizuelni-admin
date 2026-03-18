// src/lib/data/serbian-datasets/converter.ts

import type { SerbianDataset } from './types';
import type { DimensionMeta, DimensionType, Observation, ParsedDataset } from '@/types/observation';
import type { Locale } from '@/lib/i18n/config';

function normalizeDimensionType(type: string): DimensionType {
  switch (type) {
    case 'temporal':
      return 'temporal';
    case 'geographic':
      return 'geographic';
    case 'categorical':
    case 'nominal':
    case 'ordinal':
    default:
      return 'categorical';
  }
}

function normalizeTemporalValue(value: string | number | Date): string | Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return new Date(Date.UTC(value, 0, 1));
  }

  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? value : new Date(parsed);
  }

  return String(value);
}

function normalizeDimensionValues(
  values: Array<string | number | Date>,
  type: DimensionType
): Array<string | Date> {
  if (type === 'temporal') {
    return values.map(normalizeTemporalValue);
  }

  return values.map(value => (value instanceof Date ? value : String(value)));
}

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

  const normalizedDimensions: DimensionMeta[] = dataset.dimensions.map((dimension) => {
    const type = normalizeDimensionType(dimension.type);

    return {
      key: dimension.key,
      label: dimension.label,
      type,
      values: normalizeDimensionValues(dimension.values, type),
      cardinality: dimension.cardinality,
    };
  });

  // Map locale to title key
  const titleKey =
    locale === 'sr-Cyrl' ? 'sr' : locale === 'sr-Latn' ? 'lat' : 'en';

  return {
    observations: dataset.observations as Observation[],
    dimensions: normalizedDimensions,
    measures: dataset.measures,
    metadataColumns: [],
    columns,
    rowCount: dataset.observations.length,
    source: {
      datasetId: dataset.id,
      format: 'json',
      fetchedAt: new Date().toISOString(),
      name:
        dataset.title[titleKey as keyof typeof dataset.title] ||
        dataset.title.en,
    },
  };
}
