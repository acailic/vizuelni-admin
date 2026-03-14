---
name: Chart Preview Thumbnails
description: Fix demo gallery chart previews to show complete scaled-down charts instead of cropped partial views
type: project
---

# Chart Preview Thumbnails

## Problem

In the demo gallery (`/sr-Latn/demo-gallery`), chart preview cards show only a cropped portion of the chart because:

- Card preview area is fixed at `h-48` (192px)
- Charts render at default 400px height
- Result: bottom portion (x-axis, legend) is cut off

## Solution

Show a complete, scaled-down miniature of each chart by:

1. Reducing the chart height prop to fit the card
2. Hiding non-essential chrome elements in preview mode

## Design Decisions

### Card Height

- **Keep current `h-48` (192px)** - maintains grid density

### Elements to Hide in Preview Mode

- **Chart title** - redundant, already shown in card footer
- **Legend** - takes space, not essential for thumbnail

### Elements to Keep

- Description/subtitle
- Axis labels (X/Y titles)
- Tick values
- Grid lines
- Data visualization

## Implementation

### 1. ChartFrame.tsx

Add `previewMode` prop that conditionally renders chrome:

```tsx
interface ChartFrameProps {
  // ... existing props
  previewMode?: boolean;
}
```

When `previewMode={true}`:

- Skip rendering `<header>` section (title + description)
- Set minimal padding for data area
- Note: `filterBar` is already handled by `ChartRenderer` (not rendered in previewMode), no change needed in ChartFrame

### 2. ChartRenderer.tsx

The `previewMode` prop already exists on `ChartRendererProps` (line 41). Only the pass-through to `RendererComponent` is needed:

```tsx
<RendererComponent
  // ... existing props
  previewMode={previewMode}
/>
```

### 3. DemoGalleryCard.tsx

Already has `previewMode={true}`. Only needs to add the `height` prop:

```tsx
<ChartRenderer
  config={example.chartConfig}
  data={example.inlineData.observations}
  locale={locale}
  previewMode={true}
  height={176} // h-48 (192px) minus p-2 padding (8px * 2 = 16px) = 176px
/>
```

### 4. Individual Chart Components

Each chart renderer (LineChart, BarChart, etc.) needs to:

- Accept `previewMode` prop
- Pass to ChartFrame
- Conditionally hide legend when `previewMode && showInternalLegend`

```tsx
// Example in LineChart.tsx
{
  showInternalLegend && !previewMode && (config.options?.showLegend ?? true) ? (
    <Legend />
  ) : null;
}
```

## Files to Modify

| File                                                     | Change                               |
| -------------------------------------------------------- | ------------------------------------ |
| `src/types/chart-config.ts`                              | Add `previewMode?: boolean` to props |
| `src/components/charts/shared/ChartFrame.tsx`            | Add `previewMode` prop, hide header  |
| `src/components/charts/ChartRenderer.tsx`                | Pass `previewMode` to renderer       |
| `src/components/demo-gallery/DemoGalleryCard.tsx`        | Pass `height={176}`                  |
| `src/components/charts/line/LineChart.tsx`               | Accept `previewMode`, hide legend    |
| `src/components/charts/bar/BarChart.tsx`                 | Accept `previewMode`, hide legend    |
| `src/components/charts/area/AreaChart.tsx`               | Accept `previewMode`, hide legend    |
| `src/components/charts/column/ColumnChart.tsx`           | Accept `previewMode`, hide legend    |
| `src/components/charts/pie/PieChart.tsx`                 | Accept `previewMode`, hide legend    |
| `src/components/charts/scatterplot/ScatterplotChart.tsx` | Accept `previewMode`, hide legend    |
| `src/components/charts/combo/ComboChart.tsx`             | Accept `previewMode`, hide legend    |
| `src/components/charts/map/MapChart.tsx`                 | Accept `previewMode`                 |
| `src/components/charts/table/TableChart.tsx`             | Accept `previewMode`                 |

## Type Changes

Update `ChartRendererComponentProps` in `src/types/chart-config.ts`:

```tsx
interface ChartRendererComponentProps {
  // ... existing props
  previewMode?: boolean;
}
```

## Testing

1. Verify all chart types render correctly in demo gallery cards
2. Verify clicking cards opens modal with full chart (no changes to modal)
3. Verify title appears in card footer as before
4. Check responsive behavior on different screen sizes
