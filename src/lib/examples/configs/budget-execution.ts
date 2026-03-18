import { parseDatasetContent } from '@/lib/data/loader';
import type { FeaturedExampleConfig } from '../types';

import budgetExecutionRaw from '@/data/serbian-budget-execution.json';

const budgetExecutionDataset = parseDatasetContent(
  JSON.stringify(budgetExecutionRaw),
  {
    format: 'json',
    datasetId: 'serbian-budget-execution',
  }
);

export const budgetExecutionConfig: FeaturedExampleConfig = {
  id: 'budget-execution',
  title: {
    sr: 'Извршење буџета',
    lat: 'Izvršenje budžeta',
    en: 'Budget Execution',
  },
  description: {
    sr: 'Приходи и расходи републичког буџета',
    lat: 'Prihodi i rashodi republičkog budžeta',
    en: 'Revenue and expenditure of the republican budget',
  },
  datasetId: 'serbian-budget-execution',
  resourceUrl: '',
  chartConfig: {
    type: 'column',
    title: 'Budget Revenue and Expenditure',
    x_axis: { field: 'category', type: 'category', label: 'Category' },
    y_axis: { field: 'value', type: 'linear', label: 'Billion RSD' },
    options: {
      paletteId: 'government',
      showLegend: true,
      showGrid: true,
      grouping: 'grouped',
    },
  },
  inlineData: budgetExecutionDataset,
  category: 'economy',
  tags: ['finance', 'budget', 'revenue', 'expenditure', 'government'],
  featured: true,
  dataSource: 'МФ - Министарство финансија',
  lastUpdated: '2024-12-01',
};
