import { scaleTime } from "d3-scale";

export interface TimeScaleOptions {
  /** Input domain [min date, max date] */
  domain: [Date, Date];
  /** Output range [min, max] */
  range: [number, number];
  /** Clamp output to range */
  clamp?: boolean;
  /** Round domain to nice intervals */
  nice?:
    | boolean
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "year";
}

/**
 * Creates a time scale function
 */
export function createTimeScale(options: TimeScaleOptions) {
  const { domain, range, clamp = false, nice = false } = options;

  const scale = scaleTime().domain(domain).range(range).clamp(clamp);

  if (nice) {
    if (typeof nice === "string") {
      const intervalMap: Record<string, number> = {
        second: 1,
        minute: 2,
        hour: 3,
        day: 4,
        week: 5,
        month: 6,
        year: 7,
      };
      scale.nice(intervalMap[nice] || 10);
    } else {
      scale.nice();
    }
  }

  return scale;
}
