# Demo Gallery Targeted Improvements Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix confusing stats, improve preview reliability, enhance card metadata, polish visual design, and improve accessibility in the Demo Gallery.

**Architecture:** Incremental improvements to existing components. Each component is enhanced in isolation with clear interfaces. Changes are focused and minimal to address specific issues without restructuring the overall architecture.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Next.js 14 App Router

---

## Files Structure

### Components to Modify

- `src/components/demo-gallery/GalleryStats.tsx` - Fix confusing counts, improve dynamic display
- `src/components/demo-gallery/PreviewStateHandler.tsx` - Add skeleton, retry button
- `src/components/demo-gallery/ChartPreview.tsx` - Add timeout mechanism
- `src/components/demo-gallery/VisualizationCard.tsx` - Add chart type icon
- `src/components/demo-gallery/CategoryFilterBar.tsx` - Polish active state styling
- `src/components/demo-gallery/DemoGalleryClient.tsx` - Wire up improvements, add accessibility

### Components to Create

- `src/components/demo-gallery/SkeletonPreview.tsx` - Animated skeleton loader

---

## Tasks

### Task 1: Create SkeletonPreview Component

**Files:**

- Create: `src/components/demo-gallery/SkeletonPreview.tsx`

- [ ] **Step 1: Create SkeletonPreview component with animated pulse**

```tsx
'use client';

export function SkeletonPreview() {
  return (
    <div className='h-full w-full animate-pulse rounded-[1.75rem] bg-slate-200'>
      <div className='flex h-full flex-col justify-between p-4'>
        <div className='space-y-3'>
          <div className='h-3 w-3/4 rounded-full bg-slate-300' />
          <div className='h-2 w-1/2 rounded-full bg-slate-300' />
        </div>
        <div className='space-y-2'>
          <div className='h-20 rounded-lg bg-slate-300' />
          <div className='flex justify-between'>
            <div className='h-2 w-1/4 rounded-full bg-slate-300' />
            <div className='h-2 w-1/4 rounded-full bg-slate-300' />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Export from index**

Add to `src/components/demo-gallery/index.ts`:

```tsx
export { SkeletonPreview } from './SkeletonPreview';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/demo-gallery/SkeletonPreview.tsx src/components/demo-gallery/index.ts
git commit -m "feat(demo-gallery): add SkeletonPreview component"
```

---

### Task 2: Add Timeout State Management to ChartPreview

**Files:**

- Modify: `src/components/demo-gallery/ChartPreview.tsx`

- [ ] **Step 1: Add timeout state management to ChartPreview**

```tsx
// In ChartPreview.tsx, add useState for timeout tracking
const [isTimedOut, setIsTimedOut] = useState(false);
const TIMEOUT_MS = 10000;

useEffect(() => {
  if (!shouldRenderPreview) return;

  setIsTimedOut(false); // Reset on new render

  const timeout = setTimeout(() => {
    setIsTimedOut(true);
  }, TIMEOUT_MS);

  return () => clearTimeout(timeout);
}, [shouldRenderPreview, example.id]);

