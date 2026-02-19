import React from "react";
import { line } from "d3-shape";
import type { Datum } from "@vizualni/core";

export interface LinePathProps {
  data: Datum[];
  x: (d: Datum) => number;
  y: (d: Datum) => number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  className?: string;
}

export function LinePath({
  data,
  x,
  y,
  stroke = "#4e79a7",
  strokeWidth = 2,
  fill = "none",
  className,
}: LinePathProps) {
  const pathGenerator = line<Datum>()
    .x((d) => x(d))
    .y((d) => y(d));

  const path = pathGenerator(data);

  if (!path) return null;

  return (
    <path
      d={path}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      className={className}
    />
  );
}
