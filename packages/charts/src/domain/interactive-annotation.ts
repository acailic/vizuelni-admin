/**
 * @vizualni/charts - Interactive Annotations
 *
 * Types for interactive, localized chart annotations.
 * These support user interaction, localization, and dynamic positioning.
 */

/**
 * Base annotation interface with localization support
 */
export interface InteractiveAnnotation {
  key: string
  /** Localized titles keyed by locale code (e.g., 'en', 'sr-Cyrl') */
  title: Record<string, string>
  /** Optional localized descriptions keyed by locale code */
  description?: Record<string, string>
  /** Targets that this annotation points to */
  targets: Array<{
    componentId: string
    value: string | number
  }>
  /** Custom color for the annotation marker */
  color?: string
  /** Visual style of the annotation marker */
  style: 'filled' | 'outline'
  /** Whether the annotation tooltip should be open by default */
  defaultOpen: boolean
}

/**
 * Chart annotation with position and visibility state.
 * Extends InteractiveAnnotation with rendering information.
 */
export interface InteractiveChartAnnotation extends InteractiveAnnotation {
  /** X position for rendering */
  x: number
  /** Y position for rendering */
  y: number
  /** Whether the annotation is currently visible */
  visible: boolean
}
