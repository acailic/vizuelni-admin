// app/pages/demos/playground/__tests__/constants.test.ts
import { describe, it, expect } from "vitest";

import { THEME_PRESETS, SAMPLE_DATASETS, getThemeById } from "../_constants";

describe("Playground Constants", () => {
  it("should have 5 theme presets", () => {
    expect(THEME_PRESETS).toHaveLength(5);
  });

  it("should find theme by id", () => {
    const theme = getThemeById("indigo");
    expect(theme?.primary).toBe("#6366f1");
  });

  it("should have sample datasets", () => {
    expect(Object.keys(SAMPLE_DATASETS).length).toBeGreaterThanOrEqual(3);
  });

  it("should have valid data in sales dataset", () => {
    expect(SAMPLE_DATASETS.sales.data).toHaveLength(6);
    expect(SAMPLE_DATASETS.sales.data[0]).toHaveProperty("label");
    expect(SAMPLE_DATASETS.sales.data[0]).toHaveProperty("value");
  });
});
