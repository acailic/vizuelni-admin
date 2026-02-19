import type { Dimensions, Margins, Rect } from "../types";
import type { ChartConfig } from "../config";

export interface Layout extends Dimensions {}

export interface ComputeLayoutOptions {
  width: number;
  height: number;
  margins?: Partial<Margins>;
}

/**
 * Default margins for charts
 */
const DEFAULT_MARGINS: Margins = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 60,
};

/**
 * Computes chart layout dimensions
 */
export function computeLayout(
  config: ChartConfig,
  options: ComputeLayoutOptions
): Layout {
  const { width, height, margins: customMargins } = options;

  const margins: Margins = {
    ...DEFAULT_MARGINS,
    ...customMargins,
  };

  const chartArea: Rect = {
    x: margins.left,
    y: margins.top,
    width: width - margins.left - margins.right,
    height: height - margins.top - margins.bottom,
  };

  return {
    width,
    height,
    margins,
    chartArea,
  };
}
