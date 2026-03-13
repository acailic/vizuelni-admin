// src/lib/data/serbian-datasets/registry.ts

import type { SerbianDataset, SerbianDatasetMeta, DataCategory } from './types';

// Import all datasets (will be populated as we create them)
import birthRatesData from './data/birth-rates.json';
import fertilityRatesData from './data/fertility-rates.json';
import naturalChangeData from './data/natural-change.json';
import populationDeclineData from './data/population-decline.json';
import diasporaDestinationsData from './data/diaspora-destinations.json';
import migrationBalanceData from './data/migration-balance.json';
import populationPyramidData from './data/population-pyramid.json';

const ALL_DATASETS: SerbianDataset[] = [
  birthRatesData as SerbianDataset,
  fertilityRatesData as SerbianDataset,
  naturalChangeData as SerbianDataset,
  populationDeclineData as SerbianDataset,
  diasporaDestinationsData as SerbianDataset,
  migrationBalanceData as SerbianDataset,
  populationPyramidData as SerbianDataset,
];

/**
 * Get all dataset metadata (lightweight, no observations)
 */
export function getAllDatasetMeta(): SerbianDatasetMeta[] {
  return ALL_DATASETS.map(({ observations, dimensions, measures, ...meta }) => meta);
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
