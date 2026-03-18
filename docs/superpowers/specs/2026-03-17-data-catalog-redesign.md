# Data Catalog Redesign — "Insight Explorer"

**Date**: 2026-03-17
**Status**: Approved for Implementation
**Scope**: Complete redesign of `/[locale]/data` page

## Overview

Transform the Data Catalog from a dataset-centric technical interface into a citizen-first insight explorer optimized for non-technical users. The goal is to enable first-time users to find relevant data in under 30 seconds and understand what the dataset offers immediately.

### Target Users

- **Primary**: Serbian citizens accessing government data for personal/professional use
- **Secondary**: Journalists and researchers analyzing administrative data trends
- **Tertiary**: Government officials presenting or exploring data insights

### Key Design Decisions

1. **Complete redesign** — Replace `DataGovBrowser` entirely (not incremental enhancement)
2. **Keyword extraction search** — Parse natural language into filter params (no AI dependency)
3. **Curated insights** — Hand-picked high-value datasets with pre-configured visualizations

---

## Page Architecture

**URL**: `/[locale]/data`

**Layout** — Three vertical zones:

```
┌─────────────────────────────────────────────────────────────┐
│  ZONE 1: HERO EXPLORER                                       │
│  Natural language search + Topic shortcuts + Popular cards   │
├─────────────────────────────────────────────────────────────┤
│  ZONE 2: SPLIT EXPLORER                                      │
│  [Life Topic Nav] [Dataset List] [Live Preview Panel]        │
├─────────────────────────────────────────────────────────────┤
│  ZONE 3: TRUST FOOTER                                        │
│  Source attribution, methodology, licensing info             │
└─────────────────────────────────────────────────────────────┘
```

---

## URL Routing

**Localized Pathnames** (add to `src/lib/i18n/config.ts`):

```typescript
const DATA_PAGE_PATHS = {
  'sr-Cyrl': '/podaci',
  'sr-Latn': '/podaci',
  en: '/data',
};
```

The page will be accessible at:

- `/sr-Cyrl/podaci`
- `/sr-Latn/podaci`
- `/en/data`

---

## Type Definitions

**File**: `src/types/insight-explorer.ts`

