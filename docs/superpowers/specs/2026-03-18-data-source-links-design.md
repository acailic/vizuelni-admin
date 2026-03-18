# Data Source Links for Visualizations

**Date:** 2026-03-18
**Status:** Draft
**Author:** Claude

## Overview

Add clickable links from each visualization to its original data source on data.gov.rs. Users will be able to:
1. Click the source badge on cards to open the dataset page
2. Access both dataset page and direct download links in the expanded modal

## Goals

- Connect visualizations to their official data sources
- Maintain clean, uncluttered UI
- Provide both browse (dataset page) and download (direct file) options

## Non-Goals

- Auto-fetching or syncing data from data.gov.rs
- Creating charts from arbitrary data.gov.rs datasets (that's a separate feature)
- Changing how user-created charts handle sources

## Data Model Changes

### FeaturedExampleConfig Type

**Reuse existing `resourceUrl` field** instead of creating a new field. The existing `resourceUrl` field (line 60 in types.ts) is already defined as "Direct URL to CSV/JSON resource" - perfect for direct download links.

Add one new field to `src/lib/examples/types.ts`:

```typescript
export interface FeaturedExampleConfig {
  // ... existing fields ...
  resourceUrl: string;           // EXISTING - Direct download URL (repurpose for this feature)
  /** URL to the data.gov.rs dataset page */
  dataSourceUrl?: string;        // NEW
}
```

**Note:** `resourceUrl` already exists but is currently empty in most configs. We'll populate it with actual data.gov.rs download links.

### Example Usage

```typescript
export const populationPyramidConfig: FeaturedExampleConfig = {
  id: 'population-pyramid',
  dataSource: 'РЗС - Републички завод за статистику',
  dataSourceUrl: 'https://data.gov.rs/sr/datasets/population-statistics-2024',
  resourceUrl: 'https://data.gov.rs/datasets/population-2024.csv',  // repurposed
  // ... rest of config
};
```

## Component Changes

### 1. SourceBadge Component

**File:** `src/components/demo-gallery/SourceBadge.tsx`

**Changes:**
- Add optional `href` prop
- Wrap content in `<a>` tag when href is provided
- Add small external link icon (↗) when clickable
- Add hover state for visual feedback

**Updated Props:**
```typescript
interface SourceBadgeProps {
  badge: string;
  label: string;
  icon: string;
  href?: string;  // NEW
}
```

**Behavior:**
- If `href` provided: renders as clickable link, opens in new tab
- If no `href`: renders as non-interactive span (current behavior)

### 2. VisualizationCard Component

**File:** `src/components/demo-gallery/VisualizationCard.tsx`

**Changes:**
- Pass `example.dataSourceUrl` to SourceBadge as `href` prop

### 3. DemoGalleryModalEnhanced Component

**File:** `src/components/demo-gallery/DemoGalleryModalEnhanced.tsx`

**Changes:**
- Add new "Data Source" section below chart preview
- Include:
  - Institution name (from `dataSource`)
  - "View on data.gov.rs" button (primary, opens `dataSourceUrl`)
  - "Download data" button (secondary, opens `dataDownloadUrl`)
  - Last updated date (from existing `lastUpdated` field)

**Conditional Rendering:**
- Hide entire section if no source URLs available
- Show only available buttons (hide download if no download URL)

### 4. galleryUtils Updates

**File:** `src/components/demo-gallery/galleryUtils.ts`

**Changes:**
- Update `getDerivedVisualizationMeta` to include `dataSourceUrl` and `resourceUrl`
- Add to `DerivedVisualizationMeta` interface:
  ```typescript
  dataSourceUrl?: string;
  resourceUrl?: string;  // repurposed for direct download
  ```

## Visual Design

### SourceBadge (Card)

```
Before:  🏛 РЗС
After:   🏛 РЗС ↗  (subtle external link icon, hover highlight)
```

### Modal Source Section

```
┌─────────────────────────────────────────────┐
│  📊 Data Source                             │
│  ┌─────────────────────────────────────────┐│
│  │ РЗС - Републички завод за статистику    ││
│  │                                         ││
│  │ [View on data.gov.rs ↗]  [Download ↓]  ││
│  │                                         ││
│  │ Last updated: Dec 2024                  ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

## Internationalization (i18n)

All new UI strings must be localized in three locales (sr-Cyrl, sr-Latn, en).

**Strings to add to locale files** (`public/locales/{locale}/common.json` or inline in page component):

| Key | sr-Cyrl | sr-Latn | en |
|-----|---------|---------|-----|
| `viewOnDataGov` | Погледај на data.gov.rs | Pogledaj na data.gov.rs | View on data.gov.rs |
| `downloadData` | Преузми податке | Preuzmi podatke | Download data |
| `dataSource` | Извор података | Izvor podataka | Data source |
| `opensInNewTab` | (отвара у новом језичку) | (otvara u novom jezičku) | (opens in new tab) |

## Accessibility

**SourceBadge links:**
- Add `aria-label` that includes "opens in new tab" indication
- Example: `aria-label="РЗС - отвара у новом језичку"` / `aria-label="SORS - opens in new tab"`
- External link icon should have `aria-hidden="true"` since the label already conveys the information

**Modal buttons:**
- Both buttons should have descriptive labels
- Download button should indicate file type if known (e.g., "Download CSV")
- Use `rel="noopener noreferrer"` for security on external links

**Screen reader announcement:**
```tsx
<a
  href={dataSourceUrl}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`${sourceLabel} - ${t('opensInNewTab')}`}
>
  {badge}
  <ExternalLinkIcon aria-hidden="true" />
</a>
```

## Implementation Steps

1. Update `FeaturedExampleConfig` type with new URL fields
2. Update `SourceBadge` to accept and use href prop
3. Update `VisualizationCard` to pass dataSourceUrl to SourceBadge
4. Create `DataSourceSection` component for modal
5. Update `DemoGalleryModalEnhanced` to include DataSourceSection
6. Update `galleryUtils` to expose URL fields
7. Add example config URLs (can be done incrementally)

## Testing

- Verify SourceBadge is clickable when URL present
- Verify SourceBadge remains non-clickable when no URL
- Verify modal shows source section correctly
- Verify both links open in new tabs
- Verify graceful degradation when only one URL present
- Test with screen reader for accessibility

## Rollout

- Phase 1: Implement component changes
- Phase 2: Add URLs to high-priority examples (population, GDP, health)
- Phase 3: Gradually add URLs to remaining examples
