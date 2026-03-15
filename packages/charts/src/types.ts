/**
 * @vizualni/charts - Types
 *
 * Core types for chart configuration and rendering.
 */

import type { ReactNode } from 'react';
import { z } from 'zod';

// Chart types
export type SupportedChartType =
  | 'line'
  | 'bar'
  | 'column'
  | 'area'
  | 'pie'
  | 'scatterplot'
  | 'table'
  | 'combo'
  | 'map';

export type ChartType = SupportedChartType | 'scatter';

// Geographic levels
export type GeoLevel = 'region' | 'district' | 'municipality';

// Map color scale types
export type ColorScaleType = 'sequential' | 'diverging' | 'categorical';

// Classification methods for choropleth maps
export type ClassificationMethod =
  | 'equal-intervals'
  | 'quantiles'
  | 'natural-breaks'
  | 'custom';

// Predefined color palettes for maps
export type MapPalette =
  | 'blues'
  | 'reds'
  | 'greens'
  | 'oranges'
  | 'purples'
  | 'viridis'
  | 'orange-blue'
  | 'red-blue';

// Axis configuration
export interface AxisConfig {
  field: string;
  label?: string;
  type?: 'linear' | 'category' | 'date';
  format?: string;
}

// Chart options
export interface ChartOptions {
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[];
  paletteId?: string;
  customColors?: string[];
  animation?: boolean;
  animationEnabled?: boolean;
  animationField?: string;
  animationSpeed?: number;
  animationLoop?: boolean;
  responsive?: boolean;
  curveType?: 'linear' | 'monotone' | 'step';
  showDots?: boolean;
  grouping?: 'grouped' | 'stacked' | 'percent-stacked';
  fillOpacity?: number;
  innerRadius?: number;
  showLabels?: boolean;
  showPercentages?: boolean;
  dotSize?: number;
  opacity?: number;
  pageSize?: number;
  secondaryField?: string;
  legendPosition?: 'top' | 'bottom' | 'right' | 'none';
  geoLevel?: GeoLevel;
  colorScaleType?: ColorScaleType;
  colorPalette?: MapPalette;
  classificationMethod?: ClassificationMethod;
  classCount?: number;
  customBreaks?: number[];
  showSymbols?: boolean;
  symbolMinSize?: number;
  symbolMaxSize?: number;
  symbolOpacity?: number;
  showMissingDataPattern?: boolean;
  basemapStyle?: 'streets' | 'light' | 'satellite';
}

// Reference line for charts
export interface ReferenceLine {
  id: string;
  axis: 'x' | 'y';
  value: number | string;
  label: string;
  style: 'solid' | 'dashed' | 'dotted';
  color?: string;
  labelPosition: 'above' | 'below' | 'left' | 'right';
}

// Chart annotation
export interface ChartAnnotation {
  id: string;
  type: 'point' | 'range';
  x?: number | string;
  y?: number;
  xStart?: number | string;
  xEnd?: number | string;
  yStart?: number;
  yEnd?: number;
  text: string;
  style: 'callout' | 'badge' | 'highlight';
  color?: string;
  backgroundColor?: string;
}

// Chart configuration
export interface ChartConfig {
  id?: string;
  type: ChartType;
  title: string;
  description?: string;
  dataset_id?: string;
  x_axis?: AxisConfig;
  y_axis?: AxisConfig;
  options?: ChartOptions;
  referenceLines?: ReferenceLine[];
  annotations?: ChartAnnotation[];
}

// Chart renderer props
export type ChartRendererDataRow = Record<string, unknown>;

export interface ChartRendererProps {
  config: ChartConfig;
  data: ChartRendererDataRow[];
  height?: number;
  locale?: string;
  filterBar?: ReactNode;
  showInternalLegend?: boolean;
  hiddenSeriesKeys?: string[];
  previewMode?: boolean;
}

// Chart capabilities
export interface ChartCapabilities {
  supportsStacking: boolean;
  supportsGrouping: boolean;
  supportsAnimation: boolean;
  requiresGeo: boolean;
  minDimensions: number;
  minMeasures: number;
  maxMeasures: number;
}

// Default chart colors
export const defaultChartColors = [
  '#0D4077',
  '#4B90F5',
  '#3558A2',
  '#C6363C',
  '#10B981',
  '#F59E0B',
];