```typescript
import type { Locale } from '@/lib/i18n/config';
import type {
  BrowseSearchParams,
  BrowseDataset,
  BrowseResource,
} from '@/types/browse';
import type { ChartConfig } from '@/types/chart-config';

// ============================================
// Core Types
// ============================================

type LocalizedString = Record<Locale, string>;

// ============================================
// Search & Suggestions
// ============================================

interface SearchSuggestion {
  id: string;
  query: string; // The search query to execute
  label: LocalizedString; // Display text in each locale
  icon?: string; // Optional emoji or icon name
}

// ============================================
// Topics & Navigation
// ============================================

interface LifeTopic {
  id: string;
  icon: string;
  label: LocalizedString;
  description: LocalizedString;
  datasetCount: number;
  dataGovTopics: string[]; // Maps to data.gov.rs topic slugs
}

interface LocationFilter {
  id: string;
  label: LocalizedString;
  type: 'region' | 'city' | 'municipality';
}

interface InsightTypeFilter {
  id: 'trend' | 'comparison' | 'map';
  label: LocalizedString;
  description: LocalizedString;
}

// ============================================
// Popular Insights
// ============================================

type ChartType = 'line' | 'bar' | 'map' | 'pie';
type FreshnessLevel = 'today' | 'this-week' | 'this-month' | 'this-year';
type BadgeType = 'new' | 'trending' | 'featured';

interface PopularInsight {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  chartType: ChartType;
  chartPreviewData?: Record<string, unknown>[]; // Optional mini preview data
  searchParams: Partial<BrowseSearchParams>;
  datasetId: string;
  freshness: FreshnessLevel;
  badge?: {
    type: BadgeType;
    label: LocalizedString;
  };
}

// ============================================
// Dataset Cards
// ============================================

interface InsightBullets {
  datasetId: string;
  bullets: LocalizedString[]; // Array of "what you can learn" bullets
}

interface CitizenDatasetCardLabels {
  readyToVisualize: string;
  dataOnly: string;
  whatYouCanLearn: string;
  updated: string;
  rows: string;
  viewVisualization: string;
  visualizationLoaded: string;
  details: string;
  download: string;
}

// ============================================
// Preview Panel
// ============================================

interface GeneratedInsight {
  text: string;
  type: 'observation' | 'trend' | 'comparison' | 'anomaly';
  confidence: 'high' | 'medium' | 'low';
}

interface KeyStatistic {
  value: string | number;
  label: LocalizedString;
  icon: 'rows' | 'cities' | 'year' | 'records' | 'coverage';
}

// ============================================
// Keyword Extraction
// ============================================

interface ExtractionPattern {
  type: 'topic' | 'location' | 'timeRange' | 'metric';
  patterns: LocalizedString[]; // Patterns per locale
  mapsTo: string; // Target filter value
}

interface ExtractedParams {
  q?: string; // Remaining unmatched terms
  topic?: string; // Matched topic ID
  location?: string; // Matched location ID
  year?: string; // Matched year
  metric?: string; // Matched metric type
}

// ============================================
// Hook Interface
// ============================================

interface UseInsightExplorerReturn {
  // State
  searchQuery: string;
  selectedTopic: string | null;
  selectedLocation: string | null;
  selectedYear: string | null;
  selectedInsightType: string | null;
  selectedDataset: BrowseDataset | null;
  selectedResource: BrowseResource | null;

  // Dataset queries
  datasets: BrowseDataset[];
  datasetsLoading: boolean;
  datasetsError: Error | null;
  totalDatasets: number;

  // Preview queries
  previewData: Record<string, unknown>[] | null;
  previewLoading: boolean;
  previewError: Error | null;
  chartConfig: ChartConfig | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedTopic: (topicId: string | null) => void;
  setSelectedLocation: (locationId: string | null) => void;
  setSelectedYear: (year: string | null) => void;
  setSelectedInsightType: (type: string | null) => void;
  selectDataset: (datasetId: string) => void;
  selectResource: (resourceId: string) => void;
  clearFilters: () => void;
}

// ============================================
// Error States
// ============================================

interface ErrorStateProps {
  locale: Locale;
  type: 'no-results' | 'preview-failed' | 'api-unavailable';
  onRetry?: () => void;
  onClearFilters?: () => void;
}
```

---

## Component Specifications

### 1. InsightHero

**File**: `src/components/insight-explorer/InsightHero.tsx`

**Purpose**: Replace dataset-centric entry with question-driven discovery

**Elements**:

- Eyebrow: "Званични каталог data.gov.rs"
- Headline: "Шта желите да сазнате?"
- Large search input with autocomplete
- Search suggestions (clickable chips)
- Topic shortcut buttons

**Search Suggestions** (localized):

| Serbian Cyrillic            | Serbian Latin               | English                    |
| --------------------------- | --------------------------- | -------------------------- |
| Квалитет ваздуха у Београду | Kvalitet vazduha u Beogradu | Air quality in Belgrade    |
| Цене прехрамбених производа | Cene prehrambenih proizvoda | Food prices over time      |
| Популација по општинама     | Populacija po opštinama     | Population by municipality |
| Буџет мог града             | Budžet mog grada            | Budget of my city          |
| Незапосленост тренд         | Nezaposlenost trend         | Unemployment trends        |

**Props**:

```typescript
interface InsightHeroProps {
  locale: Locale;
  onSearch: (query: string) => void;
  onTopicSelect: (topicId: string) => void;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
}

interface SearchSuggestion {
  id: string;
  query: string;
  label: Record<Locale, string>;
  icon?: string;
}
```

---

### 2. TopicShortcuts

**File**: `src/components/insight-explorer/TopicShortcuts.tsx`

