import {
  getChartSeriesKeys,
  getFilterableDimensions,
  getTemporalValues,
  isTemporalChart,
  parseChartConfig,
  supportsLegendFilter,
  type ChartConfig,
  type ChartConfigInput,
  type ChartRendererDataRow,
  type FilterableDimension,
} from '@vizualni/charts'
import {
  applyInteractiveFilters,
  type InteractiveFiltersState,
  type Observation,
} from '@vizualni/data'

export interface PreparedChartData {
  parsedConfig: ChartConfig
  seriesKeys: string[]
  temporalValues: string[]
  dimensions: FilterableDimension[]
  filteredData: ChartRendererDataRow[]
}

export function prepareChartData(
  config: ChartConfigInput,
  data: ChartRendererDataRow[],
  filterState?: InteractiveFiltersState,
  locale?: string
): PreparedChartData {
  const parsedConfig = parseChartConfig(config)
  const seriesKeys = supportsLegendFilter(parsedConfig) ? getChartSeriesKeys(parsedConfig) : []
  const temporalValues = isTemporalChart(parsedConfig, data)
    ? getTemporalValues(parsedConfig, data)
    : []
  const dimensions = getFilterableDimensions(parsedConfig, data, locale)
  const filteredData = filterState
    ? (applyInteractiveFilters(
        data as Observation[],
        filterState,
        parsedConfig
      ) as ChartRendererDataRow[])
    : data

  return {
    parsedConfig,
    seriesKeys,
    temporalValues,
    dimensions,
    filteredData,
  }
}
