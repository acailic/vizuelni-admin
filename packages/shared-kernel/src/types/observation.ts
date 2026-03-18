export type ObservationValue = string | number | Date | null

export interface Observation {
  [dimensionKey: string]: ObservationValue
}

export type DimensionType = 'categorical' | 'temporal' | 'geographic'
export type ColumnRole = 'dimension' | 'measure' | 'metadata'

export interface DimensionMeta {
  key: string
  label: string
  type: DimensionType
  values: Array<string | Date>
  cardinality: number
}

export interface MeasureMeta {
  key: string
  label: string
  unit?: string
  min: number
  max: number
  hasNulls: boolean
}

export interface ColumnProfile {
  key: string
  label: string
  role: ColumnRole
  dimensionType?: DimensionType
  numericRatio: number
  dateRatio: number
  nullRatio: number
  cardinality: number
}

export interface ParsedDatasetSource {
  datasetId?: string
  resourceId?: string
  resourceUrl?: string
  format: string
  fetchedAt?: string
  name?: string
}

export type JoinType = 'inner' | 'left'

export interface JoinConfig {
  primary: { datasetId: string; resourceId: string; joinKey: string }
  secondary: { datasetId: string; resourceId: string; joinKey: string }
  joinType: JoinType
}

export interface JoinSuggestion {
  primaryKey: string
  secondaryKey: string
  confidence: number
  matchType: 'exact-name' | 'fuzzy-name' | 'value-overlap'
  overlapPercent: number
}

export interface DatasetReference {
  datasetId: string
  resourceId: string
  joinKey?: string
  prefix?: string
}

export interface ParsedDataset {
  observations: Observation[]
  dimensions: DimensionMeta[]
  measures: MeasureMeta[]
  metadataColumns: string[]
  columns: string[]
  rowCount: number
  source: ParsedDatasetSource
}

export interface JoinedDataset extends ParsedDataset {
  joinedFrom: DatasetReference[]
}