**Purpose**: Quick access to life-topic categories

**Categories**:

| ID          | Icon | sr-Cyrl           | sr-Latn           | en                   |
| ----------- | ---- | ----------------- | ----------------- | -------------------- |
| people      | 👥   | Људи и друштво    | Ljudi i društvo   | People & Society     |
| economy     | 💰   | Економија и цене  | Ekonomija i cene  | Economy & Prices     |
| environment | 🌿   | Животна средина   | Životna sredina   | Environment          |
| health      | 🏥   | Здравље           | Zdravlje          | Health               |
| transport   | 🚌   | Саобраћај         | Saobraćaj         | Transport            |
| government  | 🏛️   | Влада и финансије | Vlada i finansije | Government & Finance |
| local       | 🏘️   | Локална заједница | Lokalna zajednica | Local Community      |

---

### 3. PopularInsightsGrid

**File**: `src/components/insight-explorer/PopularInsightsGrid.tsx`

**Purpose**: Surface ready-to-explore visualizations immediately

**Card Elements**:

- Mini chart preview (120px height)
- Title in everyday language
- Subtitle (freshness or category count)
- Primary CTA: "Истражите податке"
- Source attribution

**Initial Curated Insights**:

```typescript
const POPULAR_INSIGHTS: PopularInsight[] = [
  {
    id: 'air-quality',
    title: {
      'sr-Cyrl': 'Квалитет ваздуха данас',
      'sr-Latn': 'Kvalitet vazduha danas',
      en: 'Air quality today',
    },
    subtitle: {
      'sr-Cyrl': 'Ажурирано пре 2 сата',
      'sr-Latn': 'Ažurirano pre 2 sata',
      en: 'Updated 2 hours ago',
    },
    chartType: 'map',
    searchParams: { topic: 'zivotna-sredina', q: 'vazduh' },
    datasetId: 'air-quality-serbia',
    freshness: 'today',
    badge: {
      type: 'trending',
      label: {
        'sr-Cyrl': 'Трендинг',
        'sr-Latn': 'Trending',
        en: 'Trending',
      },
    },
  },
  {
    id: 'food-prices',
    title: {
      'sr-Cyrl': 'Цене прехрамбених производа',
      'sr-Latn': 'Cene prehrambenih proizvoda',
      en: 'Food prices over time',
    },
    subtitle: {
      'sr-Cyrl': '24 категорије производа',
      'sr-Latn': '24 kategorije proizvoda',
      en: '24 product categories',
    },
    chartType: 'line',
    searchParams: { topic: 'ekonomija', q: 'cene hrane' },
    datasetId: 'food-prices-serbia',
    freshness: 'this-week',
  },
  {
    id: 'population-municipalities',
    title: {
      'sr-Cyrl': 'Популација по општинама',
      'sr-Latn': 'Populacija po opštinama',
      en: 'Population by municipality',
    },
    subtitle: {
      'sr-Cyrl': 'Попис 2024',
      'sr-Latn': 'Popis 2024',
      en: '2024 Census',
    },
    chartType: 'map',
    searchParams: { q: 'populacija opstine' },
    datasetId: 'population-municipalities',
    freshness: 'this-year',
  },
  {
    id: 'public-spending',
    title: {
      'sr-Cyrl': 'Јавна потрошња',
      'sr-Latn': 'Javna potrošnja',
      en: 'Public spending',
    },
    subtitle: {
      'sr-Cyrl': 'Буџет 2024',
      'sr-Latn': 'Budžet 2024',
      en: 'Budget 2024',
    },
    chartType: 'bar',
    searchParams: { topic: 'budzet', format: 'csv' },
    datasetId: 'public-spending-2024',
    freshness: 'this-year',
  },
  {
    id: 'traffic-accidents',
    title: {
      'sr-Cyrl': 'Саобраћајне незгоде',
      'sr-Latn': 'Saobraćajne nezgode',
      en: 'Traffic accidents',
    },
    subtitle: {
      'sr-Cyrl': 'Статистика 2024',
      'sr-Latn': 'Statistika 2024',
      en: '2024 Statistics',
    },
    chartType: 'line',
    searchParams: { topic: 'mobilnost', q: 'nezgode' },
    datasetId: 'traffic-accidents-2024',
    freshness: 'this-month',
  },
];
```

