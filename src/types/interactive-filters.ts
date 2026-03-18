import type {
  InteractiveCalculation,
  InteractiveFilterValue,
  InteractiveTimeRange,
  InteractiveFiltersState,
} from '@vizualni/shared-kernel/types/filter'

// Re-export types from shared-kernel
export type {
  InteractiveCalculation,
  InteractiveFilterValue,
  InteractiveTimeRange,
  InteractiveFiltersState,
}

export interface InteractiveFilterDefaults extends InteractiveFiltersState {
  chartId: string
}

export interface InteractiveFiltersStoreState {
  charts: Record<string, InteractiveFiltersState>
  defaults: Record<string, InteractiveFiltersState>
  initializeChart: (defaults: InteractiveFilterDefaults) => void
  clearChart: (chartId: string) => void
  setLegendState: (chartId: string, legend: Record<string, boolean>) => void
  toggleLegendItem: (chartId: string, key: string) => void
  setTimeRange: (chartId: string, from: string | null, to: string | null) => void
  setTimeSliderValue: (chartId: string, value: string | null) => void
  setDataFilter: (chartId: string, dimensionKey: string, value: InteractiveFilterValue) => void
  setCalculation: (chartId: string, calculation: InteractiveCalculation) => void
  resetAll: (chartId: string) => void
}
