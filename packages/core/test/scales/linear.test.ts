import { describe, it, expect } from "vitest";
import { createLinearScale } from "../../src/scales/linear";

describe("createLinearScale", () => {
  it("should create a linear scale with domain and range", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [0, 500],
    });

    expect(scale(0)).toBe(0);
    expect(scale(50)).toBe(250);
    expect(scale(100)).toBe(500);
  });

  it("should handle inverted range", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [400, 0],
    });

    expect(scale(0)).toBe(400);
    expect(scale(50)).toBe(200);
    expect(scale(100)).toBe(0);
  });

  it("should handle negative domain values", () => {
    const scale = createLinearScale({
      domain: [-50, 50],
      range: [0, 100],
    });

    expect(scale(-50)).toBe(0);
    expect(scale(0)).toBe(50);
    expect(scale(50)).toBe(100);
  });

  it("should clamp values when clamp is true", () => {
    const scale = createLinearScale({
      domain: [0, 100],
      range: [0, 500],
      clamp: true,
    });

    expect(scale(-10)).toBe(0);
    expect(scale(110)).toBe(500);
  });

  it("should return nice values for nice option", () => {
    const scale = createLinearScale({
      domain: [3, 97],
      range: [0, 500],
      nice: true,
    });

    // Nice should round to clean values
    const domain = scale.domain();
    expect(domain[0]).toBeLessThanOrEqual(3);
    expect(domain[1]).toBeGreaterThanOrEqual(97);
  });
});
