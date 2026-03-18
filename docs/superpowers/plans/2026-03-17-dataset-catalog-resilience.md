---
name: Dataset Catalog Resilience Implementation
description: Implementation plan for transforming broken dataset catalog into resilient data explorer
type: implementation-plan
spec: docs/superpowers/specs/2026-03-17-dataset-catalog-resilience-design.md
---

# Dataset Catalog Resilience - Implementation Plan

**Spec:** `docs/superpowers/specs/2026-03-17-dataset-catalog-resilience-design.md`
**Branch:** `feature/dataset-catalog-resilience`

## Overview

Transform the `/data` page from a broken experience into a world-class public data explorer that:

- Shows clear status at all times
- Automatically falls back to demo data when API fails
- Allows manual switching between official and demo sources
- Works offline with demo mode

## Implementation Phases

---

## Phase 1: Foundation

### Task 1.1: Create DataSourceContext

**File:** `src/contexts/DataSourceContext.tsx` (NEW)

**What to build:**
React context that manages data source state (official vs demo), connection status, retry count, and fallback logic.

**Type definitions:**

```typescript
type DataSourceType = 'official' | 'demo';
type ConnectionStatus = 'connected' | 'connecting' | 'fallback' | 'error';

interface DataSourceState {
  source: DataSourceType;
  status: ConnectionStatus;
  lastUpdated: Date | null;
  retryCount: number;
  error: Error | null;
}

interface DataSourceContextValue extends DataSourceState {
  switchSource: (source: DataSourceType) => void;
  retry: () => void;
  setFallback: () => void;
  clearError: () => void;
  incrementRetry: () => void;
}
```

**Implementation notes:**

- Use `useState` for state management
- Persist `source` to localStorage key `vas-preferred-source`
- On mount, read localStorage and set initial source
- `setFallback()` sets source to 'demo' and status to 'fallback'
- `retry()` resets retryCount to 0, sets source to 'official', status to 'connecting'
- `incrementRetry()` increments retryCount
- `clearError()` sets error to null

**Test file:** `src/contexts/__tests__/DataSourceContext.test.tsx`

**Test cases:**

1. Initial state is 'official' with 'connecting' status
2. `switchSource('demo')` changes source and persists to localStorage
3. `setFallback()` sets status to 'fallback' and source to 'demo'
4. `retry()` resets for retry attempt
5. `incrementRetry()` increments counter

**Commit:** `feat(context): add DataSourceContext for source management`

---

### Task 1.2: Create Demo Dataset Loader

**File:** `src/lib/demo-datasets.ts` (NEW)

**What to build:**
Functions to load and filter the curated demo datasets, converting them to `BrowseDataset` format.

**Type definitions:**

```typescript
interface DemoResource {
  id: string;
  title: string;
  format: string;
  url: string;
  filesize?: number;
  description?: string;
}

interface DemoDataset {
  id: string;
  title: string;
  description: string;
  organization: { name: string; slug: string };
  topic: string;
  tags: string[];
  resources: DemoResource[];
  last_modified: string;
  page?: string;
  data: Record<string, unknown>[];
}
```

**Functions to implement:**

1. `getDemoDatasets(): DemoDataset[]` - Returns the hardcoded list of 10 demo datasets
2. `toBrowseDataset(demo: DemoDataset): BrowseDataset` - Converts to API-compatible format
3. `loadDemoDatasetList(params: BrowseSearchParams): BrowsePageResponse<BrowseDataset>` - Filters and paginates
4. `loadDemoDataset(id: string): BrowseDataset | null` - Gets single dataset by ID

**All 10 demo datasets with full definitions:**

