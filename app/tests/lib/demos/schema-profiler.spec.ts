import { describe, expect, it } from "vitest";

import { DEMO_FALLBACKS } from "@/lib/demos/fallbacks";
import { profileData, selectColumns } from "@/lib/demos/schema-profiler";

describe("schema-profiler column selection", () => {
  it("treats year-like strings as temporal category columns", () => {
    const sample = [
      { Period: "2018", Value: 10 },
      { Period: "2019", Value: 11 },
      { Period: "2020", Value: 12 },
    ];

    const profile = profileData(sample);
    expect(profile.dateColumns).toContain("Period");
  });

  it("selects usable category/value columns for energy fallback data", () => {
    const data = DEMO_FALLBACKS.energy.fallbackData ?? [];
    const { category, value } = selectColumns(profileData(data));

    expect(category).toBe("Period");
    expect(value).toBe("Ugalj");
  });

  it("avoids temporal numeric columns as main metric values", () => {
    const data = DEMO_FALLBACKS.economy.fallbackData ?? [];
    const { category, value } = selectColumns(profileData(data));

    expect(category).toBe("Period");
    expect(value).toBe("BDPRealniRast");
  });
});
