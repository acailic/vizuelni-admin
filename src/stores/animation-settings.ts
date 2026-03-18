import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AnimationSettings {
  enabled: boolean
  respectReducedMotion: boolean
  duration: number
  easing: 'ease' | 'ease-out' | 'ease-in-out' | 'linear'
  stagger: number
}

const DEFAULT_SETTINGS: AnimationSettings = {
  enabled: true,
  respectReducedMotion: true,
  duration: 800,
  easing: 'ease-out',
  stagger: 100,
}

interface AnimationSettingsState extends AnimationSettings {
  setEnabled: (enabled: boolean) => void
  setDuration: (duration: number) => void
  setEasing: (easing: AnimationSettings['easing']) => void
  setStagger: (stagger: number) => void
  setRespectReducedMotion: (respect: boolean) => void
  reset: () => void
}

export const useAnimationSettingsStore = create<AnimationSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setEnabled: (enabled) => set({ enabled }),
      setDuration: (duration) => set({ duration }),
      setEasing: (easing) => set({ easing }),
      setStagger: (stagger) => set({ stagger }),
      setRespectReducedMotion: (respectReducedMotion) => set({ respectReducedMotion }),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'chart-animation-settings',
    }
  )
)