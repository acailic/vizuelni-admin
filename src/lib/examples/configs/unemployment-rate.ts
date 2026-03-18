import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import unemploymentRaw from '@/data/serbian-unemployment.json';

const unemploymentDataset = parseDatasetContent(
  JSON.stringify(unemploymentRaw),
  { format: 'json', datasetId: 'serbian-unemployment' }
);

export const unemploymentRateConfig: FeaturedExampleConfig = {
  id: 'unemployment-rate',
  title: {
    sr: 'Стопа незапослености',
    lat: 'Stopa nezaposlenosti',
    en: 'Unemployment Rate',
  },
  description: {
    sr: 'Стопа незапослености по регионима',
    lat: 'Stopa nezaposlenosti po regionima',
    en: 'Unemployment rate by region',
  },
  datasetId: 'serbian-unemployment',
  resourceUrl: '',
  chartConfig: {
    type: 'bar',
    title: 'Unemployment Rate',
    x_axis: { field: 'name', type: 'category', label: 'Region' },
    y_axis: { field: 'rate', type: 'linear', label: 'Rate (%)' },
    options: {
      paletteId: 'government',
      showLegend: false,
      showGrid: true,
      disableCalculationToggle: true,
    },
  },
  inlineData: unemploymentDataset,
  category: 'economy',
  tags: ['economy', 'unemployment', 'labor', 'regions'],
  dataSource: 'SORS - Statistical Office of the Republic of Serbia',
  lastUpdated: '2024-06-01',
};
