import { describe, it, expect } from "vitest";
import { computeShapes } from "../../src/shapes/index";
import { computeScales } from "../../src/scales/index";
import { computeLayout } from "../../src/layout/index";
import type { ChartConfig, Datum } from "../../src/types";

describe("computeShapes", () => {
  describe("bar chart", () => {
    it("should correctly calculate bar height for positive values", () => {
      const data: Datum[] = [
        { category: "A", value: 100 },
      ];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, { width: 600, height: 400, ...layout });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(1);
      const bar = shapes[0];
      expect(bar.type).toBe("bar");
      if (bar.type === "bar") {
        expect(bar.height).toBeGreaterThan(0);
        expect(bar.y).toBeGreaterThanOrEqual(0);
        expect(bar.y + bar.height).toBeLessThanOrEqual(layout.chartArea.height);
      }
    });

    it("should correctly calculate bar height for negative values", () => {
      const data: Datum[] = [
        { category: "A", value: -50 },
      ];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, { width: 600, height: 400, ...layout });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(1);
      const bar = shapes[0];
      expect(bar.type).toBe("bar");
      if (bar.type === "bar") {
        // Negative bars should have positive height
        expect(bar.height).toBeGreaterThan(0);
      }
    });

    it("should correctly handle mixed positive and negative values", () => {
      const data: Datum[] = [
        { category: "A", value: 100 },
        { category: "B", value: -50 },
        { category: "C", value: 75 },
      ];
      const config: ChartConfig = {
        type: "bar",
        x: { field: "category", type: "string" },
        y: { field: "value", type: "number" },
      };

      const layout = computeLayout(config, { width: 600, height: 400 });
      const scales = computeScales(data, config, { width: 600, height: 400, ...layout });
      const shapes = computeShapes(data, config, { scales, layout });

      expect(shapes).toHaveLength(3);

      // All bars should have positive height
      shapes.forEach((shape) => {
        if (shape.type === "bar") {
          expect(shape.height).toBeGreaterThan(0);
        }
      });

      // Positive bar (A) should be above negative bar (B)
      const barA = shapes.find((s) => s.type === "bar" && "category" in s && s.category === "A");
      const barB = shapes.find((s) => s.type === "bar" && "category" in s && s.category === "B");

      if (barA?.type === "bar" && barB?.type === "bar") {
        expect(barA.y).toBeLessThan(barB.y); // Positive bar is higher (smaller y)
      }
    });
  });
});
