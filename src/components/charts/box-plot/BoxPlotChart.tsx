'use client'

import { useMemo } from 'react'

import { getChartColors, toNumericValue } from '@/components/charts/shared/chart-data'
import {
  createChartFormatters,
  formatChartValue,
} from '@/components/charts/shared/chart-formatters'
import { PlotlyWrapper } from '@/components/charts/shared/PlotlyWrapper'
import { ChartFrame } from '@/components/charts/shared/ChartFrame'
import type { ChartRendererComponentProps } from '@/types'

export function BoxPlotChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
  previewMode = false,
}: ChartRendererComponentProps) {
  const colors = getChartColors(config)
  const { formatNumber } = createChartFormatters(locale)
  const traces = useMemo(() => {
    if (!config.x_axis?.field || !config.y_axis?.field) {
      return []
    }

    const groups = new Map<string, number[]>()

    for (const row of data) {
      const group = formatChartValue(row[config.x_axis.field], locale)
      const value = toNumericValue(row[config.y_axis.field])

      if (!group || value === null) {
        continue
      }

      const values = groups.get(group) ?? []
      values.push(value)
      groups.set(group, values)
    }

    return Array.from(groups.entries()).map(([name, values], index) => ({
      type: 'box',
      name,
      y: values,
      boxpoints: 'outliers',
      marker: {
        color: colors[index % colors.length],
      },
      line: {
        color: colors[index % colors.length],
      },
      hovertemplate: `${name}<br>${config.y_axis?.label ?? 'Value'}: %{y}<extra></extra>`,
    }))
  }, [colors, config.x_axis, config.y_axis, data, locale])

  if (!traces.length) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage='No grouped numeric data available for this box plot.'
        previewMode={previewMode}
      />
    )
  }

  return (
    <ChartFrame
      title={config.title}
      description={config.description}
      filterBar={filterBar}
      height={height}
      previewMode={previewMode}
    >
      <PlotlyWrapper
        ariaLabel={`${config.title}. Box plot visualization.`}
        data={traces}
        layout={{
          xaxis: {
            title: config.x_axis?.label,
          },
          yaxis: {
            title: config.y_axis?.label,
            tickformat: ',.0f',
          },
        }}
      />
      <p className='mt-3 text-xs text-slate-500'>
        Each box shows median, quartiles, and outliers for grouped values. Example formatted
        number: {formatNumber(1234)}.
      </p>
    </ChartFrame>
  )
}
