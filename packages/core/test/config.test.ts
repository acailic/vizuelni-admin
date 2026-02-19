import { describe, it, expect } from "vitest";
import { ChartConfigSchema, LineChartConfigSchema } from "../src/config";

describe("Chart Config Schema", () => {
  describe("LineChartConfigSchema", () => {
    it("should validate a minimal line chart config", () => {
      const config = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };
      const result = LineChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it("should require x and y fields", () => {
      const config = {
        type: "line",
      };
      const result = LineChartConfigSchema.safeParse(config);
      expect(result.success).toBe(false);
    });

    it("should accept optional segment field", () => {
      const config = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
        segment: { field: "category", type: "string" },
      };
      const result = LineChartConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });
  });

  describe("ChartConfigSchema", () => {
    it("should discriminate between chart types", () => {
      const lineConfig = {
        type: "line",
        x: { field: "date", type: "date" },
        y: { field: "value", type: "number" },
      };
      const result = ChartConfigSchema.safeParse(lineConfig);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe("line");
      }
    });
  });
});
