/**
 * @vizualni/charts
 *
 * React chart components for Serbian government data visualization.
 *
 * @packageDocumentation
 */

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
  ChartConfigInput,
  ChartRendererDataRow,
  ChartCapabilities,
  ConfiguratorStep,
} from './types';

// React-specific types (separated from domain layer)
export type {
  ChartRendererProps,
  ChartRendererComponentProps,
  ChartTypeDefinition,
} from './react-types';

// Constants
export { defaultChartColors } from './types';

// Schemas
export {
  axisConfigSchema,
  chartOptionsSchema,
  chartConfigSchema,
} from './types';

// Utility functions
export {
  normalizeChartType,
  parseChartConfig,
  getDefaultOptions,
  getChartCapabilities,
} from './types';

export {
  resolveChartLocale,
  createChartFormatters,
  formatChartValue,
} from './domain/formatters';

export type {
  FilterOption,
  FilterableDimension,
} from './domain/interactive-filters';

export {
  getChartId,
  getChartSeriesKeys,
  supportsLegendFilter,
  supportsCalculationToggle,
  isTemporalChart,
  getTemporalValues,
  getFilterableDimensions,
  inferDimensionLabel,
  matchesFilterSearch,
} from './domain/interactive-filters';

export type { PaletteType, ColorPalette } from './domain/color-palettes';

export {
  PALETTES,
  DEFAULT_PALETTE_ID,
  getPalette,
  getAllPalettes,
  getPalettesByType as getPalettesByCategory,
  getPalettesBySource,
  getColorblindSafePalettes,
  getPaletteColors,
  getDefaultPaletteForChartType,
  getPaletteOptionsForChartType,
} from './domain/color-palettes';

export type { ClassificationResult as ColorClassificationResult } from './domain/color-scales';

export {
  COLOR_PALETTES,
  MISSING_DATA_COLORS,
  classifyData,
  getColorForValue,
  createColorScale,
  getLegendTicks,
  formatNumberForMap,
  getPaletteInfo,
  getPalettesByType as getMapPalettesByType,
} from './domain/color-scales';

export {
  getSuggestedChartType,
  getSuggestedChartConfig,
} from './domain/suggestions';

export {
  stepOrder,
  isConfigReady,
  canProceedFromStep,
} from './domain/configurator-rules';

// Dashboard rules
export {
  MAX_CHARTS,
  canAddChart,
  isValidDashboardConfig,
  generateDashboardId,
  createEmptyDashboard,
  createDashboardFromTemplate,
  type DashboardLayoutItem,
  type SharedFilterConfig,
  type DashboardConfig,
  type DashboardTemplate,
} from './domain/dashboard-rules';

// Filter normalization
export {
  type InteractiveFiltersStateLike,
  normalizeLegendState,
  normalizeDataFilters,
  mergeFiltersWithDefaults,
} from './domain/filter-normalization';

// Re-export types from @vizualni/data for convenience
export type {
  Observation,
  ObservationValue,
  DimensionMeta,
  MeasureMeta,
  ColumnProfile,
  ParsedDataset,
  ParsedDatasetSource,
  JoinedDataset,
  JoinConfig,
  JoinSuggestion,
} from '@vizualni/shared-kernel';

// Domain ports (repository interfaces)
export {
  ChartStatus,
  type SavedChart,
  type SavedChartMeta,
  type CreateChartInput,
  type UpdateChartInput,
  type ChartListFilters,
  type ChartListPagination,
  type ChartListResult,
  type RepositoryResult,
  type ChartRepository,
} from './domain/ports/chart-repository';

// Interactive annotations
export type {
  InteractiveAnnotation,
  InteractiveChartAnnotation,
} from './domain/interactive-annotation';
