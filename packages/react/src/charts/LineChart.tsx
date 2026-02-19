import React from "react";
import type { ScaleTime } from "d3-scale";
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
 * Line chart component
 */
export function LineChart({
  data,
  config,
  width,
  height,
  className,
}: LineChartProps) {
  const { scales, layout } = useChart(data, config, { width, height });

  // Line charts always use a time scale for x-axis
  const xScale = scales.x as ScaleTime<number, number>;

  const getX = (d: Datum) => xScale(d[config.x.field] as Date);
  const getY = (d: Datum) => scales.y(d[config.y.field] as number);

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
      <XAxis scale={xScale} height={layout.chartArea.height} />
      <YAxis scale={scales.y} />
    </svg>
  );
}
