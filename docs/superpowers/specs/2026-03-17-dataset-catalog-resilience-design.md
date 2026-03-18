---
name: Dataset Catalog Resilience
description: Transform broken dataset catalog into world-class public data explorer with fallback, status visibility, and source switching
type: project
---

# Dataset Catalog Resilience Design

**Date:** 2026-03-17
**Status:** Draft
**Scope:** `/data` page - dataset catalog explorer

## Problem Statement

The current dataset catalog page fails when the external data.gov.rs API is unavailable, producing:

- HTTP 400 errors with no recovery path
- Dead-end empty states with no actions
- No visibility into data source status
- No fallback option for users

## Goals

1. **Resilience**: Page remains functional even when external API fails
2. **Transparency**: Users always know data source and connection status
3. **Actionability**: Every state has clear next steps
4. **Consistency**: Same UI works for official and demo data sources

## Non-Goals

- File upload feature (deferred to future iteration)
- Full demo gallery exposure (curated subset only)
- Backend caching proxy (client-side solution only)

## Architecture

### Component Hierarchy

```
DataPage
└── DataSourceProvider (context)
    ├── CatalogStatusBar
    ├── DataSourceSwitcher
    ├── ErrorFallbackBanner (conditional)
    ├── HeroSection (search + stats + presets)
    └── ThreePanelLayout
        ├── FilterSidebar
        ├── DatasetCardList
        └── PreviewPanel (sticky)
```

### Data Flow

```
User Action
    │
    ▼
DataSourceContext
    │
    ├── source: 'official' | 'demo'
    ├── status: 'connected' | 'connecting' | 'fallback' | 'error'
    └── retry()
    │
    ▼
useUnifiedDatasetList(params)
    │
    ├── if source === 'demo' → loadDemoDatasets()
    └── if source === 'official' → fetchAPI() with retry logic
            │
            ├── success → return data
            └── fail × 2 → setFallback() + loadDemoDatasets()
    │
    ▼
DatasetCardList (renders same way regardless of source)
```

## New Components

### 1. DataSourceContext

**File:** `src/contexts/DataSourceContext.tsx`

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

**Behavior:**

- Persists selected source to localStorage
- Tracks retry count per session
- Auto-expires fallback after 5 minutes (prompts retry)

### 2. CatalogStatusBar

**File:** `src/components/data/CatalogStatusBar.tsx`

**Purpose:** Always-visible indicator of data source and connection health.

**Visual Design:**

```
┌─────────────────────────────────────────────────────────────┐
│ 🌐 Извор: data.gov.rs (званични)  ● Повезан  🕒 17.03 14:32 │
└─────────────────────────────────────────────────────────────┘
```

