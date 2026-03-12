// app/charts/shared/__tests__/chart-theme-tokens.spec.ts
import { describe, it, expect } from "vitest";

import {
  chartColors,
  chartTypography,
  chartMotion,
  chartSpacing,
  getChartColorPalette,
} from "../chart-theme-tokens";

describe("chart-theme-tokens", () => {
  it("should export chart color palette", () => {
    expect(chartColors.primary).toBeDefined();
    expect(chartColors.accent).toBeDefined();
    expect(chartColors.positive).toBeDefined();
    expect(chartColors.negative).toBeDefined();
    expect(chartColors.neutral).toBeDefined();
  });

  it("should export typography tokens", () => {
    expect(chartTypography.title.fontWeight).toBe(600);
    expect(chartTypography.axisLabel.fontWeight).toBeGreaterThanOrEqual(500);
  });

  it("should export motion tokens", () => {
    expect(chartMotion.duration).toBe(300);
    expect(chartMotion.easing).toBe("ease-out");
  });

  it("should export spacing tokens", () => {
    expect(chartSpacing.padding).toBeGreaterThan(0);
  });

  it("should generate colorblind-safe palette", () => {
    const palette = getChartColorPalette({ colorblindSafe: true });
    expect(palette.length).toBeGreaterThan(0);
  });

  it("should generate vibrant default palette", () => {
    const palette = getChartColorPalette({ colorblindSafe: false });
    expect(palette.length).toBeGreaterThan(0);
    expect(palette[0]).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});
