# Functional Bug Analysis Report

**Date:** 2026-03-19
**Repository:** vizuelni-admin-srbije
**Focus:** Functional correctness

## Summary

| Severity | Count | Fixed |
|----------|-------|-------|
| Critical | 1 | 0 |
| High | 7 | 0 |
| Medium | 25 | 0 |
| Low | 62 | 0 |
| **Total** | **95** | **0** |

---

## Critical Bugs

### BUG-001: Increment Views Uses Wrong Table Name
**Severity:** Critical
**Component:** Auth
**File:** `src/lib/db/charts.ts:162-166`

**Current Behavior:**
The raw SQL `UPDATE charts` may fail silently due to table name mismatch. The error is caught and only logged to console, so views never increment.

**Expected Behavior:**
Use Prisma's atomic increment API or ensure table name matches. Throw error or use proper logging.

**Root Cause:**
Potential mismatch between raw SQL table name and Prisma model mapping.

**Reproduction:**
1. View a published chart
2. Check database - views count not incremented
3. Check console for silent error

**Fix Status:** Pending

---

## High Bugs

### BUG-002: Charts.ts Functions Bypass Ownership Checks
**Severity:** High
**Component:** Auth
**File:** `src/lib/db/charts.ts:100-123`

**Current Behavior:**
`updateChart()`, `deleteChart()`, and `publishChart()` functions do NOT perform ownership verification. They allow modification/deletion of any chart by ID.

**Expected Behavior:**
Remove these functions, deprecate them, or add ownership parameters. API routes should use *Owned methods.

**Root Cause:**
Standalone CRUD functions exist alongside secure *Owned variants.

**Reproduction:**
1. Call updateChart() with any chart ID
2. Chart is modified without ownership check

**Fix Status:** Pending

---

### BUG-003: SSR Hydration Mismatch - Persist Middleware Without Hydration Guard
**Severity:** High
**Component:** State
**File:** `src/stores/animation-settings.ts:29-43`

**Current Behavior:**
The `useAnimationSettingsStore` uses Zustand's `persist` middleware without hydration handling. SSR renders with defaults while client uses localStorage values, causing hydration mismatch.

**Expected Behavior:**
Use `skipHydration` option, implement custom hydration pattern, or render loading state until hydration completes.

**Root Cause:**
Missing hydration state tracking for persisted stores.

**Reproduction:**
1. Load app with saved animation settings in localStorage
2. Check console for hydration warnings

**Fix Status:** Pending

---

### BUG-004: SSR Hydration Mismatch - Dashboard Store Persistence
**Severity:** High
**Component:** State
**File:** `src/stores/dashboard.ts:77-78, 308-315`

**Current Behavior:**
Same issue as BUG-003 - persist middleware without hydration handling causes SSR/client mismatch.

**Expected Behavior:**
Implement hydration state tracking to prevent SSR mismatches.

**Root Cause:**
Missing hydration state tracking for persisted stores.

**Fix Status:** Pending

---

### BUG-005: Missing accessibilityPage Key in English Locale
**Severity:** High
**Component:** i18n
**File:** `src/lib/i18n/locales/en/common.json`

**Current Behavior:**
English locale file is missing the `accessibilityPage` section entirely. Accessibility page uses hardcoded strings instead of translation keys.

**Expected Behavior:**
English locale should have `accessibilityPage` key matching Serbian locales' structure.

**Root Cause:**
Incomplete translation key migration.

**Fix Status:** Pending

---

### BUG-006: Missing accessibilityPage Key in Serbian Latin Locale
**Severity:** High
**Component:** i18n
**File:** `src/lib/i18n/locales/lat/common.json`

**Current Behavior:**
Serbian Latin locale file is missing the `accessibilityPage` section. Serbian Cyrillic has it but Latin does not.

**Expected Behavior:**
Serbian Latin locale should have `accessibilityPage` key.

