'use client'

import {
  Cell,
  Funnel,
  FunnelChart as RechartsFunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import {
  getChartColors,
  toNumericValue,
} from '@/components/charts/shared/chart-data'
import {
  createChartFormatters,
  formatChartValue,
} from '@/components/charts/shared/chart-formatters'
import { ChartFrame } from '@/components/charts/shared/ChartFrame'
import { useChartAnimation } from '@/hooks/useChartAnimation'
import type { ChartRendererComponentProps } from '@/types'

export function FunnelChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
  previewMode = false,
}: ChartRendererComponentProps) {
  const { ref, shouldAnimate, duration, easing } = useChartAnimation()
  const colors = getChartColors(config)
  const { formatNumber } = createChartFormatters(locale)
  const series = data
    .map(row => ({
      name: formatChartValue(
        config.x_axis?.field ? row[config.x_axis.field] : undefined,
        locale
      ),
      value: config.y_axis?.field ? toNumericValue(row[config.y_axis.field]) : null,
    }))
    .filter(
      (item): item is { name: string; value: number } =>
        Boolean(item.name) && item.value !== null
    )

  if (!series.length) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage='No numeric data available for this funnel chart.'
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
        <ResponsiveContainer width='100%' height='100%'>
          <RechartsFunnelChart>
            <Tooltip
              formatter={value =>
                typeof value === 'number' ? formatNumber(value) : String(value)
              }
            />
            <Funnel
              data={series}
              dataKey='value'
              nameKey='name'
              isAnimationActive={shouldAnimate && config.options?.animation !== false}
              animationDuration={duration}
              animationEasing={easing as any}
            >
            {series.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={colors[index % colors.length]} />
            ))}
            {config.options?.showLabels ?? true ? (
              <LabelList dataKey='name' position='right' fill='#334155' stroke='none' />
            ) : null}
          </Funnel>
            </RechartsFunnelChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}
