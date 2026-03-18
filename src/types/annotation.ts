/**
 * Annotation types for interactive chart annotations.
 *
 * Re-exports from @vizualni/charts for backward compatibility.
 */

import type {
  InteractiveAnnotation,
  InteractiveChartAnnotation,
} from '@vizualni/charts'

// Re-export types from package
export type {
  InteractiveAnnotation,
  InteractiveChartAnnotation,
}

// Backward-compatible type aliases
export type Annotation = InteractiveAnnotation
export type ChartAnnotation = InteractiveChartAnnotation
