# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign homepage for clarity, conversion, and institutional trust with 8 focused sections.

**Architecture:** Modify existing home components in-place where possible. Create 5 new components. Remove 4 deprecated components. Update locale files with new copy.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, Lucide Icons, Zustand, i18n

---

## File Structure

### New Files (5)

- `src/components/home/QuickProofStrip.tsx` — horizontal trust badges strip
- `src/components/home/ComparisonCards.tsx` — vertical comparison cards
- `src/components/home/AudienceSegmentation.tsx` — 4 audience cards
- `src/components/home/HowItWorksMinimal.tsx` — 3-step horizontal flow
- `src/components/home/FeaturedExamplesCurated.tsx` — curated 4-example grid

### Modified Files (9)

- `src/app/[locale]/page.tsx` — restructure section order
- `src/components/home/HeroSectionAnimated.tsx` — simplified hero
- `src/components/home/ExampleCard.tsx` — add data trust display
- `src/components/home/CodeExamplePanel.tsx` — add bullet list
- `src/components/home/FinalCta.tsx` — copy updates
- `src/components/home/index.ts` — exports
- `src/lib/i18n/locales/sr/common.json` — Serbian Cyrillic copy
- `src/lib/i18n/locales/lat/common.json` — Serbian Latin copy
- `src/lib/i18n/locales/en/common.json` — English copy

### Deleted Files (4)

- `src/components/home/ProblemStatement.tsx`
- `src/components/home/FeaturesGrid.tsx`
- `src/components/home/ComparisonTable.tsx`
- `src/components/home/GettingStartedGuide.tsx`

### Type Updates (2)

- `src/lib/examples/types.ts` — add `period?: string`
- `src/lib/examples/demo-gallery-examples.ts` — add period values to 4 examples

---

## Task 1: Update Types and Add Period Values

**Files:**

- Modify: `src/lib/examples/types.ts`
- Modify: `src/lib/examples/demo-gallery-examples.ts`

- [ ] **Step 1: Add period field to FeaturedExampleConfig type**

In `src/lib/examples/types.ts`, add `period?: string` to the interface:

```typescript
// Find the FeaturedExampleConfig interface and add:
period?: string; // e.g., "2020–2024"
```

- [ ] **Step 2: Add period values to the 4 curated examples**

In `src/lib/examples/demo-gallery-examples.ts`, add `period` field to these examples:

```typescript
// demo-population-pyramid (around line 140)
period: '2020–2024',

// demo-cancer-incidence (around line 370)
period: '2019–2023',

// demo-gdp-growth (around line 635)
period: '2015–2024',

// demo-diaspora-destinations (around line 825)
period: '2021–2023',
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/examples/types.ts src/lib/examples/demo-gallery-examples.ts
git commit -m "feat(types): add period field to featured examples"
```

---

## Task 2: Create QuickProofStrip Component

**Files:**

- Create: `src/components/home/QuickProofStrip.tsx`
- Modify: `src/components/home/index.ts`

- [ ] **Step 1: Create QuickProofStrip component**

```typescript
// src/components/home/QuickProofStrip.tsx
'use client';

import { BarChart3, Building2, Languages, Map } from 'lucide-react';

interface QuickProofStripProps {
  labels: {
    examples: string;
    officialSources: string;
    cyrillicLatin: string;
    serbianMaps: string;
  };
}

const proofItems = [
  { icon: BarChart3, key: 'examples' as const },
  { icon: Building2, key: 'officialSources' as const },
  { icon: Languages, key: 'cyrillicLatin' as const },
  { icon: Map, key: 'serbianMaps' as const },
];

export function QuickProofStrip({ labels }: QuickProofStripProps) {
  return (
    <section className="bg-slate-50 py-8" aria-label="Platform highlights">
      <div className="container-custom">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {proofItems.map(({ icon: Icon, key }) => (
            <div key={key} className="flex flex-col items-center text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gov-primary/10">
                <Icon className="h-6 w-6 text-gov-primary" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-gray-700">{labels[key]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Export from index.ts**

Add to `src/components/home/index.ts`:

```typescript
export { QuickProofStrip } from './QuickProofStrip';
```

- [ ] **Step 3: Verify component renders without errors**

Run: `npm run build 2>&1 | head -50`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/home/QuickProofStrip.tsx src/components/home/index.ts
git commit -m "feat(home): add QuickProofStrip component"
```

---

## Task 3: Create ComparisonCards Component

**Files:**

- Create: `src/components/home/ComparisonCards.tsx`
- Modify: `src/components/home/index.ts`

