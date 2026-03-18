'use client'

import { getChartCapabilities, getDefaultOptions } from '@vizualni/charts'
import { lazy } from 'react'

import type { ChartTypeDefinition, SupportedChartType } from '@/types'

const LazyLineChart = lazy(() =>
  import('@/components/charts/line/LineChart').then(module => ({ default: module.LineChart }))
)
const LazyBarChart = lazy(() =>
  import('@/components/charts/bar/BarChart').then(module => ({ default: module.BarChart }))
)
const LazyColumnChart = lazy(() =>
  import('@/components/charts/column/ColumnChart').then(module => ({ default: module.ColumnChart }))
)
const LazyAreaChart = lazy(() =>
  import('@/components/charts/area/AreaChart').then(module => ({ default: module.AreaChart }))
)
const LazyPieChart = lazy(() =>
  import('@/components/charts/pie/PieChart').then(module => ({ default: module.PieChart }))
)
const LazyScatterplotChart = lazy(() =>
  import('@/components/charts/scatterplot/ScatterplotChart').then(module => ({
    default: module.ScatterplotChart,
  }))
)
const LazyTableChart = lazy(() =>
  import('@/components/charts/table/TableChart').then(module => ({ default: module.TableChart }))
)
const LazyComboChart = lazy(() =>
  import('@/components/charts/combo/ComboChart').then(module => ({ default: module.ComboChart }))
)
const LazyMapChart = lazy(() =>
  import('@/components/charts/map/MapChart').then(module => ({ default: module.MapChart }))
)
const LazyRadarChart = lazy(() =>
  import('@/components/charts/radar/RadarChart').then(module => ({ default: module.RadarChart }))
)
const LazyTreemapChart = lazy(() =>
  import('@/components/charts/treemap/TreemapChart').then(module => ({
    default: module.TreemapChart,
  }))
)
const LazyFunnelChart = lazy(() =>
  import('@/components/charts/funnel/FunnelChart').then(module => ({ default: module.FunnelChart }))
)
const LazySankeyChart = lazy(() =>
  import('@/components/charts/sankey/SankeyChart').then(module => ({ default: module.SankeyChart }))
)
const LazyHeatmapChart = lazy(() =>
  import('@/components/charts/heatmap/HeatmapChart').then(module => ({
    default: module.HeatmapChart,
  }))
)
const LazyPopulationPyramidChart = lazy(() =>
  import('@/components/charts/population-pyramid/PopulationPyramidChart').then(module => ({
    default: module.PopulationPyramidChart,
  }))
)
const LazyWaterfallChart = lazy(() =>
  import('@/components/charts/waterfall/WaterfallChart').then(module => ({
    default: module.WaterfallChart,
  }))
)
const LazyGaugeChart = lazy(() =>
  import('@/components/charts/gauge/GaugeChart').then(module => ({ default: module.GaugeChart }))
)
const LazyBoxPlotChart = lazy(() =>
  import('@/components/charts/box-plot/BoxPlotChart').then(module => ({
    default: module.BoxPlotChart,
  }))
)

function createDefinition(
  type: SupportedChartType,
  label: string,
  icon: string,
  renderer: ChartTypeDefinition['renderer']
): ChartTypeDefinition {
  return {
    type,
    label,
    icon,
    renderer,
    defaultConfig: {
      type,
      options: getDefaultOptions(type),
    },
    capabilities: getChartCapabilities(type),
  }
}

export const chartRegistry: ChartTypeDefinition[] = [
  createDefinition('line', 'Line', '↗', LazyLineChart),
  createDefinition('bar', 'Bar', '▤', LazyBarChart),
  createDefinition('column', 'Column', '▥', LazyColumnChart),
  createDefinition('area', 'Area', '▰', LazyAreaChart),
  createDefinition('pie', 'Pie', '◔', LazyPieChart),
  createDefinition('scatterplot', 'Scatterplot', '∙', LazyScatterplotChart),
  createDefinition('table', 'Table', '☷', LazyTableChart),
  createDefinition('combo', 'Combo', '≋', LazyComboChart),
  createDefinition('map', 'Map', '🗺', LazyMapChart),
  createDefinition('radar', 'Radar', '◌', LazyRadarChart),
  createDefinition('treemap', 'Treemap', '▧', LazyTreemapChart),
  createDefinition('funnel', 'Funnel', '⏷', LazyFunnelChart),
  createDefinition('sankey', 'Sankey', '⇄', LazySankeyChart),
  createDefinition('heatmap', 'Heatmap', '▒', LazyHeatmapChart),
  createDefinition('population-pyramid', 'Population Pyramid', '⫷', LazyPopulationPyramidChart),
  createDefinition('waterfall', 'Waterfall', '⤓', LazyWaterfallChart),
  createDefinition('gauge', 'Gauge', '◠', LazyGaugeChart),
  createDefinition('box-plot', 'Box Plot', '▣', LazyBoxPlotChart),
]

export function getChartDefinition(type: SupportedChartType) {
  return chartRegistry.find(entry => entry.type === type)
}

export function getChartTypeOptions() {
  return chartRegistry.map(({ type, label, icon }) => ({
    type,
    label,
    icon,
  }))
}
