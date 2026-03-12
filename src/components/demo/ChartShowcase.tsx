'use client'

import { BarChart, Bar, LineChart, PieChart, AreaChart, MapChart, ComboChart, TableChart, ScatterplotChart } from '@/components/charts'
import { ChartFrame } from '@/components/charts/shared/ChartFrame'
import populationData from '@/public/data/sample-datasets/serbian-population.json'
import gdpData from '@/public/data/sample-datasets/serbian-gdp.json'
import unemploymentData from '@/public/data/sample-datasets/serbian-unemployment.json'
import budgetData from '@/public/data/sample-datasets/serbian-budget.json'
import timeSeriesData from '@/public/data/sample-datasets/serbian-time-series.json'

// Chart configurations
const populationConfig = {
  title: 'Population by Region',
  title: 'Популација по регионима',
  description: 'Regional population distribution in Serbia (2023)',
  description: 'Распределение становништва по регионима у Србији (2023)',
  chartType: 'bar',
  x_axis: { field: 'name', label: 'Region' },
  y_axis: { field: 'value', label: 'Population' },
  options: { showLegend: true, showGrid: true },
}

const gdpConfig = {
  title: 'GDP Growth by Region',
  title: 'Раст БДП-а по регионима',
  description: 'Quarterly GDP growth percentage by region (2021)',
  description: 'квартални раст БДП-а по регионима (2021)',
  chartType: 'line',
  x_axis: { field: 'name', label: 'Region' },
  y_axis: { field: 'gdp', label: 'GDP Growth (%)' },
  options: { showLegend: true, showGrid: true },
}

const unemploymentConfig = {
  title: 'Unemployment Rate by Region',
  title: 'Стопа незапослености по регионима',
  description: 'Unemployment rate by region in Serbia (January 2024)',
  description: 'Стопа незапослености по регионима у Србији (јануар 2024)',
  chartType: 'pie',
  x_axis: { field: 'name', label: 'Region' },
  y_axis: { field: 'rate', label: 'Rate (%)' },
  options: { showLegend: true },
}

const budgetConfig = {
  title: 'Budget Allocation by Category',
  title: 'Расподела бу буџету по категоријама',
  description: 'Government budget allocation by category (2023, million RSD)',
  description: 'Расподела државног буџета по категоријама (2023, милиони РSD)',
  chartType: 'area',
  x_axis: { field: 'category', label: 'Category' },
  y_axis: { field: 'allocated', label: 'Amount (Million RSD)' },
  options: { showLegend: true },
}

const timeSeriesConfig = {
  title: 'GDP Growth Over Time',
  title: 'Раст БДП-а током времена',
  description: 'Quarterly GDP growth trend by region (2021)',
  description: 'тренut квартalног раста БДП-а током времена (2021)',
  chartType: 'scatterplot',
  x_axis: { field: 'quarter', label: 'Quarter' },
  y_axis: { field: 'gdp', label: 'GDP Growth (%)' },
  options: { showLegend: true, showGrid: true },
}

const mapConfig = {
  title: 'Regional Population Map',
  title: 'Мапа становништва по регионима',
  description: 'Population distribution across Serbian regions',
  description: 'распределение становништва широм региона Србије',
  chartType: 'map',
  // Map-specific options would go here
}

export default function ChartShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Population Bar Chart */}
      <ChartPreviewCard
        config={populationConfig}
        data={populationData.data}
        type="bar"
        title="Population by Region"
        description="Regional population distribution"
      />

      {/* GDP Line Chart */}
      <ChartPreviewCard
        config={gdpConfig}
        data={gdpData.data}
        type="line"
        title="GDP Growth by Region"
        description="Quarterly GDP growth percentage"
      />

      {/* Unemployment Pie Chart */}
      <ChartPreviewCard
        config={unemploymentConfig}
        data={unemploymentData.data}
        type="pie"
        title="Unemployment Rate by Region"
        description="Unemployment rate by region"
      />

      {/* Budget Area Chart */}
      <ChartPreviewCard
        config={budgetConfig}
        data={budgetData.data}
        type="area"
        title="Budget Allocation"
        description="Government budget allocation by category"
      />

      {/* Time Series Scatterplot */}
      <ChartPreviewCard
        config={timeSeriesConfig}
        data={timeSeriesData.data}
        type="scatterplot"
        title="GDP Growth Over Time"
        description="Quarterly GDP growth trend"
      />

      {/* Map Chart */}
      <ChartPreviewCard
        config={mapConfig}
        data={populationData.data}
        type="map"
        title="Regional Population Map"
        description="Population distribution across regions"
      />
    </div>
  )
}