---

### 4. LifeTopicNav

**File**: `src/components/insight-explorer/LifeTopicNav.tsx`

**Purpose**: Replace organization-centric filters with human-centric topic browsing

**Filters**:

1. **Life Topics** — 7 categories (see TopicShortcuts)
2. **Location** — Serbian regions (Београд, Војводина, etc.)
3. **Time Range** — Year chips (2024, 2023, 2022, Све)
4. **Insight Type** — Trend / Comparison / Map

**Topic-to-Dataset Mapping**:

```typescript
const TOPIC_TO_DATA_GOV: Record<string, string[]> = {
  people: ['uprava', 'stanovnistvo'],
  economy: ['ekonomija', 'finansije', 'cene'],
  environment: ['zivotna-sredina', 'ekologija'],
  health: ['zdravlje', 'zdravstvo'],
  transport: ['mobilnost', 'saobracaj'],
  government: ['uprava', 'budzet', 'finansije'],
  local: ['lokalna-uprava', 'opstine'],
};
```

---

### 5. CitizenDatasetCard

**File**: `src/components/insight-explorer/CitizenDatasetCard.tsx`

**Purpose**: Communicate VALUE, not metadata

**Card Structure**:

```
┌─────────────────────────────────────────────────┐
│ ✓ Спремно за визуализацију              [📊]   │
│                                                  │
│ Квалитет ваздуха у Србији                        │
│ Дневни подаци о загађењу ваздуха                │
│                                                  │
│ Шта можете сазнати:                              │
│ • Ниво PM2.5 и PM10 честица по градовима        │
│ • Сезонске варијације квалитета ваздуха         │
│ • Упоређење са ЕУ стандардима                    │
│                                                  │
│ 📅 Ажурирано: пре 2 сата  🏛️ Извор  📊 156 редова│
│                                                  │
│ [👁️ Погледајте визуализацију →]                 │
│ [Детаљи]  [Преузми CSV]                          │
└─────────────────────────────────────────────────┘
```

**States**:

- **Ready to visualize** — Green badge, primary CTA highlighted
- **Data only** — Gray badge, secondary CTA
- **Selected** — Blue border, shows "Визуализација учитана"

**Curated Insight Bullets**:

```typescript
const CURATED_BULLETS: Record<string, InsightBullets> = {
  'air-quality-serbia': {
    datasetId: 'air-quality-serbia',
    bullets: {
      'sr-Cyrl': [
        'Ниво PM2.5 и PM10 честица по градовима',
        'Сезонске варијације квалитета ваздуха',
        'Упоређење са ЕУ стандардима',
      ],
      'sr-Latn': [
        'Nivo PM2.5 i PM10 čestica po gradovima',
        'Sezonske varijacije kvaliteta vazduha',
        'Upoređenje sa EU standardima',
      ],
      en: [
        'PM2.5 and PM10 particle levels by city',
        'Seasonal air quality variations',
        'Comparison with EU standards',
      ],
    },
  },
  'population-municipalities': {
    datasetId: 'population-municipalities',
    bullets: {
      'sr-Cyrl': [
        'Број становника по општинама',
        'Демографске промене 2019–2024',
        'Старосна структура становништва',
      ],
      'sr-Latn': [
        'Broj stanovnika po opštinama',
        'Demografske promene 2019–2024',
        'Starosna struktura stanovništva',
      ],
      en: [
        'Population count by municipality',
        'Demographic changes 2019–2024',
        'Age structure of population',
      ],
    },
  },
  // Additional curated datasets added as needed
};
```

---

### 6. LivePreviewPanel

