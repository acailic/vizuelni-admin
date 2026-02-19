import { scaleLinear } from "d3-scale";

export interface LinearScaleOptions {
  /** Input domain [min, max] */
  domain: [number, number];
  /** Output range [min, max] */
  range: [number, number];
  /** Clamp output to range */
  clamp?: boolean;
  /** Round domain to nice values */
  nice?: boolean | number;
}

/**
 * Creates a linear scale function
 */
export function createLinearScale(options: LinearScaleOptions) {
  const { domain, range, clamp = false, nice = false } = options;

  const scale = scaleLinear().domain(domain).range(range).clamp(clamp);

  if (nice) {
    scale.nice(typeof nice === "number" ? nice : 10);
  }

  return scale;
}
