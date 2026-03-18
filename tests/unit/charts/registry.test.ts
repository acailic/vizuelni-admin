jest.mock('@/components/charts/scatterplot/ScatterplotChart', () => ({
  ScatterplotChart: () => null,
}))

import { chartRegistry, getChartDefinition, getChartTypeOptions } from '@/lib/charts/registry'

describe('chart registry', () => {
  it('exposes the supported chart types', () => {
    expect(chartRegistry).toHaveLength(18)
    expect(chartRegistry.map(entry => entry.type)).toEqual([
      'line',
      'bar',
      'column',
      'area',
      'pie',
      'scatterplot',
      'table',
      'combo',
      'map',
      'radar',
      'treemap',
      'funnel',
      'sankey',
      'heatmap',
      'population-pyramid',
      'waterfall',
      'gauge',
      'box-plot',
    ])
  })

  it('returns chart definitions and lightweight picker options', () => {
    expect(getChartDefinition('combo')?.label).toBe('Combo')
    expect(getChartTypeOptions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'table', label: 'Table' }),
        expect.objectContaining({ type: 'scatterplot', label: 'Scatterplot' }),
        expect.objectContaining({ type: 'population-pyramid', label: 'Population Pyramid' }),
      ])
    )
  })
})
