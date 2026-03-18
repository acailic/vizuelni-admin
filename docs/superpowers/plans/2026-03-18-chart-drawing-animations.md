# Chart Drawing Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add globally configurable drawing animations to all chart types that trigger on viewport scroll.

**Architecture:** Create a Zustand store for animation settings, a combined hook that merges settings with viewport detection, and update all chart components to use the new hook instead of `useChartInView` directly.

**Tech Stack:** Zustand for state, existing Recharts animation props, IntersectionObserver (via existing hook)

---

## File Structure

```
src/
├── stores/
│   └── animation-settings.ts          # NEW: Global animation settings
├── hooks/
│   └── useChartAnimation.ts           # NEW: Combined hook
└── components/
    └── charts/
        └── shared/
            └── AnimationToggle.tsx    # NEW: UI toggle
```

**Chart files to modify** (16 total):
- `src/components/charts/line/LineChart.tsx`
- `src/components/charts/area/AreaChart.tsx`
- `src/components/charts/bar/BarChart.tsx`
- `src/components/charts/column/ColumnChart.tsx`
- `src/components/charts/pie/PieChart.tsx`
- `src/components/charts/radar/RadarChart.tsx`
- `src/components/charts/combo/ComboChart.tsx`
- `src/components/charts/sankey/SankeyChart.tsx`
- `src/components/charts/treemap/TreemapChart.tsx`
- `src/components/charts/scatterplot/ScatterplotChart.tsx`
- `src/components/charts/heatmap/HeatmapChart.tsx`
- `src/components/charts/gauge/GaugeChart.tsx`
- `src/components/charts/funnel/FunnelChart.tsx`
- `src/components/charts/box-plot/BoxPlotChart.tsx`
- `src/components/charts/waterfall/WaterfallChart.tsx`
- `src/components/charts/population-pyramid/PopulationPyramidChart.tsx`

---

## Task 1: Animation Settings Store

**Files:**
- Create: `src/stores/animation-settings.ts`
- Test: `tests/unit/stores/animation-settings.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/unit/stores/animation-settings.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/stores/animation-settings.test.ts`
Expected: FAIL with "Cannot find module '@/stores/animation-settings'"

- [ ] **Step 3: Write the store implementation**

```typescript
// src/stores/animation-settings.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/stores/animation-settings.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/stores/animation-settings.ts tests/unit/stores/animation-settings.test.ts
git commit -m "feat(animation): add animation settings store with persistence"
```

---

## Task 2: useChartAnimation Hook

**Files:**
- Create: `src/hooks/useChartAnimation.ts`
- Test: `src/hooks/__tests__/useChartAnimation.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/hooks/__tests__/useChartAnimation.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChartAnimation } from '../useChartAnimation'
import { useAnimationSettingsStore } from '@/stores/animation-settings'

// Mock useChartInView
vi.mock('../useChartInView', () => ({
  useChartInView: () => ({
    ref: { current: null },
    inView: true,
  }),
}))

describe('useChartAnimation', () => {
  beforeEach(() => {
    useAnimationSettingsStore.setState({
      enabled: true,
      respectReducedMotion: true,
      duration: 800,
      easing: 'ease-out',
      stagger: 100,
    })
  })

  it('should return animation settings when enabled and in view', () => {
    const { result } = renderHook(() => useChartAnimation())
    expect(result.current.shouldAnimate).toBe(true)
    expect(result.current.duration).toBe(800)
    expect(result.current.easing).toBe('ease-out')
    expect(result.current.stagger).toBe(100)
  })

  it('should not animate when disabled globally', () => {
    useAnimationSettingsStore.getState().setEnabled(false)
    const { result } = renderHook(() => useChartAnimation())
    expect(result.current.shouldAnimate).toBe(false)
  })

  it('should return ref from useChartInView', () => {
    const { result } = renderHook(() => useChartAnimation())
    expect(result.current.ref).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/hooks/__tests__/useChartAnimation.test.ts`
Expected: FAIL with "Cannot find module '../useChartAnimation'"

