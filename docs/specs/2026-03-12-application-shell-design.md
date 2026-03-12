# Application Shell Design Spec

**Date:** 2026-03-12
**Status:** Draft
**Author:** Claude (Brainstorming Session)

## Overview

Complete the application shell for Vizuelni Admin Srbije to unlock access to the 28 existing features. Currently, the platform has comprehensive chart components, authentication, and data integration but lacks the main application routes for users to actually use these features.

## Goals

- Enable users to browse datasets from data.gov.rs
- Enable users to create, save, and share visualizations
- Enable users to view public charts and dashboards
- Enable users to manage their saved content
- Enable embedding charts in external government portals

## Non-Goals

- SPARQL/GraphQL data integration (future enhancement)
- Collaborative editing (future enhancement)
- Real-time collaboration features
- Advanced semantic search beyond faceted filtering

---

## Architecture

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ [Collapsible Sidebar]  │  [Main Content Area]               │
│                        │  ┌────────────────────────────────┐│
│ ┌──────────┐           │  │ Header: Title + Search + User  ││
│ │ Logo     │           │  └────────────────────────────────┘│
│ ├──────────┤           │                                   │
│ │ Browse   │           │  [Page Content]                   │
│ │ Create   │           │                                   │
│ │ Gallery  │           │                                   │
│ │ Dashboard│           │                                   │
│ ├──────────┤           │                                   │
│ │ [Collapse]           │                                   │
│ └──────────┘           │                                   │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar Navigation

- **Logo** - Links to homepage
- **Browse** - Dataset browser (`/browse`)
- **Create** - Chart creator (`/create`)
- **Gallery** - Public charts (`/gallery`)
- **Dashboard** - User's saved content (`/dashboard`)
- **Collapse toggle** - Minimizes to icon-only mode

### Header (in main content area)

- Page title / breadcrumbs
- Global search bar
- User menu (avatar, name, dropdown with Profile, Sign out)
- Language switcher (sr-Cyrl, sr-Latn, en)

---

## Routes

| Route         | Purpose                             | Auth Required |
| ------------- | ----------------------------------- | ------------- |
| `/`           | Landing page with CTAs              | No            |
| `/browse`     | Dataset browser with faceted search | No            |
| `/create`     | Chart creator with live preview     | Yes (to save) |
| `/gallery`    | Public charts gallery               | No            |
| `/chart/[id]` | Individual chart view               | No            |
| `/dashboard`  | User's saved charts/dashboards      | Yes           |
| `/profile`    | User profile & settings             | Yes           |
| `/embed/[id]` | Embeddable chart (no chrome)        | No            |

---

## Page Specifications

### 1. Homepage (`/`)

**Purpose:** Introduce the platform and guide users to key actions.

**Sections:**

1. **Hero Section**
   - Title: "Визуелни Административни Подаци Србије"
   - Subtitle: Brief description
   - Primary CTA: "Browse Datasets" → `/browse`
   - Secondary CTA: "Create Chart" → `/create`

2. **Featured Section**
   - 3-4 featured/public charts as cards
   - "View in Gallery" link

3. **Quick Stats**
   - Number of datasets: 3,412+
   - Number of public charts
   - Optional: registered users count

4. **Getting Started**
   - 3-step visual: "Find Data → Visualize → Share"

**Components:**

- `HeroSection.tsx`
- `FeaturedCharts.tsx`
- `QuickStats.tsx`
- `GettingStartedGuide.tsx`

---

### 2. Dataset Browser (`/browse`)

**Purpose:** Search and discover datasets from data.gov.rs.

**Layout:**

```
┌─────────────────┬──────────────────────────────────┐
│ Sidebar Filters │ Dataset Results Grid             │
└─────────────────┴──────────────────────────────────┘
```

**Left Sidebar - Faceted Filters:**

- Search within results
- Theme/Category (with counts)
- Organization/Publisher (with counts)
- Data Format (CSV, JSON, XLSX, etc.)
- Date Range filter
- "Clear all filters" button

**Main Content - Dataset Cards:**

- Title
- Description snippet
- Publisher name
- Format badges
- Last updated date
- Pagination (20 per page)
- Sort: Relevance, Newest, Most Popular

**Dataset Detail (modal or `/browse/[id]`):**

- Full description
- Data preview (first 10 rows)
- "Create Chart from Dataset" button
- Direct download link

**Components:**

- `BrowsePage.tsx`
- `FacetedFilters.tsx`
- `DatasetCard.tsx`
- `DatasetDetailModal.tsx`
- `DataPreview.tsx`

---

### 3. Chart Creator (`/create`)

**Purpose:** Create visualizations with live preview.

**Layout:**

```
┌─────────────────────────┬──────────────────────────────┐
│ Configuration Panel     │ Live Preview Canvas          │
└─────────────────────────┴──────────────────────────────┘
```

**Left Panel - Configuration:**

1. **Dataset Selector** - Search/select from data.gov.rs
2. **Chart Type** - Icons: line, bar, column, area, pie, scatter, combo, table
3. **Data Mapping**
   - X-axis field dropdown
   - Y-axis field(s) dropdown
   - Group/color by field
4. **Filters Section** - Add/remove filters
5. **Styling**
   - Color palette selector
   - Title & labels inputs
   - Legend toggle
   - Annotations

**Right Panel - Live Preview:**

