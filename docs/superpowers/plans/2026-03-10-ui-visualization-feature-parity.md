# UI & Visualization Feature Parity Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development
> (if subagents available) or superpowers:executing-plans to implement this
> plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all missing UI/visualization features from
visualize-admin/visualization-tool to achieve full feature parity.

**Architecture:** Each new chart type follows the existing pattern
(chart-type-state.tsx, chart-type-state-props.ts, chart-type.tsx,
chart-chart-type.tsx). Theme variants use a token-based system. Map layers
extend existing Deck.gl integration.

**Tech Stack:** React, TypeScript, D3.js, Deck.gl, MapLibre GL, MUI

---

## Pre-existing Features (Already Implemented)

These features exist and don't need implementation:

- ✅ Excel export (using exceljs) - see `app/components/data-download.tsx`
- ✅ Show values for bar/column/pie charts - see
  `app/charts/shared/show-values-utils.ts`
- ✅ Basic guidance hints - see
  `app/charts/shared/interaction/guidance-hint.tsx`
- ✅ Leader lines for pie charts - see `app/charts/pie/rendering-utils.ts`
- ✅ Donut variants (pie, donut, donut-thin)
- ✅ Legend symbols: square, line, dashed-line, circle, cross, triangle

---

## Chunk 1: Theme Variants System

### Task 1.1: Theme Variants Types

**Files:**

- Create: `app/charts/shared/chart-theme-variants.ts`
- Test: `app/charts/shared/__tests__/chart-theme-variants.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// app/charts/shared/__tests__/chart-theme-variants.spec.ts
import { describe, it, expect } from "vitest";
import {
  ChartThemeVariant,
  getChartThemeVariant,
  CHART_THEME_VARIANTS,
} from "../chart-theme-variants";

describe("chart-theme-variants", () => {
  it("should return default variant when no variant specified", () => {
    const theme = getChartThemeVariant("default");
    expect(theme.colors.primary).toBe("#3B82F6");
  });

  it("should return modern variant with softer colors", () => {
    const theme = getChartThemeVariant("modern");
    expect(theme.stroke.barRadius).toBeGreaterThan(4);
  });

  it("should return minimal variant with thin strokes", () => {
    const theme = getChartThemeVariant("minimal");
    expect(theme.stroke.lineWidth).toBeLessThan(2);
  });

  it("should return dark variant with dark background", () => {
    const theme = getChartThemeVariant("dark");
    expect(theme.colors.background).toMatch(/^#/);
    expect(theme.colors.tooltip.background).not.toBe("#1F2937");
  });

  it("should throw for invalid variant", () => {
    expect(() => getChartThemeVariant("invalid" as any)).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && vitest run shared/__tests__/chart-theme-variants.spec.ts`
Expected: FAIL with "module not found" or similar

- [ ] **Step 3: Write implementation**

