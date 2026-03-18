import { assessChartQuality } from '@/lib/charts/quality-check'
import type { ChartConfig, ChartRendererDataRow } from '@/types'

describe('chart quality check', () => {
  it('scores a well-labeled chart strongly', () => {
    const config: ChartConfig = {
      type: 'column',
      title: 'GDP by region',
      description: 'Regional GDP comparison',
      dataset_id: 'demo-gdp',
      x_axis: { field: 'region', label: 'Region', type: 'category' },
      y_axis: { field: 'gdp', label: 'GDP', type: 'linear' },
      options: { responsive: true },
    }
    const data: ChartRendererDataRow[] = [
      { region: 'Belgrade', gdp: 100 },
      { region: 'Vojvodina', gdp: 80 },
    ]

    const report = assessChartQuality(config, data)

    expect(report.overallScore).toBeGreaterThanOrEqual(70)
    expect(report.grade).toMatch(/[ABC]/)
  })

  it('penalizes charts with sparse data and missing context', () => {
    const config: ChartConfig = {
      type: 'column',
      title: 'Untitled',
      x_axis: { field: 'region', type: 'category' },
      y_axis: { field: 'gdp', type: 'linear' },
    }
    const data: ChartRendererDataRow[] = [{ region: 'Belgrade', gdp: null }]

    const report = assessChartQuality(config, data)

    expect(report.overallScore).toBeLessThan(85)
    expect(
      report.checks.find((check) => check.id === 'data-integrity')?.score
    ).toBeLessThan(20)
  })
})
