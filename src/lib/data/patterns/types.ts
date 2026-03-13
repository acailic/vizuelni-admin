// src/lib/data/patterns/types.ts
import type { DimensionMeta, MeasureMeta } from '@/types/observation'
import type { SupportedChartType } from '@/types/chart-config'

/**
 * Semantic types for detected patterns
 */
export type SemanticType =
  | 'age-group'
  | 'gender'
  | 'region'
  | 'district'
  | 'municipality'
  | 'year'
  | 'quarter'
  | 'month'
  | 'icd-code'
  | 'nace-code'
  | 'currency'
  | 'percentage'
  | 'unknown'

/**
 * Enriched dimension metadata with semantic detection
 */
export interface EnrichedDimensionMeta extends DimensionMeta {
  semanticType?: SemanticType
  hierarchy?: string[]
  unit?: string
}

/**
 * Enriched measure metadata
 */
export interface EnrichedMeasureMeta extends MeasureMeta {
  format?: string
}

/**
 * Chart suggestion with confidence score
 */
export interface ChartSuggestion {
  type: SupportedChartType
  confidence: number // 0-1
  reason: string
  config?: Record<string, unknown>
}

/**
 * Quality warning types
 */
export type QualityWarningType =
  | 'missing-values'
  | 'outliers'
  | 'inconsistent-format'
  | 'mixed-types'

export type QualitySeverity = 'info' | 'warning' | 'error'

/**
 * Quality warning for a column
 */
export interface QualityWarning {
  column: string
  type: QualityWarningType
  severity: QualitySeverity
  message: string
  affectedRows: number
}

/**
 * Data quality report
 */
export interface QualityReport {
  completeness: number // 0-1 ratio of non-null values
  consistency: number // 0-1 based on pattern violations
  warnings: QualityWarning[]
  suggestions: string[]
}

/**
 * Complete detection result
 */
export interface DetectionResult {
  dimensions: EnrichedDimensionMeta[]
  measures: EnrichedMeasureMeta[]
  suggestedCharts: ChartSuggestion[]
  quality: QualityReport
}

/**
 * Pattern definition for vocabulary
 */
export interface PatternDefinition {
  columnPatterns: RegExp[]
  valuePatterns?: RegExp[]
  knownValues?: Record<string, string[]>
  unit?: string
}