```typescript
// app/charts/shared/chart-theme-variants.ts
import {
  chartColors,
  chartTypography,
  chartMotion,
  chartSpacing,
  chartStroke,
} from "./chart-theme-tokens";

export type ChartThemeVariant = "default" | "modern" | "minimal" | "dark";

export interface ChartThemeTokens {
  colors: typeof chartColors;
  typography: typeof chartTypography;
  motion: typeof chartMotion;
  spacing: typeof chartSpacing;
  stroke: typeof chartStroke;
}

const DEFAULT_THEME: ChartThemeTokens = {
  colors: chartColors,
  typography: chartTypography,
  motion: chartMotion,
  spacing: chartSpacing,
  stroke: chartStroke,
};

const MODERN_THEME: ChartThemeTokens = {
  colors: {
    ...chartColors,
    primary: "#6366F1", // Indigo
    accent: "#A855F7", // Purple
  },
  typography: {
    ...chartTypography,
    title: { ...chartTypography.title, fontSize: "1.375rem" },
    axisLabel: { ...chartTypography.axisLabel, fontSize: "0.8125rem" },
  },
  motion: {
    ...chartMotion,
    duration: 400,
    entrance: { duration: 500, delay: 75 },
  },
  spacing: {
    ...chartSpacing,
    padding: 20,
    legendGap: 28,
  },
  stroke: {
    lineWidth: 2.5,
    dotRadius: 5,
    dotGlowRadius: 10,
    barRadius: 8,
  },
};

const MINIMAL_THEME: ChartThemeTokens = {
  colors: {
    ...chartColors,
    primary: "#64748B", // Slate
    accent: "#94A3B8",
    grid: "rgba(148, 163, 184, 0.15)",
  },
  typography: {
    ...chartTypography,
    title: { ...chartTypography.title, fontSize: "1.125rem", fontWeight: 500 },
    dataLabel: { ...chartTypography.dataLabel, fontSize: "0.625rem" },
  },
  motion: {
    ...chartMotion,
    duration: 200,
    entrance: { duration: 250, delay: 25 },
  },
  spacing: {
    padding: 12,
    legendGap: 16,
    tooltipPadding: 8,
  },
  stroke: {
    lineWidth: 1.5,
    dotRadius: 3,
    dotGlowRadius: 6,
    barRadius: 2,
  },
};

const DARK_THEME: ChartThemeTokens = {
  colors: {
    primary: "#60A5FA", // Light blue
    accent: "#C084FC", // Light purple
    positive: "#34D399",
    negative: "#F87171",
    neutral: "#9CA3AF",
    grid: "rgba(75, 85, 99, 0.3)",
    axis: "#D1D5DB",
    tooltip: {
      background: "#1F2937",
      border: "#374151",
      text: "#F9FAFB",
    },
  },
  typography: chartTypography,
  motion: chartMotion,
  spacing: chartSpacing,
  stroke: {
    lineWidth: 2.5,
    dotRadius: 4,
    dotGlowRadius: 8,
    barRadius: 4,
  },
};

export const CHART_THEME_VARIANTS: Record<ChartThemeVariant, ChartThemeTokens> =
  {
    default: DEFAULT_THEME,
    modern: MODERN_THEME,
    minimal: MINIMAL_THEME,
    dark: DARK_THEME,
  };

export function getChartThemeVariant(
  variant: ChartThemeVariant
): ChartThemeTokens {
  const theme = CHART_THEME_VARIANTS[variant];
  if (!theme) {
    throw new Error(`Unknown chart theme variant: ${variant}`);
  }
  return theme;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && vitest run shared/__tests__/chart-theme-variants.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/charts/shared/chart-theme-variants.ts app/charts/shared/__tests__/chart-theme-variants.spec.ts
git commit -m "feat(charts): add theme variants system"
```

### Task 1.2: Integrate Theme Variants with useChartTheme

**Files:**

- Modify: `app/charts/shared/use-chart-theme.ts`
- Test: `app/charts/shared/__tests__/use-chart-theme.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// Add to app/charts/shared/__tests__/use-chart-theme.spec.ts
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useChartTheme } from "../use-chart-theme";

describe("useChartTheme with variants", () => {
  it("should return default theme when no variant context", () => {
    const { result } = renderHook(() => useChartTheme());
    expect(result.current.labelFontSize).toBeDefined();
  });
});
```

- [ ] **Step 2: Update useChartTheme to support variants**

Read `app/charts/shared/use-chart-theme.ts` and add variant support by:

1. Creating a ChartThemeContext
2. Adding useChartThemeVariant hook
3. Updating useChartTheme to merge variant tokens

- [ ] **Step 3: Run tests**

Run: `cd app && vitest run shared/__tests__/use-chart-theme.spec.ts` Expected:
PASS

- [ ] **Step 4: Commit**

```bash
git add app/charts/shared/use-chart-theme.ts app/charts/shared/__tests__/use-chart-theme.spec.ts
git commit -m "feat(charts): integrate theme variants with useChartTheme"
```

### Task 1.3: Add Theme Selector UI

**Files:**

- Create: `app/configurator/components/theme-variant-selector.tsx`
- Modify: `app/configurator/components/chart-options-selector.tsx`

