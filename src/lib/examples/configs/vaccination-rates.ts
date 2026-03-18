import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import vaccinationRaw from '@/data/serbian-vaccination.json';

const vaccinationDataset = parseDatasetContent(JSON.stringify(vaccinationRaw), {
  format: 'json',
  datasetId: 'serbian-vaccination',
});

export const vaccinationRatesConfig: FeaturedExampleConfig = {
  id: 'vaccination-rates',
  title: {
    sr: 'Покривеност вакцинацијом',
    lat: 'Pokrivenost vakcinacijom',
    en: 'Vaccination Coverage',
  },
  description: {
    sr: 'Покривеност вакцинацијом по окрузима Србије',
    lat: 'Pokrivenost vakcinacijom po okruzima Srbije',
    en: 'Vaccination coverage by Serbian districts',
  },
  datasetId: 'serbian-vaccination',
  resourceUrl: '',
  chartConfig: {
    type: 'column',
    title: 'Vaccination Coverage by District',
    x_axis: { field: 'district', type: 'category', label: 'District' },
    y_axis: { field: 'coverage', type: 'linear', label: 'Coverage (%)' },
    options: {
      paletteId: 'government',
      showLegend: false,
      showGrid: true,
      disableCalculationToggle: true,
    },
  },
  inlineData: vaccinationDataset,
  category: 'healthcare',
  tags: ['healthcare', 'vaccination', 'coverage', 'districts'],
  featured: true,
  dataSource: 'Батут - Институт за јавно здравље',
  lastUpdated: '2024-12-01',
};
