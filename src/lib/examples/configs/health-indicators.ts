import type { FeaturedExampleConfig } from '../types';

export const healthIndicatorsConfig: FeaturedExampleConfig = {
  id: 'health-indicators',
  title: {
    sr: 'Здравствени показатељи',
    lat: 'Zdravstveni pokazatelji',
    en: 'Health Indicators',
  },
  description: {
    sr: 'Кључни здравствени показатељи током времена',
    lat: 'Ključni zdravstveni pokazatelji tokom vremena',
    en: 'Key health indicators over time',
  },
  datasetId: 'health-indicators',
  resourceUrl: '/data/health-indicators.csv',
  category: 'healthcare',
  chartConfig: {
    type: 'line',
    title: 'Health Indicators',
    x_axis: { field: 'year', type: 'category', label: 'Year' },
    y_axis: {
      field: 'life_expectancy',
      type: 'linear',
      label: 'Life Expectancy',
    },
    options: {
      paletteId: 'government',
      showLegend: true,
      showGrid: true,
      showDots: true,
    },
  },
};
