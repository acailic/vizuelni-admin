'use client'

import { useMemo } from 'react'

import { toNumericValue } from '@/components/charts/shared/chart-data'
import {
  createChartFormatters,
  formatChartValue,
} from '@/components/charts/shared/chart-formatters'
import { PlotlyWrapper } from '@/components/charts/shared/PlotlyWrapper'
import { ChartFrame } from '@/components/charts/shared/ChartFrame'
import type { ChartRendererComponentProps } from '@/types'

export function GaugeChart({
  config,
  data,
  height = 360,
  locale,
  filterBar,
  previewMode = false,
}: ChartRendererComponentProps) {
  const { formatNumber } = createChartFormatters(locale)
  const valueField = config.y_axis?.field
  // Gauge charts display a single KPI value (like a speedometer).
  // We use only the first non-null data point because multiple values
  // on a gauge would be visually confusing. This is by design for KPI displays.
  const point = useMemo(() => {
    if (!valueField) return null

    const firstRow = data.find(row => toNumericValue(row[valueField]) !== null)
    if (!firstRow) return null

    return {
      value: toNumericValue(firstRow[valueField]) ?? 0,
      label:
        config.x_axis?.field && config.x_axis.field !== valueField
          ? formatChartValue(firstRow[config.x_axis.field], locale)
          : config.y_axis?.label ?? valueField,
    }
  }, [config.x_axis, config.y_axis, data, locale, valueField])

  if (!point) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage='No numeric value available for this gauge chart.'
        previewMode={previewMode}
      />
    )
  }

  const min = config.options?.gaugeMin ?? 0
  const max = config.options?.gaugeMax ?? Math.max(point.value, 100)
  const thresholds = config.options?.gaugeThresholds ?? [
    { value: min + (max - min) * 0.33, color: '#C6363C' },
    { value: min + (max - min) * 0.66, color: '#F59E0B' },
    { value: max, color: '#10B981' },
  ]

  let previousValue = min
  const steps = thresholds.map(threshold => {
    const step = {
      range: [previousValue, threshold.value],
      color: threshold.color,
    }
    previousValue = threshold.value
    return step
  })

  return (
    <ChartFrame
      title={config.title}
      description={config.description}
      filterBar={filterBar}
      height={height}
      previewMode={previewMode}
    >
      <PlotlyWrapper
        ariaLabel={`${config.title}. Gauge visualization.`}
        data={[
          {
            type: 'indicator',
            mode: 'gauge+number',
            value: point.value,
            number: {
              valueformat: ',.2f',
            },
            title: {
              text: point.label,
            },
            gauge: {
              axis: { range: [min, max] },
              bar: { color: '#0D4077' },
              steps,
            },
          },
        ]}
      />
      <p className='mt-3 text-xs text-slate-500'>
        Current value: {formatNumber(point.value)} within the configured range of{' '}
        {formatNumber(min)} to {formatNumber(max)}.
      </p>
    </ChartFrame>
  )
}
