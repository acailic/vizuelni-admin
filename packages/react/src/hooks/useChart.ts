import { useMemo } from "react";
import {
  computeScales,
  computeLayout,
  type ChartConfig,
  type Datum,
  type Scales,
  type Layout,
  type Margins,
  type Rect,
} from "@vizualni/core";

export interface UseChartOptions {
  width: number;
  height: number;
  margins?: Partial<Margins>;
}

export interface ChartResult {
  scales: Scales;
  layout: Layout;
  /** Error if data validation failed */
  error?: string;
}

/** Default margins for charts */
const DEFAULT_MARGINS: Margins = {
  top: 30,
  right: 30,
  bottom: 50,
  left: 60,
};

/**
 * Validates that required fields exist in data
 */
function validateData(
  data: Datum[],
  config: ChartConfig
): { valid: boolean; error?: string } {
  if (!data || data.length === 0) {
    return { valid: false, error: "Data array is empty" };
  }

  const requiredFields: string[] = [];

  if (config.type === "line" || config.type === "bar") {
    requiredFields.push(config.x.field, config.y.field);
    if (config.segment) {
      requiredFields.push(config.segment.field);
    }
  } else if (config.type === "pie") {
    requiredFields.push(config.value.field, config.category.field);
  }

  for (const field of requiredFields) {
    const hasField = data.some((d) => field in d && d[field] !== undefined);
    if (!hasField) {
      return {
        valid: false,
        error: `Required field "${field}" not found in data`,
      };
    }
  }

  return { valid: true };
}

/**
 * Headless hook that computes chart scales and layout
 * @template TConfig - The specific chart config type (e.g., LineChartConfig, BarChartConfig)
 */
export function useChart<TConfig extends ChartConfig>(
  data: Datum[],
  config: TConfig,
  options: UseChartOptions
): ChartResult {
  const { width, height, margins: customMargins } = options;

  const margins: Margins = useMemo(
    () => ({ ...DEFAULT_MARGINS, ...customMargins }),
    [customMargins]
  );

  const chartArea: Rect = useMemo(
    () => ({
      x: margins.left,
      y: margins.top,
      width: width - margins.left - margins.right,
      height: height - margins.top - margins.bottom,
    }),
    [width, height, margins]
  );

  // Validate data
  const validation = useMemo(() => validateData(data, config), [data, config]);

  const scales = useMemo(() => {
    if (!validation.valid) {
      // Return dummy scales on error
      return {
        x: () => 0,
        y: () => 0,
      } as unknown as Scales;
    }
    return computeScales(data, config, { width, height, margins, chartArea });
  }, [data, config, width, height, margins, chartArea, validation]);

  const layout = useMemo(
    () => computeLayout(config, { width, height, margins: customMargins }),
    [config, width, height, customMargins]
  );

  return useMemo(
    () => ({
      scales,
      layout,
      error: validation.valid ? undefined : validation.error,
    }),
    [scales, layout, validation]
  );
}
