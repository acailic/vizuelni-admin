/**
 * Choropleth Color Utilities
 * Color scales for geographic visualizations
 */

import { ColorScaleConfig, MapDataPoint } from './types';

// Predefined color scales
export const COLOR_SCALES = {
  // Sequential scales for positive values
  blues: [
    '#f7fbff',
    '#deebf7',
    '#c6dbef',
    '#9ecae1',
    '#6baed6',
    '#4292c6',
    '#2171b5',
    '#08519c',
    '#08306b',
  ],
  greens: [
    '#f7fcf5',
    '#e5f5e0',
    '#c7e9c0',
    '#a1d99b',
    '#74c476',
    '#41ab5d',
    '#238b45',
    '#006d2c',
    '#00441b',
  ],
  reds: [
    '#fff5f0',
    '#fee0d2',
    '#fcbba1',
    '#fc9272',
    '#fb6a4a',
    '#de2d26',
    '#a50f15',
    '#67000d',
  ],

  // Diverging scales for +/- values
  redBlue: [
    '#b2182b',
    '#d6604d',
    '#f4a582',
    '#fddbc7',
    '#f7f7f7',
    '#d1e5f0',
    '#92c5de',
    '#4393c3',
    '#2166ac',
  ],
  redGreen: [
    '#d73027',
    '#f46d43',
    '#fdae61',
    '#fee08b',
    '#ffffbf',
    '#d9ef8b',
    '#a6d96a',
    '#66bd63',
    '#1a9850',
  ],

  // Categorical for discrete values
  categorical: [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
  ],
};

/**
 * Get color for a value using a color scale
 */
export function getColorForValue(
  value: number,
  config: ColorScaleConfig
): string {
  const { type, colors, domain = [0, 100], midPoint } = config;

  if (type === 'sequential') {
    const [min, max] = domain;
    const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const index = Math.floor(normalized * (colors.length - 1));
    return colors[Math.min(index, colors.length - 1)];
  }

  if (type === 'diverging' && midPoint !== undefined) {
    const [min, max] = domain;
    const normalizedMid = (midPoint - min) / (max - min);
    const normalized = (value - min) / (max - min);

    if (normalized < normalizedMid) {
      const lowerNorm = normalized / normalizedMid;
      const index = Math.floor(lowerNorm * (colors.length / 2 - 1));
      return colors[Math.min(index, Math.floor(colors.length / 2) - 1)];
    } else {
      const upperNorm = (normalized - normalizedMid) / (1 - normalizedMid);
      const index =
        Math.floor(upperNorm * (colors.length / 2 - 1)) +
        Math.floor(colors.length / 2);
      return colors[Math.min(index, colors.length - 1)];
    }
  }

  // Fallback to first color
  return colors[0];
}

/**
 * Generate legend items from color scale config
 */
export function generateLegendItems(
  config: ColorScaleConfig,
  steps: number = 5
): { color: string; label: string; value: number }[] {
  const {
    type: _type,
    colors: _colors,
    domain = [0, 100],
    midPoint: _midPoint,
  } = config;
  const [min, max] = domain;
  const items: { color: string; label: string; value: number }[] = [];

  for (let i = 0; i < steps; i++) {
    const value = min + (max - min) * (i / (steps - 1));
    const color = getColorForValue(value, config);
    items.push({
      color,
      label: formatNumber(value),
      value,
    });
  }

  return items;
}

/**
 * Format number for display
 */
function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toFixed(value % 1 === 0 ? 0 : 1);
}

/**
 * Create a color scale config from data
 */
export function createColorScaleFromData(
  data: MapDataPoint[],
  scaleType: 'sequential' | 'diverging' = 'sequential',
  colorScheme: string = 'blues'
): ColorScaleConfig {
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const midPoint = min + (max - min) / 2;

  const colors =
    COLOR_SCALES[colorScheme as keyof typeof COLOR_SCALES] ||
    COLOR_SCALES.blues;

  return {
    type: scaleType,
    colors: Array.isArray(colors) ? colors : [colors],
    domain: [min, max],
    midPoint: scaleType === 'diverging' ? midPoint : undefined,
  };
}
