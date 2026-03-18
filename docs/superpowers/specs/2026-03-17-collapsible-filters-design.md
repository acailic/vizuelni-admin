# Collapsible Filters for Gallery Pages - Design Spec

**Date:** 2026-03-17
**Status:** Draft

## Overview

Add collapsible filter sections to both the Demo Gallery and Gallery pages. Filters are hidden by default and revealed via a toggle button that displays a badge showing the count of active filters.

## Motivation

- Reduces visual clutter on initial page load
- Follows the project's Swiss-inspired functional minimalism principle
- Makes the chart cards the primary focus
- Provides clear feedback about active filters through badge count

## Design

### New Component: `CollapsibleFilters`

A reusable client component that wraps filter controls with show/hide functionality.

**Location:** `src/components/ui/CollapsibleFilters.tsx`

**Icon:** `Filter` from `lucide-react`

**Props:**

```typescript
interface CollapsibleFiltersProps {
  children: React.ReactNode;
  activeFilterCount: number;
  labels: {
    filters: string; // "Filters"
    showFilters: string; // "Show filters"
    hideFilters: string; // "Hide filters"
  };
  defaultExpanded?: boolean; // defaults to false
  className?: string; // optional additional styling
}
```

**Behavior:**

- Collapsed by default on initial render (unless `defaultExpanded` is true)
- Toggle button displays Filter icon + text
- Badge appears next to button when `activeFilterCount > 0`
- Smooth height transition using CSS max-height transition with Tailwind
- Respects `prefers-reduced-motion` media query via Tailwind's motion-safe variant
- Button uses `aria-expanded` to communicate state to screen readers
- When collapsing with focus inside filter section, focus returns to toggle button

**Visual Design:**

- Toggle button styled as secondary/outline button with rounded corners
- Badge: small pill with Serbian red (`#C6363C`) background, white text
- Expanded section has subtle top border for visual separation
- Chevron icon rotates when expanded

### Page 1: Demo Gallery

**File:** `src/components/demo-gallery/DemoGalleryClient.tsx`

**Current State:**

- Category tabs (all, demographics, healthcare, economy, migration, society) always visible

**Changes:**

- Wrap `DemoGalleryTabs` component in `CollapsibleFilters`
- Calculate active filter count: `activeCategory !== 'all' ? 1 : 0`

**Layout Before:**

```
[Header + Results Summary]
[Category tabs - always visible]
[Chart cards grid]
```

**Layout After:**

```
[Header + Results Summary]
[🔘 Filters (1) ▾]  ← toggle button, collapsed by default
[Category tabs]     ← hidden until expanded
[Chart cards grid]
```

### Page 2: Gallery Page

**File:** `src/components/gallery/GalleryPage.tsx`

**Current State:**

- `GalleryFilterBar` with search input, chart type dropdown, and sort dropdown always visible

**Changes:**

- Wrap `GalleryFilterBar` component in `CollapsibleFilters`
- Calculate active filter count:
  - `+1` if `search` string is not empty
  - `+1` if `chartType !== 'all'`
  - Sort selection does not count as a "filter" for badge purposes

**Layout Before:**

```
[Header]
[Search | Chart Type | Sort - always visible]
[Results count]
[Chart cards grid]
```

**Layout After:**

```
[Header]
[🔘 Filters (2) ▾]  ← toggle button, collapsed by default
[Search | Type | Sort] ← hidden until expanded
[Results count]
[Chart cards grid]
```

## Translations

Add namespaced keys to locale files under `collapsibleFilters`:

| Key                        | en           | sr-Cyrl         | sr-Latn         |
| -------------------------- | ------------ | --------------- | --------------- |
| `collapsibleFilters.label` | Filters      | Филтери         | Filteri         |
| `collapsibleFilters.show`  | Show filters | Прикажи филтере | Prikaži filtere |
| `collapsibleFilters.hide`  | Hide filters | Сакриј филтере  | Sakrij filtere  |

**Files to update:**

- `src/locales/en.json`
- `src/locales/sr-cyr.json`
- `src/locales/sr-lat.json`

## Implementation Checklist

1. [ ] Create `CollapsibleFilters` component in `src/components/ui/`
2. [ ] Add translation keys to all locale files
3. [ ] Update `DemoGalleryClient.tsx` to use `CollapsibleFilters`
4. [ ] Update `GalleryPage.tsx` to use `CollapsibleFilters`
5. [ ] Test keyboard navigation and screen reader compatibility
6. [ ] Verify reduced motion preference is respected

## Accessibility Considerations

- Toggle button uses `aria-expanded="true/false"` to communicate state
- Expanded section uses `aria-hidden` when collapsed
- Focus management: when collapsing, focus returns to toggle button
- Keyboard users can Tab to toggle button and activate with Enter/Space
- Screen readers announce filter count via sr-only text in badge

## Files Changed

| File                                                | Action |
| --------------------------------------------------- | ------ |
| `src/components/ui/CollapsibleFilters.tsx`          | Create |
| `src/components/demo-gallery/DemoGalleryClient.tsx` | Modify |
| `src/components/gallery/GalleryPage.tsx`            | Modify |
| `src/locales/en.json`                               | Modify |
| `src/locales/sr-cyr.json`                           | Modify |
| `src/locales/sr-lat.json`                           | Modify |