- [ ] **Step 3: Write the hook implementation**

```typescript
// src/hooks/useChartAnimation.ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/hooks/__tests__/useChartAnimation.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useChartAnimation.ts src/hooks/__tests__/useChartAnimation.test.ts
git commit -m "feat(animation): add useChartAnimation hook combining settings and viewport detection"
```

---

## Task 3: AnimationToggle Component

**Files:**
- Create: `src/components/charts/shared/AnimationToggle.tsx`

- [ ] **Step 1: Create the toggle component**

```typescript
// src/components/charts/shared/AnimationToggle.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/charts/shared/AnimationToggle.tsx
git commit -m "feat(animation): add AnimationToggle component"
```

---

## Task 4: Update LineChart

**Files:**
- Modify: `src/components/charts/line/LineChart.tsx`

- [ ] **Step 1: Update imports and hook usage**

Change the import from `useChartInView` to `useChartAnimation`:

```typescript
// Replace this import:
import { useChartInView } from '@/hooks/useChartInView'

// With this import:
import { useChartAnimation } from '@/hooks/useChartAnimation'
```

- [ ] **Step 2: Update hook call inside component**

Replace the hook call inside the component:

```typescript
// Replace:
const { ref, inView } = useChartInView()

// With:
const { ref, shouldAnimate, duration, easing } = useChartAnimation()
```

- [ ] **Step 3: Update Line component props**

Update the `<Line>` component animation props:

```typescript
// Replace:
<Line
  // ... existing props
  isAnimationActive={inView && config.options?.animation !== false}
  animationDuration={800}
  animationEasing="ease-out"
/>

// With:
<Line
  // ... existing props
  isAnimationActive={shouldAnimate && config.options?.animation !== false}
  animationDuration={duration}
  animationEasing={easing}
/>
```

- [ ] **Step 4: Verify the chart still works**

Run: `npm run build`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components/charts/line/LineChart.tsx
git commit -m "feat(animation): update LineChart to use global animation settings"
```

---

## Task 5: Update AreaChart

**Files:**
- Modify: `src/components/charts/area/AreaChart.tsx`

- [ ] **Step 1: Update imports**

```typescript
// Replace:
import { useChartInView } from '@/hooks/useChartInView'

// With:
import { useChartAnimation } from '@/hooks/useChartAnimation'
```

- [ ] **Step 2: Update hook call**

```typescript
// Replace:
const { ref, inView } = useChartInView()

// With:
const { ref, shouldAnimate, duration, easing } = useChartAnimation()
```

- [ ] **Step 3: Update Area component props**

```typescript
// Replace:
<Area
  // ... existing props
  isAnimationActive={inView && config.options?.animation !== false}
  animationDuration={800}
  animationEasing="ease-out"
/>

// With:
<Area
  // ... existing props
  isAnimationActive={shouldAnimate && config.options?.animation !== false}
  animationDuration={duration}
  animationEasing={easing}
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/charts/area/AreaChart.tsx
git commit -m "feat(animation): update AreaChart to use global animation settings"
```

---

## Task 6: Update BarChart

**Files:**
- Modify: `src/components/charts/bar/BarChart.tsx`

- [ ] **Step 1: Update imports**

```typescript
// Replace:
import { useChartInView } from '@/hooks/useChartInView'

// With:
import { useChartAnimation } from '@/hooks/useChartAnimation'
```

- [ ] **Step 2: Update hook call**

```typescript
// Replace:
const { ref, inView } = useChartInView()

// With:
const { ref, shouldAnimate, duration, easing } = useChartAnimation()
```

- [ ] **Step 3: Update Bar component props**

```typescript
// Replace:
<Bar
  // ... existing props
  isAnimationActive={inView && config.options?.animation !== false}
  animationDuration={600}
  animationEasing="ease-out"
/>

