'use client';

import { useMemo } from 'react';

import { toNumericValue } from '@/components/charts/shared/chart-data';
import {
  createChartFormatters,
  formatChartValue,
} from '@/components/charts/shared/chart-formatters';
import { PlotlyWrapper } from '@/components/charts/shared/PlotlyWrapper';
import { ChartFrame } from '@/components/charts/shared/ChartFrame';
import type { ChartRendererComponentProps } from '@/types';

function looksLikeTotal(label: string) {
  return /total|ukupno|sum/i.test(label);
}

export function WaterfallChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
  previewMode = false,
}: ChartRendererComponentProps) {
  const { formatNumber } = createChartFormatters(locale);
  // Use custom colors from config, or fall back to Serbian brand defaults
  const customColors = config.options?.colors;
  const increaseColor = customColors?.[0] ?? '#10B981';
  const decreaseColor = customColors?.[1] ?? '#C6363C';
  const totalColor = customColors?.[2] ?? '#0D4077';

  const series = useMemo(
    () =>
      data
        .map((row) => {
          const label = formatChartValue(
            config.x_axis?.field ? row[config.x_axis.field] : undefined,
            locale
          );
          const value = config.y_axis?.field
            ? toNumericValue(row[config.y_axis.field])
            : null;

          if (!label || value === null) {
            return null;
          }

          return { label, value };
        })
        .filter(
          (item): item is { label: string; value: number } => item !== null
        ),
    [config.x_axis, config.y_axis, data, locale]
  );

  if (!series.length) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage='No sequential values available for this waterfall chart.'
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
      <PlotlyWrapper
        ariaLabel={`${config.title}. Waterfall visualization.`}
        data={[
          {
            type: 'waterfall',
            x: series.map((item) => item.label),
            y: series.map((item) => item.value),
            measure: series.map((item) =>
              looksLikeTotal(item.label) ? 'total' : 'relative'
            ),
            connector: {
              line: {
                color: '#94a3b8',
              },
            },
            increasing: {
              marker: {
                color: increaseColor,
              },
            },
            decreasing: {
              marker: {
                color: decreaseColor,
              },
            },
            totals: {
              marker: {
                color: totalColor,
              },
            },
            hovertemplate: `%{x}<br>${config.y_axis?.label ?? 'Value'}: %{y}<extra></extra>`,
          },
        ]}
        layout={{
          yaxis: {
            title: config.y_axis?.label,
            tickformat: ',.0f',
          },
          xaxis: {
            title: config.x_axis?.label,
          },
        }}
      />
      <p className='mt-3 text-xs text-slate-500'>
        Positive steps indicate increases, negative steps indicate decreases,
        and labeled totals reset the running sum. Example formatted value:{' '}
        {formatNumber(1234)}.
      </p>
    </ChartFrame>
  );
}
