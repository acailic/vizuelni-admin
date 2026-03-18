# UX Fixes Design Spec

**Date**: 2026-03-17
**Status**: Approved
**Scope**: Landing, Gallery, Data, Guide, Accessibility pages

## Problem Statement

The Vizuelni Admin Srbije site has several UX issues affecting clarity, conversion, and polish:

1. **Inconsistent CTAs** - No dominant primary action across pages
2. **Count mismatches** - Gallery shows different totals, data catalog shows "Teme 0"
3. **Encoding glitches** - Garbled text in guide ("Пита и却没有")
4. **Missing translations** - Accessibility page defaults to English in Serbian locales
5. **Missing gallery features** - No search, sort, or category chips
6. **No visualizability indicators** - Data catalog doesn't explain why datasets can/can't be visualized
7. **Missing guide links** - No "See example" links to gallery

## Solution Design

### 1. CTA Consistency (All Pages)

**Changes**:

- Hero CTAs: "Try Demo Gallery" primary (blue bg), "Star GitHub" secondary (outline)
- Final CTAs on each page: "Try Demo Gallery" prominent, other actions subdued
- Navigation: Keep consistent ordering (Home > Gallery > Data > Guide > Accessibility)

**Files to modify**:

- `src/app/[locale]/page.tsx` - Already has correct structure
- `src/app/[locale]/guide/chart-types/ChartTypesGuideContent.tsx` - CTA section
- `src/components/home/FinalCta.tsx` - Ensure primary CTA is dominant

### 2. Gallery UX Upgrades

**New features**:

- Search bar filtering by title, tags, data source
- Sort dropdown: Newest, Most Viewed, Alphabetical
- Category chips displayed on cards
- Modal enhancements: source link, last updated, download options (disabled in demo with tooltip)

**Files to modify**:

- `src/components/demo-gallery/DemoGalleryClient.tsx` - Add search/sort state
- `src/components/demo-gallery/DemoGalleryCard.tsx` - Add category chips
- `src/components/demo-gallery/DemoGalleryModalEnhanced.tsx` - Add source/updated/download UI

### 3. Data Catalog Fixes

**Changes**:

- Fix "Teme 0" - show actual count from facets array length
- Add "Visualizable?" badge on dataset cards (Yes/No with reason)
- Remove duplicated descriptions in sidebar
- Add bridge: "This dataset powers: [visualizations]" when applicable

**Files to modify**:

- `src/components/data/DataGovBrowser.tsx` - Fix counts, add visualizability indicator
- `src/components/browse/FilterSidebar.tsx` - If showing duplicate content

### 4. Guide Improvements

**Changes**:

- Fix encoding: `Пита и却没有` → `Пита и Торта` (Pie & Donut)
- Add "See example" link to gallery for each chart type
- Add "When not to use" section for each chart type

**Files to modify**:

- `src/app/[locale]/guide/chart-types/ChartTypesGuideContent.tsx` - Fix encoding, add links

### 5. Accessibility Localization

**Changes**:

- Add Serbian Cyrillic and Latin translations to locale files
- Add "How we test" section (keyboard nav, screen reader, contrast checkers)
- Refine "Known limitations" with more detail

**Files to modify**:

- `public/locales/sr-Cyrl.json` - Add `accessibility` section
- `public/locales/sr-Latn.json` - Add `accessibility` section (or create if missing)
- `src/app/[locale]/accessibility/AccessibilityContent.tsx` - Add testing section

### 6. Language Toggle Labels

**Changes**:

- Make locale labels explicit: "SRB (Ћир)" / "SRB (Lat)" / "EN"
- Currently may use ambiguous abbreviations

**Files to modify**:

- `src/components/layout/LanguageSwitcher.tsx` or similar

## Implementation Order

1. **Quick wins first** - Encoding fix, count fix, translations
2. **Gallery features** - Search, sort, chips
3. **Data catalog** - Visualizability indicators
4. **Guide links** - Gallery cross-links
5. **Polish** - CTA consistency, accessibility testing section

## Acceptance Criteria

- [ ] No placeholder/inconsistent numbers across pages
- [ ] No encoding glitches in any locale
- [ ] Primary CTA appears consistently and is visually dominant
- [ ] Gallery search/sort works and feels fast
- [ ] Data catalog shows meaningful counts and visualizability
- [ ] Accessibility page fully translated to Serbian
- [ ] Keyboard accessibility still works across all dialogs/buttons