// With:
<Bar
  // ... existing props
  isAnimationActive={shouldAnimate && config.options?.animation !== false}
  animationDuration={duration}
  animationEasing={easing}
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/charts/bar/BarChart.tsx
git commit -m "feat(animation): update BarChart to use global animation settings"
```

---

## Task 7: Update ColumnChart

**Files:**
- Modify: `src/components/charts/column/ColumnChart.tsx`

- [ ] **Step 1: Update imports**

```typescript
// Replace:
import { useChartInView } from '@/hooks/useChartInView'

// With:
import { useChartAnimation } from '@/hooks/useChartAnimation'
```

- [ ] **Step 2: Update hook call**

```typescript
// Replace:
const { ref, inView } = useChartInView()

// With:
const { ref, shouldAnimate, duration, easing } = useChartAnimation()
```

- [ ] **Step 3: Update Bar component props**

```typescript
// Replace:
<Bar
  // ... existing props
  isAnimationActive={inView && config.options?.animation !== false}
  animationDuration={600}
  animationEasing="ease-out"
/>

// With:
<Bar
  // ... existing props
  isAnimationActive={shouldAnimate && config.options?.animation !== false}
  animationDuration={duration}
  animationEasing={easing}
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/charts/column/ColumnChart.tsx
git commit -m "feat(animation): update ColumnChart to use global animation settings"
```

---

## Task 8: Update PieChart

**Files:**
- Modify: `src/components/charts/pie/PieChart.tsx`

- [ ] **Step 1: Update imports**

```typescript
// Replace:
import { useChartInView } from '@/hooks/useChartInView'

// With:
import { useChartAnimation } from '@/hooks/useChartAnimation'
```

- [ ] **Step 2: Update hook call**

```typescript
// Replace:
const { ref, inView } = useChartInView()

// With:
const { ref, shouldAnimate, duration, easing } = useChartAnimation()
```

- [ ] **Step 3: Update Pie component props**

```typescript
// Replace:
<Pie
  // ... existing props
  isAnimationActive={inView && config.options?.animation !== false}
  animationDuration={800}
  animationEasing="ease-out"
/>

// With:
<Pie
  // ... existing props
  isAnimationActive={shouldAnimate && config.options?.animation !== false}
  animationDuration={duration}
  animationEasing={easing}
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/charts/pie/PieChart.tsx
git commit -m "feat(animation): update PieChart to use global animation settings"
```

---

## Task 9: Update RadarChart

**Files:**
- Modify: `src/components/charts/radar/RadarChart.tsx`

- [ ] **Step 1: Check current implementation**

Read the file to see if it uses `useChartInView`. If not, add the import and hook call.

- [ ] **Step 2: Update imports**

```typescript
// Add or replace:
import { useChartAnimation } from '@/hooks/useChartAnimation'
```

- [ ] **Step 3: Add or update hook call inside component**

```typescript
const { ref, shouldAnimate, duration, easing } = useChartAnimation()
```

- [ ] **Step 4: Update Radar component props**

Update both Radar components (primary and secondary):

```typescript
<Radar
  // ... existing props
  isAnimationActive={shouldAnimate && config.options?.animation !== false}
  animationDuration={duration}
  animationEasing={easing}
/>
```

- [ ] **Step 5: Wrap chart content in ref div**

Ensure the chart content is wrapped with the ref:

```typescript
<div ref={ref} className="h-full w-full">
  {/* ResponsiveContainer and chart here */}
</div>
```

- [ ] **Step 6: Commit**

```bash
git add src/components/charts/radar/RadarChart.tsx
git commit -m "feat(animation): update RadarChart to use global animation settings"
```

---

## Task 10: Update ComboChart

**Files:**
- Modify: `src/components/charts/combo/ComboChart.tsx`

- [ ] **Step 1: Update imports**

```typescript
// Replace:
import { useChartInView } from '@/hooks/useChartInView'

// With:
import { useChartAnimation } from '@/hooks/useChartAnimation'
```

- [ ] **Step 2: Update hook call**

```typescript
// Replace:
const { ref, inView } = useChartInView()

