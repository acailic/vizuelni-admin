import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import airQualityRaw from '@/data/serbian-air-quality.json';

const airQualityDataset = parseDatasetContent(JSON.stringify(airQualityRaw), {
  format: 'json',
  datasetId: 'serbian-air-quality',
});

export const airQualityIndexConfig: FeaturedExampleConfig = {
  id: 'air-quality-index',
  title: {
    sr: 'Индекс квалитета ваздуха',
    lat: 'Indeks kvaliteta vazduha',
    en: 'Air Quality Index',
  },
  description: {
    sr: 'Дневни индекс квалитета ваздуха по градовима',
    lat: 'Dnevni indeks kvaliteta vazduha po gradovima',
    en: 'Daily air quality index by city',
  },
  datasetId: 'serbian-air-quality',
  resourceUrl: '',
  chartConfig: {
    type: 'line',
    title: 'Air Quality Index Trend',
    x_axis: { field: 'date', type: 'date', label: 'Date' },
    y_axis: { field: 'aqi', type: 'linear', label: 'AQI' },
    options: {
      paletteId: 'government',
      showLegend: true,
      showGrid: true,
      showDots: true,
    },
  },
  inlineData: airQualityDataset,
  category: 'society',
  tags: ['environment', 'air-quality', 'health', 'pollution'],
  featured: true,
  dataSource: 'СЕБЕП - Агенција за заштиту животне средине',
  lastUpdated: '2025-01-07',
};
