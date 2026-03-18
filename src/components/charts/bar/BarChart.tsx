'use client';

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  getAxisLabel,
  getCartesianData,
  getChartColors,
} from '@/components/charts/shared/chart-data';
import { createChartFormatters } from '@/components/charts/shared/chart-formatters';
import { ChartFrame } from '@/components/charts/shared/ChartFrame';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import type { ChartRendererComponentProps } from '@/types';

export function BarChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
  showInternalLegend = true,
  hiddenSeriesKeys = [],
  previewMode = false,
}: ChartRendererComponentProps) {
  const { ref, shouldAnimate, duration, easing } = useChartAnimation();
  const series = getCartesianData(data, config, locale).filter(
    (datum) => datum.value !== null
  );
  const colors = getChartColors(config);
  const { formatNumber } = createChartFormatters(locale);
  const isPrimaryVisible = !hiddenSeriesKeys.includes(
    config.y_axis?.field ?? ''
  );

  if (!series.length || !isPrimaryVisible) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage='No numeric data available for this bar chart.'
        previewMode={previewMode}
      />
    );
  }

  return (
    <ChartFrame
      title={config.title}
      description={config.description}
      filterBar={filterBar}
      height={height}
      previewMode={previewMode}
    >
      <div ref={ref} className='h-full w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <RechartsBarChart
          data={series}
          layout='vertical'
          margin={{ top: 8, right: 12, bottom: 8, left: 24 }}
        >
          {(config.options?.showGrid ?? true) ? (
            <CartesianGrid strokeDasharray='3 3' horizontal={false} />
          ) : null}
          <XAxis
            type='number'
            tickFormatter={formatNumber}
            tickCount={previewMode ? 4 : undefined}
            tick={{ fontSize: previewMode ? 10 : 12 }}
            label={
              previewMode
                ? undefined
                : {
                    value: getAxisLabel(config.y_axis),
                    position: 'insideBottom',
                    offset: -4,
                  }
            }
          />
          <YAxis
            type='category'
            dataKey='label'
            width={previewMode ? 84 : 120}
            tick={{ fontSize: previewMode ? 10 : 12 }}
            interval={previewMode ? 'preserveStartEnd' : 0}
            label={
              previewMode
                ? undefined
                : {
                    value: getAxisLabel(config.x_axis),
                    angle: -90,
                    position: 'insideLeft',
                  }
            }
          />
          <Tooltip
            formatter={(value) =>
              typeof value === 'number' ? formatNumber(value) : String(value)
            }
          />
          {showInternalLegend &&
          !previewMode &&
          (config.options?.showLegend ?? true) ? (
            <Legend />
          ) : null}
          <Bar
            dataKey='value'
            fill={colors[0]}
            radius={[0, 8, 8, 0]}
            isAnimationActive={shouldAnimate && config.options?.animation !== false}
            animationDuration={duration}
            animationEasing={easing as any}
            name={getAxisLabel(config.y_axis)}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