- [ ] **Step 1: Create ComparisonCards component**

```typescript
// src/components/home/ComparisonCards.tsx
import { Check, X, MapPin, Globe2, Database, Accessibility, Building2 } from 'lucide-react';

interface ComparisonItem {
  icon: React.ElementType;
  label: string;
  ourValue: string;
  genericValue: string;
}

interface ComparisonCardsProps {
  labels: {
    title: string;
    subtitle: string;
    columnOur: string;
    columnGeneric: string;
    rowGeography: { label: string; our: string; generic: string };
    rowLocalization: { label: string; our: string; generic: string };
    rowData: { label: string; our: string; generic: string };
    rowAccessibility: { label: string; our: string; generic: string };
    rowContext: { label: string; our: string; generic: string };
  };
}

const iconMap = {
  geography: MapPin,
  localization: Globe2,
  data: Database,
  accessibility: Accessibility,
  context: Building2,
};

export function ComparisonCards({ labels }: ComparisonCardsProps) {
  const items: ComparisonItem[] = [
    { icon: iconMap.geography, label: labels.rowGeography.label, ourValue: labels.rowGeography.our, genericValue: labels.rowGeography.generic },
    { icon: iconMap.localization, label: labels.rowLocalization.label, ourValue: labels.rowLocalization.our, genericValue: labels.rowLocalization.generic },
    { icon: iconMap.data, label: labels.rowData.label, ourValue: labels.rowData.our, genericValue: labels.rowData.generic },
    { icon: iconMap.accessibility, label: labels.rowAccessibility.label, ourValue: labels.rowAccessibility.our, genericValue: labels.rowAccessibility.generic },
    { icon: iconMap.context, label: labels.rowContext.label, ourValue: labels.rowContext.our, genericValue: labels.rowContext.generic },
  ];

  return (
    <section className="py-16" aria-labelledby="comparison-title">
      <div className="container-custom">
        <header className="mb-12 text-center">
          <h2 id="comparison-title" className="text-3xl font-bold text-gray-900">
            {labels.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">{labels.subtitle}</p>
        </header>

        <div className="mx-auto max-w-3xl space-y-4">
          {items.map((item, index) => (
            <article
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gov-primary/10">
                  <item.icon className="h-5 w-5 text-gov-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.label}</h3>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                      <div>
                        <span className="block text-xs font-medium text-gray-500">{labels.columnOur}</span>
                        <span className="text-sm text-gray-700">{item.ourValue}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                      <div>
                        <span className="block text-xs font-medium text-gray-500">{labels.columnGeneric}</span>
                        <span className="text-sm text-gray-500">{item.genericValue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Export from index.ts**

Add to `src/components/home/index.ts`:

```typescript
export { ComparisonCards } from './ComparisonCards';
```

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | head -50`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/home/ComparisonCards.tsx src/components/home/index.ts
git commit -m "feat(home): add ComparisonCards component"
```

---

## Task 4: Create AudienceSegmentation Component

**Files:**

- Create: `src/components/home/AudienceSegmentation.tsx`
- Modify: `src/components/home/index.ts`

- [ ] **Step 1: Create AudienceSegmentation component**

```typescript
// src/components/home/AudienceSegmentation.tsx
import Link from 'next/link';
import { ArrowRight, Users, Newspaper, Microscope, Code2 } from 'lucide-react';

import type { Locale } from '@/lib/i18n/config';

interface AudienceCard {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  external?: boolean;
}

interface AudienceSegmentationProps {
  locale: Locale;
  labels: {
    title: string;
    citizens: { title: string; subtitle: string; description: string };
    journalists: { title: string; subtitle: string; description: string };
    researchers: { title: string; subtitle: string; description: string };
    developers: { title: string; subtitle: string; description: string };
  };
}

const GITHUB_URL = 'https://github.com/acailic/vizualni-admin';

