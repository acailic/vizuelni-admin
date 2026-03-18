import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import hospitalCapacityRaw from '@/data/serbian-hospital-capacity.json';

const hospitalCapacityDataset = parseDatasetContent(
  JSON.stringify(hospitalCapacityRaw),
  {
    format: 'json',
    datasetId: 'serbian-hospital-capacity',
  }
);

export const hospitalCapacityConfig: FeaturedExampleConfig = {
  id: 'hospital-capacity',
  title: {
    sr: 'Капацитет здравства',
    lat: 'Kapacitet zdravstva',
    en: 'Healthcare Capacity',
  },
  description: {
    sr: 'Болнички кревети на 1000 становника по регионима',
    lat: 'Bolnički kreveti na 1000 stanovnika po regionima',
    en: 'Hospital beds per 1000 residents by region',
  },
  datasetId: 'serbian-hospital-capacity',
  resourceUrl: '',
  chartConfig: {
    type: 'column',
    title: 'Hospital Beds per 1000 Residents',
    x_axis: { field: 'region', type: 'category', label: 'Region' },
    y_axis: {
      field: 'beds_per_1000',
      type: 'linear',
      label: 'Beds per 1000',
    },
    options: {
      paletteId: 'government',
      showLegend: false,
      showGrid: true,
      disableCalculationToggle: true,
    },
  },
  inlineData: hospitalCapacityDataset,
  category: 'healthcare',
  tags: ['healthcare', 'hospitals', 'capacity', 'regions'],
  featured: true,
  dataSource: 'РИЗО - Републички завод за здравствено осигурање',
  lastUpdated: '2024-12-01',
};