// Update the render logic to handle timeout
if (isTimedOut) {
  return (
    <PreviewStateHandler
      state='error'
      chartType={meta.chartTypeLabel}
      labels={labels}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demo-gallery/ChartPreview.tsx
git commit -m "feat(demo-gallery): add 10s timeout to chart preview"
```

---

### Task 3: Integrate SkeletonPreview into PreviewStateHandler

**Files:**

- Modify: `src/components/demo-gallery/PreviewStateHandler.tsx`

- [ ] **Step 1: Import SkeletonPreview and update loading state**

```tsx
import { SkeletonPreview } from './SkeletonPreview';

// In PreviewStateHandler, for the loading case:
if (state === 'loading') {
  return (
    <div className='h-full w-full'>
      <SkeletonPreview />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/demo-gallery/PreviewStateHandler.tsx
git commit -m "feat(demo-gallery): use skeleton in preview handler"
```

---

### Task 4: Add Retry Button to Preview Error State

**Files:**

- Modify: `src/components/demo-gallery/PreviewStateHandler.tsx`
- Modify: `src/components/demo-gallery/ChartPreview.tsx`

- [ ] **Step 1: Add onRetry prop to PreviewStateHandler interface**

```tsx
interface PreviewStateHandlerProps {
  state: 'loading' | 'unavailable' | 'error';
  chartType: string;
  labels: { ... };
  onRetry?: () => void;  // Add this
}
```

- [ ] **Step 2: Update error state rendering with retry button**

```tsx
case 'error':
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[1.75rem] bg-slate-100 p-4 text-center">
      <AlertCircle className="h-8 w-8 text-red-400" />
      <p className="text-sm text-slate-600">{labels.previewFailed}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-gov-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gov-primary/90"
        >
          Retry
        </button>
      )}
    </div>
  );
```

- [ ] **Step 3: Wire up retry in ChartPreview**

In `ChartPreview.tsx`, add retry handler:

```tsx
const handleRetry = () => {
  setIsTimedOut(false);
  setShouldRenderPreview(false);
  // Re-trigger after small delay
  setTimeout(() => setShouldRenderPreview(true), 100);
};

// Pass to PreviewStateHandler when in error state
<PreviewStateHandler
  state='error'
  chartType={meta.chartTypeLabel}
  labels={labels}
  onRetry={handleRetry}
/>;
```

- [ ] **Step 4: Commit**

```bash
git add src/components/demo-gallery/PreviewStateHandler.tsx src/components/demo-gallery/ChartPreview.tsx
git commit -m "feat(demo-gallery): add retry button to preview error state"
```

---

### Task 5: Fix GalleryStats Dynamic Display

**Files:**

- Modify: `src/components/demo-gallery/GalleryStats.tsx`
- Modify: `src/components/demo-gallery/DemoGalleryClient.tsx`

- [ ] **Step 1: Replace confusing stats with clear display**

```tsx
'use client';

interface GalleryStatsProps {
  total: number;
  shown: number;
  categoryLabel: string;
  searchQuery?: string;
  labels: {
    total: string;
    shown: string;
    category: string;
    trust: string;
    trustValue: string;
    results?: string;
    filtering?: string;
  };
}

export function GalleryStats({
  total,
  shown,
  categoryLabel,
  searchQuery,
  labels,
}: GalleryStatsProps) {
  const isFiltered = shown < total || Boolean(searchQuery);
  const resultsText = isFiltered
    ? `${shown} ${labels.results ?? 'приказано'}`
    : `${total} ${labels.total}`;

  return (
    <div
      className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm'
      role='status'
      aria-live='polite'
    >
      <div className='flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5'>
        <span className='font-semibold text-slate-900'>{resultsText}</span>
      </div>
      <span className='text-slate-400' aria-hidden='true'>
        ·
      </span>
      <div className='flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5'>
        <span className='font-medium text-blue-700'>{categoryLabel}</span>
      </div>
      {isFiltered && (
        <>
          <span className='text-slate-400' aria-hidden='true'>
            ·
          </span>
          <div className='flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5'>
            <span className='text-emerald-700'>{labels.trustValue}</span>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update DemoGalleryClient to pass searchQuery**

In `DemoGalleryClient.tsx`, update the GalleryStats props:

```tsx
<GalleryStats
  total={examples.length}
  shown={filteredExamples.length}
  categoryLabel={activeCategoryLabel}
  searchQuery={searchQuery}
  labels={{
    total: labels.statsTotal,
    shown: labels.statsShown,
    category: labels.statsCategory,
    trust: labels.statsTrust,
    trustValue: labels.statsTrustValue,
    results:
      locale === 'sr-Cyrl'
        ? 'приказано'
        : locale === 'sr-Latn'
          ? 'prikazano'
          : 'shown',
  }}
/>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/demo-gallery/GalleryStats.tsx src/components/demo-gallery/DemoGalleryClient.tsx
git commit -m "fix(demo-gallery): clarify dynamic stats display with search integration"
```

---

### Task 6: Add Chart Type Icon to VisualizationCard

**Files:**

- Modify: `src/components/demo-gallery/VisualizationCard.tsx`

- [ ] **Step 1: Add ChartTypeIcon helper (preserve existing metadata rows)**

Import icons and create helper function - **DO NOT replace the existing metadata dl, only enhance the first dd**:

```tsx
import { BarChart3, LineChart, PieChart, Map } from 'lucide-react';

function ChartTypeIcon({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    line: LineChart,
    bar: BarChart3,
    pie: PieChart,
    map: Map,
  };
  const Icon = iconMap[type] ?? BarChart3;
  return <Icon className={className} aria-hidden='true' />;
}
```

- [ ] **Step 2: Enhance first metadata dd to include icon**

Find the first `<dd>` in the metadata dl (the one showing chartTypeLabel) and add the icon:

```tsx
<dd className='font-medium text-slate-700'>
  <ChartTypeIcon
    type={example.chartConfig.type}
    className='mr-1.5 inline h-3.5 w-3.5 text-slate-500'
  />
  {meta.chartTypeLabel}
</dd>
```

**Keep the second metadata row (reliability, freshness, lastUpdated) intact.**

- [ ] **Step 3: Commit**

```bash
git add src/components/demo-gallery/VisualizationCard.tsx
git commit -m "feat(demo-gallery): add chart type icon to card metadata"
```

---

### Task 7: Polish CategoryFilterBar Active States

**Files:**

- Modify: `src/components/demo-gallery/CategoryFilterBar.tsx`

- [ ] **Step 1: Improve active state styling**

Update the active button styling to be more prominent:

```tsx
// In the button className for active state:
className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gov-primary/20 ${
  isActive
    ? 'bg-gov-primary text-white shadow-md ring-2 ring-gov-primary/30 scale-105'
    : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
}`}
```

- [ ] **Step 2: Ensure smooth count transitions**

Add transition classes for count badges:

```tsx
<span className='ml-1.5 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-inherit px-1.5 py-0.5 text-xs font-semibold transition-all duration-200'>
  {count}
</span>
```

- [ ] **Step 3: Make "All" option more prominent**

Ensure the "All" category has special prominence with the total count:

```tsx
// For the "all" category button, consider adding a star or badge indicator
{
  category === 'all' && <span className='ml-1 text-xs opacity-70'>★</span>;
}
```

- [ ] **Step 4: Improve mobile responsiveness**

Ensure horizontal scroll works smoothly on mobile:

```tsx
// Add scroll hint on mobile if overflow
<div className='relative'>
  <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-hide'>
    {/* category buttons */}
  </div>
  {/* Optional: gradient fade on edges */}
  <div className='pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent' />
</div>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/demo-gallery/CategoryFilterBar.tsx
git commit -m "feat(demo-gallery): polish category filter with better active states and mobile support"
```

---

### Task 8: Improve Accessibility

**Files:**

- Modify: `src/components/demo-gallery/DemoGalleryClient.tsx`

- [ ] **Step 1: Add aria-live to dynamic regions**

Add `aria-live="polite"` to GalleryStats region that shows counts

- [ ] **Step 2: Add role="status" to results section**

```tsx
<section
  role="region"
  aria-labelledby="demo-gallery-results-title"
  aria-busy={isPending}
  aria-live="polite"
  className="..."
>
```

- [ ] **Step 3: Ensure focus-visible on all interactive elements**

Add global focus styles if not present in globals.css:

```css
/* Ensure visible focus indicators */
*:focus-visible {
  outline: 2px solid #0d4077;
  outline-offset: 2px;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/demo-gallery/DemoGalleryClient.tsx
git commit -m "feat(demo-gallery): improve accessibility with aria-live regions"
```

---

### Task 9: Final Integration and Testing

**Files:**

- All modified files

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 2: Run lint check**

```bash
npm run lint
```

Expected: No errors

- [ ] **Step 3: Test in browser at multiple locales**

Test at:

- `/sr-Cyrl/demo-gallery`
- `/sr-Latn/demo-gallery`
- `/en/demo-gallery`

Expected: All pages load correctly, stats update when filtering, previews show loading states

- [ ] **Step 4: Test timeout behavior**

- Wait 10 seconds on a preview that doesn't load
- Verify error state appears with retry button
- Click retry and verify preview attempts to reload

- [ ] **Step 5: Test mobile responsiveness**

- Test on mobile viewport (375px width)
- Verify category filter bar scrolls horizontally
- Verify cards stack properly

- [ ] **Step 6: Commit all changes**

```bash
git add .
git commit -m "feat(demo-gallery): complete gallery improvements - stats, previews, metadata, accessibility"
```

---

## Testing Checklist

- [ ] Stats update correctly when filtering by category
- [ ] Stats update correctly when searching
- [ ] Preview shows skeleton while loading
- [ ] Preview shows error state with retry after 10s timeout
- [ ] Retry button actually re-renders the preview
- [ ] Cards show metadata prominently with icons
- [ ] Category filters have clear active states
- [ ] "All" category is prominent
- [ ] Category filter bar works on mobile (horizontal scroll)
- [ ] All pages accessible via keyboard
- [ ] Screen reader announces count changes
- [ ] Works in all three locales (sr-Cyrl, sr-Latn, en)

---

## Dependencies

- None (all changes use existing dependencies: lucide-react for icons)

---

## Rollback

If issues arise, each task can be reverted independently via git revert.
