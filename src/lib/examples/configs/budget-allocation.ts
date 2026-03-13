import { parseDatasetContent } from '@/lib/data/loader'
import type { FeaturedExampleConfig } from '../types'

import budgetRaw from '@/data/serbian-budget.json'

const budgetDataset = parseDatasetContent(
  JSON.stringify(budgetRaw),
  { format: 'json', datasetId: 'serbian-budget' }
)

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
    y_axis: { field: 'allocated', type: 'linear', label: 'Amount' },
    options: { paletteId: 'government', showLegend: true },
  },
  inlineData: budgetDataset,
  category: 'economy',
  preselectedFilters: {
    dataFilters: { showTop: '5' },
  },
}
