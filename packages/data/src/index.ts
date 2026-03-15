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
  ClassificationResult,
  ParsedDataset,
  ParsedDatasetSource,
  JoinedDataset,
  JoinConfig,
  JoinSuggestion,
  JoinType,
  DatasetReference,
  GeoMatchResult,
} from './types'

export { classifyColumns, inferDimensionType } from './classifier'
export { matchGeoColumn, getAllGeoNames, detectGeoLevel, getRegionFuzzyMatcher } from './geo-matcher'
export {
  joinDatasets,
  calculateJoinOverlap,
  autoSuggestJoin,
  normalizeJoinValue,
} from './join'
