import type { FeaturedExampleConfig } from '../types';

export const energyConsumptionConfig: FeaturedExampleConfig = {
  id: 'energy-consumption',
  title: {
    sr: 'Потрошња енергије',
    lat: 'Potrošnja energije',
    en: 'Energy Consumption',
  },
  description: {
    sr: 'Потрошња електричне енергије по секторима',
    lat: 'Potrošnja električne energije po sektorima',
    en: 'Electricity consumption by sector',
  },
  datasetId: 'energy-consumption',
  resourceUrl: '/data/energy-consumption.csv',
  chartConfig: {
    type: 'bar',
    title: 'Energy Consumption',
    x_axis: { field: 'sector', type: 'category', label: 'Sector' },
    y_axis: {
      field: 'consumption_twh',
      type: 'linear',
      label: 'Consumption (TWh)',
    },
    options: { paletteId: 'government', showLegend: false, showGrid: true },
  },
  category: 'economy',
};
