# Chart Gallery Design Document

**Date:** 2026-03-13
**Status:** Draft
**Author:** Claude

## Overview

A showcase gallery of pre-built demo charts using Serbian government data. The gallery serves two purposes:

1. **Landing Page Showcase** - Display featured charts to demonstrate platform capabilities
2. **Configurator Templates** - Browse and load pre-configured chart templates into the chart builder

## Goals

- Showcase the visualization capabilities of the platform with real Serbian data
- Provide ready-to-use templates for users starting with the chart builder
- Build an expandable system that's easy to add new demo charts to

## Non-Goals

- Full data exploration/analysis features (that's the main app)
- User-uploaded templates
- Template sharing between users

## Existing Infrastructure

The project already has a demo chart system that we will extend:

- **`src/lib/examples/types.ts`** - `FeaturedExampleConfig` interface with inlineData support
- **`src/components/gallery/`** - Gallery components for user-saved charts (GalleryPage, GalleryChartCard, etc.)
- **`src/data/*.json`** - Data files imported at build time

We will **extend the existing FeaturedExampleConfig** rather than create a parallel system.

## Architecture

### Directory Structure

```
src/
├── lib/
│   └── examples/
│       ├── types.ts                    # EXTEND FeaturedExampleConfig
│       └── showcase-examples.ts        # NEW: Showcase chart configs
│
├── components/
│   └── showcase/                       # NEW directory (not gallery/)
│       ├── index.ts                    # Exports
│       ├── ShowcaseGrid.tsx            # Landing page grid
│       ├── ShowcaseCard.tsx            # Single chart card
│       ├── TemplatesPanel.tsx          # Configurator templates browser
│       └── TemplatePreviewModal.tsx    # Preview modal
│
├── data/
│   ├── serbian-population.json         # EXISTING pattern
│   ├── serbia-migration.json           # NEW
│   ├── serbia-regions.json             # NEW
│   └── ...                             # More data files
│
└── app/
    └── [locale]/
        └── create/
            └── templates/
                └── page.tsx            # NEW: Templates browser page
```

### Key Design Decisions

1. **Extend existing types** - Add fields to `FeaturedExampleConfig` instead of creating `DemoChartConfig`
2. **Use inlineData pattern** - Data imported at build time for fast loading (existing pattern)
3. **Separate directory** - `src/components/showcase/` to avoid conflict with `src/components/gallery/`
4. **Reuses ChartRenderer** - Same rendering pipeline as existing examples

## Type Extensions

### Extend FeaturedExampleConfig

```typescript
// src/lib/examples/types.ts - ADD these fields

export interface FeaturedExampleConfig {
  // ... existing fields ...
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  datasetId: string;
  resourceUrl: string;
  chartConfig: ChartConfig;
  inlineData?: ParsedDataset;
  preselectedFilters?: PreselectedFilters;

  // NEW fields for showcase:
  /** Category for filtering/grouping */
  category?: 'demographics' | 'healthcare' | 'economy' | 'migration';
  /** Tags for search */
  tags?: string[];
  /** Show on landing page? */
  featured?: boolean;
  /** Data source attribution */
  dataSource?: string;
  /** Last updated date */
  lastUpdated?: string;
}
```

## Component Specifications

### ShowcaseCard

```typescript
interface ShowcaseCardProps {
  example: FeaturedExampleConfig;
  showEditButton?: boolean;
  locale: Locale;
}
```

**Behavior:**

- Renders card with chart preview (using ChartRenderer), title, description, category badge
- Hover effect to highlight the card
- "Edit in Configurator" button navigates to `/create?template={id}`

### ShowcaseGrid

```typescript
interface ShowcaseGridProps {
  examples: FeaturedExampleConfig[];
  columns?: 2 | 3 | 4;
  showEditButton?: boolean;
  categoryFilter?: boolean;
  locale: Locale;
}
```

**Behavior:**

- Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
- Optional category filter pills at top
- Lazy loads charts as they scroll into view using IntersectionObserver

### TemplatesPanel

```typescript
interface TemplatesPanelProps {
  onSelectTemplate: (example: FeaturedExampleConfig) => void;
  locale: Locale;
}
```

**Behavior:**

- Full-height panel for use inside configurator
- Sidebar with category navigation
- Grid of template cards
- Click calls `onSelectTemplate` with the full config

### TemplatePreviewModal

```typescript
interface TemplatePreviewModalProps {
  example: FeaturedExampleConfig;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: () => void;
  locale: Locale;
}
```

**Behavior:**

- Modal overlay showing larger chart preview
- "Use this template" button
- Shows data preview table (first 10 rows)

## Data Strategy

Use the **existing inlineData pattern** for all showcase charts:

```typescript
// src/lib/examples/showcase-examples.ts
import populationData from '@/data/serbian-population.json';
import migrationData from '@/data/serbia-migration.json';
// ...

export const showcaseExamples: FeaturedExampleConfig[] = [
  {
    id: 'population-trend',
    title: {
      sr: 'Тренд популације',
      lat: 'Trend populacije',
      en: 'Population Trend',
    },
    description: {
      sr: 'Пад популације са 7.5M (1991) на 6.6M (2024)',
      lat: 'Pad populacije sa 7.5M (1991) na 6.6M (2024)',
      en: 'Population decline from 7.5M (1991) to 6.6M (2024)',
    },
    datasetId: 'showcase-population',
    resourceUrl: '', // Not needed for inline data
    chartConfig: {
      /* ... */
    },
    inlineData: populationData,
    category: 'demographics',
    featured: true,
    dataSource: 'Statistical Office of Serbia',
    lastUpdated: '2024-12-01',
  },
  // ... more examples
];
```

**Why inlineData?**

- Fast loading (imported at build time, no fetch)
- Works offline
- Same pattern as existing featured examples
- Simplifies configurator integration

## Integration Points

### Landing Page

Add a showcase section to the home page featuring 5 highlighted charts:

```tsx
// src/app/[locale]/page.tsx
import { ShowcaseGrid } from '@/components/showcase';
import { showcaseExamples } from '@/lib/examples/showcase-examples';

export default function HomePage({ params: { locale } }) {
  const featuredCharts = showcaseExamples.filter((e) => e.featured);

  return (
    <main>
      <HeroSection />
      <section className='py-16'>
        <h2>Explore Serbian Data</h2>
        <ShowcaseGrid
          examples={featuredCharts}
          columns={3}
          showEditButton={true}
          locale={locale}
        />
      </section>
    </main>
  );
}
```

### Configurator Integration

**Option A: Templates Panel in Sidebar**

Add a "Templates" button to `ConfiguratorSidebar.tsx` that opens a slide-out panel:

```tsx
// src/components/configurator/ConfiguratorSidebar.tsx
// Add after dataset selection buttons:
<Button onClick={() => setShowTemplates(true)}>
  <FileTextIcon /> Browse Templates
</Button>;

{
  showTemplates && (
    <TemplatesPanel onSelectTemplate={handleApplyTemplate} locale={locale} />
  );
}
```

**handleApplyTemplate behavior:**

1. Receive `FeaturedExampleConfig` from TemplatesPanel
2. Set configurator state with `example.chartConfig`
3. Set dataset with `example.inlineData`
4. Apply any `example.preselectedFilters`
5. Navigate to Preview step

**Option B: Separate Templates Page**

Create `/create/templates` page with full templates browser, then link from configurator.

**Recommendation:** Option A for simpler UX - templates accessible without leaving configurator.

### "Edit in Configurator" Behavior

When user clicks "Edit in Configurator" on a showcase card:

1. Navigate to `/create?template={exampleId}`
2. On configurator load, check URL for `template` param
3. If present, find the example in `showcaseExamples`
4. Load `inlineData` and `chartConfig` into configurator state
5. Apply `preselectedFilters` if any
6. Start at Preview step (user can go back to customize)

```tsx
// src/app/[locale]/create/page.tsx
import { showcaseExamples } from '@/lib/examples/showcase-examples';

export default function CreatePage({ searchParams, params: { locale } }) {
  const templateId = searchParams.template;

  useEffect(() => {
    if (templateId) {
      const example = showcaseExamples.find((e) => e.id === templateId);
      if (example) {
        // Load into configurator state
        setChartData(example.inlineData);
        setChartConfig(example.chartConfig);
        setCurrentStep('preview');
      }
    }
  }, [templateId]);
}
```

## Initial Demo Charts

8 charts to build initially:

| Chart                         | Type                | Category     | Featured |
| ----------------------------- | ------------------- | ------------ | -------- |
| Population Trend              | Line                | demographics | Yes      |
| Regional GDP Per Capita       | Bar                 | economy      | Yes      |
| Migration Balance             | Area                | migration    | Yes      |
| Diaspora Destinations         | Column (horizontal) | migration    | Yes      |
| Healthcare Workers vs EU      | Grouped Bar         | healthcare   | Yes      |
| Birth Rate Decline            | Line + Reference    | demographics | No       |
| Life Expectancy by Region     | Column              | healthcare   | No       |
| Fertility Rate vs Replacement | Combo               | demographics | No       |

**Data sources:** Statistical Office of Serbia, WHO, World Bank, UNDESA

## Interactivity Level

- **Static rendering** - Charts render cleanly without interaction
- **Basic interactivity** - Hover tooltips, clickable legends to toggle series
- **No** complex filters, time range brushes, or zoom for demo charts

## i18n Considerations

- All titles and descriptions use `LocalizedText` with sr/lat/en keys
- Category labels use existing i18n system
- Data values remain locale-agnostic

## Accessibility

- Charts wrapped in existing `ChartContainer` with ARIA labels
- Category badges use semantic colors with sufficient contrast
- Keyboard navigation for template browser

## Future Expansion

The system is designed to easily add new charts:

1. Add data file to `src/data/`
2. Add config to `showcaseExamples` array in `src/lib/examples/showcase-examples.ts`
3. Set `featured: true` to show on landing page

## Open Questions

None at this time.
