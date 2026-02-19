import { describe, it, expect, beforeEach } from "vitest";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  createConfiguratorSlice,
  ConfiguratorSlice,
} from "@/stores/slices/configurator";

// Minimal store wrapping just the slice
const createTestStore = () =>
  create<ConfiguratorSlice>()(
    immer((...args) => createConfiguratorSlice(...args))
  );

describe("configuratorSlice", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it("starts in selecting-dataset phase", () => {
    expect(store.getState().phase).toBe("selecting-dataset");
    expect(store.getState().chartConfigs).toHaveLength(0);
  });

  it("selectDataset moves to configuring phase", () => {
    store.getState().selectDataset("https://example.com/cube");
    expect(store.getState().phase).toBe("configuring");
    expect(store.getState().chartConfigs).toHaveLength(1);
    expect(store.getState().chartConfigs[0].cubeIri).toBe(
      "https://example.com/cube"
    );
  });

  it("setActiveChart updates activeChartKey", () => {
    store.getState().selectDataset("https://example.com/cube");
    const key = store.getState().chartConfigs[0].key;
    store.getState().setActiveChart(key);
    expect(store.getState().activeChartKey).toBe(key);
  });

  it("setChartType updates the chart type on the active chart", () => {
    store.getState().selectDataset("https://example.com/cube");
    const key = store.getState().chartConfigs[0].key;
    store.getState().setActiveChart(key);
    store.getState().setChartType(key, "bar");
    const chart = store.getState().chartConfigs.find((c) => c.key === key);
    expect(chart?.chartType).toBe("bar");
  });

  it("publish moves to published phase", () => {
    store.getState().selectDataset("https://example.com/cube");
    store.getState().publish();
    expect(store.getState().phase).toBe("published");
  });

  it("reset returns to selecting-dataset", () => {
    store.getState().selectDataset("https://example.com/cube");
    store.getState().reset();
    expect(store.getState().phase).toBe("selecting-dataset");
    expect(store.getState().chartConfigs).toHaveLength(0);
  });
});