```typescript
const DEMO_DATASETS: DemoDataset[] = [
  {
    id: 'demo-demographics',
    title: 'Демографија Србије / Serbia Demographics',
    description:
      'Population statistics including age distribution, birth rates, and natural change.',
    organization: { name: 'Републички завод за статистику', slug: 'rzs' },
    topic: 'demografija',
    tags: ['demografija', 'stanovništvo', 'popis'],
    resources: [
      {
        id: 'demo-demographics-1',
        title: 'Population Pyramid',
        format: 'json',
        url: '/data/demo-gallery/demographics/population-pyramid.json',
      },
    ],
    last_modified: '2025-12-01T00:00:00Z',
    data: [],
  },
  {
    id: 'demo-gdp',
    title: 'БДП Раст / GDP Growth',
    description: 'Annual GDP growth rates and economic output metrics.',
    organization: { name: 'Републички завод за статистику', slug: 'rzs' },
    topic: 'ekonomija',
    tags: ['ekonomija', 'bdp', 'gdp', 'rast'],
    resources: [
      {
        id: 'demo-gdp-1',
        title: 'GDP Growth Data',
        format: 'json',
        url: '/data/demo-gallery/economy/gdp-growth.json',
      },
    ],
    last_modified: '2025-11-15T00:00:00Z',
    data: [],
  },
  {
    id: 'demo-inflation',
    title: 'Инфлација / Inflation',
    description: 'Consumer price indices and inflation rates over time.',
    organization: { name: 'Народна банка Србије', slug: 'nbs' },
    topic: 'ekonomija',
    tags: ['ekonomija', 'inflacija', 'cene', 'cpi'],
    resources: [
      {
        id: 'demo-inflation-1',
        title: 'Inflation Data',
        format: 'json',
        url: '/data/demo-gallery/economy/inflation.json',
      },
    ],
    last_modified: '2025-10-20T00:00:00Z',
    data: [],
  },
  {
    id: 'demo-cancer',
    title: 'Инциденца рака / Cancer Incidence',
    description: 'Cancer incidence rates by type, age group, and region.',
    organization: { name: 'Институт за јавно здравље Србије', slug: 'batut' },
    topic: 'zdravlje',
    tags: ['zdravlje', 'rak', 'incidenca', 'statistika'],
    resources: [
      {
        id: 'demo-cancer-1',
        title: 'Cancer Incidence Data',
        format: 'json',
        url: '/data/demo-gallery/healthcare/cancer-incidence.json',
      },
    ],
    last_modified: '2025-09-10T00:00:00Z',
    data: [],
  },
  {
    id: 'demo-air-quality',
    title: 'Квалитет ваздуха / Air Quality',
    description: 'Air quality measurements by city and pollutant type.',
    organization: { name: 'Агенција за заштиту животне средине', slug: 'sepa' },
    topic: 'zivotna-sredina',
    tags: ['zivotna-sredina', 'vazduh', 'kvalitet', 'zagađenje'],
    resources: [
      {
        id: 'demo-air-1',
        title: 'Air Quality Data',
        format: 'json',
        url: '/data/demo-gallery/environment/air-quality-by-city.json',
      },
    ],
    last_modified: '2025-12-05T00:00:00Z',
    data: [],
  },
  {
    id: 'demo-education',
    title: 'Упис у школе / School Enrollment',
    description: 'Student enrollment by education level and region.',
    organization: { name: 'Министарство просвете', slug: 'mpn' },
    topic: 'obrazovanje',
    tags: ['obrazovanje', 'upis', 'skole', 'učenici'],
    resources: [
      {
        id: 'demo-edu-1',
        title: 'Enrollment Data',
        format: 'json',
        url: '/data/demo-gallery/education/enrollment-by-level.json',
      },
    ],
    last_modified: '2025-08-30T00:00:00Z',
    data: [],
  },
  {
    id: 'demo-budget',
    title: 'Извршење буџета / Budget Execution',
    description: 'Government budget execution and spending by category.',
    organization: { name: 'Министарство финансија', slug: 'mfin' },
    topic: 'finansije',
    tags: ['finansije', 'budžet', 'troškovi', 'država'],
    resources: [
      {
        id: 'demo-budget-1',
        title: 'Budget Data',
        format: 'json',
        url: '/data/demo-gallery/public-finance/budget-execution.json',
      },
    ],
    last_modified: '2025-07-15T00:00:00Z',
    data: [],
  },
  {
    id: 'demo-emigration',
    title: 'Исељавање / Emigration',
    description: 'Emigration trends and destination countries.',
    organization: { name: 'Републички завод за статистику', slug: 'rzs' },
    topic: 'migracije',
    tags: ['migracije', 'iseljavanje', 'dijaspora'],
    resources: [
      {
        id: 'demo-emig-1',
        title: 'Emigration Data',
        format: 'json',
        url: '/data/demo-gallery/migration/emigration-trends.json',
      },
    ],
    last_modified: '2025-06-20T00:00:00Z',
    data: [],
  },
  {
    id: 'demo-transport',
    title: 'Саобраћајне незгоде / Road Accidents',
    description: 'Traffic accident statistics by type and region.',
    organization: { name: 'Министарство унутрашњих послова', slug: 'mup' },
    topic: 'saobracaj',
    tags: ['saobracaj', 'nezgode', 'bezbednost'],
    resources: [
      {
        id: 'demo-trans-1',
        title: 'Accident Data',
        format: 'json',
        url: '/data/serbian-road-accidents.json',
      },
    ],
    last_modified: '2025-05-10T00:00:00Z',
    data: [],
  },
  {
    id: 'demo-vital',
    title: 'Витална статистика / Vital Statistics',
    description: 'Births, deaths, and marriages by region and time.',
    organization: { name: 'Републички завод за статистику', slug: 'rzs' },
    topic: 'drustvo',
    tags: ['drustvo', 'vitalna', 'rođeni', 'umrli'],
    resources: [
      {
        id: 'demo-vital-1',
        title: 'Vital Statistics Data',
        format: 'json',
        url: '/data/demo-gallery/society/vital-statistics.json',
      },
    ],
    last_modified: '2025-04-25T00:00:00Z',
    data: [],
  },
];
```

