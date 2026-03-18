import { useMemo } from 'react'
import { useAnimationSettingsStore } from '@/stores/animation-settings'
import { useChartInView } from './useChartInView'

export interface UseChartAnimationResult {
  ref: React.RefObject<HTMLDivElement>
  shouldAnimate: boolean
  duration: number
  easing: string
  stagger: number
}

/**
 * Combined hook for chart drawing animations.
 * Merges global animation settings with viewport detection.
 */
export function useChartAnimation(): UseChartAnimationResult {
  const { ref, inView } = useChartInView()
  const settings = useAnimationSettingsStore()

  const shouldAnimate = useMemo(() => {
    // Disabled globally
    if (!settings.enabled) return false

    // Note: useChartInView already handles prefers-reduced-motion internally
    // We respect that via the respectReducedMotion setting in the store

    // Must be in viewport
    return inView
  }, [settings.enabled, inView])

  return {
    ref,
    shouldAnimate,
    duration: settings.duration,
    easing: settings.easing,
    stagger: settings.stagger,
  }
}