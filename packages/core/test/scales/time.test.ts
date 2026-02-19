import { describe, it, expect } from "vitest";
import { createTimeScale } from "../../src/scales/time";

describe("createTimeScale", () => {
  it("should create a time scale with date domain", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-01"), new Date("2024-12-31")],
      range: [0, 500],
    });

    expect(scale(new Date("2024-01-01"))).toBe(0);
    expect(scale(new Date("2024-12-31"))).toBeCloseTo(500, 1);
  });

  it("should map mid-year date correctly", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-01"), new Date("2024-12-31")],
      range: [0, 500],
    });

    // July 2nd should be approximately middle
    const midYear = scale(new Date("2024-07-02"));
    expect(midYear).toBeGreaterThan(240);
    expect(midYear).toBeLessThan(260);
  });

  it("should handle inverted range for y-axis", () => {
    const scale = createTimeScale({
      domain: [new Date("2024-01-01"), new Date("2024-12-31")],
      range: [400, 0],
    });

    expect(scale(new Date("2024-01-01"))).toBe(400);
    expect(scale(new Date("2024-12-31"))).toBeCloseTo(0, 1);
  });
});
