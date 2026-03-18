# Data Catalog Redesign — Insight Explorer Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Data Catalog from a dataset-centric technical interface into a citizen-first insight explorer optimized for non-technical users.

**Architecture:** Three-zone layout (Hero Explorer, Split Explorer, Trust Footer) with curated content libraries for natural language processing, topic mapping, and auto-generated insights.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide icons, date-fns, existing hooks (useDataset, useDatasetList), ChartRenderer

---

## File Structure

### New Files

```
src/types/insight-explorer.ts                      # Type definitions
src/lib/insight-explorer/keyword-extractor.ts     # Natural language parsing
src/lib/insight-explorer/topic-mapping.ts         # Life topics → data.gov topics
src/lib/insight-explorer/insight-generator.ts     # Auto-generate key insights
src/lib/insight-explorer/insight-bullets.ts       # Curated "what you can learn"
src/lib/insight-explorer/popular-insights.ts       # Curated insight configs
src/lib/insight-explorer/search-suggestions.ts     # Search suggestion chips
src/lib/insight-explorer/index.ts                 # Barrel export
src/hooks/useInsightExplorer.ts                  # Main state management hook
src/components/insight-explorer/InsightExplorer.tsx    # Main client component
src/components/insight-explorer/InsightHero.tsx
src/components/insight-explorer/PopularInsightsGrid.tsx
src/components/insight-explorer/PopularInsightCard.tsx
src/components/insight-explorer/LifeTopicNav.tsx
src/components/insight-explorer/LocationFilter.tsx
src/components/insight-explorer/TimeRangeFilter.tsx
src/components/insight-explorer/CitizenDatasetList.tsx
src/components/insight-explorer/CitizenDatasetCard.tsx
src/components/insight-explorer/LivePreviewPanel.tsx
src/components/insight-explorer/KeyInsightsBlock.tsx
src/components/insight-explorer/KeyStatistics.tsx
src/components/insight-explorer/PreviewActions.tsx
src/components/insight-explorer/TrustFooter.tsx
src/components/insight-explorer/EmptySearchResults.tsx
src/components/insight-explorer/PreviewErrorState.tsx
src/components/insight-explorer/ApiUnavailableState.tsx
src/components/insight-explorer/MobilePreviewModal.tsx
src/components/insight-explorer/index.ts           # Barrel export
```

### Modified Files

```
src/app/[locale]/data/page.tsx                   # Use new InsightExplorer component
src/lib/i18n/locales/sr/common.json             # Add locale keys
src/lib/i18n/locales/lat/common.json             # Add locale keys
src/lib/i18n/locales/en/common.json             # Add locale keys
src/lib/i18n/config.ts                          # Add localized pathnames
```

---

## Task 1: Type Definitions

**Files:**

- Create: `src/types/insight-explorer.ts`

- [ ] **Step 1: Create the type definitions file**

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

export interface SearchSuggestion {
  id: string;
  query: string;
  label: LocalizedString;
  icon?: string;
}

// ============================================
// Topics & Navigation
// ============================================

export interface LifeTopic {
  id: string;
  icon: string;
  label: LocalizedString;
  description: LocalizedString;
  datasetCount: number;
  dataGovTopics: string[];
}

export interface LocationFilter {
  id: string;
  label: LocalizedString;
  type: 'region' | 'city' | 'municipality';
}

// ============================================
// Popular Insights
// ============================================

export type ChartType = 'line' | 'bar' | 'map' | 'pie';
export type FreshnessLevel = 'today' | 'this-week' | 'this-month' | 'this-year';
export type BadgeType = 'new' | 'trending' | 'featured';

