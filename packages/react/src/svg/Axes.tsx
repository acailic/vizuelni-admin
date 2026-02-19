import React from "react";
import type { ScaleLinear, ScaleTime } from "d3-scale";

export interface XAxisProps {
  scale: ScaleLinear<number, number> | ScaleTime<number, number>;
  height: number;
  tickCount?: number;
  className?: string;
}

export function XAxis({
  scale,
  height,
  tickCount = 10,
  className,
}: XAxisProps) {
  const ticks = scale.ticks(tickCount);
  const range = scale.range();

  return (
    <g className={`x-axis ${className || ""}`}>
      {/* Axis line */}
      <line
        x1={range[0]}
        y1={height}
        x2={range[1]}
        y2={height}
        stroke="#333"
        strokeWidth={1}
      />
      {/* Ticks */}
      {ticks.map((tick, i) => {
        const x = scale(tick as number);
        return (
          <g key={i} transform={`translate(${x}, ${height})`}>
            <line y2={6} stroke="#333" />
            <text
              y={9}
              dy="0.71em"
              textAnchor="middle"
              fontSize="10px"
              fill="#666"
            >
              {String(tick)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export interface YAxisProps {
  scale: ScaleLinear<number, number>;
  width?: number;
  tickCount?: number;
  className?: string;
}

export function YAxis({
  scale,
  width = 0,
  tickCount = 10,
  className,
}: YAxisProps) {
  const ticks = scale.ticks(tickCount);
  const range = scale.range();

  return (
    <g className={`y-axis ${className || ""}`}>
      {/* Axis line */}
      <line
        x1={width}
        y1={range[0]}
        x2={width}
        y2={range[1]}
        stroke="#333"
        strokeWidth={1}
      />
      {/* Ticks */}
      {ticks.map((tick, i) => {
        const y = scale(tick);
        return (
          <g key={i} transform={`translate(${width}, ${y})`}>
            <line x2={-6} stroke="#333" />
            <text
              x={-9}
              dy="0.32em"
              textAnchor="end"
              fontSize="10px"
              fill="#666"
            >
              {tick}
            </text>
          </g>
        );
      })}
    </g>
  );
}