**Root Cause:**
Incomplete translation key migration.

**Fix Status:** Pending

---

### BUG-007: Stale Closure in DataSourceContext useEffect
**Severity:** High
**Component:** State
**File:** `src/contexts/DataSourceContext.tsx:74`

**Current Behavior:**
`useEffect` missing dependency: `source`. The effect reads `source` but doesn't include it in deps array. This could cause localStorage sync to behave unexpectedly if source changes.

**Expected Behavior:**
Add `source` to dependency array or document why it's intentionally omitted.

**Root Cause:**
Missing dependency in React hooks.

**Reproduction:**
1. Change data source
2. Check localStorage - may not sync correctly

**Fix Status:** Pending

---

### BUG-008: Stale Closure in TutorialContext useCallback
**Severity:** High
**Component:** State
**File:** `src/lib/tutorials/TutorialContext.tsx:133`

**Current Behavior:**
`useCallback` missing dependency: `completeTutorial`. The `nextStep` callback calls `completeTutorial()` but doesn't include it in deps.

**Expected Behavior:**
Add `completeTutorial` to dependency array.

**Root Cause:**
Missing dependency in React hooks.

**Reproduction:**
1. Start tutorial
2. Complete step - may use stale completeTutorial reference

**Fix Status:** Pending

---

## Medium Bugs

### BUG-009: No Fallback for Missing Translations
**Severity:** Medium
**Component:** i18n
**File:** `src/lib/i18n/messages.ts:22-24`

**Current Behavior:**
`getMessages` returns locale messages directly without fallback. Missing keys show `undefined` or crash.

**Expected Behavior:**
Implement fallback to default locale for missing keys.

**Fix Status:** Pending

---

### BUG-010: Hardcoded "No time data available" String
**Severity:** Medium
**Component:** i18n
**File:** `src/components/filters/TimeRangeBrush.tsx:218`

**Current Behavior:**
String "No time data available" is hardcoded in English.

**Expected Behavior:**
Use translation key like `charts.states.no_data`.

**Fix Status:** Pending

---

### BUG-011: Inconsistent date-fns Locale Handling
**Severity:** Medium
**Component:** i18n
**File:** `src/components/gallery/GalleryChartCard.tsx:70-71`

**Current Behavior:**
When locale is `sr-Cyrl`, dateLocale returns `undefined` instead of `sr` locale.

**Expected Behavior:**
Use `sr` locale for both `sr-Cyrl` and `sr-Latn`.

**Fix Status:** Pending

---

### BUG-012: Default Labels Hardcoded in DatasetInfoFooter
**Severity:** Medium
**Component:** i18n
**File:** `src/components/charts/shared/DatasetInfoFooter.tsx:28-32`

**Current Behavior:**
Default labels "Dataset" and "Latest data update" hardcoded in English.

**Expected Behavior:**
Use translation keys as defaults.

**Fix Status:** Pending

---

### BUG-013: Animation State Not Cleared on Navigation
**Severity:** Medium
**Component:** State
**File:** `src/stores/animation.ts:139-144`

**Current Behavior:**
`reset()` only resets `isPlaying`, `currentIndex`, `animationId`, but NOT `timeValues`, `totalFrames`, `speed`. Stale data persists when navigating between charts.

**Expected Behavior:**
`reset()` should clear all animation-related state.

**Fix Status:** Pending

---

### BUG-014: Potential Animation Frame Leak on Unmount
**Severity:** Medium
**Component:** State
**File:** `src/stores/animation.ts:18, 50, 143, 148`

**Current Behavior:**
`animationId` stored in global store becomes stale if component unmounts while animation playing.

**Expected Behavior:**
Remove `animationId` from store or ensure cleanup uses closure ref, not store state.

**Fix Status:** Pending

---

### BUG-015: Race Condition in Animation Loop State Updates
**Severity:** Medium
**Component:** State
**File:** `src/components/charts/shared/AnimationControls.tsx:74-93`

