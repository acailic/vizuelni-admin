'use client'

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  getAxisLabel,
  getCartesianData,
  getChartColors,
} from '@/components/charts/shared/chart-data'
import { createChartFormatters } from '@/components/charts/shared/chart-formatters'
import { ChartFrame } from '@/components/charts/shared/ChartFrame'
import { useChartInView } from '@/hooks/useChartInView'
import type { ChartRendererComponentProps } from '@/types'

export function AreaChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
  showInternalLegend = true,
  hiddenSeriesKeys = [],
  previewMode = false,
}: ChartRendererComponentProps) {
  const { ref, inView } = useChartInView()
  const series = getCartesianData(data, config, locale).filter(datum => datum.value !== null)
  const colors = getChartColors(config)
  const { formatNumber } = createChartFormatters(locale)
  const isPrimaryVisible = !hiddenSeriesKeys.includes(config.y_axis?.field ?? '')

  if (!series.length || !isPrimaryVisible) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage="No numeric data available for this area chart."
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
      <div ref={ref} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={series} margin={{ top: 8, right: 12, bottom: 24, left: 12 }}>
          {(config.options?.showGrid ?? true) ? (
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
          ) : null}
          <XAxis
            dataKey="label"
            minTickGap={24}
            tick={{ fontSize: 12 }}
            label={{ value: getAxisLabel(config.x_axis), position: 'insideBottom', offset: -12 }}
          />
          <YAxis
            tickFormatter={formatNumber}
            label={{ value: getAxisLabel(config.y_axis), angle: -90, position: 'insideLeft' }}
          />
          <Tooltip formatter={(value) => typeof value === 'number' ? formatNumber(value) : String(value)} />
          {showInternalLegend && !previewMode && (config.options?.showLegend ?? true) ? <Legend /> : null}
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors[0]}
            fill={colors[1] ?? colors[0]}
            fillOpacity={config.options?.fillOpacity ?? 0.3}
            isAnimationActive={inView && config.options?.animation !== false}
            animationDuration={800}
            animationEasing="ease-out"
            name={getAxisLabel(config.y_axis)}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}
