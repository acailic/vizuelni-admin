'use client';

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { useChartAnimation } from '@/hooks/useChartAnimation';
import {
  getAxisLabel,
  getChartColors,
  toNumericValue,
} from '@/components/charts/shared/chart-data';
import {
  createChartFormatters,
  formatChartValue,
} from '@/components/charts/shared/chart-formatters';
import { ChartFrame } from '@/components/charts/shared/ChartFrame';
import type { ChartRendererComponentProps } from '@/types';

export function RadarChart({
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
  const primaryKey = config.y_axis?.field;
  const secondaryKey = config.options?.secondaryField;
  const colors = getChartColors(config);
  const { formatNumber } = createChartFormatters(locale);
  const series = data
    .map((row) => {
      const labelValue = config.x_axis?.field
        ? row[config.x_axis.field]
        : undefined;
      const primaryValue = primaryKey ? toNumericValue(row[primaryKey]) : null;
      const secondaryValue = secondaryKey
        ? toNumericValue(row[secondaryKey])
        : null;

      return {
        label: formatChartValue(labelValue, locale),
        [primaryKey ?? 'value']: primaryValue,
        ...(secondaryKey ? { [secondaryKey]: secondaryValue } : {}),
      };
    })
    .filter((row) => row.label && row[primaryKey ?? 'value'] !== null);

  const showPrimary = primaryKey
    ? !hiddenSeriesKeys.includes(primaryKey)
    : false;
  const showSecondary = secondaryKey
    ? !hiddenSeriesKeys.includes(secondaryKey)
    : false;

  if (!series.length || (!showPrimary && !showSecondary)) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage='No numeric data available for this radar chart.'
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
      <div ref={ref} className="h-full w-full">
      <ResponsiveContainer width='100%' height='100%'>
        <RechartsRadarChart data={series} outerRadius='78%'>
          <PolarGrid
            gridType={
              config.options?.radarShape === 'circle' ? 'circle' : 'polygon'
            }
          />
          <PolarAngleAxis dataKey='label' tick={{ fontSize: 12 }} />
          <PolarRadiusAxis
            tickFormatter={formatNumber}
            tick={{ fontSize: 11 }}
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
          {showPrimary && primaryKey ? (
            <Radar
              name={getAxisLabel(config.y_axis)}
              dataKey={primaryKey}
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={config.options?.fillOpacity ?? 0.35}
              isAnimationActive={shouldAnimate && config.options?.animation !== false}
              animationDuration={duration}
              animationEasing={easing as any}
            />
          ) : null}
          {showSecondary && secondaryKey ? (
            <Radar
              name={secondaryKey}
              dataKey={secondaryKey}
              stroke={colors[1] ?? colors[0]}
              fill={colors[1] ?? colors[0]}
              fillOpacity={0.18}
              isAnimationActive={shouldAnimate && config.options?.animation !== false}
              animationDuration={duration}
              animationEasing={easing as any}
            />
          ) : null}
        </RechartsRadarChart>
      </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
