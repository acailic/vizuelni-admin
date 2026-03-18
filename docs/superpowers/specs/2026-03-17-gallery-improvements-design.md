# Demo Gallery Targeted Improvements Design

Date: 2026-03-17

## Summary

Targeted improvements to transform the Demo Gallery into a world-class visualization discovery interface by fixing critical issues while building on the existing component architecture.

## Scope

Fix confusing stats, improve preview reliability, enhance card metadata, polish visual design, and improve accessibility.

---

## Problem Statement

### Current Issues (P0)

1. **Confusing visualization counts** - "43 interactive" vs "53 available" creates uncertainty
2. **Infinite loading previews** - "Учитавање прегледа…" never resolves
3. **Cards lack scannable metadata** - Source, time range, chart type not immediately visible
4. **Weak visual hierarchy** - Information architecture needs refinement
5. **Accessibility gaps** - Keyboard navigation and screen reader support incomplete

---

## Design Decisions

### 1. Fix GalleryStats (CLARify Dynamic Counts)

**Current state:**

- Shows confusing "43 interactive" vs "53 available" labels
- Trust indicator feels disconnected from main count

**Changes:**

- Replace with clear, real-time dynamic display:
  ```
  {shown} / {total} приказано  ·  {categoryLabel}
  ```
- When filtering: show filtered count prominently
- Remove redundant trust badge (integrate into card design instead)
- Update counts reactively as user filters/searches

**Why:** Users need immediate feedback on what they're viewing.

---

### 2. Improve PreviewStateHandler (Fix Infinite Loading)

**Current state:**

- Only handles loading/unavailable/error states
- No timeout mechanism
- Skeleton loader is basic

**Changes:**

- Add 10-second timeout for preview rendering
- Replace infinite loading with animated skeleton placeholder
- Add retry mechanism for failed previews
- Improve error state with helpful message and retry button

**Why:** Prevents users from waiting indefinitely for broken previews.

---

### 3. Enhance VisualizationCard Metadata

**Current state:**

- Metadata row exists but is small and easy to miss
- Chart type badge and source badge are present but could be more prominent
- Time range is extracted but not always visible

**Changes:**

- Make metadata row more prominent with better contrast
- Add icon to chart type badge for quicker recognition
- Ensure time range is always displayed
- Add visual separator between preview and content
- Improve insight subtitle emphasis

**Why:** Users scan cards quickly; metadata must be immediately visible.

---

### 4. Polish CategoryFilterBar

**Current state:**

- Active category styling could be clearer
- Count badges on categories
- Horizontal scroll on mobile

**Changes:**

- More prominent active state styling (stronger background, border)
- Ensure count updates are smooth (no jarring transitions)
- Add "All" option with total count prominently
- Improve mobile responsiveness

**Why:** Category filtering is primary navigation; must feel responsive and clear.

---

### 5. Improve Accessibility

**Current issues:**

- Some interactive elements lack proper ARIA labels
- Focus indicators could be more visible
- Screen reader announcements for state changes

**Changes:**

- Add `aria-live` to dynamic regions
- Ensure all interactive elements have focus-visible styling
- Add `role="status"` to live regions
- Improve keyboard navigation flow

**Why:** WCAG 2.1 AA compliance is baseline requirement.

---

## Implementation Tasks

1. **Fix GalleryStats component**
   - Update display format for clarity
   - Add real-time count updates
   - Remove redundant trust badge

2. **Improve PreviewStateHandler**
   - Add timeout mechanism
   - Create skeleton loader component
   - Add retry functionality

3. **Enhance VisualizationCard**
   - Prominent metadata display
   - Better visual hierarchy
   - Improved insight subtitles

4. **Polish CategoryFilterBar**
   - Clearer active state
   - Smooth transitions
   - Mobile responsiveness

5. **Accessibility improvements**
   - ARIA labels
   - Focus management
   - Screen reader support

---

## Files to Modify

- `src/components/demo-gallery/GalleryStats.tsx`
- `src/components/demo-gallery/PreviewStateHandler.tsx`
- `src/components/demo-gallery/VisualizationCard.tsx`
- `src/components/demo-gallery/CategoryFilterBar.tsx`
- `src/components/demo-gallery/DemoGalleryClient.tsx`

---

## Out of Scope

- New component architecture
- Data flow changes
- Backend modifications
- New dependencies
