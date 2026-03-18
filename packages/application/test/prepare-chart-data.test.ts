import { describe, expect, it } from 'vitest'

import { prepareChartData } from '../src'

describe('prepareChartData', () => {
  it('parses config, derives filter dimensions, and applies interactive filters', () => {
    const data = [
      { mesec: new Date('2024-01-01'), region: 'Sever', ukupno: 10 },
      { mesec: new Date('2024-02-01'), region: 'Jug', ukupno: 20 },
    ]

    const prepared = prepareChartData(
      {
        type: 'column',
        title: 'Stanovnistvo',
        x_axis: { field: 'mesec', type: 'date' },
        y_axis: { field: 'ukupno', type: 'linear' },
      },
      data,
      {
        legend: { ukupno: true },
        timeRange: { from: null, to: null },
        timeSlider: null,
        dataFilters: { region: 'Sever' },
        calculation: 'absolute',
      },
      'sr-Cyrl'
    )

    expect(prepared.parsedConfig.type).toBe('column')
    expect(prepared.seriesKeys).toEqual(['ukupno'])
    expect(prepared.temporalValues).toHaveLength(2)
    expect(prepared.dimensions).toEqual(
      expect.arrayContaining([expect.objectContaining({ key: 'region' })])
    )
    expect(prepared.filteredData).toEqual([data[0]])
  })
})
