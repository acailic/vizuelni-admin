'use client';

import type { ChartConfig } from '@/types';

import populationData from '@/data/serbian-population.json';
import gdpData from '@/data/serbian-gdp.json';
import unemploymentData from '@/data/serbian-unemployment.json';
import budgetData from '@/data/serbian-budget.json';
import timeSeriesData from '@/data/serbian-time-series.json';

import ChartPreviewCard from './ChartPreviewCard';

const populationConfig = {
  type: 'bar' as const,
  title: 'Популација по регионима',
  description: 'Расподела становништва по регионима у Србији (2023)',
  x_axis: { field: 'name', label: 'Регион' },
  y_axis: { field: 'value', label: 'Становништво' },
  options: { showLegend: true, showGrid: true },
};

const gdpConfig = {
  type: 'line' as const,
  title: 'Раст БДП-а по регионима',
  description: 'Квартални раст БДП-а по регионима (2021)',
  x_axis: { field: 'name', label: 'Регион' },
  y_axis: { field: 'gdp', label: 'Раст БДП-а (%)' },
  options: { showLegend: true, showGrid: true },
};

const unemploymentConfig = {
  type: 'pie' as const,
  title: 'Стопа незапослености по регионима',
  description: 'Стопа незапослености по регионима у Србији',
  x_axis: { field: 'name', label: 'Регион' },
  y_axis: { field: 'rate', label: 'Стопа (%)' },
  options: { showLegend: true },
};

const budgetConfig = {
  type: 'area' as const,
  title: 'Расподела буџета по категоријама',
  description: 'Расподела државног буџета по категоријама',
  x_axis: { field: 'category', label: 'Категорија' },
  y_axis: { field: 'allocated', label: 'Износ' },
  options: { showLegend: true },
};

const timeSeriesConfig = {
  type: 'scatterplot' as const,
  title: 'Раст БДП-а током времена',
  description: 'Квартални тренд раста БДП-а',
  x_axis: { field: 'quarter', label: 'Квартал' },
  y_axis: { field: 'gdp', label: 'Раст БДП-а (%)' },
  options: { showLegend: true, showGrid: true },
};

const mapConfig: Partial<ChartConfig> = {
  type: 'map' as const,
  title: 'Мапа становништва по регионима',
  description: 'Расподела становништва широм региона Србије',
  x_axis: { field: 'name', label: 'Регион' },
  y_axis: { field: 'value', label: 'Становништво' },
  options: { geoLevel: 'region', showLegend: true },
};

export default function ChartShowcase() {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      <ChartPreviewCard
        config={populationConfig}
        data={populationData.data}
        type='bar'
        title='Population by Region'
        description='Regional population distribution'
      />
      <ChartPreviewCard
        config={gdpConfig}
        data={gdpData.data}
        type='line'
        title='GDP Growth by Region'
        description='Quarterly GDP growth percentage'
      />
      <ChartPreviewCard
        config={unemploymentConfig}
        data={unemploymentData.data}
        type='pie'
        title='Unemployment Rate by Region'
        description='Unemployment rate by region'
      />
      <ChartPreviewCard
        config={budgetConfig}
        data={budgetData.data}
        type='area'
        title='Budget Allocation'
        description='Government budget allocation by category'
      />
      <ChartPreviewCard
        config={timeSeriesConfig}
        data={timeSeriesData.data}
        type='scatterplot'
        title='GDP Growth Over Time'
        description='Quarterly GDP growth trend'
      />
      <ChartPreviewCard
        config={mapConfig}
        data={populationData.data}
        type='map'
        title='Regional Population Map'
        description='Population distribution across regions'
      />
    </div>
  );
}
