import { useAnimationSettingsStore } from '@/stores/animation-settings'

describe('animation-settings store', () => {
  beforeEach(() => {
    useAnimationSettingsStore.setState({
      enabled: true,
      respectReducedMotion: true,
      duration: 800,
      easing: 'ease-out',
      stagger: 100,
    })
  })

  it('should have correct default values', () => {
    const state = useAnimationSettingsStore.getState()
    expect(state.enabled).toBe(true)
    expect(state.respectReducedMotion).toBe(true)
    expect(state.duration).toBe(800)
    expect(state.easing).toBe('ease-out')
    expect(state.stagger).toBe(100)
  })

  it('should toggle enabled state', () => {
    const { setEnabled } = useAnimationSettingsStore.getState()
    setEnabled(false)
    expect(useAnimationSettingsStore.getState().enabled).toBe(false)
  })

  it('should update duration', () => {
    const { setDuration } = useAnimationSettingsStore.getState()
    setDuration(1200)
    expect(useAnimationSettingsStore.getState().duration).toBe(1200)
  })

  it('should update easing', () => {
    const { setEasing } = useAnimationSettingsStore.getState()
    setEasing('linear')
    expect(useAnimationSettingsStore.getState().easing).toBe('linear')
  })

  it('should update stagger', () => {
    const { setStagger } = useAnimationSettingsStore.getState()
    setStagger(200)
    expect(useAnimationSettingsStore.getState().stagger).toBe(200)
  })

  it('should reset to defaults', () => {
    const store = useAnimationSettingsStore.getState()
    store.setEnabled(false)
    store.setDuration(2000)
    store.reset()
    expect(useAnimationSettingsStore.getState().enabled).toBe(true)
    expect(useAnimationSettingsStore.getState().duration).toBe(800)
  })
})