// With:
const { ref, shouldAnimate, duration, easing } = useChartAnimation()
```

- [ ] **Step 3: Update both Line and Bar component props**

ComboChart has both Line and Bar - update both:

```typescript
<Line
  // ... existing props
  isAnimationActive={shouldAnimate && config.options?.animation !== false}
  animationDuration={duration}
  animationEasing={easing}
/>

<Bar
  // ... existing props
  isAnimationActive={shouldAnimate && config.options?.animation !== false}
  animationDuration={duration}
  animationEasing={easing}
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/charts/combo/ComboChart.tsx
git commit -m "feat(animation): update ComboChart to use global animation settings"
```

---

## Task 11: Update Remaining Charts (Batch)

**Files:**
- Modify: `src/components/charts/sankey/SankeyChart.tsx`
- Modify: `src/components/charts/treemap/TreemapChart.tsx`
- Modify: `src/components/charts/scatterplot/ScatterplotChart.tsx`
- Modify: `src/components/charts/heatmap/HeatmapChart.tsx`
- Modify: `src/components/charts/gauge/GaugeChart.tsx`
- Modify: `src/components/charts/funnel/FunnelChart.tsx`
- Modify: `src/components/charts/box-plot/BoxPlotChart.tsx`
- Modify: `src/components/charts/waterfall/WaterfallChart.tsx`
- Modify: `src/components/charts/population-pyramid/PopulationPyramidChart.tsx`

- [ ] **Step 1: For each chart, apply the same pattern:**

1. Update import from `useChartInView` to `useChartAnimation`
2. Update hook call to get `shouldAnimate`, `duration`, `easing`
3. Update animation props on Recharts components
4. Ensure ref is attached to wrapper div

Pattern for each file:

```typescript
// Import change
import { useChartAnimation } from '@/hooks/useChartAnimation'

// Hook call change
const { ref, shouldAnimate, duration, easing } = useChartAnimation()

// Animation props change (example for Scatter)
<Scatter
  isAnimationActive={shouldAnimate && config.options?.animation !== false}
  animationDuration={duration}
  animationEasing={easing}
/>
```

- [ ] **Step 2: Run build to verify**

Run: `npm run build`
Expected: No errors

- [ ] **Step 3: Commit all changes**

```bash
git add src/components/charts/sankey/SankeyChart.tsx \
        src/components/charts/treemap/TreemapChart.tsx \
        src/components/charts/scatterplot/ScatterplotChart.tsx \
        src/components/charts/heatmap/HeatmapChart.tsx \
        src/components/charts/gauge/GaugeChart.tsx \
        src/components/charts/funnel/FunnelChart.tsx \
        src/components/charts/box-plot/BoxPlotChart.tsx \
        src/components/charts/waterfall/WaterfallChart.tsx \
        src/components/charts/population-pyramid/PopulationPyramidChart.tsx
git commit -m "feat(animation): update remaining charts to use global animation settings"
```

---

## Task 12: Export AnimationToggle from index

**Files:**
- Modify: `src/components/charts/index.ts`

- [ ] **Step 1: Add export for AnimationToggle**

Add to the exports in `src/components/charts/index.ts`:

```typescript
export { AnimationToggle } from './shared/AnimationToggle'
```

- [ ] **Step 2: Commit**

```bash
git add src/components/charts/index.ts
git commit -m "feat(animation): export AnimationToggle from charts index"
```

---

## Task 13: Run Full Test Suite

- [ ] **Step 1: Run all tests**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Manual verification**

1. Start dev server: `npm run dev`
2. Navigate to a chart page
3. Verify chart animates when scrolled into view
4. Open browser dev tools, toggle the animation setting in localStorage (`chart-animation-settings`)
5. Verify animation is disabled when setting is false

---

## Success Criteria

- [ ] All chart types animate on scroll when enabled
- [ ] Global toggle correctly enables/disables all animations
- [ ] `prefers-reduced-motion` is respected (via existing useChartInView logic)
- [ ] No new external dependencies added
- [ ] All existing tests pass
- [ ] Build succeeds
