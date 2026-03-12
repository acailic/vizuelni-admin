# Gallery Featured Section Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Featured Examples" section at the top of the gallery page, displaying the same 9 working examples from the homepage.

**Architecture:** Create a new `GalleryFeaturedSection` component that reuses `ExampleCard` and `useExampleData` from the homepage. Add it to `GalleryPage` above the filter bar. Add localized title strings to all three locale files.

**Tech Stack:** React, TypeScript, Tailwind CSS, existing example infrastructure

---

## Chunk 1: Create GalleryFeaturedSection Component

### Task 1: Create GalleryFeaturedSection Component

**Files:**
- Create: `src/components/gallery/GalleryFeaturedSection.tsx`

- [ ] **Step 1: Create the component file**

```typescript
'use client'

import { featuredExamples } from '@/lib/examples'
import { ExampleCard } from '@/components/home/ExampleCard'
import { useExampleData } from '@/components/home/useExampleData'
import type { Locale } from '@/lib/i18n/config'

interface GalleryFeaturedSectionProps {
  locale: string
  title: string
}

export function GalleryFeaturedSection({ locale, title }: GalleryFeaturedSectionProps) {
  // Cast locale to Locale type (validated by route)
  const typedLocale = locale as Locale
  // Create hooks for each example
  const exampleStates = featuredExamples.map((config) => useExampleData(config))

  return (
    <section className="mb-8" aria-labelledby="featured-examples-gallery">
      <h2 id="featured-examples-gallery" className="mb-4 text-xl font-semibold text-slate-800">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredExamples.map((config, index) => (
          <ExampleCard
            key={config.id}
            config={config}
            locale={typedLocale}
            dataset={exampleStates[index].dataset}
            status={exampleStates[index].status}
            onRetry={exampleStates[index].retry}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `pnpm tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/gallery/GalleryFeaturedSection.tsx
git commit -m "feat: add GalleryFeaturedSection component"
```

---

## Chunk 2: Add Localization Keys

### Task 2: Add featuredTitle to English locale

**Files:**
- Modify: `src/lib/i18n/locales/en/common.json` (line ~466, in gallery section)

- [ ] **Step 1: Add featuredTitle to English gallery section**

Find the `"gallery":` section (around line 466) and add `featuredTitle` as the first property:

```json
"gallery": {
  "featuredTitle": "Featured Examples",
  "title": "Gallery",
  ...rest of gallery properties
}
```

- [ ] **Step 2: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/lib/i18n/locales/en/common.json'))"`
Expected: No output (valid JSON)

### Task 3: Add featuredTitle to Serbian Cyrillic locale

**Files:**
- Modify: `src/lib/i18n/locales/sr/common.json` (line ~493, in gallery section)

- [ ] **Step 1: Add featuredTitle to Serbian Cyrillic gallery section**

```json
"gallery": {
  "featuredTitle": "Издвојени примери",
  "title": "Галерија",
  ...rest of gallery properties
}
```

- [ ] **Step 2: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/lib/i18n/locales/sr/common.json'))"`
Expected: No output (valid JSON)

### Task 4: Add featuredTitle to Serbian Latin locale

**Files:**
- Modify: `src/lib/i18n/locales/lat/common.json` (line ~493, in gallery section)

- [ ] **Step 1: Add featuredTitle to Serbian Latin gallery section**

```json
"gallery": {
  "featuredTitle": "Izdvojeni primeri",
  "title": "Galerija",
  ...rest of gallery properties
}
```

- [ ] **Step 2: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/lib/i18n/locales/lat/common.json'))"`
Expected: No output (valid JSON)

- [ ] **Step 3: Commit localization changes**

```bash
git add src/lib/i18n/locales/*/common.json
git commit -m "feat: add gallery.featuredTitle localization keys"
```

---

## Chunk 3: Update GalleryPage to Include Featured Section

### Task 5: Update GalleryPage component

**Files:**
- Modify: `src/components/gallery/GalleryPage.tsx`

- [ ] **Step 1: Import GalleryFeaturedSection**

Add import at top of file after existing imports:

```typescript
import { GalleryFeaturedSection } from './GalleryFeaturedSection'
```

- [ ] **Step 2: Add featuredTitle to labels interface and props**

Add `featuredTitle: string` to the `labels` interface and update the props destructuring.

- [ ] **Step 3: Render GalleryFeaturedSection in the component**

Add the section right after the header and before the error state:

```typescript
{/* Featured Examples Section */}
<GalleryFeaturedSection
  locale={locale}
  title={labels.featuredTitle}
/>
```

- [ ] **Step 4: Verify the component compiles**

Run: `pnpm tsc --noEmit`
Expected: No errors

### Task 6: Update gallery page route to pass featuredTitle

**Files:**
- Modify: `src/app/[locale]/gallery/page.tsx`

- [ ] **Step 1: Add featuredTitle to labels object**

Add `featuredTitle` to the labels object passed to GalleryPage:

```typescript
const labels = {
  title: galleryLabels.title ?? 'Gallery',
  featuredTitle: galleryLabels.featuredTitle ?? 'Featured Examples',
  // ... rest of labels
}
```

- [ ] **Step 2: Verify the page compiles**

Run: `pnpm tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit gallery changes**

```bash
git add src/components/gallery/GalleryPage.tsx src/app/[locale]/gallery/page.tsx
git commit -m "feat: add featured examples section to gallery page"
```

---

## Chunk 4: Testing and Final Commit

### Task 7: Manual Testing

- [ ] **Step 1: Start dev server**

Run: `pnpm dev`
Expected: Server starts on http://localhost:3000

- [ ] **Step 2: Verify gallery page renders featured section**

Navigate to: `http://localhost:3002/sr-Cyrl/gallery`
Expected: Featured Examples section appears at top with 9 cards

- [ ] **Step 3: Verify all three locales**

Navigate to:
- `http://localhost:3002/sr-Cyrl/gallery` - Should show "Издвојени примери"
- `http://localhost:3002/sr-Latn/gallery` - Should show "Izdvojeni primeri"
- `http://localhost:3002/en/gallery` - Should show "Featured Examples"

- [ ] **Step 4: Verify user charts still work**

If there are published charts in the database, verify they still appear below the featured section.

### Task 8: Build verification

- [ ] **Step 1: Run production build**

Run: `pnpm build`
Expected: Build succeeds without errors

- [ ] **Step 2: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: resolve any build issues"
```

---

## Success Criteria

- [ ] Gallery page shows "Featured Examples" section at top
- [ ] All 9 example cards render correctly
- [ ] Localized title shows correctly in all 3 locales
- [ ] User charts (if any) still appear below featured section
- [ ] Build succeeds without errors