**Filtering logic in `loadDemoDatasetList`:**

- `q`: Case-insensitive search in title, description, tags
- `topic`: Matches against `topic` field
- `organization`: Matches against `organization.slug`
- `format`: Filters datasets with resources matching format
- `page`/`pageSize`: Slice the filtered array
- `sort`: Handle `-last_update` (default) and `title`

**Test file:** `src/lib/__tests__/demo-datasets.test.ts`

**Test cases:**

1. `getDemoDatasets()` returns 10 datasets
2. `toBrowseDataset()` produces valid BrowseDataset
3. `loadDemoDatasetList({ q: 'zdravlje' })` filters correctly
4. `loadDemoDatasetList({ page: 1, pageSize: 5 })` paginates correctly
5. `loadDemoDataset('demo-demographics')` returns correct dataset
6. `loadDemoDataset('nonexistent')` returns null

**Important implementation notes:**

1. **Status transition (connecting → connected):** When a query succeeds after being in 'connecting' state, call `setStatus('connected')` in a useEffect that watches `query.isSuccess`.

2. **Error handling:** Use `useEffect` to watch `query.isError` instead of the deprecated `onError` callback. This is the modern React Query pattern.

3. **onAccept handler:** The `ErrorFallbackBanner` needs an `onAccept` callback that:
   - Sets `dismissed: true` in local state to hide the banner
   - Does NOT switch source (user accepts demo mode)
   - Optionally clears the error state

**Commit:** `feat(lib): add demo dataset loader with filtering`

---

### Task 1.3: Update useDatasetList Hook

**File:** `src/hooks/useDataset.ts` (MODIFY)

**Changes:**

1. Import and use `useDataSource()` context
2. Add fallback logic when API fails
3. Support demo source
4. Use consistent cache key pattern

**New implementation:**

```typescript
export function useDatasetList(params: BrowseSearchParams) {
  const { source, setFallback, clearError, incrementRetry, retryCount } =
    useDataSource();

  return useQuery({
    queryKey: ['data-gov', 'datasets', source, params],
    queryFn: async ({ signal }) => {
      if (source === 'demo') {
        return loadDemoDatasetList(params);
      }

      try {
        const result = await dataGovService.getDatasetList(params, signal);
        clearError();
        return result;
      } catch (error) {
        incrementRetry();
        throw error;
      }
    },
    enabled: source === 'official' || source === 'demo',
    retry: source === 'official' ? 1 : false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    staleTime: ONE_HOUR,
  });

  // Handle errors with useEffect (modern pattern, not deprecated onError)
  useEffect(() => {
    if (query.isError && source === 'official' && retryCount >= 1) {
      setFallback();
    }
  }, [query.isError, source, retryCount, setFallback]);

  // Update status on success
  useEffect(() => {
    if (query.isSuccess && status === 'connecting') {
      setStatus('connected');
    }
  }, [query.isSuccess, status, setStatus]);

  return query;
}
```

