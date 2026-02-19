import { StateCreator } from "zustand";

export type ConfiguratorPhase =
  | "selecting-dataset"
  | "configuring"
  | "layouting"
  | "publishing"
  | "published";

export type SlimChartConfig = {
  key: string;
  cubeIri: string;
  chartType: string;
  fields: Record<string, { componentId: string }>;
};

export type ConfiguratorSlice = {
  phase: ConfiguratorPhase;
  chartConfigs: SlimChartConfig[];
  activeChartKey: string | null;

  selectDataset: (cubeIri: string) => void;
  setActiveChart: (key: string) => void;
  setChartType: (key: string, chartType: string) => void;
  setField: (key: string, field: string, componentId: string) => void;
  publish: () => void;
  reset: () => void;
};

const createKey = () => Math.random().toString(36).slice(2);

export const createConfiguratorSlice: StateCreator<
  ConfiguratorSlice,
  [["zustand/immer", never]],
  [],
  ConfiguratorSlice
> = (set) => ({
  phase: "selecting-dataset",
  chartConfigs: [],
  activeChartKey: null,

  selectDataset: (cubeIri) =>
    set((draft) => {
      const key = createKey();
      draft.chartConfigs = [{ key, cubeIri, chartType: "column", fields: {} }];
      draft.activeChartKey = key;
      draft.phase = "configuring";
    }),

  setActiveChart: (key) =>
    set((draft) => {
      draft.activeChartKey = key;
    }),

  setChartType: (key, chartType) =>
    set((draft) => {
      const chart = draft.chartConfigs.find((c) => c.key === key);
      if (!chart) return;
      chart.chartType = chartType;
      chart.fields = {};
    }),

  setField: (key, field, componentId) =>
    set((draft) => {
      const chart = draft.chartConfigs.find((c) => c.key === key);
      if (!chart) return;
      chart.fields[field] = { componentId };
    }),

  publish: () =>
    set((draft) => {
      draft.phase = "published";
    }),

  reset: () =>
    set((draft) => {
      draft.phase = "selecting-dataset";
      draft.chartConfigs = [];
      draft.activeChartKey = null;
    }),
});
