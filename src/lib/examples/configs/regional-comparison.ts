import type { FeaturedExampleConfig } from '../types'

export const regionalComparisonConfig: FeaturedExampleConfig = {
  id: 'regional-comparison',
  title: {
    sr: 'Регионално поређење',
    lat: 'Regionalno poređenje',
    en: 'Regional Comparison',
  },
  description: {
    sr: 'Економски показатељи по регионима Србије',
    lat: 'Ekonomski pokazatelji po regionima Srbije',
    en: 'Economic indicators by Serbian regions',
  },
  datasetId: 'regional-comparison',
  resourceUrl: '/data/regional-comparison.csv',
  chartConfig: {
    type: 'column',
    title: 'Regional Comparison',
    x_axis: { field: 'region', type: 'category', label: 'Region' },
    y_axis: { field: 'gdp_growth', type: 'linear', label: 'GDP Growth (%)' },
    options: { paletteId: 'government', showLegend: false, showGrid: true },
  },
}
