'use client'

import { useAnimationSettingsStore } from '@/stores/animation-settings'

interface AnimationToggleProps {
  labels?: {
    enabled?: string
    disabled?: string
  }
}

/**
 * Toggle component for enabling/disabling chart animations globally.
 */
export function AnimationToggle({ labels }: AnimationToggleProps) {
  const { enabled, setEnabled } = useAnimationSettingsStore()

  const labelText = enabled
    ? labels?.enabled || 'Animations on'
    : labels?.disabled || 'Animations off'

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        aria-label={labelText}
      />
      <span className="text-sm text-slate-700">{labelText}</span>
    </label>
  )
}