// Zod schemas for validation
export const axisConfigSchema = z.object({
  field: z.string().trim().min(1),
  label: z.string().trim().min(1).optional(),
  type: z.enum(['linear', 'category', 'date']).optional(),
  format: z.string().trim().min(1).optional(),
});

const baseChartOptionsSchema = z.object({
  showLegend: z.boolean().optional(),
  showGrid: z.boolean().optional(),
  colors: z.array(z.string().trim().min(1)).min(1).optional(),
  paletteId: z.string().trim().min(1).optional(),
  customColors: z.array(z.string().trim().min(1)).min(1).optional(),
  animation: z.boolean().optional(),
  animationEnabled: z.boolean().optional(),
  animationField: z.string().trim().min(1).optional(),
  animationSpeed: z.number().positive().optional(),
  animationLoop: z.boolean().optional(),
  responsive: z.boolean().optional(),
});

export const chartOptionsSchema = baseChartOptionsSchema.extend({
  curveType: z.enum(['linear', 'monotone', 'step']).optional(),
  showDots: z.boolean().optional(),
  grouping: z.enum(['grouped', 'stacked', 'percent-stacked']).optional(),
  fillOpacity: z.number().min(0).max(1).optional(),
  innerRadius: z.number().min(0).max(100).optional(),
  showLabels: z.boolean().optional(),
  showPercentages: z.boolean().optional(),
  dotSize: z.number().min(2).max(24).optional(),
  opacity: z.number().min(0).max(1).optional(),
  pageSize: z.number().int().min(5).max(50).optional(),
  secondaryField: z.string().trim().min(1).optional(),
  legendPosition: z.enum(['top', 'bottom', 'right', 'none']).optional(),
  geoLevel: z.enum(['region', 'district', 'municipality']).optional(),
  colorScaleType: z.enum(['sequential', 'diverging', 'categorical']).optional(),
  colorPalette: z
    .enum([
      'blues',
      'reds',
      'greens',
      'oranges',
      'purples',
      'viridis',
      'orange-blue',
      'red-blue',
    ])
    .optional(),
  classificationMethod: z
    .enum(['equal-intervals', 'quantiles', 'natural-breaks', 'custom'])
    .optional(),
  classCount: z.number().int().min(2).max(12).optional(),
  customBreaks: z.array(z.number()).min(1).optional(),
  showSymbols: z.boolean().optional(),
  symbolMinSize: z.number().positive().optional(),
  symbolMaxSize: z.number().positive().optional(),
  symbolOpacity: z.number().min(0).max(1).optional(),
  showMissingDataPattern: z.boolean().optional(),
  basemapStyle: z.enum(['streets', 'light', 'satellite']).optional(),
});

const baseChartConfigShape = {
  id: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  dataset_id: z.string().trim().min(1).optional(),
};

const xyChartConfigShape = {
  ...baseChartConfigShape,
  x_axis: axisConfigSchema,
  y_axis: axisConfigSchema,
};

const sharedChartConfigShape = {
  options: chartOptionsSchema.optional(),
  referenceLines: z
    .array(
      z.object({
        id: z.string(),
        axis: z.enum(['x', 'y']),
        value: z.union([z.number(), z.string()]),
        label: z.string(),
        style: z.enum(['solid', 'dashed', 'dotted']),
        color: z.string().optional(),
        labelPosition: z.enum(['above', 'below', 'left', 'right']),
      })
    )
    .optional(),
  annotations: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(['point', 'range']),
        x: z.union([z.number(), z.string()]).optional(),
        y: z.number().optional(),
        xStart: z.union([z.number(), z.string()]).optional(),
        xEnd: z.union([z.number(), z.string()]).optional(),
        yStart: z.number().optional(),
        yEnd: z.number().optional(),
        text: z.string(),
        style: z.enum(['callout', 'badge', 'highlight']),
        color: z.string().optional(),
        backgroundColor: z.string().optional(),
      })
    )
    .optional(),
};

const cartesianChartConfigSchema = z.object({
  ...xyChartConfigShape,
  type: z.enum([
    'line',
    'bar',
    'column',
    'area',
    'pie',
    'scatterplot',
    'combo',
    'map',
  ]),
});

