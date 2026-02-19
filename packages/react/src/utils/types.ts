import type { ScaleLinear, ScaleTime, ScaleBand } from "d3-scale";

/**
 * Union type for all possible X scale types
 */
export type XScale =
  | ScaleTime<number, number>
  | ScaleLinear<number, number>
  | ScaleBand<string>;

/**
 * Type guard to check if a scale is a band scale (used for categorical data)
 */
export function isBandScale(scale: XScale): scale is ScaleBand<string> {
  return typeof (scale as ScaleBand<string>).bandwidth === "function";
}

/**
 * Type guard to check if a scale is a time scale (used for date/time data)
 */
export function isTimeScale(scale: XScale): scale is ScaleTime<number, number> {
  return (
    !isBandScale(scale) &&
    "ticks" in scale &&
    !(
      "invert" in scale &&
      typeof (scale as ScaleLinear<number, number>).ticks === "function"
    )
  );
}

/**
 * Type guard to check if a scale is a linear scale (used for numeric data)
 * Note: Time scales also have ticks, but we distinguish them by checking for time-specific methods
 */
export function isLinearScale(
  scale: XScale
): scale is ScaleLinear<number, number> {
  if (isBandScale(scale)) return false;
  // Both linear and time scales have invert, but time scale domain contains Dates
  const domain = scale.domain();
  return domain.length > 0 && typeof domain[0] === "number";
}