- Real-time chart preview
- Responsive breakpoint toggle (desktop/tablet/mobile)
- Action bar: Save | Export PNG | Share | Embed

**Top Bar:**

- Chart title (editable inline)
- Save button → dialog with public/private option

**Components:**

- `CreatePage.tsx`
- `ConfigPanel.tsx`
- `DatasetSelector.tsx`
- `ChartTypeSelector.tsx`
- `DataMappingSection.tsx`
- `FiltersSection.tsx`
- `StylingSection.tsx`
- `LivePreview.tsx`
- `SaveDialog.tsx`

---

### 4. Public Gallery (`/gallery`)

**Purpose:** Browse and discover public visualizations.

**Layout:**

```
┌─────────────────────────────────────────────────────────┐
│ Filter Bar: Search | Type | Theme | Sort               │
├─────────────────────────────────────────────────────────┤
│ Chart Cards Grid                                        │
└─────────────────────────────────────────────────────────┘
```

**Filter Bar:**

- Search by title
- Filter by: Chart type, Theme/Category
- Sort: Newest, Most Viewed

**Chart Cards:**

- Thumbnail preview
- Title
- Author name + avatar
- View count
- Chart type badge
- Created date

**Chart Detail Page (`/chart/[id]`):**

- Full interactive chart
- Title and description
- Author info with avatar
- Dataset source link
- Actions: Like, Share, Embed, Download PNG, Fork (copy to edit)

**Components:**

- `GalleryPage.tsx`
- `GalleryFilterBar.tsx`
- `GalleryChartCard.tsx`
- `ChartDetailPage.tsx`
- `ChartActions.tsx`
- `EmbedCodeGenerator.tsx`

---

### 5. User Dashboard (`/dashboard`)

**Purpose:** Manage user's saved charts and dashboards.

**Tabs:**

1. **My Charts** - Saved charts grid
2. **My Dashboards** - Saved multi-chart layouts
3. **Favorites** - Liked charts

**My Charts Section:**

- Grid of chart cards with thumbnails
- Each card shows: Title, Last modified, Status badge
- Actions: Edit, Delete, Toggle Public/Private
- Filter: All | Draft | Published

**My Dashboards Section:**

- Dashboard cards with preview thumbnails
- "Create new dashboard" button
- Edit/Delete actions

**Components:**

- `DashboardPage.tsx`
- `DashboardTabs.tsx`
- `MyChartsGrid.tsx`
- `MyDashboardsGrid.tsx`
- `FavoritesGrid.tsx`
- `ChartStatusBadge.tsx`

---

### 6. User Profile (`/profile`)

**Purpose:** View and edit user settings.

**Sections:**

1. **Profile Info**
   - Name (from auth provider)
   - Email
   - Role badge (USER, EDITOR, ADMIN)
   - Avatar

2. **Settings**
   - Default locale preference
   - Default color palette
   - Email notifications toggle (optional)

3. **Danger Zone**
   - Delete account option

**Components:**

- `ProfilePage.tsx`
- `ProfileInfo.tsx`
- `ProfileSettings.tsx`
- `DangerZone.tsx`

---

### 7. Embed Page (`/embed/[id]`)

**Purpose:** Minimal chart rendering for iframe embedding.

**Layout:**

- No sidebar, no header, no footer
- Chart fills entire container
- White background
- Responsive - inherits iframe dimensions

**Embed Code Generator (on chart detail page):**

```html
<iframe
  src="https://vizuelni.gov.rs/embed/[chart-id]"
  width="800"
  height="500"
  frameborder="0"
>
</iframe>
```

- Configurable width/height inputs
- Copy to clipboard button

**Components:**

- `EmbedPage.tsx`
- `EmbedCodeGenerator.tsx`

---

## Implementation Phases

### Phase 1: Foundation

- Sidebar navigation component
- Main layout wrapper
- Header with search and user menu
- Route structure setup

### Phase 2: Browse

- Dataset browser page
- Faceted filters component
- Dataset cards and detail modal
- Integration with data.gov.rs API

### Phase 3: Create

- Chart creator page
- Configuration panel
- Live preview canvas
- Save dialog with public/private option

### Phase 4: Gallery

- Public gallery page
- Chart detail page
- Chart actions (like, share, embed)
- Embed code generator

### Phase 5: Dashboard

- User dashboard page
- My Charts / My Dashboards / Favorites tabs
- Edit/delete functionality
- Status management (draft/published)

### Phase 6: Profile & Embed

- User profile page
- Settings management
- Embed page for iframes
- Final polish

---

## Technical Notes

### State Management

- Use existing Zustand stores for chart configuration
- TanStack Query for server state (datasets, charts)
- URL state for filters and search params

### Authentication

- Leverage existing NextAuth.js setup
- Protect routes: `/create`, `/dashboard`, `/profile`
- Public routes: `/`, `/browse`, `/gallery`, `/chart/[id]`, `/embed/[id]`

### Internationalization

- All new pages use next-intl
- Three locales: sr-Cyrl, sr-Latn, en
- Add new translation keys to locale files

### Responsive Design

- Sidebar collapses on mobile
- Chart creator stacks on small screens
- Gallery grid adapts to viewport

---

## Success Criteria

1. Users can browse and search datasets from data.gov.rs
2. Users can create charts with live preview
3. Users can save charts as public or private
4. Users can view and interact with public charts
5. Users can embed charts in external sites
6. All pages are accessible (WCAG 2.1 AA)
7. All pages support three locales
