/**
 * @vizualni/charts - Filter Normalization Functions
 *
 * Pure functions for normalizing and merging interactive filter state.
 * These are used by the interactive filters store and can be reused elsewhere.
 */

import type {
  InteractiveFilterValue,
  InteractiveTimeRange,
  InteractiveCalculation,
} from '@vizualni/shared-kernel/types/filter'

/**
 * Normalizes legend state by merging current values with defaults.
 * Ensures all keys from defaults are present in the result.
 */
export function normalizeLegendState(
  current: Record<string, boolean> | undefined,
  defaults: Record<string, boolean>
): Record<string, boolean> {
  return Object.fromEntries(
    Object.keys(defaults).map(key => [key, current?.[key] ?? defaults[key] ?? true])
  )
}

/**
 * Normalizes data filters by merging current values with defaults.
 * Ensures all keys from defaults are present in the result.
 */
export function normalizeDataFilters(
  current: Record<string, InteractiveFilterValue> | undefined,
  defaults: Record<string, InteractiveFilterValue>
): Record<string, InteractiveFilterValue> {
  return Object.fromEntries(
    Object.keys(defaults).map(key => [key, current?.[key] ?? defaults[key] ?? null])
  )
}

/**
 * Interactive filters state shape for normalization.
 * Matches InteractiveFiltersState from @vizualni/shared-kernel.
 */
export interface InteractiveFiltersStateLike {
  legend: Record<string, boolean>
  timeRange: InteractiveTimeRange
  timeSlider: string | null
  dataFilters: Record<string, InteractiveFilterValue>
  calculation: InteractiveCalculation
}

/**
 * Merges current filter state with defaults, normalizing collections.
 * Used when initializing chart filters or resetting to defaults.
 */
export function mergeFiltersWithDefaults<T extends InteractiveFiltersStateLike>(
  current: T | undefined,
  defaults: T
): T {
  return {
    ...defaults,
    ...current,
    legend: normalizeLegendState(current?.legend, defaults.legend),
    dataFilters: normalizeDataFilters(current?.dataFilters, defaults.dataFilters),
    timeRange: current?.timeRange ?? defaults.timeRange,
    timeSlider: current?.timeSlider ?? defaults.timeSlider,
    calculation: current?.calculation ?? defaults.calculation,
  } as T
}