**File**: `src/components/insight-explorer/LivePreviewPanel.tsx`

**Purpose**: Instant visualization with plain-language explanation

**Elements**:

- Interactive chart (reusing `ChartRenderer`)
- Key insights block (auto-generated observations)
- Key statistics (row count, coverage, year)
- Source attribution with link
- Action buttons: Customize / Download / Share

**Key Insights Generation**:

```typescript
interface GeneratedInsight {
  text: string;
  type: 'observation' | 'trend' | 'comparison' | 'anomaly';
  confidence: 'high' | 'medium' | 'low';
}

function generateKeyInsights(
  data: Record<string, unknown>[],
  chartConfig: ChartConfig,
  locale: Locale
): GeneratedInsight[];
```

**Action Buttons**:

| Button    | Action                                     |
| --------- | ------------------------------------------ |
| Прилагоди | Navigate to `/[locale]/create?dataset=...` |
| Преузми   | Download current resource                  |
| Подели    | Open share dialog with URL + embed code    |

---

### 7. TrustFooter

**File**: `src/components/insight-explorer/TrustFooter.tsx`

**Purpose**: Build citizen confidence in data authenticity

**Elements**:

- Official source card → data.gov.rs
- Freshness card → update schedule
- Methodology card → documentation links
- License info → CC BY 4.0
- Footer links: Contact, Terms, Privacy

**Trust Indicators** (per dataset):

- ✅ Званични извор — data.gov.rs верификовано
- ✅ Ажурност — Last update time
- ✅ Покривеност — Time range and geography
- ✅ Лиценца — CC BY 4.0
- ✅ Квалитет — Quality score

---

### 8. Keyword Extraction System

**File**: `src/lib/keyword-extractor.ts`

**Purpose**: Transform natural language queries into filter parameters

**Flow**:

1. Normalize query (lowercase, transliterate)
2. Tokenize
3. Match against patterns (topics, locations, time, metrics)
4. Return structured params

**Extraction Patterns**:

```typescript
interface ExtractionPattern {
  type: 'topic' | 'location' | 'timeRange' | 'metric';
  patterns: Record<Locale, string[]>;
  mapsTo: string;
}

const EXTRACTION_PATTERNS: ExtractionPattern[] = [
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['ваздух', 'загађење', 'екологија'],
      'sr-Latn': ['vazduh', 'zagadjenje', 'ekologija'],
      en: ['air', 'pollution', 'ecology'],
    },
    mapsTo: 'zivotna-sredina',
  },
  // ... more patterns
];

interface ExtractedParams {
  q?: string; // Remaining unmatched terms
  topic?: string;
  location?: string;
  year?: string;
  metric?: string;
}
```

---

## Mobile Responsive Design

### Breakpoints

| Breakpoint | Width          | Layout                     |
| ---------- | -------------- | -------------------------- |
| Mobile     | < 640px        | Single column, stacked     |
| Tablet     | 640px - 1024px | Two column, preview modal  |
| Desktop    | > 1024px       | Three column, side-by-side |

### Mobile Behavior

- **Hero**: Stacked, search stays prominent
- **Popular Insights**: Horizontal scroll with snap
- **Topic Nav**: Collapsible accordion
- **Dataset Cards**: Full width, tap to preview
- **Preview Panel**: Slide-up fullscreen modal

### Mobile Preview Modal

```
┌─────────────────────────────┐
│ ← Назад           [✕]      │  ← Sticky header
├─────────────────────────────┤
│   [FULL-WIDTH CHART]        │
│   Key insights              │
│   Source info               │
├─────────────────────────────┤
│  [Прилагоди] [Преузми]      │  ← Sticky footer
└─────────────────────────────┘
```

**Modal Behavior**:

- **Trigger**: Tap anywhere on dataset card
- **Animation**: Slide up from bottom, 300ms ease-out
- **Backdrop**: Semi-transparent (rgba(0,0,0,0.5)), tap to close
- **URL**: Updates to `?dataset=...&modal=true` (for shareability)
- **Close actions**: Back button, X button, backdrop tap, Escape key

