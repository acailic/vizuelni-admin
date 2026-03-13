import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import timeSeriesRaw from '@/data/serbian-time-series.json';

const timeSeriesDataset = parseDatasetContent(JSON.stringify(timeSeriesRaw), {
  format: 'json',
  datasetId: 'serbian-time-series',
});

export const gdpTimeSeriesConfig: FeaturedExampleConfig = {
  id: 'gdp-time-series',
  title: {
    sr: 'БДП током времена',
    lat: 'BDP tokom vremena',
    en: 'GDP Over Time',
  },
  description: {
    sr: 'Квартални БДП по регионима',
    lat: 'Kvartalni BDP po regionima',
    en: 'Quarterly GDP by region',
  },
  datasetId: 'serbian-time-series',
  resourceUrl: '',
  chartConfig: {
    type: 'line',
    title: 'GDP Over Time',
    x_axis: { field: 'quarter', type: 'category', label: 'Quarter' },
    y_axis: { field: 'gdp', type: 'linear', label: 'GDP Growth (%)' },
    options: {
      paletteId: 'government',
      showLegend: true,
      showGrid: true,
      showDots: true,
    },
  },
  inlineData: timeSeriesDataset,
  // Preselect to show Belgrade region
  preselectedFilters: {
    dataFilters: {
      region: 'Београд',
    },
  },
};
