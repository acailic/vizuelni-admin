// src/lib/data/patterns/quality-analyzer.ts
import type { Observation } from '@/types/observation';
import type {
  EnrichedDimensionMeta,
  EnrichedMeasureMeta,
  QualityReport,
  QualityWarning,
} from './types';

/**
 * Calculate completeness ratio (non-null values / total cells)
 */
function calculateCompleteness(
  data: Observation[],
  dimensions: EnrichedDimensionMeta[],
  measures: EnrichedMeasureMeta[]
): number {
  if (data.length === 0) return 1;

  const allKeys = [
    ...dimensions.map((d) => d.key),
    ...measures.map((m) => m.key),
  ];

  if (allKeys.length === 0) return 1;

  let nonNullCount = 0;
  const totalCells = data.length * allKeys.length;

  for (const row of data) {
    for (const key of allKeys) {
      if (row[key] !== null && row[key] !== undefined) {
        nonNullCount++;
      }
    }
  }

  return nonNullCount / totalCells;
}

/**
 * Calculate IQR (Interquartile Range) outliers
 */
function detectOutliers(values: number[]): number[] {
  if (values.length < 4) return [];

  const sorted = [...values].sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return values.filter((v) => v < lowerBound || v > upperBound);
}

/**
 * Detect missing values in a column
 */
function detectMissingValues(
  data: Observation[],
  key: string
): { count: number; ratio: number } {
  const missingCount = data.filter(
    (row) => row[key] === null || row[key] === undefined
  ).length;

  return {
    count: missingCount,
    ratio: data.length > 0 ? missingCount / data.length : 0,
  };
}

/**
 * Analyze data quality and generate warnings/suggestions
 */
export function analyzeQuality(
  data: Observation[],
  dimensions: EnrichedDimensionMeta[],
  measures: EnrichedMeasureMeta[]
): QualityReport {
  const warnings: QualityWarning[] = [];
  const suggestions: string[] = [];

  // Check for missing values
  const allKeys = [
    ...dimensions.map((d) => d.key),
    ...measures.map((m) => m.key),
  ];

  for (const key of allKeys) {
    const missing = detectMissingValues(data, key);
    if (missing.count > 0) {
      warnings.push({
        column: key,
        type: 'missing-values',
        severity: missing.ratio > 0.1 ? 'warning' : 'info',
        message: `Column "${key}" has ${missing.count} missing values (${Math.round(missing.ratio * 100)}%)`,
        affectedRows: missing.count,
      });
    }
  }

  // Check for outliers in measures
  for (const measure of measures) {
    const numericValues = data
      .map((row) => row[measure.key])
      .filter((v): v is number => typeof v === 'number' && !isNaN(v));

    if (numericValues.length >= 4) {
      const outliers = detectOutliers(numericValues);
      if (outliers.length > 0) {
        warnings.push({
          column: measure.key,
          type: 'outliers',
          severity: 'info',
          message: `Column "${measure.key}" has ${outliers.length} potential outlier(s)`,
          affectedRows: outliers.length,
        });
      }
    }
  }

  // Calculate metrics
  const completeness = calculateCompleteness(data, dimensions, measures);

  // Consistency based on warnings severity
  const errorCount = warnings.filter((w) => w.severity === 'error').length;
  const warningCount = warnings.filter((w) => w.severity === 'warning').length;
  const consistency = Math.max(0, 1 - (errorCount * 0.2 + warningCount * 0.1));

  // Generate suggestions
  if (completeness < 0.9) {
    suggestions.push(
      'Consider filling missing values or removing incomplete rows'
    );
  }

  if (warnings.some((w) => w.type === 'outliers')) {
    suggestions.push(
      'Review outlier values - they may be data entry errors or may need special handling'
    );
  }

  if (measures.some((m) => m.hasNulls)) {
    suggestions.push(
      'Some measures contain null values which may affect chart rendering'
    );
  }

  // Always add at least one helpful suggestion
  if (suggestions.length === 0 && warnings.length > 0) {
    suggestions.push('Review warnings before proceeding with visualization');
  }

  if (suggestions.length === 0) {
    suggestions.push('Data quality looks good - ready for visualization');
  }

  return {
    completeness,
    consistency,
    warnings,
    suggestions,
  };
}