export interface PopularInsight {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  chartType: ChartType;
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

export interface InsightBullets {
  datasetId: string;
  bullets: LocalizedString[];
}

export interface CitizenDatasetCardLabels {
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

export interface GeneratedInsight {
  text: string;
  type: 'observation' | 'trend' | 'comparison' | 'anomaly';
  confidence: 'high' | 'medium' | 'low';
}

export interface KeyStatistic {
  value: string | number;
  label: LocalizedString;
  icon: 'rows' | 'cities' | 'year' | 'records' | 'coverage';
}

// ============================================
// Keyword Extraction
// ============================================

export interface ExtractionPattern {
  type: 'topic' | 'location' | 'timeRange' | 'metric';
  patterns: LocalizedString[];
  mapsTo: string;
}

export interface ExtractedParams {
  q?: string;
  topic?: string;
  location?: string;
  year?: string;
  metric?: string;
}

// ============================================
// Hook Interface
// ============================================

export interface UseInsightExplorerReturn {
  searchQuery: string;
  selectedTopic: string | null;
  selectedLocation: string | null;
  selectedYear: string | null;
  selectedInsightType: string | null;
  selectedDataset: BrowseDataset | null;
  selectedResource: BrowseResource | null;
  datasets: BrowseDataset[];
  datasetsLoading: boolean;
  datasetsError: Error | null;
  totalDatasets: number;
  previewData: Record<string, unknown>[] | null;
  previewLoading: boolean;
  previewError: Error | null;
  chartConfig: ChartConfig | null;
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

export interface ErrorStateProps {
  locale: Locale;
  type: 'no-results' | 'preview-failed' | 'api-unavailable';
  onRetry?: () => void;
  onClearFilters?: () => void;
}

// ============================================
// Mobile Modal
// ============================================

export interface MobilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: BrowseDataset | null;
  locale: Locale;
}
```

- [ ] **Step 2: Commit type definitions**

```bash
git add src/types/insight-explorer.ts
git commit -m "feat(insight-explorer): add type definitions"
```

---

## Task 2: Utility Libraries - Keyword Extractor

**Files:**

- Create: `src/lib/insight-explorer/keyword-extractor.ts`
- Test: `src/lib/insight-explorer/__tests__/keyword-extractor.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { extractKeywords } from '../keyword-extractor';

describe('extractKeywords', () => {
  it('extracts health topic from Serbian Cyrillic', () => {
    const result = extractKeywords('здравље у Србији', 'sr-Cyrl');
    expect(result.topic).toBe('health');
  });

  it('extracts location from query', () => {
    const result = extractKeywords('saobraćaj u Beogradu', 'sr-Latn');
    expect(result.location).toBe('belgrade');
  });

  it('extracts year from query', () => {
    const result = extractKeywords('ekonomija 2024', 'sr-Latn');
    expect(result.topic).toBe('economy');
    expect(result.year).toBe('2024');
  });

  it('returns remaining terms as q', () => {
    const result = extractKeywords('traffic accidents unknown term', 'en');
    expect(result.topic).toBe('safety');
    expect(result.q).toBe('accidents unknown term');
  });

  it('handles empty query', () => {
    const result = extractKeywords('', 'en');
    expect(result).toEqual({});
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- src/lib/insight-explorer/__tests__/keyword-extractor.test.ts
```

Expected: FAIL with "module not found"

- [ ] **Step 3: Write minimal implementation**

```typescript
import type { Locale } from '@/lib/i18n/config';
import type {
  ExtractionPattern,
  ExtractedParams,
} from '@/types/insight-explorer';

const EXTRACTION_PATTERNS: ExtractionPattern[] = [
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['здравље', 'болница', 'медицина', 'лекари'],
      'sr-Latn': ['zdravlje', 'bolnica', 'medicina', 'lekari'],
      en: ['health', 'hospital', 'medicine', 'doctors'],
    },
    mapsTo: 'health',
  },
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['образовање', 'школа', 'факултет', 'студенти'],
      'sr-Latn': ['obrazovanje', 'škola', 'fakultet', 'studenti'],
      en: ['education', 'school', 'university', 'students'],
    },
    mapsTo: 'education',
  },
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['економија', 'привреда', 'компаније', 'посао'],
      'sr-Latn': ['ekonomija', 'privreda', 'kompanije', 'posao'],
      en: ['economy', 'business', 'companies', 'jobs'],
    },
    mapsTo: 'economy',
  },
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['саобраћај', 'криминал', 'полиција', 'безбедност'],
      'sr-Latn': ['saobraćaj', 'kriminal', 'policija', 'bezbednost'],
      en: ['traffic', 'crime', 'police', 'safety'],
    },
    mapsTo: 'safety',
  },
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['становништво', 'демографија', 'рођени', 'умрли'],
      'sr-Latn': ['stanovništvo', 'demografija', 'rođeni', 'umrli'],
      en: ['population', 'demographics', 'births', 'deaths'],
    },
    mapsTo: 'demographics',
  },
  {
    type: 'topic',
    patterns: {
      'sr-Cyrl': ['животна средина', 'екологија', 'загађење', 'клима'],
      'sr-Latn': ['životna sredina', 'ekologija', 'zagađenje', 'klima'],
      en: ['environment', 'ecology', 'pollution', 'climate'],
    },
    mapsTo: 'environment',
  },
  {
    type: 'location',
    patterns: {
      'sr-Cyrl': ['београд', 'beograd', 'bg'],
      'sr-Latn': ['beograd', 'beč', 'bg'],
      en: ['belgrade', 'beograd', 'bg'],
    },
    mapsTo: 'belgrade',
  },
  {
    type: 'location',
    patterns: {
      'sr-Cyrl': ['нови сад', 'војводина', 'ns'],
      'sr-Latn': ['novi sad', 'vojvodina', 'ns'],
      en: ['novi sad', 'vojvodina', 'ns'],
    },
    mapsTo: 'novi-sad',
  },
  {
    type: 'timeRange',
    patterns: {
      'sr-Cyrl': ['2024', 'ове године', 'годину'],
      'sr-Latn': ['2024', 'ove godine', 'godinu'],
      en: ['2024', 'this year', 'last year'],
    },
    mapsTo: '2024',
  },
  {
    type: 'timeRange',
    patterns: {
      'sr-Cyrl': ['2023', 'прошле године'],
      'sr-Latn': ['2023', 'prošle godine'],
      en: ['2023', 'last year'],
    },
    mapsTo: '2023',
  },
];