### Touch Optimizations

| Element          | Mobile Behavior              |
| ---------------- | ---------------------------- |
| Popular Insights | Horizontal scroll with snap  |
| Topic sidebar    | Collapsible accordion        |
| Dataset cards    | Tap to expand preview        |
| Chart            | Pinch to zoom (if supported) |
| Filters          | Bottom sheet drawer          |
| Touch targets    | Minimum 44x44px              |

---

## File Structure

```
src/
├── components/
│   └── insight-explorer/
│       ├── InsightExplorer.tsx          # Main page component
│       ├── InsightHero.tsx              # Hero with search
│       ├── InsightHeroSearch.tsx        # Search input + autocomplete
│       ├── SearchSuggestions.tsx        # Query suggestions dropdown
│       ├── TopicShortcuts.tsx           # Quick topic buttons
│       ├── PopularInsightsGrid.tsx      # Curated insight cards
│       ├── PopularInsightCard.tsx       # Individual insight card
│       ├── LifeTopicNav.tsx             # Topic sidebar navigation
│       ├── LocationFilter.tsx           # Geographic filter
│       ├── TimeRangeFilter.tsx          # Year/time filter
│       ├── InsightTypeFilter.tsx        # Trend/Map/Comparison filter
│       ├── CitizenDatasetCard.tsx       # Value-focused dataset card
│       ├── CitizenDatasetList.tsx       # List of dataset cards
│       ├── LivePreviewPanel.tsx         # Right-side preview
│       ├── KeyInsightsBlock.tsx         # Generated insights
│       ├── KeyStatistics.tsx            # Stat cards
│       ├── DataSourceBlock.tsx          # Source attribution
│       ├── PreviewActions.tsx           # Customize/Download/Share
│       ├── MobilePreviewModal.tsx       # Mobile fullscreen preview
│       └── TrustFooter.tsx              # Trust & transparency
│
├── lib/
│   ├── keyword-extractor.ts             # Natural language parsing
│   ├── topic-mapping.ts                 # Life topics → data.gov topics
│   ├── insight-generator.ts             # Auto-generate key insights
│   ├── insight-bullets.ts               # Curated "what you can learn"
│   └── popular-insights.ts              # Curated insight configs
│
├── hooks/
│   └── useInsightExplorer.ts            # Main state management hook
│
└── types/
    └── insight-explorer.ts              # Type definitions
```

---

## Migration Path

1. **Phase 1**: Create new components alongside existing `DataGovBrowser`
2. **Phase 2**: Add feature flag `ENABLE_INSIGHT_EXPLORER` in `src/lib/app-config.ts` to toggle between old/new
3. **Phase 3**: Test with real users
4. **Phase 4**: Remove old `DataGovBrowser` after validation

**Feature Flag**:

```typescript
// src/lib/app-config.ts
export const ENABLE_INSIGHT_EXPLORER =
  process.env.NEXT_PUBLIC_ENABLE_INSIGHT_EXPLORER === 'true';
```

---

## Error & Empty States

### No Search Results (`EmptySearchResults.tsx`)

```
┌─────────────────────────────────────┐
│            🔍                       │
│                                     │
│  Нема резултата за "xyz"            │
│                                     │
│  Предлози:                          │
│  • Проверите правопис               │
│  • Користите општије појмове        │
│  • Изаберите другу тему             │
│                                     │
│  [Очисти филтере]  [Прикажи све]    │
└─────────────────────────────────────┘
```

### Preview Failed (`PreviewErrorState.tsx`)

```
┌─────────────────────────────────────┐
│            ⚠️                       │
│                                     │
│  Визуализација није доступна        │
│                                     │
│  Овај ресурс не може бити           │
│  аутоматски визуализован.           │
│                                     │
│  [Преузми податке]  [Пријави грешку]│
└─────────────────────────────────────┘
```