**Also update `useDataset` for single dataset:**

```typescript
export function useDataset(datasetId: string | null) {
  const { source } = useDataSource();

  return useQuery({
    queryKey: ['data-gov', 'dataset', source, datasetId],
    queryFn: async ({ signal }) => {
      if (!datasetId) throw new Error('Dataset id is required.');

      if (source === 'demo') {
        const dataset = loadDemoDataset(datasetId);
        if (!dataset) throw new Error(`Demo dataset not found: ${datasetId}`);
        return dataset;
      }

      return dataGovService.getDataset(datasetId, signal);
    },
    enabled: Boolean(datasetId),
    staleTime: ONE_HOUR,
  });
}
```

**Test file:** `src/hooks/__tests__/useDataset.test.ts` (UPDATE)

**Test cases:**

1. When source is 'demo', loads from demo datasets
2. When source is 'official' and fails twice, triggers fallback
3. Cache key includes source

**Commit:** `feat(hooks): integrate DataSourceContext into useDataset hooks`

---

## Phase 2: UI Components

### Task 2.1: Build CatalogStatusBar

**File:** `src/components/data/CatalogStatusBar.tsx` (NEW)

**What to build:**
A compact status bar showing current data source, connection status, and last update time.

**Props:**

```typescript
interface CatalogStatusBarProps {
  locale: Locale;
  compact?: boolean;
}
```

**UI structure:**

```tsx
<div className='flex items-center gap-4 rounded-xl bg-slate-100 px-4 py-2 text-sm'>
  {/* Source indicator */}
  <div className='flex items-center gap-2'>
    <Globe className='h-4 w-4' />
    <span>
      {labels.source}: {sourceLabel}
    </span>
  </div>

  {/* Status indicator */}
  <div className='flex items-center gap-2'>
    <span className={statusColorClass}>{statusIcon}</span>
    <span>{statusText}</span>
  </div>

  {/* Last update */}
  <div className='flex items-center gap-2 text-slate-500'>
    <Clock className='h-4 w-4' />
    <span>
      {labels.lastUpdate}: {formattedTime}
    </span>
  </div>
</div>
```

**Status colors:**

- connected: `text-emerald-600`, green dot
- connecting: `text-amber-600`, animated pulse
- fallback: `text-amber-600`, amber dot
- error: `text-red-600`, red dot

**Accessibility:**

- Use `aria-live="polite"` on status text
- Include visually hidden status for screen readers

**Test file:** `src/components/data/__tests__/CatalogStatusBar.test.tsx`

**Test cases:**

1. Shows "Official catalog" when source is official
2. Shows "Demo datasets" when source is demo
3. Shows correct status color for each status
4. Announces status changes to screen readers

**Commit:** `feat(components): add CatalogStatusBar component`

---

### Task 2.2: Build DataSourceSwitcher

**File:** `src/components/data/DataSourceSwitcher.tsx` (NEW)

**What to build:**
Radio button group to switch between official and demo data sources.

**Props:**

```typescript
interface DataSourceSwitcherProps {
  locale: Locale;
}
```

**UI structure:**

```tsx
<div className='rounded-xl border border-slate-200 bg-white p-4'>
  <p className='mb-3 text-sm font-medium text-slate-700'>
    {labels.sourceLabel}:
  </p>
  <div className='space-y-2'>
    <label className='flex items-center gap-3 cursor-pointer'>
      <input
        type='radio'
        name='dataSource'
        value='official'
        checked={source === 'official'}
        onChange={() => switchSource('official')}
        className='h-4 w-4 text-gov-primary'
      />
      <span>{labels.official} (data.gov.rs)</span>
    </label>
    <label className='flex items-center gap-3 cursor-pointer'>
      <input
        type='radio'
        name='dataSource'
        value='demo'
        checked={source === 'demo'}
        onChange={() => switchSource('demo')}
        className='h-4 w-4 text-gov-primary'
      />
      <span>{labels.demo}</span>
    </label>
  </div>
</div>
```

**Behavior:**

- Switching clears current dataset selection (handled by parent via URL params)
- Show loading state briefly when switching

