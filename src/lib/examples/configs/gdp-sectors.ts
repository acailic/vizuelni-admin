import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import gdpSectorsRaw from '@/data/serbian-gdp-sectors.json';

const gdpSectorsDataset = parseDatasetContent(JSON.stringify(gdpSectorsRaw), {
  format: 'json',
  datasetId: 'serbian-gdp-sectors',
});

export const gdpSectorsConfig: FeaturedExampleConfig = {
  id: 'gdp-sectors',
  title: {
    sr: 'БДП по секторима',
    lat: 'BDP po sektorima',
    en: 'GDP by Sector',
  },
  description: {
    sr: 'Удео економских сектора у бруто домаћем производу',
    lat: 'Udeo ekonomskih sektora u bruto domaćem proizvodu',
    en: 'Economic sector share of gross domestic product',
  },
  datasetId: 'serbian-gdp-sectors',
  resourceUrl: '',
  chartConfig: {
    type: 'pie',
    title: 'GDP by Sector',
    x_axis: { field: 'sector', type: 'category', label: 'Sector' },
    y_axis: { field: 'value', type: 'linear', label: 'GDP Share (%)' },
    options: {
      paletteId: 'government',
      showLegend: true,
      showLabels: true,
      showPercentages: true,
    },
  },
  inlineData: gdpSectorsDataset,
  category: 'economy',
  tags: ['economy', 'gdp', 'sectors', 'industry'],
  featured: true,
  dataSource: 'РЗС - Републички завод за статистику',
  lastUpdated: '2024-12-01',
};
