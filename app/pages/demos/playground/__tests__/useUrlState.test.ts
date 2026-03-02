// app/pages/demos/playground/__tests__/useUrlState.test.ts
import { describe, it, expect } from "vitest";

import { compressState, decompressState } from "../_hooks/useUrlState";

import type { PlaygroundState } from "../_types";

describe("URL State", () => {
  const sampleState: Partial<PlaygroundState> = {
    chartType: "bar",
    data: [{ label: "A", value: 10 }],
    config: { xAxis: "label", yAxis: "value", color: "#6366f1" },
  };

  it("should compress state to string", () => {
    const compressed = compressState(sampleState as PlaygroundState);
    expect(typeof compressed).toBe("string");
    expect(compressed.length).toBeGreaterThan(0);
  });

  it("should decompress to original state", () => {
    const compressed = compressState(sampleState as PlaygroundState);
    const decompressed = decompressState(compressed);
    expect(decompressed?.chartType).toBe("bar");
    expect(decompressed?.data).toEqual([{ label: "A", value: 10 }]);
  });

  it("should handle invalid compressed data", () => {
    const result = decompressState("invalid-base64!");
    expect(result).toBeNull();
  });
});
