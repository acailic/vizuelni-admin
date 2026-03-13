import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import populationRaw from '@/data/serbian-population.json';

const populationDataset = parseDatasetContent(JSON.stringify(populationRaw), {
  format: 'json',
  datasetId: 'serbian-population',
});

export const populationRegionsConfig: FeaturedExampleConfig = {
  id: 'population-regions',
  title: {
    sr: 'Популација по градовима',
    lat: 'Populacija po gradovima',
    en: 'Population by City',
  },
  description: {
    sr: 'Број становника по градовима Србије',
    lat: 'Broj stanovnika po gradovima Srbije',
    en: 'Population count by Serbian cities',
  },
  datasetId: 'serbian-population',
  resourceUrl: '',
  chartConfig: {
    type: 'column',
    title: 'Population by City',
    x_axis: { field: 'name', type: 'category', label: 'City' },
    y_axis: { field: 'value', type: 'linear', label: 'Population' },
    options: { paletteId: 'government', showLegend: false, showGrid: true },
  },
  inlineData: populationDataset,
  category: 'demographics',
  // Preselect to show only Vojvodina region cities
  preselectedFilters: {
    dataFilters: {
      region: 'Војводина',
    },
  },
};