**Current Behavior:**
Animation loop reads state directly from store and updates it, bypassing React's state management.

**Expected Behavior:**
Use store's `set` function properly to ensure reactivity.

**Fix Status:** Pending

---

### BUG-016: Non-Atomic Owned Operation Verification Race Condition
**Severity:** Medium
**Component:** Auth
**File:** `src/lib/db/chart-repository-prisma.ts:120-138`

**Current Behavior:**
In updateOwned/softDeleteOwned, after updateMany returns count=0, separate findUnique query determines error type. Between queries, another process could modify the chart.

**Expected Behavior:**
Error determination should be atomic using transaction.

**Fix Status:** Pending

---

### BUG-017: OAuth User Role Not Refreshed on Subsequent Logins
**Severity:** Medium
**Component:** Auth
**File:** `src/lib/auth/auth-options.ts:101-115`

**Current Behavior:**
On subsequent logins, if user's role changed in database, JWT token role is NOT updated.

**Expected Behavior:**
Refresh role from database on session update or subsequent logins.

**Fix Status:** Pending

---

### BUG-018: Demo Mode Prisma Client Cast Allows Unsafe Operations
**Severity:** Medium
**Component:** Auth
**File:** `src/lib/db/prisma.ts:21-22`

**Current Behavior:**
In demo mode, prisma is cast as `undefined as unknown as PrismaClient`. Code bypassing repository pattern will throw runtime error.

**Expected Behavior:**
Throw clear error or route to DemoChartRepository.

**Fix Status:** Pending

---

### BUG-019: Empty Dataset Classification Returns Incorrect Min/Max
**Severity:** Medium
**Component:** Data
**File:** `packages/data/src/domain/classifier.ts:172`

**Current Behavior:**
When classifying empty observations array, MeasureMeta min/max are set to 0, which may be misleading.

**Expected Behavior:**
Return null/undefined for min/max when no numeric values exist.

**Fix Status:** Pending

---

### BUG-020: AggregateObservations Returns 0 for Min/Max/Avg on Empty Groups
**Severity:** Medium
**Component:** Data
**File:** `packages/data/src/domain/transforms.ts:144-148`

**Current Behavior:**
When aggregating with no numeric values in group, returns 0 for min/max/avg. Misleading visualization.

**Expected Behavior:**
Return null for min/max/avg when no valid values exist.

**Fix Status:** Pending

---

### BUG-021: Join Silently Drops Duplicate Keys in Secondary Dataset
**Severity:** Medium
**Component:** Data
**File:** `packages/data/src/domain/join.ts:70-74`

**Current Behavior:**
When building secondaryMap, duplicate join keys are silently overwritten. Data loss without warning.

**Expected Behavior:**
Aggregate duplicates, keep all matches, or warn about duplicates.

**Fix Status:** Pending

---

### BUG-022: CSV Streaming May Truncate Mid-Row
**Severity:** Medium
**Component:** Data
**File:** `packages/data/src/application/load-dataset.ts:253-259`

**Current Behavior:**
When streaming CSV with rowLimit, counts newlines. Quoted multi-line fields could cause mid-row truncation.

**Expected Behavior:**
Use CSV-aware row counting mechanism.

**Fix Status:** Pending

---

### BUG-023: Missing prefers-reduced-motion Support in useChartInView
**Severity:** Medium
**Component:** Charts
**File:** `src/hooks/useChartInView.ts:12-30`

**Current Behavior:**
When reduced motion is preferred, effect returns early without setting `inView: true`. Charts may not render.

**Expected Behavior:**
Set `inView: true` when reduced motion is preferred.

**Fix Status:** Pending

---

### BUG-024: PieChart Empty Array Handling
**Severity:** Medium
**Component:** Charts
**File:** `src/components/charts/pie/PieChart.tsx:34`