### API Unavailable (`ApiUnavailableState.tsx`)

```
┌─────────────────────────────────────┐
│            🌐                       │
│                                     │
│  Каталог тренутно није доступан     │
│                                     │
│  Покушајте поново касније или       │
│  посетите data.gov.rs директно.     │
│                                     │
│  [Покушај поново]  [data.gov.rs →]  │
└─────────────────────────────────────┘
```

---

## Curated Content Source

All curated content is **hardcoded in TypeScript files** for reliability and offline capability:

| Content             | File                            | Update Frequency |
| ------------------- | ------------------------------- | ---------------- |
| Search suggestions  | `src/lib/search-suggestions.ts` | Manual updates   |
| Popular insights    | `src/lib/popular-insights.ts`   | Manual updates   |
| Insight bullets     | `src/lib/insight-bullets.ts`    | Manual updates   |
| Topic mappings      | `src/lib/topic-mapping.ts`      | Manual updates   |
| Extraction patterns | `src/lib/keyword-extractor.ts`  | Manual updates   |

**Rationale**: Curated content ensures quality and consistency for first-time users. Analytics-driven suggestions can be added later as a progressive enhancement.

---

## Performance Considerations

| Concern             | Solution                                     |
| ------------------- | -------------------------------------------- |
| Chart rendering     | Lazy load preview panel; debounce selection  |
| Search latency      | Debounce input 300ms; cache results          |
| Large dataset lists | Virtual scrolling for 100+ results           |
| Mobile performance  | Reduce chart animations; simpler mini-charts |

---

## Accessibility Requirements

### Keyboard Navigation

| Element         | Behavior                                            |
| --------------- | --------------------------------------------------- |
| Search input    | Tab to focus, type to search, Enter to submit       |
| Topic shortcuts | Tab between chips, Enter to select                  |
| Dataset cards   | Tab between cards, Enter to select and show preview |
| Preview panel   | Tab within panel, Escape to close (mobile)          |
| Modal (mobile)  | Focus trap, Tab cycles within modal, Escape closes  |
| Filters         | Tab to expand/collapse, Arrow keys within list      |

### ARIA Labels

```typescript
const ARIA_LABELS = {
  searchInput: 'Претрага каталога података',
  searchSuggestions: 'Предлози за претрагу',
  topicNav: 'Навигација по темама',
  datasetList: 'Листа скупова података',
  previewPanel: 'Преглед визуализације',
  previewChart: 'Графикон података',
  closeButton: 'Затвори преглед',
  filterSection: (name: string) => `Филтер: ${name}`,
};
```

### Focus Management

1. **On dataset selection**: Focus moves to preview panel header
2. **On modal open (mobile)**: Focus moves to modal close button
3. **On modal close**: Focus returns to the dataset card that was selected
4. **On search submit**: Focus moves to first dataset card or empty state message

### Color Contrast

- All text must meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text)
- Interactive elements must have 3:1 contrast against background
- Focus indicators must have 3:1 contrast against adjacent colors

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .insight-explorer * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Touch Targets

- All interactive elements: minimum 44x44px touch target
- Adjacent targets: minimum 8px spacing
- Cards: full clickable area, not just CTA button

### Skip Links

```html
<a href="#main-content" class="skip-link"> Пређи на главни садржај </a>
<a href="#dataset-list" class="skip-link"> Пређи на листу података </a>
```

---

## Dependencies

All dependencies are already in the project:

- `framer-motion` — Mobile modal animations
- `lucide-react` — Icons
- `date-fns` — Date formatting
- Existing hooks: `useSearch`, `useDataset`, `useDatasetList`
- Existing components: `ChartRenderer`, `FilterSidebar` patterns

---

## Success Criteria

1. First-time users can find relevant data in under 30 seconds
2. Users understand what a dataset offers without technical knowledge
3. Mobile experience is fully functional
4. All text is available in three locales (sr-Cyrl, sr-Latn, en)
5. WCAG 2.1 AA compliance maintained
