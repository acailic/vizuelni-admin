/**
 * @vizualni/data
 *
 * Data preparation utilities for Serbian government data.
 *
 * @packageDocumentation
 */

export type {
  Observation,
  ObservationValue,
  DimensionMeta,
  MeasureMeta,
  ColumnProfile,
  DimensionType,
  ColumnRole,
  GeoLevel,
  GeoMatchResult,
  ClassificationResult,
  ParsedDataset,
  ParsedDatasetSource,
  JoinedDataset,
  JoinConfig,
  JoinSuggestion,
  JoinType,
  DatasetReference,
  DatasetFilterValue,
  InteractiveCalculation,
  InteractiveFilterValue,
  InteractiveFiltersState,
  InteractiveTimeRange,
  TransformAxisConfig,
  TransformContext,
  AggregationType,
  SortDirection,
  MissingValueStrategy,
  DatasetLoadOptions,
  DatasetLoadError,
  PivotTable,
} from './types'

export { classifyColumns, inferDimensionType } from './classifier'
export { matchGeoColumn, getAllGeoNames, detectGeoLevel, getRegionFuzzyMatcher } from './geo-matcher'
export {
  joinDatasets,
  calculateJoinOverlap,
  autoSuggestJoin,
  normalizeJoinValue,
} from './join'
export { inferJoinDimensions, getBestJoinSuggestion } from './infer-join'
export {
  filterObservations,
  sortObservations,
  aggregateObservations,
  pivotObservations,
  computePercentages,
  applyInteractiveFilters,
  imputeMissing,
  extractTimeValues,
  getTimeSlice,
  getTimeSliceUpTo,
} from './transforms'
export {
  parseNumberValue,
  parseDateValue,
  coerceObservationValue,
} from './domain/value-coercion'
export {
  createLoadError,
  detectResourceFormat,
  decodeResourceBuffer,
} from './application/detect-format'
export { parseDatasetContent, loadDatasetFromUrl } from './application/load-dataset'