**Accessibility:**

- Proper label association
- Focus visible on radio buttons
- Keyboard navigable

**Test file:** `src/components/data/__tests__/DataSourceSwitcher.test.tsx`

**Test cases:**

1. Renders both options
2. Calls `switchSource` when clicked
3. Shows correct selected state

**Commit:** `feat(components): add DataSourceSwitcher component`

---

### Task 2.3: Build ErrorFallbackBanner

**File:** `src/components/data/ErrorFallbackBanner.tsx` (NEW)

**What to build:**
Banner that explains fallback situation and provides retry/accept actions.

**Props:**

```typescript
interface ErrorFallbackBannerProps {
  locale: Locale;
  error: Error | null;
  onRetry: () => void;
  onAccept: () => void;
}
```

**UI structure:**

```tsx
<div
  role='alert'
  className='rounded-xl border border-amber-200 bg-amber-50 p-4'
>
  <div className='flex items-start gap-3'>
    <AlertTriangle className='h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5' />
    <div className='flex-1'>
      <h3 className='font-semibold text-amber-900'>
        {labels.fallbackBanner.title}
      </h3>
      <p className='mt-1 text-sm text-amber-800'>
        {labels.fallbackBanner.description}
      </p>
      <div className='mt-3 flex gap-3'>
        <button
          onClick={onRetry}
          className='inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700'
        >
          <RefreshCw className='h-4 w-4' />
          {labels.fallbackBanner.retry}
        </button>
        <button
          onClick={onAccept}
          className='inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100'
        >
          <Check className='h-4 w-4' />
          {labels.fallbackBanner.accept}
        </button>
      </div>
    </div>
  </div>
</div>
```

**Behavior:**

- `onRetry`: Calls `retry()` from context, attempts official again
- `onAccept`: Dismisses banner, user continues with demo

**Accessibility:**

- `role="alert"` for screen reader announcement
- Focus management: focus retry button on appear

**Test file:** `src/components/data/__tests__/ErrorFallbackBanner.test.tsx`

**Test cases:**

1. Renders with correct labels
2. Calls onRetry when retry button clicked
3. Calls onAccept when accept button clicked
4. Has proper alert role

**Commit:** `feat(components): add ErrorFallbackBanner component`

---

### Task 2.4: Update EmptyState Component

**File:** `src/components/browse/EmptyState.tsx` (MODIFY)

**Changes:**

1. Add `variant` prop for different states
2. Add optional `actions` prop for action buttons

**New interface:**

```typescript
interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface EmptyStateProps {
  title: string;
  description: string;
  variant?: 'empty' | 'error' | 'offline';
  actions?: EmptyStateAction[];
  icon?: React.ReactNode;
}
```

**UI updates:**

- `empty`: Neutral styling (current default)
- `error`: Red/danger styling with error icon
- `offline`: Amber/warning styling with offline icon

**Actions rendering:**

```tsx
{
  actions && actions.length > 0 && (
    <div className='mt-4 flex justify-center gap-3'>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium',
            action.variant === 'primary'
              ? 'bg-gov-primary text-white hover:bg-gov-primary/90'
              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
          )}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
```

**Test file:** Update `src/components/browse/__tests__/EmptyState.test.tsx`

**Test cases:**

1. Renders actions when provided
2. Applies variant-specific styling
3. Calls action onClick handlers

**Commit:** `feat(components): enhance EmptyState with variants and actions`

---

## Phase 3: Integration

### Task 3.1: Add Localization Strings

**Files to modify:**

- `src/lib/i18n/locales/sr/common.json`
- `src/lib/i18n/locales/lat/common.json` (or sr-Latn)
- `src/lib/i18n/locales/en/common.json`

**Add to each file:**

```json
{
  "dataSource": {
    "official": "...",
    "demo": "...",
    "switchSource": "...",
    "sourceLabel": "...",
    "status": {
      "connected": "...",
      "connecting": "...",
      "fallback": "...",
      "error": "..."
    },
    "fallbackBanner": {
      "title": "...",
      "description": "...",
      "retry": "...",
      "accept": "..."
    },
    "lastUpdate": "..."
  }
}
```

**Refer to spec for exact translations in all three locales.**

