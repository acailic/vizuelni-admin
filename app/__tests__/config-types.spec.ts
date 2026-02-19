import { describe, it, expect } from "vitest";

import { isChartThemeVariant } from "../config-types";

describe("ChartThemeVariant", () => {
  it("should validate modern theme variant", () => {
    expect(isChartThemeVariant("modern")).toBe(true);
  });

  it("should validate default theme variant", () => {
    expect(isChartThemeVariant("default")).toBe(true);
  });

  it("should validate minimal theme variant", () => {
    expect(isChartThemeVariant("minimal")).toBe(true);
  });

  it("should validate dark theme variant", () => {
    expect(isChartThemeVariant("dark")).toBe(true);
  });

  it("should reject invalid theme variant", () => {
    expect(isChartThemeVariant("invalid")).toBe(false);
  });
});
