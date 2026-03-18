import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import gdpRaw from '@/data/serbian-gdp.json';

const gdpDataset = parseDatasetContent(JSON.stringify(gdpRaw), {
  format: 'json',
  datasetId: 'serbian-gdp',
});

export const gdpRegionsConfig: FeaturedExampleConfig = {
  id: 'gdp-regions',
  title: {
    sr: 'БДП по регионима',
    lat: 'BDP po regionima',
    en: 'GDP by Region',
  },
  description: {
    sr: 'Раст БДП-а по градовима Србије',
    lat: 'Rast BDP-a po gradovima Srbije',
    en: 'GDP growth by Serbian cities',
  },
  datasetId: 'serbian-gdp',
  resourceUrl: '',
  chartConfig: {
    type: 'column',
    title: 'GDP Growth by City',
    x_axis: { field: 'name', type: 'category', label: 'City' },
    y_axis: { field: 'gdp', type: 'linear', label: 'GDP Growth (%)' },
    options: { paletteId: 'government', showLegend: false, showGrid: true },
  },
  inlineData: gdpDataset,
  category: 'economy',
  tags: ['economy', 'gdp', 'regions', 'cities'],
  dataSource: 'SORS - Statistical Office of the Republic of Serbia',
  lastUpdated: '2024-06-01',
  preselectedFilters: {
    dataFilters: { region: 'Београд' },
  },
};
