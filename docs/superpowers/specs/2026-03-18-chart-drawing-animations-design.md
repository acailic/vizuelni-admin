# Chart Drawing Animations - Design Specification

**Date:** 2026-03-18
**Status:** Draft
**Author:** Claude

## Overview

Add drawing/reveal animations to all chart types that trigger when charts scroll into viewport. The feature should be globally configurable and fully accessible (WCAG 2.1 AA compliant).

## Requirements

### Functional Requirements

1. **All chart types** must support drawing animations:
   - LineChart: Line draws from first point to last
   - AreaChart: Area fills from bottom up
   - BarChart: Bars grow from left to right
   - ColumnChart: Columns grow from bottom to top
   - PieChart: Segments reveal clockwise
   - RadarChart: Polygon traces from first axis
   - ComboChart: Combined line + bar animations
   - SankeyChart: Fade in (limited Recharts support)
   - TreemapChart: Fade in (limited Recharts support)
   - ScatterplotChart: Points fade/scale in
   - HeatmapChart: Cells reveal progressively
   - GaugeChart: Needle sweeps from zero
   - FunnelChart: Sections reveal top to bottom
   - BoxPlotChart: Boxes draw progressively
   - WaterfallChart: Bars reveal sequentially
   - PopulationPyramidChart: Bars grow from center

2. **Global configuration** - Single app-level toggle to enable/disable all animations

3. **Scroll trigger** - Animations play when chart enters viewport

4. **Accessibility** - Must respect `prefers-reduced-motion` system preference

### Non-Functional Requirements

- No new external dependencies (use Recharts native animations)
- Performant - no impact on chart rendering speed
- Consistent animation timing across chart types
- Works with existing `useChartInView` hook

## Architecture

### File Structure

```
src/
├── stores/
│   └── animation-settings.ts          # NEW: Global animation settings store
├── hooks/
│   └── useChartAnimation.ts           # NEW: Combined animation hook
└── components/
    └── charts/
        ├── shared/
        │   └── AnimationToggle.tsx    # NEW: UI toggle component
        ├── line/LineChart.tsx         # MODIFY: Add animation props
        ├── area/AreaChart.tsx         # MODIFY: Add animation props
        ├── bar/BarChart.tsx           # MODIFY: Add animation props
        ├── column/ColumnChart.tsx     # MODIFY: Add animation props
        ├── pie/PieChart.tsx           # MODIFY: Add animation props
        ├── radar/RadarChart.tsx       # MODIFY: Add animation props
        ├── combo/ComboChart.tsx       # MODIFY: Add animation props
        ├── sankey/SankeyChart.tsx     # MODIFY: Add animation props
        ├── treemap/TreemapChart.tsx   # MODIFY: Add animation props
        ├── scatterplot/ScatterplotChart.tsx # MODIFY
        ├── heatmap/HeatmapChart.tsx   # MODIFY
        ├── gauge/GaugeChart.tsx       # MODIFY
        ├── funnel/FunnelChart.tsx     # MODIFY
        ├── box-plot/BoxPlotChart.tsx  # MODIFY
        ├── waterfall/WaterfallChart.tsx # MODIFY
        └── population-pyramid/PopulationPyramidChart.tsx # MODIFY
```

### Data Model

```typescript
// src/stores/animation-settings.ts

export interface AnimationSettings {
  // Global on/off toggle
  enabled: boolean

  // Honor prefers-reduced-motion system preference
  respectReducedMotion: boolean

  // Base animation duration in milliseconds
  duration: number

  // Easing function: 'ease' | 'ease-out' | 'ease-in-out' | 'linear'
  easing: 'ease' | 'ease-out' | 'ease-in-out' | 'linear'

  // Stagger delay between multiple series (ms)
  stagger: number
}

// Default values
const DEFAULT_SETTINGS: AnimationSettings = {
  enabled: true,
  respectReducedMotion: true,
  duration: 800,
  easing: 'ease-out',
  stagger: 100,
}
```

### Animation Hook