export function AudienceSegmentation({ locale, labels }: AudienceSegmentationProps) {
  const cards: AudienceCard[] = [
    {
      icon: Users,
      title: labels.citizens.title,
      subtitle: labels.citizens.subtitle,
      description: labels.citizens.description,
      href: `/${locale}/demo-gallery`,
    },
    {
      icon: Newspaper,
      title: labels.journalists.title,
      subtitle: labels.journalists.subtitle,
      description: labels.journalists.description,
      href: `/${locale}/demo-gallery?category=demographics`,
    },
    {
      icon: Microscope,
      title: labels.researchers.title,
      subtitle: labels.researchers.subtitle,
      description: labels.researchers.description,
      href: `/${locale}/demo-gallery?category=healthcare`,
    },
    {
      icon: Code2,
      title: labels.developers.title,
      subtitle: labels.developers.subtitle,
      description: labels.developers.description,
      href: GITHUB_URL,
      external: true,
    },
  ];

  return (
    <section className="bg-slate-50 py-16" aria-labelledby="audience-title">
      <div className="container-custom">
        <h2 id="audience-title" className="mb-12 text-center text-3xl font-bold text-gray-900">
          {labels.title}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => {
            const content = (
              <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gov-primary/10">
                  <card.icon className="h-6 w-6 text-gov-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.subtitle}</p>
                <p className="mt-2 flex-1 text-sm text-gray-600">{card.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gov-primary">
                  {card.external ? (
                    <>
                      GitHub
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      {locale === 'sr' ? 'Истражи' : locale === 'lat' ? 'Istraži' : 'Explore'}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </div>
              </article>
            );

            if (card.external) {
              return (
                <a
                  key={index}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={index} href={card.href} className="block">
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Export from index.ts**

Add to `src/components/home/index.ts`:

```typescript
export { AudienceSegmentation } from './AudienceSegmentation';
```

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | head -50`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/home/AudienceSegmentation.tsx src/components/home/index.ts
git commit -m "feat(home): add AudienceSegmentation component"
```

---

## Task 5: Create HowItWorksMinimal Component

**Files:**

- Create: `src/components/home/HowItWorksMinimal.tsx`
- Modify: `src/components/home/index.ts`

- [ ] **Step 1: Create HowItWorksMinimal component**

```typescript
// src/components/home/HowItWorksMinimal.tsx
import { Search, BarChart3, Share2, ChevronRight } from 'lucide-react';

interface HowItWorksMinimalProps {
  labels: {
    title: string;
    step1: string;
    step2: string;
    step3: string;
  };
}

const steps = [
  { icon: Search, key: 'step1' as const },
  { icon: BarChart3, key: 'step2' as const },
  { icon: Share2, key: 'step3' as const },
];

export function HowItWorksMinimal({ labels }: HowItWorksMinimalProps) {
  return (
    <section className="py-16" aria-labelledby="how-it-works-title">
      <div className="container-custom">
        <h2 id="how-it-works-title" className="mb-12 text-center text-3xl font-bold text-gray-900">
          {labels.title}
        </h2>

        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 md:flex-row md:gap-0">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center text-center">
                <div
                  className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gov-primary text-2xl font-bold text-white"
                  aria-label={`Step ${index + 1}`}
                >
                  {index + 1}
                </div>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gov-primary/10">
                  <step.icon className="h-6 w-6 text-gov-primary" aria-label={labels[step.key]} />
                </div>
                <span className="font-medium text-gray-900">{labels[step.key]}</span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="mx-6 h-6 w-6 text-gray-300 md:mx-8" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Export from index.ts**

Add to `src/components/home/index.ts`:

```typescript
export { HowItWorksMinimal } from './HowItWorksMinimal';
```

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | head -50`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/home/HowItWorksMinimal.tsx src/components/home/index.ts
git commit -m "feat(home): add HowItWorksMinimal component"
```

---

## Task 6: Create FeaturedExamplesCurated Component

**Files:**

- Create: `src/components/home/FeaturedExamplesCurated.tsx`
- Modify: `src/components/home/index.ts`

- [ ] **Step 1: Create FeaturedExamplesCurated component**

```typescript
// src/components/home/FeaturedExamplesCurated.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, LineChart, PieChart } from 'lucide-react';

import { ChartRenderer } from '@/components/charts/ChartRenderer';
import { getDemoExampleById } from '@/lib/examples/demo-gallery-examples';
import type { Locale } from '@/lib/i18n/config';
import type { ShowcaseCategory } from '@/lib/examples/types';

interface FeaturedExamplesCuratedProps {
  locale: Locale;
  labels: {
    title: string;
    subtitle: string;
    openInteractive: string;
    source: string;
    period: string;
    lastUpdated: string;
  };
}

const CURATED_IDS = [
  'demo-population-pyramid',
  'demo-cancer-incidence',
  'demo-gdp-growth',
  'demo-diaspora-destinations',
] as const;

const chartTypeIcons = {
  line: LineChart,
  bar: BarChart3,
  column: BarChart3,
  area: BarChart3,
  pie: PieChart,
  scatterplot: BarChart3,
  table: BarChart3,
  combo: BarChart3,
  map: BarChart3,
  'population-pyramid': BarChart3,
} as const;

const categoryLabels: Record<Locale, Record<ShowcaseCategory | 'all', string>> = {
  'sr-Cyrl': {
    all: 'Сви',
    demographics: 'Демографија',
    healthcare: 'Здравство',
    economy: 'Економија',
    migration: 'Миграције',
    society: 'Друштво',
  },
  'sr-Latn': {
    all: 'Svi',
    demographics: 'Demografija',
    healthcare: 'Zdravstvo',
    economy: 'Ekonomija',
    migration: 'Migracije',
    society: 'Društvo',
  },
  en: {
    all: 'All',
    demographics: 'Demographics',
    healthcare: 'Healthcare',
    economy: 'Economy',
    migration: 'Migration',
    society: 'Society',
  },
};

const chartTypeLabels: Record<Locale, Record<string, string>> = {
  'sr-Cyrl': {
    line: 'Линијски',
    bar: 'Тракасти',
    column: 'Стубичасти',
    area: 'Површински',
    pie: 'Питасти',
    'population-pyramid': 'Пирамида',
  },
  'sr-Latn': {
    line: 'Linijski',
    bar: 'Trakasti',
    column: 'Stubičasti',
    area: 'Površinski',
    pie: 'Pitasti',
    'population-pyramid': 'Piramida',
  },
  en: {
    line: 'Line',
    bar: 'Bar',
    column: 'Column',
    area: 'Area',
    pie: 'Pie',
    'population-pyramid': 'Pyramid',
  },
};

export function FeaturedExamplesCurated({ locale, labels }: FeaturedExamplesCuratedProps) {
  const examples = CURATED_IDS.map((id) => getDemoExampleById(id)).filter(Boolean);

  return (
    <section className="py-16" aria-labelledby="featured-examples-title">
      <div className="container-custom">
        <header className="mb-12 text-center">
          <h2 id="featured-examples-title" className="text-3xl font-bold text-gray-900">
            {labels.title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">{labels.subtitle}</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {examples.map((example) => {
            if (!example) return null;

            const localeKey = locale === 'sr-Cyrl' ? 'sr' : locale === 'sr-Latn' ? 'lat' : 'en';
const title = example.title[localeKey] || example.title.en;
            const description = example.description?.[locale === 'sr' ? 'sr' : locale === 'lat' ? 'lat' : 'en'] || example.description?.en || '';
            const chartType = example.chartConfig.type as keyof typeof chartTypeIcons;
            const ChartIcon = chartTypeIcons[chartType] || BarChart3;
            const category = example.category;

            return (
              <article
                key={example.id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div className="aspect-video bg-gray-50">
                  {example.inlineData && (
                    <ChartRenderer
                      config={example.chartConfig}
                      data={example.inlineData.observations}
                      height={200}
                      locale={locale}
                      previewMode={true}
                      preselectedFilters={example.preselectedFilters}
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-1 font-semibold text-gray-900">
                    {title}
                  </h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-600">
                    {description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      <ChartIcon className="h-3 w-3" aria-hidden="true" />
                      {chartTypeLabels[locale]?.[chartType] || chartType}
                    </span>
                    {category && (
                      <span className="inline-flex items-center rounded-full bg-gov-primary/10 px-2.5 py-1 text-xs font-medium text-gov-primary">
                        {categoryLabels[locale][category]}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 space-y-0.5 text-xs text-gray-500">
                    {example.dataSource && (
                      <p>{labels.source}: {example.dataSource}</p>
                    )}
                    {example.period && (
                      <p>{labels.period}: {example.period}</p>
                    )}
                    {example.lastUpdated && (
                      <p>{labels.lastUpdated}: {example.lastUpdated}</p>
                    )}
                  </div>

                  <Link
                    href={`/${locale}/demo-gallery?example=${example.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gov-primary hover:underline"
                  >
                    {labels.openInteractive}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Export from index.ts**

Add to `src/components/home/index.ts`:

```typescript
export { FeaturedExamplesCurated } from './FeaturedExamplesCurated';
```

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | head -50`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/home/FeaturedExamplesCurated.tsx src/components/home/index.ts
git commit -m "feat(home): add FeaturedExamplesCurated component"
```

---

## Task 7: Update HeroSectionAnimated Component

**Files:**

- Modify: `src/components/home/HeroSectionAnimated.tsx`

- [ ] **Step 1: Update hero to use Population Pyramid and simplified structure**

Key changes to `src/components/home/HeroSectionAnimated.tsx`:

1. Import `getDemoExampleById` instead of `gdpTimeSeriesConfig`:

```typescript
import { getDemoExampleById } from '@/lib/examples/demo-gallery-examples';
```

2. Change preview example:

```typescript
const previewExample = getDemoExampleById('demo-population-pyramid');
```

3. Update the hero to have:
   - Simplified headline from locale
   - Single primary CTA button
   - Two secondary text links (not buttons)
   - Compact trust badges strip

4. Remove the secondary GitHub button, keep as text link only

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | head -50`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/home/HeroSectionAnimated.tsx
git commit -m "feat(home): simplify hero section, use population pyramid"
```

---

## Task 8: Update CodeExamplePanel Component

**Files:**

- Modify: `src/components/home/CodeExamplePanel.tsx`

- [ ] **Step 1: Add bullet list above code block**

Add a bullet list section above the existing code block in `src/components/home/CodeExamplePanel.tsx`:

```typescript
// Add after the header section, before the code block:
<div className="mb-6 flex flex-wrap gap-4">
  <div className="flex items-center gap-2">
    <span className="h-2 w-2 rounded-full bg-gov-primary" aria-hidden="true" />
    <span className="text-sm text-gray-700">{labels.reactComponents}</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="h-2 w-2 rounded-full bg-gov-primary" aria-hidden="true" />
    <span className="text-sm text-gray-700">{labels.localizedCharts}</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="h-2 w-2 rounded-full bg-gov-primary" aria-hidden="true" />
    <span className="text-sm text-gray-700">{labels.serbianMaps}</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="h-2 w-2 rounded-full bg-gov-primary" aria-hidden="true" />
    <span className="text-sm text-gray-700">{labels.typescript}</span>
  </div>
</div>
```

Add corresponding labels prop:

```typescript
interface CodeExamplePanelProps {
  // ... existing props
  labels: {
    // ... existing
    reactComponents: string;
    localizedCharts: string;
    serbianMaps: string;
    typescript: string;
  };
}
```

- [ ] **Step 2: Export alias in index.ts**

Add to `src/components/home/index.ts`:

```typescript
export { CodeExamplePanel as DeveloperSectionCompact } from './CodeExamplePanel';
```

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | head -50`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/home/CodeExamplePanel.tsx src/components/home/index.ts
git commit -m "feat(home): add bullet list to CodeExamplePanel"
```

---

## Task 9: Update FinalCta Component

**Files:**

- Modify: `src/components/home/FinalCta.tsx`

- [ ] **Step 1: Update FinalCta copy and structure**

Update `src/components/home/FinalCta.tsx` to use new locale keys for title and subtitle. The existing structure is fine, just update the prop usage to read from new locale keys.

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | head -50`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/home/FinalCta.tsx
git commit -m "feat(home): update FinalCta copy"
```

---

## Task 10: Update Locale Files

**Files:**

- Modify: `src/lib/i18n/locales/sr/common.json`
- Modify: `src/lib/i18n/locales/lat/common.json`
- Modify: `src/lib/i18n/locales/en/common.json`

- [ ] **Step 1: Add Serbian Cyrillic locale keys**

Add to `src/lib/i18n/locales/sr/common.json` under `homepage`:

```json
{
  "homepage": {
    "hero": {
      "title": "Јавни подаци Србије",
      "subtitle": "Најлакши начин да истражите јавне податке Србије",
      "tryDemoCta": "Испробај демо галерију",
      "examplesLink": "Примери података",
      "docsLink": "Документација",
      "previewAlt": "Преглед пирамиде старости Србије"
    },
    "quickProof": {
      "examples": "28+ интерактивних примера",
      "officialSources": "Званични извори података",
      "cyrillicLatin": "Ћирилица и латиница",
      "serbianMaps": "Уграђене мапе Србије"
    },
    "featuredExamples": {
      "title": "Истакнути примери",
      "subtitle": "Стварне визуелизације од званичних владиних података",
      "openInteractive": "Отвори интерактивно",
      "source": "Извор",
      "period": "Период",
      "lastUpdated": "Ажурирано"
    },
    "comparison": {
      "title": "Зашто не генерички алати?",
      "subtitle": "Изграђено од првог дана за српске јавне податке",
      "columnOur": "Визуелни Админ",
      "columnGeneric": "Генеричке библиотеке",
      "rowGeography": {
        "label": "Српска географија",
        "our": "Уграђене општине, окрузи, региони",
        "generic": "Ручно GeoJSON потребно"
      },
      "rowLocalization": {
        "label": "Ћирилица и латиница",
        "our": "Изворна, тестирана",
        "generic": "Често покварена"
      },
      "rowData": {
        "label": "Владини подаци",
        "our": "28+ примера учитано",
        "generic": "Ви чистите податке"
      },
      "rowAccessibility": {
        "label": "Приступачност",
        "our": "WCAG 2.1 AA подразумевано",
        "generic": "Ваша одговорност"
      }
    },
    "audience": {
      "title": "За кога је ово?",
      "citizens": {
        "title": "Грађани",
        "subtitle": "Разумите податке",
        "description": "Истражите податке о својој општини"
      },
      "journalists": {
        "title": "Новинари",
        "subtitle": "Креирајте визуелне приче",
        "description": "Претворите податке у графиконе за чланке"
      },
      "researchers": {
        "title": "Истраживачи",
        "subtitle": "Анализирајте трендове",
        "description": "Откријте обрасце кроз време и регионе"
      },
      "developers": {
        "title": "Програмери",
        "subtitle": "Уградите визуелизације",
        "description": "Користите отворени код за своје пројекте"
      }
    },
    "howItWorks": {
      "title": "Како функционише",
      "step1": "Пронађи",
      "step2": "Визуелизуј",
      "step3": "Подели"
    },
    "developerSection": {
      "title": "За програмере",
      "reactComponents": "React компоненте",
      "localizedCharts": "Локализовани графикони",
      "serbianMaps": "Српске мапе",
      "typescript": "TypeScript подршка",
      "viewDocs": "Документација",
      "viewGithub": "GitHub",
      "gettingStarted": "Како почети"
    },
    "finalCta": {
      "title": "Спремни за истраживање?",
      "subtitle": "Погледајте шта српски јавни подаци могу да открију",
      "tryDemo": "Испробај демо",
      "starGithub": "Звездица на GitHub-у",
      "viewDocs": "Погледај документацију"
    }
  }
}
```

- [ ] **Step 2: Add Serbian Latin locale keys**

Transliterate the Serbian Cyrillic content to Latin script in `src/lib/i18n/locales/lat/common.json`.

- [ ] **Step 3: Add English locale keys**

Add to `src/lib/i18n/locales/en/common.json`:

```json
{
  "homepage": {
    "hero": {
      "title": "Serbian Public Data",
      "subtitle": "The easiest way to explore Serbian public data",
      "tryDemoCta": "Try Demo Gallery",
      "examplesLink": "Data Examples",
      "docsLink": "Documentation",
      "previewAlt": "Preview of Serbia population pyramid"
    },
    "quickProof": {
      "examples": "28+ Interactive Examples",
      "officialSources": "Official Data Sources",
      "cyrillicLatin": "Cyrillic & Latin",
      "serbianMaps": "Built-in Serbian Maps"
    },
    "featuredExamples": {
      "title": "Featured Examples",
      "subtitle": "Real visualizations from official government data",
      "openInteractive": "Open Interactive",
      "source": "Source",
      "period": "Period",
      "lastUpdated": "Updated"
    },
    "comparison": {
      "title": "Why Not Generic Tools?",
      "subtitle": "Built from day one for Serbian public data"
    },
    "audience": {
      "title": "Who Is This For?",
      "citizens": {
        "title": "Citizens",
        "subtitle": "Understand Data",
        "description": "Explore data about your municipality"
      },
      "journalists": {
        "title": "Journalists",
        "subtitle": "Create Visual Stories",
        "description": "Turn data into charts for articles"
      },
      "researchers": {
        "title": "Researchers",
        "subtitle": "Analyze Trends",
        "description": "Discover patterns across time and regions"
      },
      "developers": {
        "title": "Developers",
        "subtitle": "Embed Visualizations",
        "description": "Use open source for your projects"
      }
    },
    "howItWorks": {
      "title": "How It Works",
      "step1": "Find",
      "step2": "Visualize",
      "step3": "Share"
    },
    "developerSection": {
      "title": "For Developers",
      "reactComponents": "React Components",
      "localizedCharts": "Localized Charts",
      "serbianMaps": "Serbian Maps",
      "typescript": "TypeScript Support",
      "viewDocs": "Documentation",
      "viewGithub": "GitHub",
      "gettingStarted": "Getting Started"
    },
    "finalCta": {
      "title": "Ready to Explore?",
      "subtitle": "See what Serbian public data can reveal"
    }
  }
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build 2>&1 | head -50`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/lib/i18n/locales/sr/common.json src/lib/i18n/locales/lat/common.json src/lib/i18n/locales/en/common.json
git commit -m "feat(i18n): add homepage redesign locale keys"
```

---

## Task 11: Update Main Page Structure

**Files:**

- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Restructure page.tsx with new section order**

Update `src/app/[locale]/page.tsx` to use the new component order:

```tsx
import {
  AudienceSegmentation,
  CodeExamplePanel,
  ComparisonCards,
  FeaturedExamplesCurated,
  FinalCta,
  HeroSectionAnimated,
  HowItWorksMinimal,
  QuickProofStrip,
} from '@/components/home';

// In the component return:
<main className='container-custom py-12'>
  {/* 1. Hero */}
  <HeroSectionAnimated
    locale={locale}
    title={messages.homepage.hero.title}
    subtitle={messages.homepage.hero.subtitle}
    primaryCta={messages.homepage.hero.tryDemoCta}
    secondaryCta={messages.homepage.hero.docsLink}
    socialProofLabels={{
      openSource: messages.homepage.socialProof.badge.openSource,
      accessibility: messages.homepage.socialProof.badge.accessibility,
      multilingual: messages.homepage.socialProof.badge.multilingual,
      examples: messages.homepage.socialProof.badge.examples,
    }}
    previewAlt={messages.homepage.hero.previewAlt}
  />

  {/* 2. Quick Proof Strip */}
  <QuickProofStrip
    labels={{
      examples: messages.homepage.quickProof.examples,
      officialSources: messages.homepage.quickProof.officialSources,
      cyrillicLatin: messages.homepage.quickProof.cyrillicLatin,
      serbianMaps: messages.homepage.quickProof.serbianMaps,
    }}
  />

  {/* 3. Featured Examples */}
  <FeaturedExamplesCurated
    locale={locale}
    labels={{
      title: messages.homepage.featuredExamples.title,
      subtitle: messages.homepage.featuredExamples.subtitle,
      openInteractive: messages.homepage.featuredExamples.openInteractive,
      source: messages.homepage.featuredExamples.source,
      period: messages.homepage.featuredExamples.period,
      lastUpdated: messages.homepage.featuredExamples.lastUpdated,
    }}
  />

  {/* 4. Comparison Cards */}
  <ComparisonCards
    labels={{
      title: messages.homepage.comparison.title,
      subtitle: messages.homepage.comparison.subtitle,
      columnOur: messages.homepage.comparison.columnOur,
      columnGeneric: messages.homepage.comparison.columnGeneric,
      rowGeography: {
        label: messages.homepage.comparison.rowGeography.label,
        our: messages.homepage.comparison.rowGeography.our,
        generic: messages.homepage.comparison.rowGeography.generic,
      },
      rowLocalization: {
        label: messages.homepage.comparison.rowLocalization.label,
        our: messages.homepage.comparison.rowLocalization.our,
        generic: messages.homepage.comparison.rowLocalization.generic,
      },
      rowData: {
        label: messages.homepage.comparison.rowData.label,
        our: messages.homepage.comparison.rowData.our,
        generic: messages.homepage.comparison.rowData.generic,
      },
      rowAccessibility: {
        label: messages.homepage.comparison.rowAccessibility.label,
        our: messages.homepage.comparison.rowAccessibility.our,
        generic: messages.homepage.comparison.rowAccessibility.generic,
      },
      rowContext: {
        label: messages.homepage.comparison.rowContext.label,
        our: messages.homepage.comparison.rowContext.our,
        generic: messages.homepage.comparison.rowContext.generic,
      },
    }}
  />

  {/* 5. Audience Segmentation */}
  <AudienceSegmentation
    locale={locale}
    labels={{
      title: messages.homepage.audience.title,
      citizens: {
        title: messages.homepage.audience.citizens.title,
        subtitle: messages.homepage.audience.citizens.subtitle,
        description: messages.homepage.audience.citizens.description,
      },
      journalists: {
        title: messages.homepage.audience.journalists.title,
        subtitle: messages.homepage.audience.journalists.subtitle,
        description: messages.homepage.audience.journalists.description,
      },
      researchers: {
        title: messages.homepage.audience.researchers.title,
        subtitle: messages.homepage.audience.researchers.subtitle,
        description: messages.homepage.audience.researchers.description,
      },
      developers: {
        title: messages.homepage.audience.developers.title,
        subtitle: messages.homepage.audience.developers.subtitle,
        description: messages.homepage.audience.developers.description,
      },
    }}
  />

  {/* 6. How It Works */}
  <HowItWorksMinimal
    labels={{
      title: messages.homepage.howItWorks.title,
      step1: messages.homepage.howItWorks.step1,
      step2: messages.homepage.howItWorks.step2,
      step3: messages.homepage.howItWorks.step3,
    }}
  />

  {/* 7. Developer Section */}
  <CodeExamplePanel
    title={messages.homepage.codeExample.title}
    subtitle={messages.homepage.codeExample.subtitle}
    description={messages.homepage.codeExample.description}
    viewOnGithub={messages.homepage.codeExample.viewOnGithub}
    readDocs={messages.homepage.codeExample.readDocs}
    docsUrl={docsUrl}
    labels={{
      reactComponents: messages.homepage.developerSection.reactComponents,
      localizedCharts: messages.homepage.developerSection.localizedCharts,
      serbianMaps: messages.homepage.developerSection.serbianMaps,
      typescript: messages.homepage.developerSection.typescript,
    }}
  />

  {/* 8. Final CTA */}
  <FinalCta
    locale={locale}
    title={messages.homepage.finalCta.title}
    subtitle={messages.homepage.finalCta.subtitle}
    tryDemo={messages.homepage.finalCta.tryDemo}
    starGithub={messages.homepage.finalCta.starGithub}
    viewDocs={messages.homepage.finalCta.viewDocs}
    docsUrl={docsUrl}
  />
</main>;
```

- [ ] **Step 2: Remove old section imports and usage**

Remove imports and usage for:

- `ProblemStatement`
- `FeaturesGrid`
- `ComparisonTable`
- `GettingStartedGuide`
- `ShowcaseGrid` (if used)
- `UseCases` (replaced by AudienceSegmentation)

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | head -50`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat(home): restructure landing page with new sections"
```

---

## Task 12: Delete Deprecated Components

**Files:**

- Delete: `src/components/home/ProblemStatement.tsx`
- Delete: `src/components/home/FeaturesGrid.tsx`
- Delete: `src/components/home/ComparisonTable.tsx`
- Delete: `src/components/home/GettingStartedGuide.tsx`
- Modify: `src/components/home/index.ts`

- [ ] **Step 1: Remove exports from index.ts**

Remove from `src/components/home/index.ts`:

```typescript
export { ProblemStatement } from './ProblemStatement';
export { FeaturesGrid } from './FeaturesGrid';
export { ComparisonTable } from './ComparisonTable';
export { GettingStartedGuide } from './GettingStartedGuide';
```

- [ ] **Step 2: Delete the component files**

```bash
rm src/components/home/ProblemStatement.tsx
rm src/components/home/FeaturesGrid.tsx
rm src/components/home/ComparisonTable.tsx
rm src/components/home/GettingStartedGuide.tsx
```

- [ ] **Step 3: Verify build**

Run: `npm run build 2>&1 | head -50`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor(home): remove deprecated components"
```

---

## Task 13: Final Verification

**Files:**

- None (verification only)

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Run linting**

Run: `npm run lint`
Expected: No lint errors

- [ ] **Step 3: Start dev server and visually verify**

Run: `npm run dev`
Expected: Dev server starts, visit http://localhost:3000 to verify:

- Hero shows Population Pyramid preview
- Quick proof strip shows 4 items
- Featured examples shows 4 curated cards with data trust info
- Comparison cards render correctly
- Audience segmentation shows 4 cards
- How it works shows 3 steps
- Developer section has bullet list
- Final CTA renders correctly

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix(home): final landing page adjustments"
```

---

## Summary

| Task | Description             | Files              |
| ---- | ----------------------- | ------------------ |
| 1    | Types and period values | 2 files            |
| 2    | QuickProofStrip         | 1 new, 1 modify    |
| 3    | ComparisonCards         | 1 new, 1 modify    |
| 4    | AudienceSegmentation    | 1 new, 1 modify    |
| 5    | HowItWorksMinimal       | 1 new, 1 modify    |
| 6    | FeaturedExamplesCurated | 1 new, 1 modify    |
| 7    | HeroSectionAnimated     | 1 modify           |
| 8    | CodeExamplePanel        | 1 modify           |
| 9    | FinalCta                | 1 modify           |
| 10   | Locale files            | 3 modify           |
| 11   | Main page structure     | 1 modify           |
| 12   | Delete deprecated       | 4 delete, 1 modify |
| 13   | Final verification      | -                  |

**Total: 5 new files, 12 modified files, 4 deleted files, 13 tasks**
