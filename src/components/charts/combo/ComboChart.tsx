'use client'

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
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
import { useChartAnimation } from '@/hooks/useChartAnimation'
import type { ChartRendererComponentProps } from '@/types'

export function ComboChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
  showInternalLegend = true,
  hiddenSeriesKeys = [],
  previewMode = false,
}: ChartRendererComponentProps) {
  const { ref, shouldAnimate, duration, easing } = useChartAnimation()
  const series = getCartesianData(data, config, locale).filter(datum => datum.value !== null)
  const colors = getChartColors(config)
  const { formatNumber } = createChartFormatters(locale)
  const primaryKey = config.y_axis?.field ?? ''
  const secondaryKey = config.options?.secondaryField ?? ''
  const showPrimary = !hiddenSeriesKeys.includes(primaryKey)
  const showSecondary = secondaryKey ? !hiddenSeriesKeys.includes(secondaryKey) : false

  if (!series.length || (!showPrimary && !showSecondary)) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage="No numeric data available for this combo chart."
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
        <ComposedChart data={series} margin={{ top: 8, right: 12, bottom: 24, left: 12 }}>
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
          {showPrimary ? (
            <Bar
              dataKey="value"
              fill={colors[0]}
              radius={[8, 8, 0, 0]}
              isAnimationActive={shouldAnimate && config.options?.animation !== false}
              animationDuration={duration}
              animationEasing={easing as any}
              name={getAxisLabel(config.y_axis)}
            />
          ) : null}
          {showSecondary ? (
            <Line
              dataKey="secondaryValue"
              stroke={colors[2] ?? colors[0]}
              strokeWidth={3}
              dot={false}
              isAnimationActive={shouldAnimate && config.options?.animation !== false}
              animationDuration={duration}
              animationEasing={easing as any}
              name={config.options?.secondaryField || `${getAxisLabel(config.y_axis)} trend`}
            />
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}
