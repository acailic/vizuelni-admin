export type {
  ObservationValue,
  Observation,
  DimensionType,
  ColumnRole,
  DimensionMeta,
  MeasureMeta,
  ColumnProfile,
  ParsedDatasetSource,
  JoinType,
  JoinConfig,
  JoinSuggestion,
  DatasetReference,
  ParsedDataset,
  JoinedDataset,
  DatasetFilterValue,
  GeoMatchResult,
} from '@vizualni/shared-kernel'

export type AggregationType = 'sum' | 'avg' | 'count' | 'min' | 'max'
export type SortDirection = 'asc' | 'desc'
export type MissingValueStrategy = 'zero' | 'mean' | 'interpolate' | 'skip'

export interface DatasetLoadOptions {
  datasetId?: string
  resourceId?: string
  resourceUrl?: string
  format?: string
  contentType?: string
  encoding?: string
  rowLimit?: number
  timeoutMs?: number
  fetchInit?: RequestInit
}

export interface DatasetLoadError extends Error {
  code:
    | 'FETCH_FAILED'
    | 'UNSUPPORTED_FORMAT'
    | 'PARSE_FAILED'
    | 'INVALID_JSON'
    | 'UNKNOWN_ENCODING'
}

export interface PivotTable {
  rows: string[]
  columns: string[]
  values: Record<string, Record<string, number | null>>
}