export function extractKeywords(
  query: string,
  locale: Locale
): ExtractedParams {
  const result: ExtractedParams = {};
  const lowerQuery = query.toLowerCase();
  const remainingTerms: string[] = [];
  const words = lowerQuery.split(/\s+/);

  for (const word of words) {
    let matched = false;

    for (const pattern of EXTRACTION_PATTERNS) {
      const localePatterns = pattern.patterns[locale] ?? [];
      const allPatterns = [
        ...localePatterns,
        ...(pattern.patterns['sr-Latn'] ?? []),
        ...(pattern.patterns.en ?? []),
      ];

      for (const patternText of allPatterns) {
        if (
          word.includes(patternText.toLowerCase()) ||
          patternText.toLowerCase().includes(word)
        ) {
          switch (pattern.type) {
            case 'topic':
              result.topic = pattern.mapsTo;
              break;
            case 'location':
              result.location = pattern.mapsTo;
              break;
            case 'timeRange':
              result.year = pattern.mapsTo;
              break;
          }
          matched = true;
          break;
        }
      }

      if (matched) break;
    }

    if (!matched && word.length > 2) {
      remainingTerms.push(word);
    }
  }

  if (remainingTerms.length > 0) {
    result.q = remainingTerms.join(' ');
  }

  return result;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- src/lib/insight-explorer/__tests__/keyword-extractor.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/insight-explorer/keyword-extractor.ts src/lib/insight-explorer/__tests__/keyword-extractor.test.ts
git commit -m "feat(insight-explorer): add keyword extractor with tests"
```

---

## Task 3: Utility Libraries - Topic Mapping

**Files:**

- Create: `src/lib/insight-explorer/topic-mapping.ts`

- [ ] **Step 1: Write the topic mapping**

```typescript
import type { Locale } from '@/lib/i18n/config';
import type { LifeTopic } from '@/types/insight-explorer';

export const LIFE_TOPICS: LifeTopic[] = [
  {
    id: 'health',
    icon: '❤️',
    label: {
      'sr-Cyrl': 'Здравље',
      'sr-Latn': 'Zdravlje',
      en: 'Health',
    },
    description: {
      'sr-Cyrl': 'Болнице, апотеке, лекари, здравствени сервиси',
      'sr-Latn': 'Bolnice, apoteke, lekari, zdravstveni servisi',
      en: 'Hospitals, pharmacies, doctors, health services',
    },
    datasetCount: 12,
    dataGovTopics: ['zdravstvo', 'zdravstvena-zaštita'],
  },
  {
    id: 'education',
    icon: '📚',
    label: {
      'sr-Cyrl': 'Образовање',
      'sr-Latn': 'Obrazovanje',
      en: 'Education',
    },
    description: {
      'sr-Cyrl': 'Школе, факултети, ученици, образовни програми',
      'sr-Latn': 'Škole, fakulteti, učenici, obrazovni programi',
      en: 'Schools, universities, students, educational programs',
    },
    datasetCount: 8,
    dataGovTopics: ['obrazovanje', 'nauka'],
  },
  {
    id: 'economy',
    icon: '💼',
    label: {
      'sr-Cyrl': 'Економија',
      'sr-Latn': 'Ekonomija',
      en: 'Economy',
    },
    description: {
      'sr-Cyrl': 'Посао, привреда, компаније, запосленост',
      'sr-Latn': 'Posao, privreda, kompanije, zaposlenost',
      en: 'Jobs, business, companies, employment',
    },
    datasetCount: 15,
    dataGovTopics: ['ekonomija', 'privreda', 'tržište-rada'],
  },
  {
    id: 'safety',
    icon: '🚔',
    label: {
      'sr-Cyrl': 'Безбедност',
      'sr-Latn': 'Bezbednost',
      en: 'Safety',
    },
    description: {
      'sr-Cyrl': 'Саобраћај, криминал, полиција, хитна помоћ',
      'sr-Latn': 'Saobraćaj, kriminal, policija, hitna pomoć',
      en: 'Traffic, crime, police, emergency services',
    },
    datasetCount: 10,
    dataGovTopics: ['bezbednost', 'saobraćaj', 'unutrašnji-poslovi'],
  },
  {
    id: 'demographics',
    icon: '👥',
    label: {
      'sr-Cyrl': 'Становништво',
      'sr-Latn': 'Stanovništvo',
      en: 'Population',
    },
    description: {
      'sr-Cyrl': 'Рођени, умрли, пресељење, старосна структура',
      'sr-Latn': 'Rođeni, umrli, preseljenje, starosna struktura',
      en: 'Births, deaths, migration, age structure',
    },
    datasetCount: 6,
    dataGovTopics: ['stanovništvo', 'demografija'],
  },
  {
    id: 'environment',
    icon: '🌿',
    label: {
      'sr-Cyrl': 'Животна средина',
      'sr-Latn': 'Životna sredina',
      en: 'Environment',
    },
    description: {
      'sr-Cyrl': 'Загађење, климатске промене, отпад, природа',
      'sr-Latn': 'Zagađenje, klimatske promene, otpad, priroda',
      en: 'Pollution, climate change, waste, nature',
    },
    datasetCount: 7,
    dataGovTopics: ['životna-sredina', 'ekologija'],
  },
];

export function getTopicById(id: string): LifeTopic | undefined {
  return LIFE_TOPICS.find((topic) => topic.id === id);
}

export function getTopicsForDataGovTopic(dataGovTopic: string): LifeTopic[] {
  return LIFE_TOPICS.filter((topic) =>
    topic.dataGovTopics.includes(dataGovTopic)
  );
}

export function getLocalizedTopicLabel(
  topic: LifeTopic,
  locale: Locale
): string {
  return topic.label[locale] ?? topic.label.en;
}
```

- [ ] **Step 2: Commit topic mapping**

```bash
git add src/lib/insight-explorer/topic-mapping.ts
git commit -m "feat(insight-explorer): add life topic mapping"
```

---

## Task 4: Utility Libraries - Insight Bullets

**Files:**

- Create: `src/lib/insight-explorer/insight-bullets.ts`

- [ ] **Step 1: Write insight bullets**

```typescript
import type { Locale } from '@/lib/i18n/config';
import type { InsightBullets } from '@/types/insight-explorer';

export const INSIGHT_BULLETS: InsightBullets[] = [
  {
    datasetId: 'population-by-municipality',
    bullets: {
      'sr-Cyrl': [
        'Видите колико људи живи у вашој општини',
        'Упоредите величину општина у Србији',
        'Пратите демографске промене',
      ],
      'sr-Latn': [
        'Vidite koliko ljudi živi u vašoj opštini',
        'Uporedite veličinu opština u Srbiji',
        'Pratite demografske promene',
      ],
      en: [
        'See how many people live in your municipality',
        'Compare municipality sizes across Serbia',
        'Track demographic changes',
      ],
    },
  },
  {
    datasetId: 'traffic-accidents',
    bullets: {
      'sr-Cyrl': [
        'Сазнајте најопаснија раскрсница',
        'Видите статистику саобраћајних незгода',
        'Проверите безбедност у вашем крају',
      ],
      'sr-Latn': [
        'Saznajte najopasnije raskrsnice',
        'Vidite statistiku saobraćajnih nezgoda',
        'Proverite bezbednost u vašem kraju',
      ],
      en: [
        'Learn about the most dangerous intersections',
        'See traffic accident statistics',
        'Check safety in your area',
      ],
    },
  },
];

export function getInsightBullets(datasetId: string, locale: Locale): string[] {
  const bullets = INSIGHT_BULLETS.find((b) => b.datasetId === datasetId);
  if (!bullets) return [];
  return bullets.bullets[locale] ?? bullets.bullets.en ?? [];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/insight-explorer/insight-bullets.ts
git commit -m "feat(insight-explorer): add insight bullets"
```

---

## Task 5: Utility Libraries - Popular Insights & Search Suggestions

**Files:**

- Create: `src/lib/insight-explorer/popular-insights.ts`
- Create: `src/lib/insight-explorer/search-suggestions.ts`

- [ ] **Step 1: Write popular insights**

```typescript
import type { Locale } from '@/lib/i18n/config';
import type { PopularInsight } from '@/types/insight-explorer';

export const POPULAR_INSIGHTS: PopularInsight[] = [
  {
    id: 'air-quality-belgrade',
    title: {
      'sr-Cyrl': 'Квалитет ваздуха у Београду',
      'sr-Latn': 'Kvalitet vazduha u Beogradu',
      en: 'Air Quality in Belgrade',
    },
    subtitle: {
      'sr-Cyrl': 'Актуелни подаци о загађењу',
      'sr-Latn': 'Aktuelni podaci o zagađenju',
      en: 'Current pollution data',
    },
    chartType: 'line',
    searchParams: { q: 'vazduh beograd' },
    datasetId: 'air-quality',
    freshness: 'today',
    badge: {
      type: 'trending',
      label: { 'sr-Cyrl': 'Трендинг', 'sr-Latn': 'Trending', en: 'Trending' },
    },
  },
  {
    id: 'population-pyramid',
    title: {
      'sr-Cyrl': 'Пирамида становништва',
      'sr-Latn': 'Piramida stanovništva',
      en: 'Population Pyramid',
    },
    subtitle: {
      'sr-Cyrl': 'Старосна структура',
      'sr-Latn': 'Starosna struktura',
      en: 'Age structure',
    },
    chartType: 'bar',
    searchParams: { q: 'stanovništvo starost' },
    datasetId: 'population-demographics',
    freshness: 'this-month',
  },
];

export function getLocalizedInsightTitle(
  insight: PopularInsight,
  locale: Locale
): string {
  return insight.title[locale] ?? insight.title.en;
}
```

- [ ] **Step 2: Write search suggestions**

```typescript
import type { Locale } from '@/lib/i18n/config';
import type { SearchSuggestion } from '@/types/insight-explorer';

export const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  {
    id: 'air-quality',
    query: 'kvalitet vazduha',
    label: {
      'sr-Cyrl': 'Квалитет ваздуха у мом граду?',
      'sr-Latn': 'Kvalitet vazduha u mom gradu?',
      en: 'Air quality in my city?',
    },
    icon: '🌬️',
  },
  {
    id: 'hospital-wait',
    query: 'cekanje bolnica',
    label: {
      'sr-Cyrl': 'Колико се чека у болници?',
      'sr-Latn': 'Koliko se čeka u bolnici?',
      en: 'How long are hospital wait times?',
    },
    icon: '🏥',
  },
];

export function getLocalizedSuggestionLabel(
  suggestion: SearchSuggestion,
  locale: Locale
): string {
  return suggestion.label[locale] ?? suggestion.label.en;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/insight-explorer/popular-insights.ts src/lib/insight-explorer/search-suggestions.ts
git commit -m "feat(insight-explorer): add popular insights and search suggestions"
```

---

## Task 6: Utility Libraries - Insight Generator & Barrel Export

**Files:**

- Create: `src/lib/insight-explorer/insight-generator.ts`
- Create: `src/lib/insight-explorer/index.ts`

- [ ] **Step 1: Write insight generator**

```typescript
import type { Locale } from '@/lib/i18n/config';
import type { GeneratedInsight } from '@/types/insight-explorer';

export function generateKeyInsights(
  data: Record<string, unknown>[],
  locale: Locale
): GeneratedInsight[] {
  if (!data || data.length === 0) return [];

  const insights: GeneratedInsight[] = [];
  const firstRow = data[0];
  const keys = Object.keys(firstRow);

  // Find numeric columns
  const numericKeys = keys.filter((key) => typeof firstRow[key] === 'number');

  if (numericKeys.length > 0) {
    const numericKey = numericKeys[0];
    const values = data
      .map((row) => Number(row[numericKey]))
      .filter((v) => !isNaN(v));

    if (values.length > 0) {
      const max = Math.max(...values);
      const min = Math.min(...values);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;

      insights.push({
        text:
          locale === 'sr-Cyrl'
            ? `Просек: ${avg.toFixed(1)}`
            : locale === 'sr-Latn'
              ? `Prosek: ${avg.toFixed(1)}`
              : `Average: ${avg.toFixed(1)}`,
        type: 'observation',
        confidence: 'high',
      });

      insights.push({
        text:
          locale === 'sr-Cyrl'
            ? `Опсег: ${min.toFixed(1)} - ${max.toFixed(1)}`
            : locale === 'sr-Latn'
              ? `Opseg: ${min.toFixed(1)} - ${max.toFixed(1)}`
              : `Range: ${min.toFixed(1)} - ${max.toFixed(1)}`,
        type: 'observation',
        confidence: 'high',
      });
    }
  }

  return insights;
}
```

- [ ] **Step 2: Write barrel export**

```typescript
export { extractKeywords } from './keyword-extractor';
export {
  LIFE_TOPICS,
  getTopicById,
  getTopicsForDataGovTopic,
  getLocalizedTopicLabel,
} from './topic-mapping';
export { INSIGHT_BULLETS, getInsightBullets } from './insight-bullets';
export { POPULAR_INSIGHTS, getLocalizedInsightTitle } from './popular-insights';
export {
  SEARCH_SUGGESTIONS,
  getLocalizedSuggestionLabel,
} from './search-suggestions';
export { generateKeyInsights } from './insight-generator';
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/insight-explorer/insight-generator.ts src/lib/insight-explorer/index.ts
git commit -m "feat(insight-explorer): add insight generator and barrel export"
```

---

## Task 7: useInsightExplorer Hook

**Files:**

- Create: `src/hooks/useInsightExplorer.ts`

- [ ] **Step 1: Write the hook**

```typescript
'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useDatasetList,
  useDataset,
  useResourceData,
} from '@/hooks/useDataset';
import { extractKeywords } from '@/lib/insight-explorer';
import { findPreviewableResource } from '@/lib/data-gov-api';
import type {
  UseInsightExplorerReturn,
  BrowseDataset,
  BrowseResource,
} from '@/types/insight-explorer';
import type { Locale } from '@/lib/i18n/config';

interface UseInsightExplorerOptions {
  locale: Locale;
}

export function useInsightExplorer(
  options: UseInsightExplorerOptions
): UseInsightExplorerReturn {
  const { locale } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') ?? '';
  const selectedTopic = searchParams.get('topic');
  const selectedDatasetId = searchParams.get('dataset');

  const extractedParams = useMemo(
    () => extractKeywords(searchQuery, locale),
    [searchQuery, locale]
  );

  const browseQuery = useMemo(
    () => ({
      q: (extractedParams.q ?? searchQuery) || undefined,
      topic: selectedTopic ?? extractedParams.topic ?? undefined,
      page: Number.parseInt(searchParams.get('page') ?? '1', 10),
      pageSize: 12,
    }),
    [searchQuery, selectedTopic, extractedParams]
  );

  const datasetListQuery = useDatasetList(browseQuery);
  const datasets = datasetListQuery.data?.data ?? [];

  const datasetQuery = useDataset(selectedDatasetId);
  const selectedDataset = datasetQuery.data;

  const previewResource = useMemo(() => {
    if (!selectedDataset) return null;
    return findPreviewableResource(selectedDataset.resources);
  }, [selectedDataset]);

  const resourceQuery = useResourceData(
    previewResource?.url ?? null,
    previewResource?.format ?? null,
    { limit: 100 }
  );

  const handleSetSearchQuery = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams);
      if (query) params.set('q', query);
      else params.delete('q');
      params.set('page', '1');
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const handleSetSelectedTopic = useCallback(
    (topicId: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (topicId) params.set('topic', topicId);
      else params.delete('topic');
      params.set('page', '1');
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const handleSelectDataset = useCallback(
    (datasetId: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('dataset', datasetId);
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const handleClearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    searchQuery,
    selectedTopic,
    selectedLocation: null,
    selectedYear: null,
    selectedInsightType: null,
    selectedDataset,
    selectedResource: previewResource,
    datasets,
    datasetsLoading: datasetListQuery.isLoading,
    datasetsError: datasetListQuery.error ?? null,
    totalDatasets: datasetListQuery.data?.total ?? 0,
    previewData: resourceQuery.data?.observations ?? null,
    previewLoading: resourceQuery.isLoading,
    previewError: resourceQuery.error ?? null,
    chartConfig: null,
    setSearchQuery: handleSetSearchQuery,
    setSelectedTopic: handleSetSelectedTopic,
    setSelectedLocation: () => {},
    setSelectedYear: () => {},
    setSelectedInsightType: () => {},
    selectDataset: handleSelectDataset,
    selectResource: () => {},
    clearFilters: handleClearFilters,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useInsightExplorer.ts
git commit -m "feat(insight-explorer): add useInsightExplorer hook"
```

---

## Task 8: InsightHero Component

**Files:**

- Create: `src/components/insight-explorer/InsightHero.tsx`

- [ ] **Step 1: Write InsightHero**

```typescript
'use client';

import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { SEARCH_SUGGESTIONS, LIFE_TOPICS, getLocalizedSuggestionLabel, getLocalizedTopicLabel } from '@/lib/insight-explorer';

interface InsightHeroProps {
  locale: Locale;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTopicSelect: (topicId: string | null) => void;
  selectedTopic: string | null;
}

const LABELS = {
  eyebrow: { 'sr-Cyrl': 'Званични каталог data.gov.rs', 'sr-Latn': 'Zvanični katalog data.gov.rs', en: 'Official data.gov.rs catalog' },
  headline: { 'sr-Cyrl': 'Шта желите да сазнате?', 'sr-Latn': 'Šta želite da saznate?', en: 'What would you like to discover?' },
  searchPlaceholder: { 'sr-Cyrl': 'Претражите каталог...', 'sr-Latn': 'Pretražite katalog...', en: 'Search the catalog...' },
  suggestions: { 'sr-Cyrl': 'Предлози', 'sr-Latn': 'Predlozi', en: 'Suggestions' },
  topics: { 'sr-Cyrl': 'Или изаберите тему', 'sr-Latn': 'Ili izaberite temu', en: 'Or pick a topic' },
} as const;

export function InsightHero({ locale, searchQuery, onSearchChange, onTopicSelect, selectedTopic }: InsightHeroProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSearch = () => onSearchChange(inputValue);
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <section className='rounded-[2rem] bg-gradient-to-br from-gov-primary via-gov-secondary to-[#0C1E42] px-8 py-12 text-white shadow-xl'>
      <p className='text-xs font-semibold uppercase tracking-[0.2em] text-white/70'>{LABELS.eyebrow[locale]}</p>
      <h1 className='mt-4 text-4xl font-bold tracking-tight sm:text-5xl'>{LABELS.headline[locale]}</h1>

      <div className='mt-8 flex max-w-2xl gap-3'>
        <div className='relative flex-1'>
          <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={LABELS.searchPlaceholder[locale]}
            className='w-full rounded-2xl border border-white/20 bg-white/10 py-4 pl-12 pr-4 text-white placeholder-white/50 backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20'
            aria-label={LABELS.searchPlaceholder[locale]}
          />
        </div>
        <button onClick={handleSearch} className='rounded-2xl bg-serbia-red px-8 py-4 font-semibold transition hover:bg-red-700'>
          {locale === 'sr-Cyrl' ? 'Претражи' : locale === 'sr-Latn' ? 'Pretraži' : 'Search'}
        </button>
      </div>

      <div className='mt-6'>
        <p className='text-xs font-semibold uppercase tracking-[0.15em] text-white/60'>
          <Sparkles className='mr-1.5 inline h-3.5 w-3.5' />{LABELS.suggestions[locale]}
        </p>
        <div className='mt-3 flex flex-wrap gap-2'>
          {SEARCH_SUGGESTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setInputValue(s.query); onSearchChange(s.query); }}
              className='rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm transition hover:border-white/40 hover:bg-white/20'
            >
              {s.icon} {getLocalizedSuggestionLabel(s, locale)}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-8'>
        <p className='text-xs font-semibold uppercase tracking-[0.15em] text-white/60'>{LABELS.topics[locale]}</p>
        <div className='mt-3 flex flex-wrap gap-3'>
          {LIFE_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onTopicSelect(selectedTopic === topic.id ? null : topic.id)}
              className={`rounded-2xl border px-5 py-3 text-sm font-medium transition ${
                selectedTopic === topic.id
                  ? 'border-white/40 bg-white/20'
                  : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <span className='mr-2'>{topic.icon}</span>
              {getLocalizedTopicLabel(topic, locale)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/insight-explorer/InsightHero.tsx
git commit -m "feat(insight-explorer): add InsightHero component"
```

---

## Task 9: CitizenDatasetCard Component

**Files:**

- Create: `src/components/insight-explorer/CitizenDatasetCard.tsx`

- [ ] **Step 1: Write CitizenDatasetCard**

```typescript
'use client';

import { Clock, ChevronRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { BrowseDataset } from '@/types/browse';
import { getInsightBullets } from '@/lib/insight-explorer';
import { isPreviewableFormat } from '@/lib/data-gov-api';
import { formatRelativeTime } from '@/lib/i18n/config';

interface CitizenDatasetCardProps {
  locale: Locale;
  dataset: BrowseDataset;
  isSelected: boolean;
  onSelect: () => void;
}

export function CitizenDatasetCard({ locale, dataset, isSelected, onSelect }: CitizenDatasetCardProps) {
  const previewableCount = dataset.resources.filter((r) => isPreviewableFormat(r.format)).length;
  const insightBullets = getInsightBullets(dataset.id, locale);

  const labels = {
    readyToVisualize: locale === 'sr-Cyrl' ? 'Спремно за визуализацију' : locale === 'sr-Latn' ? 'Spremno za vizualizaciju' : 'Ready to visualize',
    dataOnly: locale === 'sr-Cyrl' ? 'Само подаци' : locale === 'sr-Latn' ? 'Samo podaci' : 'Data only',
    updated: locale === 'sr-Cyrl' ? 'Ажурирано' : locale === 'sr-Latn' ? 'Ažurirano' : 'Updated',
    view: locale === 'sr-Cyrl' ? 'Преглед' : locale === 'sr-Latn' ? 'Pregled' : 'View',
  };

  return (
    <button
      onClick={onSelect}
      className={`group w-full rounded-2xl border px-5 py-5 text-left transition ${
        isSelected
          ? 'border-gov-secondary bg-gov-secondary/5 ring-2 ring-gov-secondary/20'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <p className='truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-400'>
            {dataset.organization?.name ?? 'data.gov.rs'}
          </p>
          <h3 className='mt-1 text-lg font-semibold text-slate-900'>{dataset.title}</h3>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
          previewableCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
        }`}>
          {previewableCount > 0 ? labels.readyToVisualize : labels.dataOnly}
        </span>
      </div>

      {insightBullets.length > 0 && (
        <div className='mt-4 space-y-1.5'>
          {insightBullets.slice(0, 3).map((bullet, i) => (
            <p key={i} className='flex items-start gap-2 text-sm text-slate-600'>
              <span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gov-secondary' />
              {bullet}
            </p>
          ))}
        </div>
      )}

      <div className='mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm'>
        <span className='flex items-center gap-1.5 text-slate-500'>
          <Clock className='h-4 w-4' />
          {labels.updated} {formatRelativeTime(dataset.last_modified, locale)}
        </span>
        <span className={`flex items-center gap-1 font-medium ${
          isSelected ? 'text-gov-secondary' : 'text-slate-400 group-hover:text-gov-secondary'
        }`}>
          {labels.view}
          <ChevronRight className='h-4 w-4 transition group-hover:translate-x-0.5' />
        </span>
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/insight-explorer/CitizenDatasetCard.tsx
git commit -m "feat(insight-explorer): add CitizenDatasetCard component"
```

---

## Task 10: CitizenDatasetList Component

**Files:**

- Create: `src/components/insight-explorer/CitizenDatasetList.tsx`

- [ ] **Step 1: Write CitizenDatasetList**

```typescript
'use client';

import { Loader2, Database } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { BrowseDataset } from '@/types/browse';
import { CitizenDatasetCard } from './CitizenDatasetCard';
import { EmptySearchResults } from './EmptySearchResults';
import { formatNumber } from '@/lib/i18n/config';

interface CitizenDatasetListProps {
  locale: Locale;
  datasets: BrowseDataset[];
  isLoading: boolean;
  error: Error | null;
  totalDatasets: number;
  selectedDatasetId: string | null;
  onSelectDataset: (datasetId: string) => void;
  onClearFilters: () => void;
}

export function CitizenDatasetList({
  locale, datasets, isLoading, error, totalDatasets, selectedDatasetId, onSelectDataset, onClearFilters,
}: CitizenDatasetListProps) {
  const labels = {
    results: locale === 'sr-Cyrl' ? 'резултата' : locale === 'sr-Latn' ? 'rezultata' : 'results',
    loading: locale === 'sr-Cyrl' ? 'Учитавање...' : locale === 'sr-Latn' ? 'Učitavanje...' : 'Loading...',
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16'>
        <Loader2 className='h-6 w-6 animate-spin text-gov-secondary' />
        <span className='ml-3 text-slate-500'>{labels.loading}</span>
      </div>
    );
  }

  if (error || datasets.length === 0) {
    return <EmptySearchResults locale={locale} type={error ? 'api-unavailable' : 'no-results'} onRetry={onClearFilters} onClearFilters={onClearFilters} />;
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4'>
        <Database className='h-5 w-5 text-gov-secondary' />
        <span className='text-sm text-slate-600'>{formatNumber(totalDatasets, locale)} {labels.results}</span>
      </div>
      <div className='grid gap-4'>
        {datasets.map((dataset) => (
          <CitizenDatasetCard
            key={dataset.id}
            locale={locale}
            dataset={dataset}
            isSelected={dataset.id === selectedDatasetId}
            onSelect={() => onSelectDataset(dataset.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/insight-explorer/CitizenDatasetList.tsx
git commit -m "feat(insight-explorer): add CitizenDatasetList component"
```

---

## Task 11: EmptySearchResults & TrustFooter Components

**Files:**

- Create: `src/components/insight-explorer/EmptySearchResults.tsx`
- Create: `src/components/insight-explorer/TrustFooter.tsx`

- [ ] **Step 1: Write EmptySearchResults**

```typescript
'use client';

import { Search, RefreshCw, ExternalLink } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { ErrorStateProps } from '@/types/insight-explorer';

const LABELS = {
  'no-results': {
    title: { 'sr-Cyrl': 'Нема резултата', 'sr-Latn': 'Nema rezultata', en: 'No results found' },
    description: { 'sr-Cyrl': 'Покушајте са другим појмом', 'sr-Latn': 'Pokušajte sa drugim pojmom', en: 'Try a different search term' },
    action: { 'sr-Cyrl': 'Очисти филтере', 'sr-Latn': 'Očisti filtere', en: 'Clear filters' },
  },
  'api-unavailable': {
    title: { 'sr-Cyrl': 'Каталог недоступан', 'sr-Latn': 'Katalog nedostupan', en: 'Catalog unavailable' },
    description: { 'sr-Cyrl': 'Покушајте поново', 'sr-Latn': 'Pokušajte ponovo', en: 'Try again' },
    action: { 'sr-Cyrl': 'Покушај поново', 'sr-Latn': 'Pokušaj ponovo', en: 'Try again' },
  },
} as const;

export function EmptySearchResults({ locale, type, onRetry, onClearFilters }: ErrorStateProps) {
  const labels = LABELS[type] ?? LABELS['no-results'];

  return (
    <div className='flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center'>
      <div className='rounded-full bg-slate-100 p-4'>
        {type === 'no-results' ? <Search className='h-6 w-6 text-slate-400' /> : <RefreshCw className='h-6 w-6 text-slate-400' />}
      </div>
      <h3 className='mt-4 text-lg font-semibold text-slate-900'>{labels.title[locale]}</h3>
      <p className='mt-2 text-sm text-slate-500'>{labels.description[locale]}</p>
      <button
        onClick={type === 'no-results' ? onClearFilters : onRetry}
        className='mt-6 rounded-xl bg-gov-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-gov-secondary'
      >
        {labels.action[locale]}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Write TrustFooter**

```typescript
'use client';

import { Shield, Clock, FileText } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';

interface TrustFooterProps {
  locale: Locale;
}

export function TrustFooter({ locale }: TrustFooterProps) {
  const labels = {
    officialSource: { 'sr-Cyrl': 'Званични извор', 'sr-Latn': 'Zvanični izvor', en: 'Official source' },
    freshness: { 'sr-Cyrl': 'Ажурност', 'sr-Latn': 'Ažurnost', en: 'Freshness' },
    methodology: { 'sr-Cyrl': 'Методологија', 'sr-Latn': 'Metodologija', en: 'Methodology' },
  };

  const items = [
    { icon: Shield, label: labels.officialSource[locale], value: 'data.gov.rs' },
    { icon: Clock, label: labels.freshness[locale], value: locale === 'sr-Cyrl' ? 'Недељно' : locale === 'sr-Latn' ? 'Nedeljno' : 'Weekly' },
    { icon: FileText, label: labels.methodology[locale], value: 'CC BY 4.0' },
  ];

  return (
    <footer className='mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-8 py-8'>
      <div className='grid gap-6 md:grid-cols-3'>
        {items.map((item, i) => (
          <div key={i} className='flex items-start gap-3'>
            <div className='rounded-lg bg-white p-2.5'>
              <item.icon className='h-5 w-5 text-gov-primary' />
            </div>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-500'>{item.label}</p>
              <p className='mt-1 text-sm text-slate-700'>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/insight-explorer/EmptySearchResults.tsx src/components/insight-explorer/TrustFooter.tsx
git commit -m "feat(insight-explorer): add EmptySearchResults and TrustFooter"
```

---

## Task 12: Component Barrel Export

**Files:**

- Create: `src/components/insight-explorer/index.ts`

- [ ] **Step 1: Create barrel export**

```typescript
export { InsightHero } from './InsightHero';
export { CitizenDatasetCard } from './CitizenDatasetCard';
export { CitizenDatasetList } from './CitizenDatasetList';
export { EmptySearchResults } from './EmptySearchResults';
export { TrustFooter } from './TrustFooter';
```

- [ ] **Step 2: Commit**

```bash
git add src/components/insight-explorer/index.ts
git commit -m "feat(insight-explorer): add component barrel export"
```

---

## Task 13: Main InsightExplorer Client Component

**Files:**

- Create: `src/components/insight-explorer/InsightExplorer.tsx`

- [ ] **Step 1: Write InsightExplorer (client component)**

```typescript
'use client';

import type { Locale } from '@/lib/i18n/config';
import { useInsightExplorer } from '@/hooks/useInsightExplorer';
import { InsightHero, CitizenDatasetList, TrustFooter } from './insight-explorer';

interface InsightExplorerProps {
  locale: Locale;
}

export function InsightExplorer({ locale }: InsightExplorerProps) {
  const explorer = useInsightExplorer({ locale });

  return (
    <div className='space-y-8'>
      <InsightHero
        locale={locale}
        searchQuery={explorer.searchQuery}
        onSearchChange={explorer.setSearchQuery}
        onTopicSelect={explorer.setSelectedTopic}
        selectedTopic={explorer.selectedTopic}
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]'>
        <CitizenDatasetList
          locale={locale}
          datasets={explorer.datasets}
          isLoading={explorer.datasetsLoading}
          error={explorer.datasetsError}
          totalDatasets={explorer.totalDatasets}
          selectedDatasetId={explorer.selectedDataset?.id ?? null}
          onSelectDataset={explorer.selectDataset}
          onClearFilters={explorer.clearFilters}
        />

        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          {explorer.selectedDataset ? (
            <div className='text-sm text-slate-500'>Preview: {explorer.selectedDataset.title}</div>
          ) : (
            <div className='text-sm text-slate-400'>
              {locale === 'sr-Cyrl' ? 'Изаберите скуп за преглед' : locale === 'sr-Latn' ? 'Izaberite skup za pregled' : 'Select a dataset to preview'}
            </div>
          )}
        </div>
      </div>

      <TrustFooter locale={locale} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/insight-explorer/InsightExplorer.tsx
git commit -m "feat(insight-explorer): add main InsightExplorer client component"
```

---

## Task 14: Update Data Page (Server Component)

**Files:**

- Modify: `src/app/[locale]/data/page.tsx`

- [ ] **Step 1: Update the data page**

```typescript
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { resolveLocale } from '@/lib/i18n/messages';
import type { Locale } from '@/lib/i18n/config';
import { InsightExplorer } from '@/components/insight-explorer/InsightExplorer';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  const titles = {
    'sr-Cyrl': 'Каталог података',
    'sr-Latn': 'Katalog podataka',
    en: 'Data catalog',
  };

  return {
    title: `${titles[locale]} | Визуелни Административни Подаци Србије`,
  };
}

export default async function DataPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return (
    <main className='container-custom py-8'>
      <Suspense fallback={<div className='text-slate-500'>Loading...</div>}>
        <InsightExplorer locale={locale} />
      </Suspense>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/data/page.tsx
git commit -m "feat(data): integrate InsightExplorer into data page"
```

---

## Summary

This plan implements the Data Catalog Redesign with 14 focused tasks:

| Task | Description                           | Files   |
| ---- | ------------------------------------- | ------- |
| 1    | Type definitions                      | 1 file  |
| 2    | Keyword extractor + tests             | 2 files |
| 3    | Topic mapping                         | 1 file  |
| 4    | Insight bullets                       | 1 file  |
| 5    | Popular insights + search suggestions | 2 files |
| 6    | Insight generator + barrel export     | 2 files |
| 7    | useInsightExplorer hook               | 1 file  |
| 8    | InsightHero component                 | 1 file  |
| 9    | CitizenDatasetCard                    | 1 file  |
| 10   | CitizenDatasetList                    | 1 file  |
| 11   | EmptySearchResults + TrustFooter      | 2 files |
| 12   | Component barrel export               | 1 file  |
| 13   | InsightExplorer main component        | 1 file  |
| 14   | Data page integration                 | 1 file  |

Each task produces working, testable code with frequent commits following TDD principles.
