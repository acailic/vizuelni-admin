// src/lib/data/serbian-datasets/registry.ts

import type { RawSerbianDataset, SerbianDataset, SerbianDatasetMeta, DataCategory } from './types';

// Import all datasets (will be populated as we create them)
import birthRatesData from './data/birth-rates.json';
import fertilityRatesData from './data/fertility-rates.json';
import naturalChangeData from './data/natural-change.json';
import populationDeclineData from './data/population-decline.json';
import diasporaDestinationsData from './data/diaspora-destinations.json';
import migrationBalanceData from './data/migration-balance.json';
import populationPyramidData from './data/population-pyramid.json';

const RAW_DATASETS: RawSerbianDataset[] = [
  birthRatesData as RawSerbianDataset,
  fertilityRatesData as RawSerbianDataset,
  naturalChangeData as RawSerbianDataset,
  populationDeclineData as RawSerbianDataset,
  diasporaDestinationsData as RawSerbianDataset,
  migrationBalanceData as RawSerbianDataset,
  populationPyramidData as RawSerbianDataset,
];

function normalizeCategory(category: string): DataCategory {
  switch (category) {
    case 'demographics':
    case 'regional':
    case 'healthcare':
    case 'economic':
      return category;
    default:
      return 'demographics';
  }
}

const ALL_DATASETS: SerbianDataset[] = RAW_DATASETS.map(dataset => ({
  ...dataset,
  category: normalizeCategory(dataset.category),
}));

/**
 * Get all dataset metadata (lightweight, no observations)
 */
export function getAllDatasetMeta(): SerbianDatasetMeta[] {
  return ALL_DATASETS.map(({ observations: _observations, dimensions: _dimensions, measures: _measures, ...meta }) => meta);
}

/**
 * Get datasets filtered by category
 */
export function getDatasetsByCategory(category: DataCategory): SerbianDatasetMeta[] {
  return getAllDatasetMeta().filter((d) => d.category === category);
}

/**
 * Get full dataset by ID
 */
export function getDatasetById(id: string): SerbianDataset | undefined {
  return ALL_DATASETS.find((d) => d.id === id);
}

/**
 * Check if a dataset ID is a Serbian dataset
 */
export function isSerbianDataset(id: string): boolean {
  return id.startsWith('serbia-');
}
