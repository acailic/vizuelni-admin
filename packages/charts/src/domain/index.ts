/**
 * @vizualni/charts - Domain Layer
 *
 * Core domain types, schemas, and business logic.
 */

// Chart configuration
export {
  type SupportedChartType,
  type ChartType,
  type GeoLevel,
  type ColorScaleType,
  type ClassificationMethod,
  type MapPalette,
  type AxisConfig,
  type ChartOptions,
  type ReferenceLine,
  type ChartAnnotation,
  type ChartConfig,
  type ChartRendererDataRow,
  type ChartCapabilities,
  defaultChartColors,
  axisConfigSchema,
  chartOptionsSchema,
  chartConfigSchema,
  normalizeChartType,
  parseChartConfig,
  getDefaultOptions,
  getChartCapabilities,
} from './chart-config';

// Configurator rules
export {
  type ConfiguratorStep,
  stepOrder,
  isConfigReady,
  canProceedFromStep,
} from './configurator-rules';

// Filter normalization
export {
  type InteractiveFiltersStateLike,
  normalizeLegendState,
  normalizeDataFilters,
  mergeFiltersWithDefaults,
} from './filter-normalization';

// Dashboard rules
export {
  MAX_CHARTS,
  canAddChart,
  generateDashboardId,
  createEmptyDashboard,
  type DashboardLayoutItem,
  type SharedFilterConfig,
  type DashboardConfig,
  type DashboardTemplate,
  createDashboardFromTemplate,
} from './dashboard-rules';

// Ports (repository interfaces)
export * from './ports';