**Status Indicators:**
| Status | Color | Text (sr-Cyrl) |
|--------|-------|----------------|
| connected | green (#10B981) | Повезан |
| connecting | yellow (#F59E0B) | Повезивање... |
| fallback | yellow (#F59E0B) | Резервни режим |
| error | red (#EF4444) | Недоступан |

**Props:**

```typescript
interface CatalogStatusBarProps {
  locale: Locale;
  compact?: boolean; // For mobile view
}
```

### 3. DataSourceSwitcher

**File:** `src/components/data/DataSourceSwitcher.tsx`

**Purpose:** Allow manual switching between data sources.

**Visual Design:**

```
┌─────────────────────────────────────────────────────────────┐
│ Извор података:                                              │
│ ● Званични каталог (data.gov.rs)                            │
│ ○ Демо скупови                                               │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**

- Radio button group
- Switching clears current dataset selection
- Shows confirmation if data is unsaved (future: chart in progress)

**Props:**

```typescript
interface DataSourceSwitcherProps {
  locale: Locale;
}
```

### 4. ErrorFallbackBanner

**File:** `src/components/data/ErrorFallbackBanner.tsx`

**Purpose:** Explain fallback situation and provide actions.

**Visual Design:**

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️  Званични каталог није доступан                          │
│                                                              │
│ Нисмо успели да учитамо податке са data.gov.rs након 2     │
│ покушаја. Аутоматски смо прешли на демо скупове.           │
│                                                              │
│ [🔄 Покушај поново са званичним]  [✓ Настави са демо]      │
└─────────────────────────────────────────────────────────────┘
```

**Props:**

```typescript
interface ErrorFallbackBannerProps {
  locale: Locale;
  error: Error;
  onRetry: () => void;
  onAccept: () => void;
}
```

### 5. Curated Demo Datasets

**File:** `src/lib/demo-datasets.ts`

**Purpose:** Provide BrowseDataset-compatible demo data.

**Data File Location:** `src/data/demo-catalog/` (new directory)

Each demo dataset is a JSON file with embedded data. The loader reads these files
and normalizes them to `BrowseDataset` format for UI compatibility.

**Structure:**

```typescript
// Matches BrowseResource from src/types/browse.ts
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
  topic: string; // Maps to first tag in BrowseDataset
  tags: string[];
  resources: DemoResource[];
  last_modified: string;
  page?: string; // Optional link to source
  data: Record<string, unknown>[]; // Embedded data for preview
}

// Load and filter demo datasets
function loadDemoDatasetList(
  params: BrowseSearchParams
): BrowsePageResponse<BrowseDataset>;

// Get single demo dataset by ID
function loadDemoDataset(id: string): BrowseDataset | null;

// Normalize to BrowseDataset for UI compatibility
function toBrowseDataset(demo: DemoDataset): BrowseDataset;
```

**Filtering Behavior:**

- `q`: Case-insensitive search in title, description, tags
- `topic`: Matches against `topic` field (maps to tags in BrowseDataset)
- `organization`: Matches against `organization.slug`
- `format`: Filters datasets that have resources with matching format
- `page`/`pageSize`: Standard pagination (all demo datasets fit in memory)
- `sort`: Supports `-last_update` (default), `title`

**Curated Selection (10 datasets):**

Demo data files are stored in `src/data/demo-catalog/`. Source files are copied
from existing `src/data/demo-gallery/` and wrapped with metadata.

| ID                  | Source File                                                  | Title (sr-Cyrl)     | Topic           |
| ------------------- | ------------------------------------------------------------ | ------------------- | --------------- |
| `demo-demographics` | `src/data/demo-gallery/demographics/`                        | Демографија Србије  | Демографија     |
| `demo-gdp`          | `src/data/demo-gallery/economy/gdp-growth.json`              | Раст БДП            | Економија       |
| `demo-inflation`    | `src/data/demo-gallery/economy/inflation.json`               | Инфлација           | Економија       |
| `demo-cancer`       | `src/data/demo-gallery/healthcare/cancer-incidence.json`     | Инциденца рака      | Здравље         |
| `demo-air-quality`  | `src/data/demo-gallery/environment/air-quality-by-city.json` | Квалитет ваздуха    | Животна средина |
| `demo-education`    | `src/data/demo-gallery/education/enrollment-by-level.json`   | Упис у школе        | Образовање      |
| `demo-budget`       | `src/data/demo-gallery/public-finance/budget-execution.json` | Извршење буџета     | Финансије       |
| `demo-emigration`   | `src/data/demo-gallery/migration/emigration-trends.json`     | Исељавање           | Миграције       |
| `demo-transport`    | `src/data/serbian-road-accidents.json`                       | Саобраћајне незгоде | Саобраћај       |
| `demo-vital`        | `src/data/demo-gallery/society/vital-statistics.json`        | Витална статистика  | Друштво         |

## Modified Components

### useDatasetList Hook

**File:** `src/hooks/useDataset.ts`

**Changes:**

1. Integrate with DataSourceContext
2. Trigger fallback after 2 failures (original request + 1 retry)
3. Support demo dataset loading
4. Use consistent cache key pattern

**Retry Logic Clarification:**

The retry logic works as follows:

- React Query handles automatic retries (configured for 1 retry with exponential backoff)
- If the retry also fails, the `onError` callback triggers fallback
- The context tracks retry state for UI feedback

```typescript
function useDatasetList(params: BrowseSearchParams) {
  const {
    source,
    status,
    setFallback,
    clearError,
    incrementRetry,
    retryCount,
  } = useDataSource();

  return useQuery({
    queryKey: ['data-gov', 'datasets', source, params],
    queryFn: async ({ signal }) => {
      if (source === 'demo') {
        return loadDemoDatasetList(params);
      }

      const result = await dataGovService.getDatasetList(params, signal);
      clearError();
      return result;
    },
    enabled: source === 'official' || source === 'demo',
    retry: source === 'official' ? 1 : false, // 1 retry = 2 total attempts
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    onError: (error) => {
      if (source === 'official') {
        incrementRetry();
        if (retryCount >= 1) {
          // After 2 failures, trigger fallback
          setFallback();
        }
      }
    },
  });
}
```

### useDataset Hook (Single Dataset)

**File:** `src/hooks/useDataset.ts`

**Changes:**

Same fallback pattern for single dataset lookups:

```typescript
function useDataset(datasetId: string | null) {
  const { source } = useDataSource();

  return useQuery({
    queryKey: ['data-gov', 'dataset', source, datasetId],
    queryFn: ({ signal }) => {
      if (!datasetId) {
        throw new Error('Dataset id is required.');
      }

      if (source === 'demo') {
        const dataset = loadDemoDataset(datasetId);
        if (!dataset) {
          throw new Error(`Demo dataset not found: ${datasetId}`);
        }
        return dataset;
      }

      return dataGovService.getDataset(datasetId, signal);
    },
    enabled: Boolean(datasetId),
    staleTime: ONE_HOUR,
  });
}
```

### DataGovBrowser Component

**File:** `src/components/data/DataGovBrowser.tsx`

**Changes:**

1. Wrap in DataSourceProvider
2. Add CatalogStatusBar at top
3. Add DataSourceSwitcher below status bar
4. Show ErrorFallbackBanner when status === 'fallback'
5. Update hero stats to show source indicator

### EmptyState Component

**File:** `src/components/browse/EmptyState.tsx`

**Changes:**

1. Add action buttons for error states
2. Differentiate between "no results" and "error" states

```typescript
interface EmptyStateProps {
  title: string;
  description: string;
  variant?: 'empty' | 'error' | 'offline';
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}
```

## Localization

All new strings added to locale files:

**sr-Cyrl:**

```json
{
  "dataSource": {
    "official": "Званични каталог",
    "demo": "Демо скупови",
    "switchSource": "Промени извор",
    "sourceLabel": "Извор података",
    "status": {
      "connected": "Повезан",
      "connecting": "Повезивање...",
      "fallback": "Резервни режим",
      "error": "Недоступан"
    },
    "fallbackBanner": {
      "title": "Званични каталог није доступан",
      "description": "Нисмо успели да учитамо податке са data.gov.rs након 2 покушаја. Аутоматски смо прешли на демо скупове.",
      "retry": "Покушај поново са званичним",
      "accept": "Настави са демо"
    },
    "lastUpdate": "Последње ажурирање"
  }
}
```

**sr-Latn:**

```json
{
  "dataSource": {
    "official": "Zvanični katalog",
    "demo": "Demo skupovi",
    "switchSource": "Promeni izvor",
    "sourceLabel": "Izvor podataka",
    "status": {
      "connected": "Povezan",
      "connecting": "Povezivanje...",
      "fallback": "Rezervni režim",
      "error": "Nedostupan"
    },
    "fallbackBanner": {
      "title": "Zvanični katalog nije dostupan",
      "description": "Nismo uspeli da učitamo podatke sa data.gov.rs nakon 2 pokušaja. Automatski smo prešli na demo skupove.",
      "retry": "Pokušaj ponovo sa zvaničnim",
      "accept": "Nastavi sa demo"
    },
    "lastUpdate": "Poslednje ažuriranje"
  }
}
```

**en:**

```json
{
  "dataSource": {
    "official": "Official catalog",
    "demo": "Demo datasets",
    "switchSource": "Switch source",
    "sourceLabel": "Data source",
    "status": {
      "connected": "Connected",
      "connecting": "Connecting...",
      "fallback": "Fallback mode",
      "error": "Unavailable"
    },
    "fallbackBanner": {
      "title": "Official catalog unavailable",
      "description": "We couldn't load data from data.gov.rs after 2 attempts. Automatically switched to demo datasets.",
      "retry": "Retry official catalog",
      "accept": "Continue with demo"
    },
    "lastUpdate": "Last updated"
  }
}
```

## Error Handling

### Error Types

| Error    | Detection                         | Response                             |
| -------- | --------------------------------- | ------------------------------------ |
| HTTP 4xx | `response.status >= 400 && < 500` | Immediate fallback (server rejected) |
| HTTP 5xx | `response.status >= 500`          | Retry × 2, then fallback             |
| Network  | `fetch` throws                    | Retry × 2, then fallback             |
| Timeout  | AbortController after 10s         | Retry × 2, then fallback             |
| CORS     | `TypeError: Failed to fetch`      | Immediate fallback                   |

### Retry Strategy

```typescript
const RETRY_CONFIG = {
  maxRetries: 2,
  baseDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
  timeout: 10000, // 10 seconds per request
};

function getRetryDelay(attemptIndex: number): number {
  return Math.min(
    RETRY_CONFIG.baseDelay * 2 ** attemptIndex,
    RETRY_CONFIG.maxDelay
  );
}
```

## Browser Storage

### localStorage Keys

| Key                           | Type                   | Purpose                                |
| ----------------------------- | ---------------------- | -------------------------------------- |
| `vas-preferred-source`        | `'official' \| 'demo'` | Remember user's source preference      |
| `vas-catalog-cache`           | JSON                   | Cache last successful catalog response |
| `vas-catalog-cache-timestamp` | number                 | Cache timestamp for TTL                |

### Cache TTL

- Official catalog: 1 hour
- Demo datasets: No expiry (bundled with app)
- Error state: 5 minutes before auto-retry prompt

## Accessibility

- All interactive elements keyboard-navigable
- Status changes announced via aria-live regions
- Color not sole indicator (icons + text)
- Focus management on source switch
- Reduced motion support for status animations

## Testing Strategy

### Unit Tests

1. `DataSourceContext` state transitions
2. `useDatasetList` fallback logic
3. `loadDemoDatasetList` filtering/pagination
4. Retry delay calculation

### Integration Tests

1. Full fallback flow: API fails → fallback triggered → demo loads
2. Manual source switch clears state correctly
3. Retry after fallback works

### E2E Tests

1. Offline mode shows fallback
2. Slow network shows connecting state
3. Status bar reflects current state

## Implementation Order

1. **Phase 1: Foundation**
   - Create `DataSourceContext`
   - Add demo dataset loader
   - Update `useDatasetList` hook

2. **Phase 2: UI Components**
   - Build `CatalogStatusBar`
   - Build `DataSourceSwitcher`
   - Build `ErrorFallbackBanner`
   - Update `EmptyState`

3. **Phase 3: Integration**
   - Wrap `DataGovBrowser` with provider
   - Add localization strings
   - Add localStorage persistence

4. **Phase 4: Polish**
   - Add animations/transitions
   - Add accessibility features
   - Add tests

## Success Criteria

- [ ] Page shows clear status at all times
- [ ] Fallback activates within 5 seconds of API failure
- [ ] Users can manually switch sources
- [ ] Demo datasets render identically to API datasets
- [ ] All text localized in 3 languages
- [ ] Works offline (demo mode)
- [ ] No console errors in any state