**Commit:** `feat(i18n): add dataSource localization strings`

---

### Task 3.2: Integrate Components into DataGovBrowser

**File:** `src/components/data/DataGovBrowser.tsx` (MODIFY)

**Changes:**

1. Import and use `DataSourceProvider` at top level
2. Add `CatalogStatusBar` at top of component
3. Add `DataSourceSwitcher` in sidebar or header area
4. Show `ErrorFallbackBanner` when status === 'fallback'
5. Update hero stats to show source indicator

**Updated structure:**

```tsx
export function DataGovBrowser({ locale }: DataGovBrowserProps) {
  return (
    <DataSourceProvider>
      <DataGovBrowserContent locale={locale} />
    </DataSourceProvider>
  );
}

function DataGovBrowserContent({ locale }: DataGovBrowserProps) {
  const { status, retry } = useDataSource();

  return (
    <div className='space-y-6'>
      {/* Status bar */}
      <CatalogStatusBar locale={locale} />

      {/* Fallback banner (conditional) */}
      {status === 'fallback' && (
        <ErrorFallbackBanner
          locale={locale}
          error={null}
          onRetry={retry}
          onAccept={() => {
            /* dismiss */
          }}
        />
      )}

      {/* Hero section */}
      <section>
        {/* ... existing hero ... */}
        <DataSourceSwitcher locale={locale} />
      </section>

      {/* Three panel layout */}
      <div className='grid ...'>{/* ... existing layout ... */}</div>
    </div>
  );
}
```

**Update hero stats:**

- Add source indicator next to dataset count
- When demo, show "(демо)" label

**Commit:** `feat(data): integrate DataSourceContext into DataGovBrowser`

---

### Task 3.3: Add localStorage Persistence

**File:** `src/contexts/DataSourceContext.tsx` (MODIFY)

**Changes:**

1. On initial mount, read `vas-preferred-source` from localStorage
2. On source change, write to localStorage
3. Handle SSR safely (check typeof window)

**Implementation:**

```typescript
const STORAGE_KEY = 'vas-preferred-source';

function getInitialSource(): DataSourceType {
  if (typeof window === 'undefined') return 'official';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'official' || stored === 'demo') return stored;
  return 'official';
}

// In switchSource:
localStorage.setItem(STORAGE_KEY, source);
```

**Commit:** `feat(context): add localStorage persistence for data source`

---

## Phase 4: Polish & Testing

### Task 4.1: Add Accessibility Features

**Files to modify:**

- `src/components/data/CatalogStatusBar.tsx`
- `src/components/data/DataSourceSwitcher.tsx`
- `src/components/data/ErrorFallbackBanner.tsx`

**Requirements:**

1. All interactive elements keyboard navigable
2. Status changes announced via aria-live
3. Focus management on source switch
4. Reduced motion support

**Specific changes:**

- Add `aria-live="polite"` to status text in CatalogStatusBar
- Add `aria-label` to radio buttons in DataSourceSwitcher
- Add `role="alert"` to ErrorFallbackBanner
- Add `prefers-reduced-motion` media query for any animations

**Commit:** `feat(a11y): add accessibility features to data source components`

---

### Task 4.2: Write Integration Tests

**File:** `src/components/data/__tests__/DataGovBrowser.integration.test.tsx` (NEW)

**Test cases:**

1. Full fallback flow: API fails → fallback triggered → demo loads
2. Manual source switch clears state correctly
3. Retry after fallback works
4. Status bar reflects current state

**Test setup:**

```typescript
// Mock dataGovService to fail
jest.mock('@/lib/data-gov-api', () => ({
  dataGovService: {
    getDatasetList: jest.fn().mockRejectedValue(new Error('API Error')),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as unknown as Storage;
```

**Commit:** `test(data): add integration tests for fallback flow`

---

### Task 4.3: Add E2E Tests with Playwright

**File:** `tests/e2e/data-catalog.spec.ts` (NEW)

**Test scenarios:**

1. **Offline mode shows fallback**
   - Block network requests to data.gov.rs
   - Navigate to /sr-Cyrl/data
   - Verify fallback banner appears
   - Verify demo datasets load

