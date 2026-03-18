import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import populationDensityRaw from '@/data/serbian-population-density.json';

const populationDensityDataset = parseDatasetContent(
  JSON.stringify(populationDensityRaw),
  {
    format: 'json',
    datasetId: 'serbian-population-density',
  }
);

export const populationDensityConfig: FeaturedExampleConfig = {
  id: 'population-density',
  title: {
    sr: 'Густина насељености',
    lat: 'Gustina naseljenosti',
    en: 'Population Density',
  },
  description: {
    sr: 'Густина насељености по окрузима Србије',
    lat: 'Gustina naseljenosti po okruzima Srbije',
    en: 'Population density by Serbian districts',
  },
  datasetId: 'serbian-population-density',
  resourceUrl: '',
  chartConfig: {
    type: 'column',
    title: 'Population Density by District',
    x_axis: { field: 'district', type: 'category', label: 'District' },
    y_axis: {
      field: 'density',
      type: 'linear',
      label: 'People per km²',
    },
    options: {
      paletteId: 'government',
      showLegend: false,
      showGrid: true,
      disableCalculationToggle: true,
    },
  },
  inlineData: populationDensityDataset,
  category: 'demographics',
  tags: ['demographics', 'population', 'density', 'geography'],
  featured: true,
  dataSource: 'РЗС - Републички завод за статистику',
  lastUpdated: '2024-12-01',
};
