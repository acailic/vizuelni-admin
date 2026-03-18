'use client';

import { useMemo } from 'react';
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  ScatterplotChart,
  MapChart,
} from '@/components/charts';
import type { ChartConfig, ChartRendererDataRow } from '@/types';

interface ChartPreviewCardProps {
  config: Partial<ChartConfig>;
  data: ChartRendererDataRow[];
  type: ChartConfig['type'];
  title: string;
  description: string;
  locale?: 'sr-Cyrl' | 'sr-Latn' | 'en';
}

export default function ChartPreviewCard({
  config,
  data,
  type,
  title,
  description,
  locale = 'sr-Cyrl',
}: ChartPreviewCardProps) {
  const fullConfig = useMemo(
    () =>
      ({
        type,
        title: config.title || title,
        description: config.description || description,
        x_axis: config.x_axis || { field: 'name', label: 'Name' },
        y_axis: config.y_axis || { field: 'value', label: 'Value' },
        options: {
          showLegend: true,
          showGrid: true,
          ...config.options,
        },
        referenceLines: config.referenceLines,
        annotations: config.annotations,
      }) as ChartConfig,
    [config, type, title, description]
  );

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart
            config={fullConfig}
            data={data}
            height={280}
            locale={locale}
            showInternalLegend={false}
          />
        );
      case 'line':
        return (
          <LineChart
            config={fullConfig}
            data={data}
            height={280}
            locale={locale}
            showInternalLegend={false}
          />
        );
      case 'pie':
        return (
          <PieChart
            config={fullConfig}
            data={data}
            height={280}
            locale={locale}
            showInternalLegend={false}
          />
        );
      case 'area':
        return (
          <AreaChart
            config={fullConfig}
            data={data}
            height={280}
            locale={locale}
            showInternalLegend={false}
          />
        );
      case 'scatterplot':
        return (
          <ScatterplotChart
            config={fullConfig}
            data={data}
            height={280}
            locale={locale}
            showInternalLegend={false}
          />
        );
      case 'map':
        return (
          <MapChart
            config={fullConfig}
            data={data}
            height={280}
            locale={locale}
          />
        );
      default:
        return (
          <div className='flex items-center justify-center h-full text-slate-400'>
            Chart type not supported in preview
          </div>
        );
    }
  };

  return (
    <div className='bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
      <div className='p-4 border-b border-slate-100'>
        <h3 className='text-lg font-semibold text-gov-primary'>{title}</h3>
        <p className='text-sm text-slate-500 mt-1'>{description}</p>
      </div>
      <div className='p-4'>{renderChart()}</div>
    </div>
  );
}
