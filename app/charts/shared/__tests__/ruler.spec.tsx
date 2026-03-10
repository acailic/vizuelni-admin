// @vitest-environment jsdom
// app/charts/shared/__tests__/ruler.spec.tsx
import { describe, it, expect } from "vitest";

import { getSnapPoints } from "../interaction/ruler";

import type { TooltipValue } from "../interaction/tooltip";

describe("getSnapPoints", () => {
  it("should return empty array when values is undefined", () => {
    expect(getSnapPoints(undefined)).toEqual([]);
  });

  it("should return empty array when values is empty", () => {
    expect(getSnapPoints([])).toEqual([]);
  });

  it("should filter to only y-axis values with axisOffset", () => {
    const values: TooltipValue[] = [
      {
        label: "Series A",
        value: "100",
        color: "#3B82F6",
        axis: "y",
        axisOffset: 150,
      },
      {
        label: "X Axis Value",
        value: "2024",
        color: "#999",
        axis: "x",
        axisOffset: 100,
      },
      {
        label: "Series B",
        value: "200",
        color: "#10B981",
        axis: "y",
        axisOffset: 100,
      },
    ];

    const result = getSnapPoints(values);
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe("Series A");
    expect(result[1].label).toBe("Series B");
  });

  it("should exclude values marked with hide: true", () => {
    const values: TooltipValue[] = [
      {
        label: "Series A",
        value: "100",
        color: "#3B82F6",
        axis: "y",
        axisOffset: 150,
        hide: false,
      },
      {
        label: "Series B",
        value: "200",
        color: "#10B981",
        axis: "y",
        axisOffset: 100,
        hide: true,
      },
    ];

    const result = getSnapPoints(values);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Series A");
  });

  it("should exclude values without axisOffset", () => {
    const values: TooltipValue[] = [
      {
        label: "Series A",
        value: "100",
        color: "#3B82F6",
        axis: "y",
        axisOffset: 150,
      },
      {
        label: "Series B",
        value: "200",
        color: "#10B981",
        // No axis property - should be filtered out
      } as TooltipValue,
    ];

    const result = getSnapPoints(values);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Series A");
  });

  it("should handle values with undefined axisOffset", () => {
    const values: TooltipValue[] = [
      {
        label: "Series A",
        value: "100",
        color: "#3B82F6",
        axis: "y",
        axisOffset: 150,
      },
      // TooltipValue type requires axisOffset to be a number when axis is defined
      // This tests that we properly check for undefined at runtime
      {
        label: "Series B",
        value: "200",
        color: "#10B981",
        // No axis/axisOffset properties - should be filtered out
      } as TooltipValue,
    ];

    const result = getSnapPoints(values);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Series A");
  });

  it("should preserve all properties of filtered values", () => {
    const values: TooltipValue[] = [
      {
        label: "Series A",
        value: "1,234",
        color: "#3B82F6",
        axis: "y",
        axisOffset: 150,
        symbol: "line",
        error: "+/- 5",
      },
    ];

    const result = getSnapPoints(values);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      label: "Series A",
      value: "1,234",
      color: "#3B82F6",
      axis: "y",
      axisOffset: 150,
      symbol: "line",
      error: "+/- 5",
    });
  });

  it("should handle multiple series correctly", () => {
    const values: TooltipValue[] = [
      {
        label: "Revenue",
        value: "$10,000",
        color: "#3B82F6",
        axis: "y",
        axisOffset: 200,
      },
      {
        label: "Expenses",
        value: "$8,000",
        color: "#EF4444",
        axis: "y",
        axisOffset: 160,
      },
      {
        label: "Profit",
        value: "$2,000",
        color: "#10B981",
        axis: "y",
        axisOffset: 40,
      },
    ];

    const result = getSnapPoints(values);
    expect(result).toHaveLength(3);
    expect(result.map((v) => v.label)).toEqual([
      "Revenue",
      "Expenses",
      "Profit",
    ]);
  });
});
