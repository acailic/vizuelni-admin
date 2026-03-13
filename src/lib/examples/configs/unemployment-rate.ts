import { parseDatasetContent } from '@/lib/data/loader'
import type { FeaturedExampleConfig } from '../types'

import unemploymentRaw from '@/data/serbian-unemployment.json'

const unemploymentDataset = parseDatasetContent(
  JSON.stringify(unemploymentRaw),
  { format: 'json', datasetId: 'serbian-unemployment' }
)

export const unemploymentRateConfig: FeaturedExampleConfig = {
  id: 'unemployment-rate',
  title: {
    sr: 'Стопа незапослености',
    lat: 'Stopa nezaposlenosti',
    en: 'Unemployment Rate',
  },
  description: {
    sr: 'Стопа незапослености по регионима',
    lat: 'Stopa nezaposlenosti po regionima',
    en: 'Unemployment rate by region',
  },
  datasetId: 'serbian-unemployment',
  resourceUrl: '',
  chartConfig: {
    type: 'bar',
    title: 'Unemployment Rate',
    x_axis: { field: 'rate', type: 'linear', label: 'Rate (%)' },
    y_axis: { field: 'name', type: 'category', label: 'Region' },
    options: { paletteId: 'government', showLegend: false, showGrid: true },
  },
  inlineData: unemploymentDataset,
  category: 'economy',
  preselectedFilters: {
    timeRange: { from: '2020', to: '2024' },
  },
}
