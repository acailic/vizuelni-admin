import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import budgetRaw from '@/data/serbian-budget.json';

const budgetDataset = parseDatasetContent(JSON.stringify(budgetRaw), {
  format: 'json',
  datasetId: 'serbian-budget',
});

export const budgetAllocationConfig: FeaturedExampleConfig = {
  id: 'budget-allocation',
  title: {
    sr: 'Расподела буџета',
    lat: 'Raspodela budžeta',
    en: 'Budget Allocation',
  },
  description: {
    sr: 'Расподела државног буџета по категоријама',
    lat: 'Raspodela državnog budžeta po kategorijama',
    en: 'State budget allocation by category',
  },
  datasetId: 'serbian-budget',
  resourceUrl: '',
  chartConfig: {
    type: 'pie',
    title: 'Budget Allocation',
    x_axis: { field: 'category', type: 'category', label: 'Category' },
    y_axis: { field: 'allocated', type: 'linear', label: 'Amount (RSD)' },
    options: {
      paletteId: 'government',
      showLegend: true,
      showPercentages: true,
    },
  },
  inlineData: budgetDataset,
  category: 'economy',
  tags: ['finance', 'budget', 'government', 'allocation'],
  dataSource: 'Ministry of Finance of the Republic of Serbia',
  lastUpdated: '2024-06-01',
};