- [ ] **Step 1: Create theme variant selector component**

```typescript
// app/configurator/components/theme-variant-selector.tsx
import { t } from "@lingui/macro";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useCallback } from "react";

import { ChartThemeVariant } from "@/charts/shared/chart-theme-variants";
import { useConfiguratorState } from "@/configurator";

const THEME_VARIANT_LABELS: Record<ChartThemeVariant, string> = {
  default: "Default",
  modern: "Modern",
  minimal: "Minimal",
  dark: "Dark",
};

export const ThemeVariantSelector = () => {
  const [state, dispatch] = useConfiguratorState();
  const currentVariant = state.chartConfig?.themeVariant ?? "default";

  const handleChange = useCallback(
    (variant: ChartThemeVariant) => {
      dispatch({
        type: "CHART_THEME_VARIANT_CHANGED",
        payload: { variant },
      });
    },
    [dispatch]
  );

  return (
    <FormControl size="small" fullWidth>
      <InputLabel>{t({ id: "chart.themeVariant.label", message: "Theme Style" })}</InputLabel>
      <Select
        value={currentVariant}
        label={t({ id: "chart.themeVariant.label", message: "Theme Style" })}
        onChange={(e) => handleChange(e.target.value as ChartThemeVariant)}
      >
        {(Object.keys(THEME_VARIANT_LABELS) as ChartThemeVariant[]).map((variant) => (
          <MenuItem key={variant} value={variant}>
            {THEME_VARIANT_LABELS[variant]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
```

- [ ] **Step 2: Add themeVariant to config types**

Update `app/config-types.ts` to add `themeVariant?: ChartThemeVariant` to chart
config types.

- [ ] **Step 3: Add reducer action**

Update `app/configurator/configurator-state/reducer.ts` to handle
`CHART_THEME_VARIANT_CHANGED` action.

- [ ] **Step 4: Add selector to chart options**

Import and add `<ThemeVariantSelector />` to the appropriate section in
`chart-options-selector.tsx`.

- [ ] **Step 5: Run tests**

Run: `cd app && vitest run` Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/configurator/components/theme-variant-selector.tsx app/config-types.ts app/configurator/configurator-state/reducer.ts
git commit -m "feat(configurator): add theme variant selector UI"
```

### Task 1.4: Add Diamond Legend Symbol

**Files:**

- Modify: `app/charts/shared/legend-color.tsx`
- Test: `app/charts/shared/__tests__/legend-color.spec.ts`

- [ ] **Step 1: Update LegendSymbol type**

```typescript
// In legend-color.tsx, update the type
export type LegendSymbol =
  | "square"
  | "line"
  | "dashed-line"
  | "circle"
  | "cross"
  | "triangle"
  | "diamond"; // Add diamond
```

- [ ] **Step 2: Add diamond rendering to LegendIcon**

```typescript
// Add to the switch statement in LegendIcon
case "diamond":
  node = (
    <polygon
      points="0.5,0 1,0.5 0.5,1 0,0.5"
      fill={fill}
    />
  );
  break;
```

- [ ] **Step 3: Write test for diamond symbol**

```typescript
// Add to legend-color.spec.ts
it("should render diamond symbol", () => {
  const { container } = render(<LegendIcon symbol="diamond" size={12} fill="#3B82F6" />);
  const polygon = container.querySelector("polygon");
  expect(polygon).toBeInTheDocument();
  expect(polygon?.getAttribute("fill")).toBe("#3B82F6");
});
```

- [ ] **Step 4: Run tests**

Run: `cd app && vitest run shared/__tests__/legend-color.spec.ts` Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/charts/shared/legend-color.tsx app/charts/shared/__tests__/legend-color.spec.ts
git commit -m "feat(legend): add diamond symbol"
```

---

## Chunk 2: Enhanced Interactions

### Task 2.1: Enhanced Guidance Hints with Sequential Display

**Files:**

