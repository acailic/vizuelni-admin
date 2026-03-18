// src/lib/data/patterns/index.ts
/**
 * Serbian Data Detection Pattern Library
 *
 * Detects semantic patterns in Serbian government data and suggests
 * appropriate visualizations based on data characteristics.
 */

import type {
  Observation,
  DimensionMeta,
  MeasureMeta,
} from '@/types/observation';
import type {
  EnrichedDimensionMeta,
  EnrichedMeasureMeta,
  DetectionResult,
} from './types';
import { detectSemanticType, getSemanticUnit } from './serbian-vocabulary';
import {
  suggestCharts,
  type ChartSuggestionContext,
} from './chart-suggestions';
import { analyzeQuality } from './quality-analyzer';

// Re-export types
export * from './types';

// Re-export vocabulary functions
export {
  detectSemanticType,
  getSemanticUnit,
  isAgeGroupValue,
  isAgeGroupColumn,
} from './serbian-vocabulary';

// Re-export chart suggestions
export {
  suggestCharts,
  type ChartSuggestionContext,
} from './chart-suggestions';

// Re-export quality analyzer
export { analyzeQuality } from './quality-analyzer';

/**
 * Enrich dimension metadata with semantic detection
 */
function enrichDimensions(
  dimensions: DimensionMeta[],
  data: Observation[]
): EnrichedDimensionMeta[] {
  return dimensions.map((dim) => {
    const semanticType = detectSemanticType(dim.key, data);
    const unit = getSemanticUnit(semanticType);

    return {
      ...dim,
      semanticType,
      unit,
    };
  });
}

/**
 * Enrich measure metadata
 */
function enrichMeasures(measures: MeasureMeta[]): EnrichedMeasureMeta[] {
  return measures.map((measure) => ({
    ...measure,
    format: undefined, // Can be extended later
  }));
}

/**
 * Build chart suggestion context from enriched metadata
 */
function buildSuggestionContext(
  dimensions: EnrichedDimensionMeta[],
  measures: EnrichedMeasureMeta[]
): ChartSuggestionContext {
  const semanticTypes = dimensions.map((d) => d.semanticType);

  return {
    hasAgeGroup: semanticTypes.includes('age-group'),
    hasGender: semanticTypes.includes('gender'),
    hasTemporal: semanticTypes.some((t) =>
      ['year', 'quarter', 'month'].includes(t ?? '')
    ),
    hasGeography: semanticTypes.some((t) =>
      ['region', 'district', 'municipality'].includes(t ?? '')
    ),
    measureCount: measures.length,
    dimensionCount: dimensions.length,
    maxCardinality: Math.max(...dimensions.map((d) => d.cardinality ?? 0), 0),
  };
}

/**
 * Detect patterns in data and generate suggestions
 *
 * @param data - Array of observations
 * @param dimensions - Dimension metadata
 * @param measures - Measure metadata
 * @returns Detection result with enriched metadata, chart suggestions, and quality report
 */
export function detectPatterns(
  data: Observation[],
  dimensions: DimensionMeta[],
  measures: MeasureMeta[]
): DetectionResult {
  // Enrich metadata with semantic detection
  const enrichedDimensions = enrichDimensions(dimensions, data);
  const enrichedMeasures = enrichMeasures(measures);

  // Generate chart suggestions
  const context = buildSuggestionContext(enrichedDimensions, enrichedMeasures);
  const suggestedCharts = suggestCharts(context);

  // Analyze data quality
  const quality = analyzeQuality(data, enrichedDimensions, enrichedMeasures);

  return {
    dimensions: enrichedDimensions,
    measures: enrichedMeasures,
    suggestedCharts,
    quality,
  };
}
