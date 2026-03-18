import { describe, it, expect } from '@jest/globals'
import { renderHook } from '@testing-library/react'

// Mock the dependencies first
jest.mock('../useChartInView', () => ({
  useChartInView: () => ({
    ref: { current: null },
    inView: true,
  }),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock the store
const mockStore = {
  enabled: true,
  respectReducedMotion: true,
  duration: 800,
  easing: 'ease-out',
  stagger: 100,
  setEnabled: jest.fn(),
  setDuration: jest.fn(),
  setEasing: jest.fn(),
  setStagger: jest.fn(),
  setRespectReducedMotion: jest.fn(),
  reset: jest.fn(),
}

jest.mock('@/stores/animation-settings', () => ({
  useAnimationSettingsStore: () => mockStore,
}))

import { useChartAnimation } from '../useChartAnimation'

describe('useChartAnimation', () => {
  it('should return animation settings when enabled and in view', () => {
    const { result } = renderHook(() => useChartAnimation())
    expect(result.current.shouldAnimate).toBe(true)
    expect(result.current.duration).toBe(800)
    expect(result.current.easing).toBe('ease-out')
    expect(result.current.stagger).toBe(100)
  })

  it('should not animate when disabled globally', () => {
    // Update the mock store state
    mockStore.enabled = false

    const { result } = renderHook(() => useChartAnimation())
    expect(result.current.shouldAnimate).toBe(false)
  })

  it('should return ref from useChartInView', () => {
    const { result } = renderHook(() => useChartAnimation())
    expect(result.current.ref).toBeDefined()
  })
})