# Chart Gallery Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a showcase gallery of pre-built demo charts using Serbian government data, with landing page integration and configurator templates panel.

**Architecture:** Extend existing FeaturedExampleConfig type with showcase fields, create new showcase/ components that use existing ChartRenderer with inlineData pattern

**Tech Stack:** Next.js 14, TypeScript, Zustand, Tailwind CSS

---

## File Structure

### New Files

| File                                    | Purpose                                  |
| --------------------------------------- | ---------------------------------------- |
| `src/lib/examples/showcase-examples.ts` | Showcase chart configs with inline data  |
| `src/data/showcase/*.json`              | Data files for showcase charts (5 files) |
| `src/components/showcase/`              | Showcase UI components (5 files)         |

### Modified Files

| File                                                  | Changes                                          |
| ----------------------------------------------------- | ------------------------------------------------ |
| `src/lib/examples/types.ts`                           | Add new showcase fields to FeaturedExampleConfig |
| `src/app/[locale]/page.tsx`                           | Import and use ShowcaseGrid                      |
| `src/components/configurator/ConfiguratorSidebar.tsx` | Add templates button                             |

---

## Tasks

### Task 1: Extend Types

- [ ] Extend FeaturedExampleConfig in `src/lib/examples/types.ts` with category, featured, dataSource, lastUpdated fields
- [ ] Run: `npm run type-check`
- [ ] Commit: `feat(showcase): extend FeaturedExampleConfig type`

### Task 2: Create Data Files

- [ ] Create `src/data/showcase/` directory
- [ ] Create 5 JSON data files based on Serbia data from insights/Serbia_Deep_Insights_Complete/serbia_deep_insights.py:
  - `serbia-demographics.json` - Population data (1991-2024)
  - `serbia-migration.json` - Migration data (2015-2024)
  - `serbia-regions.json` - Regional GDP data
  - `serbia-healthcare.json` - Healthcare comparison data
  - `serbia-diaspora.json` - Diaspora destinations

Data format (each file):

```json
{
  "data": [
    { "field1": value1, "field2": value2, ... }
  ]
}
```

- [ ] Commit: `feat(showcase): add showcase data files`

### Task 3: Create Showcase Examples

- [ ] Create `src/lib/examples/showcase-examples.ts`
- [ ] Import data files and create 5 chart configs
- [ ] Run: `npm run type-check`
- [ ] Commit: `feat(showcase): add showcase examples`

### Task 4: Create Showcase Components

- [ ] Create `src/components/showcase/CategoryBadge.tsx` - Colored category badge
- [ ] Create `src/components/showcase/ShowcaseCard.tsx` - Card with chart preview
- [ ] Create `src/components/showcase/ShowcaseGrid.tsx` - Grid with category filter
- [ ] Create `src/components/showcase/TemplatesPanel.tsx` - Templates browser for configurator
- [ ] Create `src/components/showcase/index.ts` - Barrel exports
- [ ] Run: `npm run type-check`
- [ ] Commit: `feat(showcase): add showcase components`

### Task 5: Integrate Landing Page

- [ ] Modify `src/app/[locale]/page.tsx`
- [ ] Import ShowcaseGrid and showcaseExamples
- [ ] Filter featured examples
- [ ] Add ShowcaseGrid section after FeaturedExamples
- [ ] Run: `npm run build`
- [ ] Commit: `feat(showcase): add showcase to landing page`

### Task 6: Integrate Configurator

- [ ] Modify `src/components/configurator/ConfiguratorSidebar.tsx`
- [ ] Add "Browse Templates" button
- [ ] Import TemplatesPanel
- [ ] Run: `npm run build`
- [ ] Commit: `feat(showcase): add templates to configurator`

### Task 7: Final Verification

- [ ] Run: `npm run build`
- [ ] Run: `npm run type-check`
- [ ] Run: `npm run lint`
- [ ] Manual test: Open http://localhost:3000, verify showcase section and templates panel work
- [ ] Commit: `feat(showcase): complete implementation`