2. **Slow network shows connecting state**
   - Throttle network to 3G speeds
   - Navigate to /sr-Cyrl/data
   - Verify status bar shows "connecting" initially

3. **Manual source switch**
   - Navigate to /sr-Cyrl/data
   - Click on "Demo datasets" radio
   - Verify URL params cleared
   - Verify demo datasets load

4. **Retry after fallback**
   - Trigger fallback
   - Click "Retry" button
   - Verify attempt to reconnect to official

**Playwright setup:**

```typescript
// tests/e2e/data-catalog.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Data Catalog Resilience', () => {
  test('shows fallback banner when API unavailable', async ({ page }) => {
    // Block API requests
    await page.route('**/data.gov.rs/**', (route) => route.abort());

    await page.goto('/sr-Cyrl/data');

    // Wait for fallback to trigger
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(
      page.getByText('Званични каталог није доступан')
    ).toBeVisible();
  });

  test('can manually switch to demo datasets', async ({ page }) => {
    await page.goto('/sr-Cyrl/data');

    // Click demo radio
    await page.getByLabel('Демо скупови').click();

    // Verify status shows demo
    await expect(page.getByText('Демо скупови')).toBeVisible();
  });
});
```

**Commit:** `test(e2e): add Playwright tests for data catalog resilience`

---

### Task 4.3: Manual QA Checklist

Run through these scenarios manually:

1. **Normal flow (official source works):**
   - [ ] Page loads with official source
   - [ ] Status shows "Connected"
   - [ ] Datasets load from API
   - [ ] Preview works

2. **Fallback flow (API fails):**
   - [ ] After 2 failures, switches to demo
   - [ ] Banner appears explaining fallback
   - [ ] Demo datasets load
   - [ ] "Retry" button works

3. **Manual switch:**
   - [ ] Can switch to demo manually
   - [ ] Can switch back to official
   - [ ] State persists on refresh

4. **Localization:**
   - [ ] All text in correct language
   - [ ] Works in sr-Cyrl, sr-Latn, en

5. **Accessibility:**
   - [ ] Tab navigation works
   - [ ] Screen reader announces status changes

**Commit:** `docs: add QA checklist to plan`

---

## File Summary

| Action | File                                                         | Description                   |
| ------ | ------------------------------------------------------------ | ----------------------------- |
| NEW    | `src/contexts/DataSourceContext.tsx`                         | Context for source management |
| NEW    | `src/lib/demo-datasets.ts`                                   | Demo dataset loader           |
| NEW    | `src/components/data/CatalogStatusBar.tsx`                   | Status bar component          |
| NEW    | `src/components/data/DataSourceSwitcher.tsx`                 | Source switcher component     |
| NEW    | `src/components/data/ErrorFallbackBanner.tsx`                | Fallback banner component     |
| MODIFY | `src/hooks/useDataset.ts`                                    | Integrate context             |
| MODIFY | `src/components/data/DataGovBrowser.tsx`                     | Add new components            |
| MODIFY | `src/components/browse/EmptyState.tsx`                       | Add variants and actions      |
| MODIFY | `src/lib/i18n/locales/sr/common.json`                        | Add sr-Cyrl strings           |
| MODIFY | `src/lib/i18n/locales/lat/common.json`                       | Add sr-Latn strings           |
| MODIFY | `src/lib/i18n/locales/en/common.json`                        | Add en strings                |
| NEW    | `src/contexts/__tests__/DataSourceContext.test.tsx`          | Context tests                 |
| NEW    | `src/lib/__tests__/demo-datasets.test.ts`                    | Demo loader tests             |
| NEW    | `src/components/data/__tests__/CatalogStatusBar.test.tsx`    | Status bar tests              |
| NEW    | `src/components/data/__tests__/DataSourceSwitcher.test.tsx`  | Switcher tests                |
| NEW    | `src/components/data/__tests__/ErrorFallbackBanner.test.tsx` | Banner tests                  |

## Success Criteria

- [ ] Page shows clear status at all times
- [ ] Fallback activates within 5 seconds of API failure
- [ ] Users can manually switch sources
- [ ] Demo datasets render identically to API datasets
- [ ] All text localized in 3 languages
- [ ] Works offline (demo mode)
- [ ] No console errors in any state
- [ ] All tests pass
