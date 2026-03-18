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

// Map palette names to Plotly colorscale names
const PALETTE_TO_COLORSCALE: Record<string, string> = {
  viridis: 'Viridis',
  plasma: 'Plasma',
  inferno: 'Inferno',
  magma: 'Magma',
  cividis: 'Cividis',
  blues: 'Blues',
  greens: 'Greens',
  reds: 'Reds',
  oranges: 'Oranges',
  purples: 'Purples',
  sequential: 'Viridis',
  diverging: 'RdBu',
  default: 'Viridis',
}

function getColorscale(palette?: string): string {
  if (!palette) return 'Viridis'
  return PALETTE_TO_COLORSCALE[palette.toLowerCase()] ?? 'Viridis'
}

export function HeatmapChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
  previewMode = false,
}: ChartRendererComponentProps) {
  const xField = config.options?.heatmapXField ?? config.x_axis?.field
  const yField = config.options?.heatmapYField
  const valueField = config.y_axis?.field
  const colorscale = getColorscale(config.options?.colorPalette)
  const { formatNumber } = createChartFormatters(locale)

  const heatmap = useMemo(() => {
    if (!xField || !yField || !valueField) {
      return null
    }

    const xValues: string[] = []
    const yValues: string[] = []
    const lookup = new Map<string, number>()

    for (const row of data) {
      const x = formatChartValue(row[xField], locale)
      const y = formatChartValue(row[yField], locale)
      const value = toNumericValue(row[valueField])

      if (!x || !y || value === null) {
        continue
      }

      if (!xValues.includes(x)) xValues.push(x)
      if (!yValues.includes(y)) yValues.push(y)

      const key = `${y}::${x}`
      lookup.set(key, (lookup.get(key) ?? 0) + value)
    }

    if (!xValues.length || !yValues.length) {
      return null
    }

    const z = yValues.map(y =>
      xValues.map(x => lookup.get(`${y}::${x}`) ?? null)
    )

    return { xValues, yValues, z }
  }, [data, locale, valueField, xField, yField])

  if (!heatmap) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage='No matrix data available for this heatmap chart.'
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
        ariaLabel={`${config.title}. Heatmap visualization.`}
        data={[
          {
            type: 'heatmap',
            x: heatmap.xValues,
            y: heatmap.yValues,
            z: heatmap.z,
            colorscale,
            hovertemplate: `%{y} / %{x}<br>${config.y_axis?.label ?? 'Value'}: %{z}<extra></extra>`,
          },
        ]}
        layout={{
          xaxis: { title: config.x_axis?.label },
          yaxis: { title: config.options?.heatmapYField },
          coloraxis: { colorbar: { title: config.y_axis?.label } },
        }}
        config={{
          locale,
          toImageButtonOptions: {
            format: 'png',
            filename: config.title,
          },
        }}
      />
      <p className='mt-3 text-xs text-slate-500'>
        Hover each cell to inspect the exact value. Values use locale-aware formatting such as{' '}
        {formatNumber(1234)}.
      </p>
    </ChartFrame>
  )
}
