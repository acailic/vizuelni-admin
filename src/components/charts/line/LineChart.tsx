'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
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
import { useChartInView } from '@/hooks/useChartInView';
import type { ChartRendererComponentProps } from '@/types';

export function LineChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
  showInternalLegend = true,
  hiddenSeriesKeys = [],
  previewMode = false,
}: ChartRendererComponentProps) {
  const { ref, inView } = useChartInView();
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
        emptyMessage='No numeric data available for this line chart.'
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
        <RechartsLineChart
          data={series}
          margin={{ top: 8, right: 12, bottom: 24, left: 12 }}
        >
          {(config.options?.showGrid ?? true) ? (
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
          ) : null}
          <XAxis
            dataKey='label'
            minTickGap={previewMode ? 40 : 24}
            tick={{ fontSize: previewMode ? 10 : 12 }}
            tickCount={previewMode ? 4 : undefined}
            label={
              previewMode
                ? undefined
                : {
                    value: getAxisLabel(config.x_axis),
                    position: 'insideBottom',
                    offset: -12,
                  }
            }
          />
          <YAxis
            tickFormatter={formatNumber}
            tick={{ fontSize: previewMode ? 10 : 12 }}
            width={previewMode ? 44 : 60}
            tickCount={previewMode ? 4 : undefined}
            label={
              previewMode
                ? undefined
                : {
                    value: getAxisLabel(config.y_axis),
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
          <Line
            type={
              config.options?.curveType === 'monotone'
                ? 'monotone'
                : config.options?.curveType === 'step'
                  ? 'stepAfter'
                  : 'linear'
            }
            dataKey='value'
            stroke={colors[0]}
            strokeWidth={3}
            dot={previewMode ? false : (config.options?.showDots ?? true)}
            isAnimationActive={inView && config.options?.animation !== false}
            animationDuration={800}
            animationEasing='ease-out'
            name={getAxisLabel(config.y_axis)}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
