import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import roadAccidentsRaw from '@/data/serbian-road-accidents.json';

const roadAccidentsDataset = parseDatasetContent(
  JSON.stringify(roadAccidentsRaw),
  {
    format: 'json',
    datasetId: 'serbian-road-accidents',
  }
);

export const roadAccidentsConfig: FeaturedExampleConfig = {
  id: 'road-accidents',
  title: {
    sr: 'Саобраћајне незгоде',
    lat: 'Saobraćajne nezgode',
    en: 'Road Accidents',
  },
  description: {
    sr: 'Месечни број саобраћајних незгода по регионима',
    lat: 'Mesečni broj saobraćajnih nezgoda po regionima',
    en: 'Monthly road accidents by region',
  },
  datasetId: 'serbian-road-accidents',
  resourceUrl: '',
  chartConfig: {
    type: 'line',
    title: 'Road Accidents Trend',
    x_axis: { field: 'month', type: 'date', label: 'Month' },
    y_axis: { field: 'accidents', type: 'linear', label: 'Accidents' },
    options: {
      paletteId: 'government',
      showLegend: true,
      showGrid: true,
      showDots: true,
    },
  },
  inlineData: roadAccidentsDataset,
  category: 'society',
  tags: ['transport', 'safety', 'accidents', 'statistics'],
  featured: true,
  dataSource: 'МУП - Министарство унутрашњих послова',
  lastUpdated: '2024-12-01',
};
