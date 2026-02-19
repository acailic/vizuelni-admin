import React from "react";
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
  const { scales, layout } = useChart(data, config as any, { width, height });

  const getX = (d: Datum) => scales.x(d[config.x.field] as Date) as number;
  const getY = (d: Datum) => scales.y(d[config.y.field] as number) as number;

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
      <XAxis scale={scales.x as any} height={layout.chartArea.height} />
      <YAxis scale={scales.y} />
    </svg>
  );
}
