/**
 * @vizualni/charts
 *
 * React chart components for Serbian government data visualization.
 *
 * @packageDocumentation
 */

// Core types
export type {
  SupportedChartType,
  ChartType,
  GeoLevel,
  ColorScaleType,
  ClassificationMethod,
  MapPalette,
  AxisConfig,
  ChartOptions,
  ReferenceLine,
  ChartAnnotation,
  ChartConfig,
  ChartRendererDataRow,
  ChartRendererProps,
  ChartCapabilities,
} from './types'

// Constants
export { defaultChartColors } from './types'

// Schemas
export {
  axisConfigSchema,
  chartOptionsSchema,
  chartConfigSchema,
} from './types'

// Utility functions
export {
  normalizeChartType,
  parseChartConfig,
  getDefaultOptions,
  getChartCapabilities,
} from './types'

// Re-export types from @vizualni/data for convenience
export type {
  Observation,
  ObservationValue,
  DimensionMeta,
  MeasureMeta,
  ColumnProfile,
  ClassificationResult,
} from '@vizualni/data'

// Re-export geo types from @vizualni/geo-data for convenience
export type { SerbiaGeoProperties } from '@vizualni/geo-data'