```typescript
// src/hooks/useChartAnimation.ts

import { useMemo } from 'react'
import { useAnimationSettingsStore } from '@/stores/animation-settings'
import { useChartInView } from './useChartInView'
import { useMediaQuery } from './useMediaQuery'

export interface UseChartAnimationResult {
  ref: React.RefObject<HTMLDivElement>
  shouldAnimate: boolean
  duration: number
  easing: string
  stagger: number
}

export function useChartAnimation(): UseChartAnimationResult {
  const { ref, inView } = useChartInView()
  const settings = useAnimationSettingsStore()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const shouldAnimate = useMemo(() => {
    // Disabled globally
    if (!settings.enabled) return false

    // User prefers reduced motion and we respect that
    if (settings.respectReducedMotion && prefersReducedMotion) return false

    // Must be in viewport
    return inView
  }, [settings.enabled, settings.respectReducedMotion, prefersReducedMotion, inView])

  return {
    ref,
    shouldAnimate,
    duration: settings.duration,
    easing: settings.easing,
    stagger: settings.stagger,
  }
}
```

## Implementation Details

### 1. Animation Settings Store

Create a Zustand store for global animation settings:

```typescript
// src/stores/animation-settings.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

### 2. Animation Toggle Component

```typescript
// src/components/charts/shared/AnimationToggle.tsx
'use client'

import { useAnimationSettingsStore } from '@/stores/animation-settings'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export function AnimationToggle() {
  const { enabled, setEnabled } = useAnimationSettingsStore()

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="chart-animations"
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <Label htmlFor="chart-animations" className="text-sm">
        Animate charts on scroll
      </Label>
    </div>
  )
}
```

### 3. Chart Component Updates

Each chart component needs to:

1. Import and use `useChartAnimation` hook
2. Replace `useChartInView` with `useChartAnimation`
3. Pass animation props to Recharts components

**Example: LineChart**

```typescript
// Before
const { ref, inView } = useChartInView()

<Line
  isAnimationActive={inView && config.options?.animation !== false}
  animationDuration={800}
  animationEasing="ease-out"
  // ...
/>

// After
const { ref, shouldAnimate, duration, easing } = useChartAnimation()

<Line
  isAnimationActive={shouldAnimate && config.options?.animation !== false}
  animationDuration={duration}
  animationEasing={easing}
  // ...
/>
```

### 4. Multi-Series Staggering

For charts with multiple series, apply stagger delay:

```typescript
// Example: Multiple Line series
{series.map((s, index) => (
  <Line
    key={s.key}
    isAnimationActive={shouldAnimate}
    animationDuration={duration}
    animationEasing={easing}
    animationBegin={index * stagger}
    // ...
  />
))}
```

### 5. Chart-Specific Animation Props

| Chart Type | Recharts Component | Animation Props |
|------------|-------------------|-----------------|
| Line | `<Line>` | `isAnimationActive`, `animationDuration`, `animationEasing` |
| Area | `<Area>` | Same + `animationBegin` for stacked |
| Bar | `<Bar>` | Same |
| Pie | `<Pie>` | Same |
| Radar | `<Radar>` | Same |
| Scatter | `<Scatter>` | Same |
| Funnel | `<Funnel>` | Same |

## Accessibility Considerations

1. **prefers-reduced-motion**: System preference checked via `useMediaQuery`
2. **Global disable**: User can turn off all animations via toggle
3. **No seizure risk**: Animations are smooth, no flashing
4. **Keyboard accessible**: Animation toggle is keyboard navigable
5. **Screen readers**: Animation state doesn't affect data accessibility

## Testing Plan

1. **Unit tests**: Animation settings store, hook logic
2. **Integration tests**: Chart components with animation enabled/disabled
3. **Visual regression**: Screenshots with animations (pause at key frames)
4. **Accessibility tests**: Verify prefers-reduced-motion is respected
5. **Manual testing**:
   - Scroll behavior triggers animations correctly
   - Toggle disables/enables animations
   - Reduced motion preference is honored

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Performance impact on many charts | Use intersection observer efficiently |
| Animation jank on low-end devices | Respect reduced motion, keep durations reasonable |
| Inconsistent timing across charts | Use centralized settings store |
| Recharts animation limitations | Document unsupported chart types |

## Success Criteria

- [ ] All chart types animate on scroll when enabled
- [ ] Global toggle correctly enables/disables all animations
- [ ] `prefers-reduced-motion` is respected when enabled
- [ ] No new dependencies added
- [ ] All existing tests pass
- [ ] WCAG 2.1 AA compliance maintained
