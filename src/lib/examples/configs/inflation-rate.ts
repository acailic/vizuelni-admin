import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import inflationRaw from '@/data/serbian-inflation.json';

const inflationDataset = parseDatasetContent(JSON.stringify(inflationRaw), {
  format: 'json',
  datasetId: 'serbian-inflation',
});

export const inflationRateConfig: FeaturedExampleConfig = {
  id: 'inflation-rate',
  title: {
    sr: 'Стопа инфлације',
    lat: 'Stopa inflacije',
    en: 'Inflation Rate',
  },
  description: {
    sr: 'Месечна стопа инфлације у Србији',
    lat: 'Mesečna stopa inflacije u Srbiji',
    en: 'Monthly inflation rate in Serbia',
  },
  datasetId: 'serbian-inflation',
  resourceUrl: '',
  chartConfig: {
    type: 'line',
    title: 'Inflation Rate Trend',
    x_axis: { field: 'month', type: 'date', label: 'Month' },
    y_axis: { field: 'value', type: 'linear', label: 'Inflation (%)' },
    options: {
      paletteId: 'government',
      showLegend: false,
      showGrid: true,
      showDots: true,
    },
  },
  inlineData: inflationDataset,
  category: 'economy',
  tags: ['economy', 'inflation', 'prices', 'trend'],
  featured: true,
  dataSource: 'НБС - Народна банка Србије',
  lastUpdated: '2025-02-01',
};