const tableChartConfigSchema = z.object({
  ...baseChartConfigShape,
  type: z.literal('table'),
  x_axis: axisConfigSchema.optional(),
  y_axis: axisConfigSchema.optional(),
});

export const chartConfigSchema = z.union([
  cartesianChartConfigSchema.extend(sharedChartConfigShape),
  tableChartConfigSchema.extend(sharedChartConfigShape),
]);

/**
 * Normalize chart type string
 */
export function normalizeChartType(type: string): SupportedChartType | null {
  if (type === 'scatter') {
    return 'scatterplot';
  }

  const supportedTypes: SupportedChartType[] = [
    'line',
    'bar',
    'column',
    'area',
    'pie',
    'scatterplot',
    'table',
    'combo',
    'map',
  ];

  return supportedTypes.includes(type as SupportedChartType)
    ? (type as SupportedChartType)
    : null;
}

/**
 * Parse and validate chart configuration
 */
export function parseChartConfig(input: ChartConfig): ChartConfig {
  const normalizedType = normalizeChartType(input.type);

  if (!normalizedType) {
    throw new Error(`Unsupported chart type: ${input.type}`);
  }

  return chartConfigSchema.parse({
    ...input,
    type: normalizedType,
  }) as ChartConfig;
}

/**
 * Get default options for a chart type
 */
export function getDefaultOptions(
  type: SupportedChartType
): Partial<ChartOptions> {
  switch (type) {
    case 'line':
      return { curveType: 'monotone', showDots: true, showLegend: true };
    case 'bar':
    case 'column':
      return { grouping: 'grouped', showLegend: true };
    case 'area':
      return { fillOpacity: 0.6, curveType: 'monotone', showLegend: true };
    case 'pie':
      return { innerRadius: 0, showLabels: true, showPercentages: true };
    case 'scatterplot':
      return { dotSize: 6, opacity: 0.7, showLegend: true };
    case 'table':
      return { pageSize: 10 };
    case 'combo':
      return { showLegend: true };
    case 'map':
      return {
        geoLevel: 'district',
        colorScaleType: 'sequential',
        colorPalette: 'blues',
        classificationMethod: 'quantiles',
        classCount: 5,
        showSymbols: false,
      };
    default:
      return {};
  }
}

/**
 * Get capabilities for a chart type
 */
export function getChartCapabilities(
  type: SupportedChartType
): ChartCapabilities {
  switch (type) {
    case 'line':
    case 'area':
      return {
        supportsStacking: false,
        supportsGrouping: true,
        supportsAnimation: true,
        requiresGeo: false,
        minDimensions: 1,
        minMeasures: 1,
        maxMeasures: 10,
      };
    case 'bar':
    case 'column':
      return {
        supportsStacking: true,
        supportsGrouping: true,
        supportsAnimation: true,
        requiresGeo: false,
        minDimensions: 1,
        minMeasures: 1,
        maxMeasures: 10,
      };
    case 'pie':
      return {
        supportsStacking: false,
        supportsGrouping: false,
        supportsAnimation: true,
        requiresGeo: false,
        minDimensions: 1,
        minMeasures: 1,
        maxMeasures: 1,
      };
    case 'scatterplot':
      return {
        supportsStacking: false,
        supportsGrouping: false,
        supportsAnimation: false,
        requiresGeo: false,
        minDimensions: 1,
        minMeasures: 2,
        maxMeasures: 3,
      };
    case 'table':
      return {
        supportsStacking: false,
        supportsGrouping: false,
        supportsAnimation: false,
        requiresGeo: false,
        minDimensions: 0,
        minMeasures: 0,
        maxMeasures: 20,
      };
    case 'combo':
      return {
        supportsStacking: false,
        supportsGrouping: true,
        supportsAnimation: true,
        requiresGeo: false,
        minDimensions: 1,
        minMeasures: 2,
        maxMeasures: 4,
      };
    case 'map':
      return {
        supportsStacking: false,
        supportsGrouping: false,
        supportsAnimation: true,
        requiresGeo: true,
        minDimensions: 1,
        minMeasures: 1,
        maxMeasures: 2,
      };
    default:
      return {
        supportsStacking: false,
        supportsGrouping: false,
        supportsAnimation: false,
        requiresGeo: false,
        minDimensions: 1,
        minMeasures: 1,
        maxMeasures: 10,
      };
  }
}
