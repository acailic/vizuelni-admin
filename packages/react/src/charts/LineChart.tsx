import type { ScaleTime, ScaleLinear } from "d3-scale";
import { useChart } from "../hooks/useChart";
import { XAxis, YAxis } from "../svg/Axes";
import { LinePath } from "../svg/LinePath";
import type { LineChartConfig, Datum } from "@vizualni/core";

export interface LineChartProps {
  data: Datum[];
  config: LineChartConfig;
  width: number;
  height: number;
  className?: string;
}

/**
 * Type guard to check if scale is a continuous scale (time or linear)
 * Continuous scales have an invert function and ticks method
 */
function isContinuousScale(
  scale: unknown
): scale is ScaleTime<number, number> | ScaleLinear<number, number> {
  return (
    typeof scale === "function" &&
    "invert" in scale &&
    typeof (scale as { invert: unknown }).invert === "function" &&
    "ticks" in scale &&
    typeof (scale as { ticks: unknown }).ticks === "function"
  );
}

/**
 * Line chart component
 */
export function LineChart({
  data,
  config,
  width,
  height,
  className,
}: LineChartProps) {
  const { scales, layout, error } = useChart(data, config, { width, height });

  // Validate that we have a continuous scale for x-axis
  if (!isContinuousScale(scales.x)) {
    if (error) {
      // Data validation failed, return empty SVG
      return (
        <svg
          role="img"
          width={width}
          height={height}
          className={className}
          aria-label="Line chart"
        >
          <text x={width / 2} y={height / 2} textAnchor="middle" fill="#999">
            {error}
          </text>
        </svg>
      );
    }
    // This should not happen with valid config, but log warning in dev
    console.warn(
      "LineChart expects a continuous x-scale (time or linear). " +
        "Ensure config.x.type is 'date' or 'number'."
    );
  }

  // Type-safe accessor that works with any continuous scale
  const getX = (d: Datum) => {
    const val = d[config.x.field];
    // scales.x is typed to accept Date | number for continuous scales
    return scales.x(val as Date | number);
  };

  const getY = (d: Datum) => scales.y(d[config.y.field] as number);

  // Check if we have valid continuous scales for axes
  const hasValidXScale = isContinuousScale(scales.x);
  const hasValidYScale = isContinuousScale(scales.y);

  return (
    <svg
      role="img"
      width={width}
      height={height}
      className={className}
      aria-label="Line chart"
    >
      <g transform={`translate(${layout.chartArea.x}, ${layout.chartArea.y})`}>
        <LinePath data={data} x={getX} y={getY} />
      </g>
      {hasValidXScale && (
        <XAxis scale={scales.x} height={layout.chartArea.height} />
      )}
      {hasValidYScale && <YAxis scale={scales.y} />}
    </svg>
  );
}
