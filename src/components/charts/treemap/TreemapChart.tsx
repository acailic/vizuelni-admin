'use client'

import { ResponsiveContainer, Tooltip, Treemap } from 'recharts'

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

function TreemapCell({
  depth,
  x,
  y,
  width,
  height,
  index,
  name,
  colors,
}: {
  depth?: number
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  name?: string
  colors: string[]
}) {
  if (
    depth !== 1 ||
    x === undefined ||
    y === undefined ||
    width === undefined ||
    height === undefined
  ) {
    return null
  }

  const fill = colors[(index ?? 0) % colors.length]
  // Use a light stroke that works in both light and dark modes
  const stroke = 'rgba(255, 255, 255, 0.8)'

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke={stroke} />
      {width > 60 && height > 30 ? (
        <text x={x + 8} y={y + 20} fill='#ffffff' fontSize={12} fontWeight={600}>
          {name}
        </text>
      ) : null}
    </g>
  )
}

export function TreemapChart({
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
      size: config.y_axis?.field ? toNumericValue(row[config.y_axis.field]) : null,
    }))
    .filter((item): item is { name: string; size: number } => Boolean(item.name) && item.size !== null)

  if (!series.length) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage='No numeric data available for this treemap chart.'
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
          <Treemap
            data={series}
            dataKey='size'
            aspectRatio={4 / 3}
            stroke='#ffffff'
            content={<TreemapCell colors={colors} />}
            isAnimationActive={shouldAnimate && config.options?.animation !== false}
            animationDuration={duration}
            animationEasing={easing as any}
          >
          <Tooltip
            formatter={value =>
              typeof value === 'number' ? formatNumber(value) : String(value)
            }
          />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}
