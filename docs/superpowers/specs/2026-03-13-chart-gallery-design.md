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

## Architecture

### Directory Structure

```
src/
├── components/
│   └── gallery/
│       ├── index.ts                    # Exports
│       ├── GalleryGrid.tsx             # Landing page grid (2-3 columns)
│       ├── GalleryCard.tsx             # Single chart card with title/desc
│       ├── GalleryCarousel.tsx         # Optional carousel variant
│       ├── TemplatesBrowser.tsx        # Full-page browser for configurator
│       ├── TemplatePreview.tsx         # Preview modal in configurator
│       └── charts/                     # Pre-configured demo charts
│           ├── index.ts                # Exports all demos
│           ├── PopulationTrend.tsx     # Line chart
│           ├── RegionalGDP.tsx         # Bar chart
│           ├── MigrationBalance.tsx    # Area chart
│           ├── DiasporaDestinations.tsx # Horizontal bar
│           ├── HealthcareComparison.tsx # Grouped bar
│           ├── LifeExpectancy.tsx      # Column chart
│           ├── SerbiaMap.tsx           # Choropleth map
│           └── CancerScreening.tsx     # Column chart
│
├── data/
│   └── demo-charts/                    # JSON datasets for templates
│       ├── serbia-population.json
│       ├── serbia-regions.json
│       ├── serbia-migration.json
│       └── ...
│
└── config/
    └── demo-charts.ts                  # Metadata registry (title, desc, category)
```

### Key Design Decisions

1. **Component-based approach** - Each demo chart is a self-contained component wrapping existing chart types
2. **Mix data strategy** - Hardcoded data for landing page (fast), JSON files for configurator (loadable)
3. **Config-driven metadata** - Single registry file for titles, descriptions, categories
4. **Reuses existing charts** - No new chart types, just pre-configured instances

## Component Specifications

### GalleryCard

```typescript
interface GalleryCardProps {
  chartId: string;
  title: string;
  description: string;
  category: 'demographics' | 'healthcare' | 'economy' | 'migration';
  chart: React.ReactNode;
  showEditButton?: boolean;
  onEdit?: () => void;
}
```

**Behavior:**

- Renders card with chart preview, title, description, category badge
- Hover effect to highlight the card
- Optional "Edit in Configurator" button

### GalleryGrid

```typescript
interface GalleryGridProps {
  charts: DemoChartConfig[];
  columns?: 2 | 3 | 4;
  showEditButton?: boolean;
  categoryFilter?: boolean;
}
```

**Behavior:**

- Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
- Optional category filter pills at top
- Lazy loads charts as they scroll into view

### TemplatesBrowser

```typescript
interface TemplatesBrowserProps {
  onSelectTemplate: (templateId: string, data: any) => void;
}
```

**Behavior:**

- Full-page view for use inside configurator
- Sidebar with category navigation
- Grid of template cards
- Click loads template data into chart builder

### TemplatePreview

```typescript
interface TemplatePreviewProps {
  templateId: string;
  onClose: () => void;
  onUseTemplate: () => void;
}
```

**Behavior:**

- Modal overlay showing larger chart preview
- "Use this template" button
- Shows data preview table

## Data Structure

### Config Registry

```typescript
export interface DemoChartConfig {
  id: string;
  title: string;
  titleKey?: string; // i18n key
  description: string;
  descriptionKey?: string; // i18n key
  category: 'demographics' | 'healthcare' | 'economy' | 'migration';
  chartType:
    | 'bar'
    | 'line'
    | 'area'
    | 'pie'
    | 'map'
    | 'column'
    | 'combo'
    | 'table';
  tags?: string[];
  featured?: boolean; // Show on landing page?
  dataSource?: string;
  lastUpdated?: string;
  component: React.ComponentType;
  jsonDataPath?: string; // For loading into configurator
}
```

### JSON Data Format

```json
{
  "meta": {
    "title": "Serbia Population Trend",
    "source": "Statistical Office of Serbia",
    "lastUpdated": "2024-12-01"
  },
  "data": [
    { "year": 1991, "population": 7580000 },
    { "year": 2002, "population": 7498001 }
  ],
  "chartConfig": {
    "xField": "year",
    "yField": "population",
    "chartType": "line"
  }
}
```

## Integration Points

### Landing Page

Add a gallery section to the home page featuring 5 highlighted charts:

```tsx
// src/app/[locale]/page.tsx
<section className='py-16'>
  <h2>Explore Serbian Data</h2>
  <GalleryGrid charts={featuredCharts} columns={3} showEditButton={true} />
</section>
```

### Configurator Templates Tab

Add a "Templates" tab to the configurator that opens TemplatesBrowser:

```tsx
// New tab in configurator
<TemplatesPanel onApplyTemplate={handleApplyTemplate} />
```

When a template is selected:

1. Fetch the JSON data file
2. Extract `data` and `chartConfig`
3. Load into configurator state
4. Navigate to preview step

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

- All titles and descriptions support i18n via `titleKey` and `descriptionKey`
- JSON data files remain locale-agnostic
- Category labels use existing i18n keys

## Accessibility

- Charts wrapped in existing `ChartContainer` with ARIA labels
- Category badges use semantic colors with sufficient contrast
- Keyboard navigation for template browser

## Future Expansion

The system is designed to easily add new charts:

1. Create component in `src/components/gallery/charts/`
2. Add JSON data file in `public/data/demo-charts/`
3. Register in `src/config/demo-charts.ts`
4. Add i18n keys if needed

## Open Questions

None at this time.
