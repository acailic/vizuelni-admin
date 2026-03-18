// src/lib/data/patterns/chart-suggestions.ts
import type { SupportedChartType } from '@/types/chart-config';

/**
 * Context for chart suggestion
 */
export interface ChartSuggestionContext {
  hasAgeGroup: boolean;
  hasGender: boolean;
  hasTemporal: boolean;
  hasGeography: boolean;
  measureCount: number;
  dimensionCount: number;
  maxCardinality: number;
}

/**
 * Chart suggestion with confidence and reason
 */
export interface ChartSuggestion {
  type: SupportedChartType;
  confidence: number;
  reason: string;
  config?: Record<string, unknown>;
}

/**
 * Internal suggestion rule
 */
interface SuggestionRule {
  match: (ctx: ChartSuggestionContext) => boolean;
  type: SupportedChartType;
  confidence: number;
  reason: string;
  config?: Record<string, unknown>;
}

/**
 * Chart suggestion rules ordered by specificity
 */
const RULES: SuggestionRule[] = [
  // Population pyramid: age-group + gender
  {
    match: (ctx) => ctx.hasAgeGroup && ctx.hasGender && ctx.measureCount >= 1,
    type: 'population-pyramid',
    confidence: 0.95,
    reason: 'Population pyramid pattern detected (age groups + gender)',
    config: { options: { grouping: 'grouped' } },
  },

  // Choropleth map: single geographic dimension
  {
    match: (ctx) =>
      ctx.hasGeography && ctx.measureCount === 1 && ctx.dimensionCount === 1,
    type: 'map',
    confidence: 0.9,
    reason: 'Geographic distribution detected',
  },

  // Combo: temporal + multiple measures
  {
    match: (ctx) => ctx.hasTemporal && ctx.measureCount >= 2,
    type: 'combo',
    confidence: 0.85,
    reason: 'Multi-measure time series detected',
  },

  // Line: temporal + single measure
  {
    match: (ctx) => ctx.hasTemporal && ctx.measureCount === 1,
    type: 'line',
    confidence: 0.85,
    reason: 'Time series pattern detected',
  },

  // Area: temporal with multiple series
  {
    match: (ctx) =>
      ctx.hasTemporal && ctx.dimensionCount >= 2 && ctx.measureCount === 1,
    type: 'area',
    confidence: 0.8,
    reason: 'Multi-series time pattern detected',
  },

  // Grouped bar: 2 categorical dimensions
  {
    match: (ctx) =>
      !ctx.hasTemporal && ctx.dimensionCount === 2 && ctx.measureCount === 1,
    type: 'bar',
    confidence: 0.75,
    reason: 'Categorical comparison with grouping detected',
  },

  // Column: single categorical dimension
  {
    match: (ctx) =>
      !ctx.hasTemporal &&
      ctx.dimensionCount === 1 &&
      ctx.measureCount === 1 &&
      ctx.maxCardinality <= 20,
    type: 'column',
    confidence: 0.7,
    reason: 'Categorical comparison detected',
  },

  // Pie: low cardinality part-to-whole
  {
    match: (ctx) =>
      ctx.dimensionCount === 1 &&
      ctx.measureCount === 1 &&
      ctx.maxCardinality <= 8,
    type: 'pie',
    confidence: 0.6,
    reason: 'Part-to-whole comparison detected',
  },

  // Scatterplot: 2 measures
  {
    match: (ctx) => ctx.measureCount >= 2 && ctx.dimensionCount >= 1,
    type: 'scatterplot',
    confidence: 0.65,
    reason: 'Correlation analysis detected',
  },

  // Table: high cardinality or many dimensions
  {
    match: (ctx) => ctx.maxCardinality > 20 || ctx.dimensionCount > 3,
    type: 'table',
    confidence: 0.5,
    reason: 'High-cardinality data suitable for table view',
  },
];

/**
 * Suggest chart types based on data characteristics
 */
export function suggestCharts(ctx: ChartSuggestionContext): ChartSuggestion[] {
  const suggestions = RULES.filter((rule) => rule.match(ctx))
    .map((rule) => ({
      type: rule.type,
      confidence: rule.confidence,
      reason: rule.reason,
      config: rule.config,
    }))
    .sort((a, b) => b.confidence - a.confidence);

  return suggestions;
}
