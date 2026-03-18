'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { toNumericValue } from '@/components/charts/shared/chart-data';
import {
  createChartFormatters,
  formatChartValue,
} from '@/components/charts/shared/chart-formatters';
import { ChartFrame } from '@/components/charts/shared/ChartFrame';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import type { ChartRendererComponentProps } from '@/types';

export function PopulationPyramidChart({
  config,
  data,
  height = 440,
  locale,
  filterBar,
  showInternalLegend = true,
  hiddenSeriesKeys = [],
  previewMode = false,
}: ChartRendererComponentProps) {
  const { ref } = useChartAnimation();
  const maleField = config.options?.pyramidMaleField ?? config.y_axis?.field;
  const femaleField =
    config.options?.pyramidFemaleField ?? config.options?.secondaryField;
  const { formatNumber } = createChartFormatters(locale);
  const series = data
    .map((row) => {
      const label = formatChartValue(
        config.x_axis?.field ? row[config.x_axis.field] : undefined,
        locale
      );
      const male = maleField ? toNumericValue(row[maleField]) : null;
      const female = femaleField ? toNumericValue(row[femaleField]) : null;

      if (!label || male === null || female === null) {
        return null;
      }

      return {
        label,
        male: -Math.abs(male),
        female: Math.abs(female),
      };
    })
    .filter(
      (item): item is { label: string; male: number; female: number } =>
        item !== null
    )
    .reverse(); // Display youngest at bottom, oldest at top (y-axis increasing)

  const showMale = maleField ? !hiddenSeriesKeys.includes(maleField) : false;
  const showFemale = femaleField
    ? !hiddenSeriesKeys.includes(femaleField)
    : false;

  if (!series.length || (!showMale && !showFemale)) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage='No sex-disaggregated data available for this population pyramid.'
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
          <BarChart
            data={series}
            layout='vertical'
            margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
            stackOffset='sign'
          >
          {(config.options?.showGrid ?? true) ? (
            <CartesianGrid strokeDasharray='3 3' horizontal={false} />
          ) : null}
          <XAxis
            type='number'
            tickFormatter={(value) => formatNumber(Math.abs(Number(value)))}
          />
          <YAxis
            dataKey='label'
            type='category'
            width={96}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) =>
              typeof value === 'number'
                ? formatNumber(Math.abs(value))
                : String(value)
            }
          />
          {showInternalLegend &&
          !previewMode &&
          (config.options?.showLegend ?? true) ? (
            <Legend />
          ) : null}
          {showMale ? (
            <Bar
              dataKey='male'
              name={maleField ?? 'Male'}
              fill='#0D4077'
              radius={[6, 0, 0, 6]}
            />
          ) : null}
          {showFemale ? (
            <Bar
              dataKey='female'
              name={femaleField ?? 'Female'}
              fill='#C6363C'
              radius={[0, 6, 6, 0]}
            />
          ) : null}
        </BarChart>
      </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
