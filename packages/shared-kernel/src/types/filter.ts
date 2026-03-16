import type { ObservationValue } from './observation'

export type DatasetFilterValue =
  | ObservationValue
  | ObservationValue[]
  | {
      min?: number | Date
      max?: number | Date
      includes?: ObservationValue[]
    }

export type InteractiveCalculation = 'absolute' | 'percent'
export type InteractiveFilterValue = string | string[] | null

export interface InteractiveTimeRange {
  from: string | null
  to: string | null
}

export interface InteractiveFiltersState {
  legend: Record<string, boolean>
  timeRange: InteractiveTimeRange
  timeSlider: string | null
  dataFilters: Record<string, InteractiveFilterValue>
  calculation: InteractiveCalculation
}