- Modify: `app/charts/shared/interaction/guidance-hint.tsx`
- Create: `app/charts/shared/interaction/guidance-hints-manager.tsx`
- Test: `app/charts/shared/__tests__/guidance-hint.spec.tsx`

- [ ] **Step 1: Write test for sequential hints**

```typescript
// app/charts/shared/__tests__/guidance-hint.spec.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GuidanceHintsManager, useGuidanceHints } from "../interaction/guidance-hints-manager";

describe("GuidanceHintsManager", () => {
  const hints = [
    { id: "hint1", content: "First hint", target: "#element1" },
    { id: "hint2", content: "Second hint", target: "#element2" },
  ];

  it("should show hints sequentially", async () => {
    render(<GuidanceHintsManager hints={hints} chartId="test" />);
    expect(screen.getByText("First hint")).toBeInTheDocument();
    expect(screen.queryByText("Second hint")).not.toBeInTheDocument();
  });

  it("should advance to next hint on dismiss", async () => {
    render(<GuidanceHintsManager hints={hints} chartId="test" />);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByText("Second hint")).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Create enhanced guidance hints manager**

```typescript
// app/charts/shared/interaction/guidance-hints-manager.tsx
import { Box, Button, Typography, Paper } from "@mui/material";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface GuidanceHintConfig {
  id: string;
  target: string; // CSS selector
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface GuidanceHintsContextValue {
  currentHintIndex: number;
  dismissHint: () => void;
  skipAll: () => void;
  totalHints: number;
}

const GuidanceHintsContext = createContext<GuidanceHintsContextValue | null>(null);

export const useGuidanceHints = () => {
  const context = useContext(GuidanceHintsContext);
  if (!context) {
    throw new Error("useGuidanceHints must be used within GuidanceHintsManager");
  }
  return context;
};

const STORAGE_KEY_PREFIX = "vizualni-guidance-hints";

export const GuidanceHintsManager: React.FC<{
  hints: GuidanceHintConfig[];
  chartId: string;
  children?: React.ReactNode;
}> = ({ hints, chartId, children }) => {
  const storageKey = `${STORAGE_KEY_PREFIX}-${chartId}`;
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [currentHintIndex, setCurrentHintIndex] = useState(() => {
    const firstUndismissed = hints.findIndex((h) => !dismissedHints.has(h.id));
    return firstUndismissed >= 0 ? firstUndismissed : -1;
  });

  const currentHint = currentHintIndex >= 0 ? hints[currentHintIndex] : null;

  const dismissHint = useCallback(() => {
    if (currentHintIndex >= 0 && currentHint) {
      const newDismissed = new Set(dismissedHints);
      newDismissed.add(currentHint.id);
      setDismissedHints(newDismissed);
      localStorage.setItem(storageKey, JSON.stringify([...newDismissed]));

      // Find next undismissed hint
      const nextIndex = hints.findIndex((h, i) => i > currentHintIndex && !newDismissed.has(h.id));
      setCurrentHintIndex(nextIndex >= 0 ? nextIndex : -1);
    }
  }, [currentHintIndex, currentHint, dismissedHints, hints, storageKey]);

  const skipAll = useCallback(() => {
    const allIds = new Set(hints.map((h) => h.id));
    setDismissedHints(allIds);
    localStorage.setItem(storageKey, JSON.stringify([...allIds]));
    setCurrentHintIndex(-1);
  }, [hints, storageKey]);

  const goToPrevious = useCallback(() => {
    if (currentHintIndex > 0) {
      setCurrentHintIndex(currentHintIndex - 1);
    }
  }, [currentHintIndex]);

  return (
    <GuidanceHintsContext.Provider
      value={{
        currentHintIndex,
        dismissHint,
        skipAll,
        totalHints: hints.length,
      }}
    >
      {children}
      {currentHint && (
        <GuidanceHintPopover
          hint={currentHint}
          currentIndex={currentHintIndex}
          totalHints={hints.length}
          onDismiss={dismissHint}
          onSkipAll={skipAll}
          onPrevious={currentHintIndex > 0 ? goToPrevious : undefined}
        />
      )}
    </GuidanceHintsContext.Provider>
  );
};

const GuidanceHintPopover: React.FC<{
  hint: GuidanceHintConfig;
  currentIndex: number;
  totalHints: number;
  onDismiss: () => void;
  onSkipAll: () => void;
  onPrevious?: () => void;
}> = ({ hint, currentIndex, totalHints, onDismiss, onSkipAll, onPrevious }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        top: hint.position === "bottom" ? "100%" : "auto",
        bottom: hint.position === "top" ? "100%" : "auto",
        left: hint.position === "right" ? "100%" : "auto",
        right: hint.position === "left" ? "100%" : "auto",
        zIndex: 1300,
        p: 2,
        maxWidth: 300,
      }}
    >
      <Typography variant="body2" sx={{ mb: 1.5 }}>
        {hint.content}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="caption" color="text.secondary">
          {currentIndex + 1} / {totalHints}
        </Typography>
        <Box>
          {onPrevious && (
            <Button size="small" onClick={onPrevious} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Button size="small" variant="contained" onClick={onDismiss}>
            {currentIndex < totalHints - 1 ? "Next" : "Got it"}
          </Button>
          <Button size="small" color="inherit" onClick={onSkipAll} sx={{ ml: 1 }}>
            Skip all
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
```

- [ ] **Step 3: Run tests**

Run: `cd app && vitest run shared/__tests__/guidance-hint.spec.tsx` Expected:
PASS

- [ ] **Step 4: Commit**

```bash
git add app/charts/shared/interaction/guidance-hints-manager.tsx app/charts/shared/__tests__/guidance-hint.spec.tsx
git commit -m "feat(guidance): add sequential hints manager"
```

### Task 2.2: Enhanced Ruler Tool with Snap-to-Data

**Files:**

- Modify: `app/charts/shared/interaction/ruler.tsx`
- Test: `app/charts/shared/__tests__/ruler.spec.tsx`

- [ ] **Step 1: Read existing ruler implementation**

Read `app/charts/shared/interaction/ruler.tsx` to understand current
implementation.

- [ ] **Step 2: Add snap-to-data functionality**

Enhance the ruler with:

1. `snapToData` option
2. Bisector for finding nearest data point
3. Visual indicator when snapped
4. Measurement display showing snapped value

- [ ] **Step 3: Write tests**

Test that ruler snaps to nearest data point when option enabled.

- [ ] **Step 4: Run tests and commit**

```bash
git add app/charts/shared/interaction/ruler.tsx app/charts/shared/__tests__/ruler.spec.tsx
git commit -m "feat(ruler): add snap-to-data functionality"
```

### Task 2.3: Observation Callouts with Leader Lines

**Files:**

- Create: `app/charts/shared/observation-callout.tsx`
- Test: `app/charts/shared/__tests__/observation-callout.spec.tsx`

- [ ] **Step 1: Write test**

```typescript
// app/charts/shared/__tests__/observation-callout.spec.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ObservationCallout } from "../observation-callout";

describe("ObservationCallout", () => {
  it("should render callout with label and value", () => {
    render(
      <ObservationCallout
        x={100}
        y={50}
        label="Q1 2024"
        value="1,234"
        color="#3B82F6"
      />
    );
    expect(screen.getByText("Q1 2024")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("should render leader line to target point", () => {
    const { container } = render(
      <ObservationCallout
        x={100}
        y={50}
        targetX={150}
        targetY={100}
        label="Test"
        value="100"
        color="#3B82F6"
      />
    );
    const line = container.querySelector("line");
    expect(line).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create observation callout component**

```typescript
// app/charts/shared/observation-callout.tsx
import { Group } from "@visx/group";
import { Line } from "@visx/shape";
import { Text } from "@visx/text";
import React, { useMemo } from "react";

export interface ObservationCalloutProps {
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  label: string;
  value: string;
  color: string;
  segment?: string;
  width?: number;
}

export const ObservationCallout: React.FC<ObservationCalloutProps> = ({
  x,
  y,
  targetX,
  targetY,
  label,
  value,
  color,
  segment,
  width = 120,
}) => {
  const showLeaderLine = targetX !== undefined && targetY !== undefined;

  const calloutPosition = useMemo(() => {
    if (!showLeaderLine) return { x, y };

    // Position callout to avoid overlap with target
    const dx = x - targetX;
    const dy = y - targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 50) {
      // If too close, offset the callout
      return {
        x: targetX + (dx > 0 ? 60 : -60),
        y: targetY + (dy > 0 ? 30 : -30),
      };
    }

    return { x, y };
  }, [x, y, targetX, targetY, showLeaderLine]);

  return (
    <Group>
      {/* Leader line */}
      {showLeaderLine && (
        <Line
          from={{ x: targetX, y: targetY }}
          to={{ x: calloutPosition.x, y: calloutPosition.y }}
          stroke={color}
          strokeWidth={1}
          strokeDasharray="3,3"
          opacity={0.7}
        />
      )}

      {/* Callout background */}
      <rect
        x={calloutPosition.x - width / 2}
        y={calloutPosition.y - 20}
        width={width}
        height={40}
        fill="white"
        stroke={color}
        strokeWidth={1}
        rx={4}
        filter="url(#callout-shadow)"
      />

      {/* Label */}
      <Text
        x={calloutPosition.x}
        y={calloutPosition.y - 5}
        textAnchor="middle"
        fontSize={10}
        fill="#6B7280"
      >
        {label}
      </Text>

      {/* Value */}
      <Text
        x={calloutPosition.x}
        y={calloutPosition.y + 10}
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
        fill={color}
      >
        {value}
      </Text>

      {/* Segment (optional) */}
      {segment && (
        <Text
          x={calloutPosition.x}
          y={calloutPosition.y + 22}
          textAnchor="middle"
          fontSize={9}
          fill="#9CA3AF"
        >
          {segment}
        </Text>
      )}
    </Group>
  );
};
```

- [ ] **Step 3: Run tests**

Run: `cd app && vitest run shared/__tests__/observation-callout.spec.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/charts/shared/observation-callout.tsx app/charts/shared/__tests__/observation-callout.spec.tsx
git commit -m "feat(charts): add observation callouts with leader lines"
```

---

## Chunk 3: Treemap Chart Type

### Task 3.1: Treemap Chart Types

**Files:**

- Create: `app/charts/treemap/treemap-types.ts`
- Modify: `app/config-types.ts`

- [ ] **Step 1: Define treemap types**

```typescript
// app/charts/treemap/treemap-types.ts
import { ChartConfig } from "@/config-types";

export type TreemapTileType = "squarify" | "slice" | "dice" | "sliceDice";

export interface TreemapFields {
  x: {
    componentId: string;
    type: "nominal";
  };
  y: {
    componentId: string;
    type: "quantitative";
  };
  segment?: {
    componentId: string;
  };
  tile?: TreemapTileType;
}

export interface TreemapConfig extends ChartConfig {
  chartType: "treemap";
  fields: TreemapFields;
}
```

- [ ] **Step 2: Add TreemapConfig to config-types.ts**

Add `TreemapConfig` to the union of chart configs and add type guard.

- [ ] **Step 3: Commit**

```bash
git add app/charts/treemap/treemap-types.ts app/config-types.ts
git commit -m "feat(treemap): add treemap chart types"
```

### Task 3.2: Treemap State

**Files:**

- Create: `app/charts/treemap/treemap-state-props.ts`
- Create: `app/charts/treemap/treemap-state.tsx`
- Test: `app/charts/treemap/__tests__/treemap-state.spec.tsx`

- [ ] **Step 1: Create treemap state props**

Following the pattern from `pie-state-props.ts`, create the state variables
hook.

- [ ] **Step 2: Create treemap state**

Using D3's `treemap()` and `hierarchy()` functions:

1. Build hierarchy from data
2. Create treemap layout
3. Calculate colors for each cell
4. Handle interactions (hover, click for drill-down)

- [ ] **Step 3: Write tests**

- [ ] **Step 4: Run tests and commit**

### Task 3.3: Treemap Rendering

**Files:**

- Create: `app/charts/treemap/treemap.tsx`
- Create: `app/charts/treemap/chart-treemap.tsx`
- Test: `app/charts/treemap/__tests__/treemap.spec.tsx`

- [ ] **Step 1: Create treemap rendering component**

Render treemap cells with:

1. SVG rect elements for each cell
2. Text labels (with collision detection)
3. Hover effects
4. Transition animations

- [ ] **Step 2: Create chart wrapper**

Following pattern from `chart-pie.tsx`.

- [ ] **Step 3: Write tests**

- [ ] **Step 4: Register treemap in charts/index.ts**

- [ ] **Step 5: Run tests and commit**

---

## Chunk 4: Sankey Diagram

### Task 4.1: Sankey Types

**Files:**

- Create: `app/charts/sankey/sankey-types.ts`
- Modify: `app/config-types.ts`

### Task 4.2: Sankey State

**Files:**

- Create: `app/charts/sankey/sankey-state-props.ts`
- Create: `app/charts/sankey/sankey-state.tsx`

Using `d3-sankey` library for layout calculation.

### Task 4.3: Sankey Rendering

**Files:**

- Create: `app/charts/sankey/sankey.tsx`
- Create: `app/charts/sankey/chart-sankey.tsx`

---

## Chunk 5: Sunburst Chart

### Task 5.1: Sunburst Types

**Files:**

- Create: `app/charts/sunburst/sunburst-types.ts`
- Modify: `app/config-types.ts`

### Task 5.2: Sunburst State

**Files:**

- Create: `app/charts/sunburst/sunburst-state-props.ts`
- Create: `app/charts/sunburst/sunburst-state.tsx`

Using D3's `partition()` and `hierarchy()`.

### Task 5.3: Sunburst Rendering

**Files:**

- Create: `app/charts/sunburst/sunburst.tsx`
- Create: `app/charts/sunburst/chart-sunburst.tsx`

---

## Chunk 6: Gauge Chart

### Task 6.1: Gauge Types

**Files:**

- Create: `app/charts/gauge/gauge-types.ts`
- Modify: `app/config-types.ts`

### Task 6.2: Gauge State

**Files:**

- Create: `app/charts/gauge/gauge-state-props.ts`
- Create: `app/charts/gauge/gauge-state.tsx`

### Task 6.3: Gauge Rendering

**Files:**

- Create: `app/charts/gauge/gauge.tsx`
- Create: `app/charts/gauge/chart-gauge.tsx`

---

## Chunk 7: Map Enhancements

### Task 7.1: Heatmap Layer

**Files:**

- Create: `app/charts/map/layers/heatmap-layer.ts`
- Test: `app/charts/map/__tests__/heatmap-layer.spec.ts`

- [ ] **Step 1: Create heatmap layer using Deck.gl**

```typescript
// app/charts/map/layers/heatmap-layer.ts
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { MapLayerProps } from "../types";

export interface HeatmapMapLayerConfig {
  type: "heatmap";
  intensityField: string;
  radius?: number;
  colorScale?: string[];
}

export function createHeatmapLayer(
  data: any[],
  config: HeatmapMapLayerConfig
): HeatmapLayer {
  return new HeatmapLayer({
    id: `heatmap-${config.intensityField}`,
    data,
    getPosition: (d) => d.coordinates,
    getWeight: (d) => d[config.intensityField],
    radiusPixels: config.radius ?? 30,
    intensity: 1,
    threshold: 0.05,
    colorRange:
      config.colorScale?.map((c) => hexToRgb(c)) ?? DEFAULT_HEATMAP_COLORS,
  });
}

const DEFAULT_HEATMAP_COLORS = [
  [0, 0, 0, 0],
  [0, 100, 150, 100],
  [0, 185, 250, 150],
  [0, 255, 200, 200],
  [150, 255, 150, 255],
];

function hexToRgb(hex: string): number[] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        255,
      ]
    : [0, 0, 0, 255];
}
```

- [ ] **Step 2: Write tests**

- [ ] **Step 3: Integrate with map state**

- [ ] **Step 4: Run tests and commit**

### Task 7.2: 3D Column Layer

**Files:**

- Create: `app/charts/map/layers/3d-column-layer.ts`

Using Deck.gl's `ColumnLayer` with elevation.

### Task 7.3: Mesh Layer for 3D Terrain

**Files:**

- Create: `app/charts/map/layers/mesh-layer.ts`

Using `@deck.gl/mesh-layers` for terrain visualization.

---

## Chunk 8: Dependencies and Final Integration

### Task 8.1: Install Dependencies

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Add new dependencies**

```bash
yarn add d3-hierarchy d3-sankey
```

- [ ] **Step 2: Verify installation**

Run: `yarn install && yarn typecheck` Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: add d3-hierarchy and d3-sankey dependencies"
```

### Task 8.2: Register All New Chart Types

**Files:**

- Modify: `app/charts/index.ts`

- [ ] **Step 1: Add exports for new chart types**

```typescript
// Add to app/charts/index.ts
export { TreemapChart } from "./treemap/chart-treemap";
export { SankeyChart } from "./sankey/chart-sankey";
export { SunburstChart } from "./sunburst/chart-sunburst";
export { GaugeChart } from "./gauge/chart-gauge";
```

- [ ] **Step 2: Add type guards**

```typescript
export const isTreemapConfig = (config: ChartConfig): config is TreemapConfig =>
  config.chartType === "treemap";

export const isSankeyConfig = (config: ChartConfig): config is SankeyConfig =>
  config.chartType === "sankey";

export const isSunburstConfig = (
  config: ChartConfig
): config is SunburstConfig => config.chartType === "sunburst";

export const isGaugeConfig = (config: ChartConfig): config is GaugeConfig =>
  config.chartType === "gauge";
```

- [ ] **Step 3: Run full test suite**

Run: `cd app && vitest run` Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add app/charts/index.ts
git commit -m "feat(charts): register new chart types"
```

### Task 8.3: Add Chart Type Selectors

**Files:**

- Modify: `app/configurator/components/chart-configurator.tsx`

Add UI options for selecting the new chart types.

### Task 8.4: Final Integration Testing

- [ ] **Step 1: Run E2E tests**

Run: `yarn e2e:dev` Verify all chart types render correctly.

- [ ] **Step 2: Run accessibility tests**

Run: `yarn test:accessibility` Expected: All a11y tests pass.

- [ ] **Step 3: Build verification**

Run: `yarn build` Expected: Build succeeds without errors.

---

## Summary

| Phase                     | Tasks | Files Created | Files Modified |
| ------------------------- | ----- | ------------- | -------------- |
| Chunk 1: Theme System     | 4     | 2             | 6              |
| Chunk 2: Interactions     | 3     | 2             | 3              |
| Chunk 3: Treemap          | 3     | 5             | 1              |
| Chunk 4: Sankey           | 3     | 5             | 1              |
| Chunk 5: Sunburst         | 3     | 5             | 1              |
| Chunk 6: Gauge            | 3     | 5             | 1              |
| Chunk 7: Map Enhancements | 3     | 3             | 1              |
| Chunk 8: Integration      | 4     | 0             | 3              |

**Total**: ~27 new files, ~17 modified files

## Success Criteria

- [ ] All 4 theme variants (default, modern, minimal, dark) working
- [ ] Theme selector UI in configurator
- [ ] Diamond legend symbol available
- [ ] Sequential guidance hints working
- [ ] Enhanced ruler with snap-to-data
- [ ] Observation callouts with leader lines
- [ ] Treemap chart rendering correctly
- [ ] Sankey diagram rendering correctly
- [ ] Sunburst chart rendering correctly
- [ ] Gauge chart rendering correctly
- [ ] Heatmap layer on maps
- [ ] 3D column layer on maps
- [ ] All tests passing
- [ ] Build succeeds