**Current Behavior:**
When all values filtered out, `total` is 0 but "Values are shown as share of total" text still appears.

**Expected Behavior:**
Don't show footer text when total is 0.

**Fix Status:** Pending

---

### BUG-025: MapChart Missing Empty State
**Severity:** Medium
**Component:** Charts
**File:** `src/components/charts/map/MapChart.tsx:168-223`

**Current Behavior:**
When `data.length === 0`, map renders with no colored regions but no "no data" message.

**Expected Behavior:**
Show visual indicator when no data to display.

**Fix Status:** Pending

---

### BUG-026: State Mutation Risk in updateConfig
**Severity:** Medium
**Component:** Charts
**File:** `src/stores/configurator.ts:142-154`

**Current Behavior:**
If `state.config.options` is undefined, spreading it throws `TypeError: Cannot spread undefined`.

**Expected Behavior:**
Safely handle undefined `state.config.options` by defaulting to `{}`.

**Fix Status:** Pending

---

### BUG-027: Double Initialization in ChartBuilder
**Severity:** Medium
**Component:** Charts
**File:** `src/components/charts/ChartBuilder.tsx:103-110`

**Current Behavior:**
`initialize` called on every render when `baseConfig` changes. Multiple ChartBuilders share same store state causing race conditions.

**Expected Behavior:**
Initialize once per dataset or use chartId to isolate state.

**Fix Status:** Pending

---

### BUG-028: URL Sync Race Condition
**Severity:** Medium
**Component:** Charts
**File:** `src/components/charts/CreateChartWorkspace.tsx:195-212`

**Current Behavior:**
Rapid step changes queue multiple `router.replace` calls, causing potential race conditions.

**Expected Behavior:**
Debounce URL updates.

**Fix Status:** Pending

---

### BUG-029: Empty ChartId Handling in Interactive Filters
**Severity:** Medium
**Component:** Charts
**File:** `src/stores/interactive-filters.ts:169`

**Current Behavior:**
If `chartId` is empty string, store looks up `state.charts['']` which could match data from another chart.

**Expected Behavior:**
Handle empty `chartId` by treating as "no chart" case.

**Fix Status:** Pending

---

### BUG-030: Missing ChartId in Interactive Filters Store
**Severity:** Medium
**Component:** State
**File:** `src/stores/interactive-filters.ts:169`

**Current Behavior:**
When chartId is not in state.charts, returns memoizedDefaults. Empty chartId could match wrong chart.

**Expected Behavior:**
Handle empty chartId gracefully.

**Fix Status:** Pending

---

## Low Bugs

Low severity bugs are documented in the structured JSON file. Key categories:
- Console statements in production code (4 instances)
- Type safety gaps with `any` (27 instances)
- Missing null checks (8 instances)
- Hardcoded aria-labels and placeholders (10 instances)
- Race conditions in async operations (5 instances)
- Memory leak potential (3 instances)
- Missing validation (5 instances)

See `docs/bug-analysis-2026-03-19.json` for complete list.

---

## Test Failures

The following tests are currently failing:

1. **CollapsibleFilters accessibility test** - `src/components/ui/__tests__/CollapsibleFilters.test.tsx:140`
   - aria-controls uses React auto-generated IDs instead of expected static ID

2. **ChartRenderer test** - `tests/unit/charts/ChartRenderer.test.tsx:80`
   - IntersectionObserver not defined in test environment

---

## Recommendations

### Immediate (Critical/High)
1. Fix ownership bypass in charts.ts CRUD functions
2. Add hydration guards to persisted Zustand stores
3. Fix increment views table name issue

### Short-term (Medium)
1. Add fallback mechanism for missing translations
2. Implement proper empty state handling across charts
3. Fix race conditions in animation and URL sync

### Long-term (Low)
1. Replace `any` types with proper TypeScript types
2. Internationalize all hardcoded strings
3. Add missing null checks and validation
