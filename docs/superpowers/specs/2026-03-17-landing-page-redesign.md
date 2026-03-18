---
name: Landing Page Redesign
description: Redesign homepage for clarity, conversion, and institutional trust
type: project
created: 2026-03-17
status: approved
---

# Landing Page Redesign Specification

## Overview

Redesign the homepage for Визуелни Админ Србије to achieve:

- **Radical simplicity** — Users understand value in under 5 seconds
- **Single clear path** — One dominant CTA, no competing actions
- **Institutional trust** — Data provenance visible on every example
- **Professional tone** — Authoritative but accessible, no marketing hype

## Primary Goal

> **"Најлакши начин да истражите јавне податке Србије"**

Users should understand what the platform is, who it's for, and how to start — all within the first viewport.

---

## Section Structure (Exact Order)

### 1. HERO — Clear Value + Single Primary Action

**Component:** `HeroSectionAnimated` (modify existing)

**Strategy:** Modify the existing `HeroSectionAnimated.tsx` in-place rather than creating a new component. Export alias as `HeroSectionRedesigned` in `index.ts` if needed for clarity.

**Layout:** Two-column (text left, chart preview right)

**Content:**

```
Badge: data.gov.rs

Headline: Јавни подаци Србије
Subtitle: Најлакши начин да истражите јавне податке Србије

Primary CTA: [Испробај демо галерију] → /${locale}/demo-gallery
Secondary links: Примери података | Документација (text only, no button styling)

Trust badges (compact horizontal strip):
- Отворени код
- WCAG 2.1 AA
- Стварни подаци
- data.gov.rs
- Нема налога

Right side: Interactive chart preview
- Use: Пирамида старости Србије (Population Pyramid)
- Badge: ● Стварни подаци
- Link: Више примера →
```

**Key Changes from Current:**

- Remove second CTA button (GitHub star)
- Move SocialProof to compact horizontal strip
- Simplify headline copy
- Use Population Pyramid instead of GDP Growth as preview

---

### 2. QUICK PROOF STRIP

**Component:** `QuickProofStrip` (new)

**Layout:** Horizontal strip, light background (bg-slate-50)

**Content:** 4 proof items, icon + 2-line label each

| Lucide Icon | Label                     |
| ----------- | ------------------------- |
| `BarChart3` | 28+ интерактивних примера |
| `Building2` | Званични извори података  |
| `Languages` | Ћирилица и латиница       |
| `Map`       | Уграђене мапе Србије      |

**Design:**

- `bg-slate-50` background
- `py-8` padding
- Icons from `lucide-react` (not emoji) for accessibility
- `aria-label` on each icon for screen readers
- Icons in muted blue circles (`bg-gov-primary/10`)
- Labels centered under icons

---

### 3. FEATURED EXAMPLES (CURATED)

**Component:** `FeaturedExamplesCurated` (adapt from `FeaturedExamples`)

**Props Interface:**

```typescript
interface FeaturedExamplesCuratedProps {
  locale: Locale;
  // Hardcoded internally - these 4 IDs
  // 'demo-population-pyramid', 'demo-cancer-incidence', 'demo-gdp-growth', 'demo-diaspora-destinations'
  labels: {
    title: string;
    subtitle: string;
    openInteractive: string;
    source: string;
    period: string;
    lastUpdated: string;
  };
}
```

**Layout:** 3-column grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)

**Content:** 4 curated examples with editorial card design (hardcoded IDs)

**Curated Selection (hardcoded):**

| ID                           | Title (sr)               | Category     | Period    |
| ---------------------------- | ------------------------ | ------------ | --------- |
| `demo-population-pyramid`    | Пирамида старости Србије | demographics | 2020–2024 |
| `demo-cancer-incidence`      | Инциденца рака           | healthcare   | 2019–2023 |
| `demo-gdp-growth`            | Раст БДП                 | economy      | 2015–2024 |
| `demo-diaspora-destinations` | Дестинације дијаспоре    | migration    | 2021–2023 |

**Note:** Add `period` values to the respective configs in `src/lib/examples/demo-gallery-examples.ts`

**Card Structure:**

```
┌──────────────────────────┐
│ [Chart Preview]          │  aspect-video
│                          │
├──────────────────────────┤
│ Title                    │  font-semibold
│ One-sentence insight     │  text-sm text-gray-600
│                          │
│ [Bar] [Демографија]      │  badges
│                          │
│ Извор: РЗС               │  text-xs text-gray-500
│ Период: 2020–2024        │
│ Ажурирано: јан 2024      │
│                          │
│ [Отвори интерактивно →]  │  button
└──────────────────────────┘
```

**Data Trust Indicators (required on every card):**

Add to `FeaturedExampleConfig` type in `src/lib/examples/types.ts`:

```typescript
// Add to existing interface
period?: string; // e.g., "2020–2024"
```

Existing fields to use:

- `dataSource` — Извор (e.g., "РЗС", "ИЈЗ Србије")
- `lastUpdated` — Последње ажурирање (e.g., "2024-01-15" → format to "јан 2024")

The `description` field will be used as the insight text on cards.

**Section Header:**

- Title: Истакнути примери
- Subtitle: Стварне визуелизације од званичних владиних података

---

### 4. WHY BETTER THAN GENERIC TOOLS

**Component:** `ComparisonCards` (replace `ComparisonTable`)

**Layout:** Vertical stack of comparison cards (better mobile than table)

**Content:** 4-5 comparison points

| Feature             | Визуелни Админ                    | Генеричке библиотеке |
| ------------------- | --------------------------------- | -------------------- |
| Српска географија   | Уграђене општине, окрузи, региони | Ручно GeoJSON        |
| Ћирилица и латиница | Изворна, тестирана                | Често покварена      |
| Владини подаци      | 28+ примера учитано               | Ви чистите           |
| Приступачност       | WCAG 2.1 AA уграђено              | Ваша одговорност     |

**Card Design:**

- Icon + Title + Description
- Side-by-side comparison with ✓/✗ indicators
- `border` with `rounded-xl`
- Subtle hover state

**Section Header:**

- Title: Зашто не генерички алати?
- Subtitle: Изграђено од првог дана за српске јавне податке

---

### 5. CHOOSE YOUR PATH (Audience Segmentation)

**Component:** `AudienceSegmentation` (adapt from `UseCases`)

**Layout:** 4-column grid (responsive: 2 col tablet, 4 col desktop)

**Content:**

| Audience    | Title                    | Description                              | CTA Link                                                                  |
| ----------- | ------------------------ | ---------------------------------------- | ------------------------------------------------------------------------- |
| Грађани     | Разумите податке         | Истражите податке о својој општини       | `/${locale}/demo-gallery`                                                 |
| Новинари    | Креирајте визуелне приче | Претворите податке у графиконе за чланке | `/${locale}/demo-gallery?category=demographics`                           |
| Истраживачи | Анализирајте трендове    | Откријте обрасце кроз време и регионе    | `/${locale}/demo-gallery?category=healthcare`                             |
| Програмери  | Уградите визуелизације   | Користите отворени код за своје пројекте | `https://github.com/acailic/vizualni-admin` (external, `target="_blank"`) |

**Card Design:**

- Icon in colored circle
- Title + short description
- Text link with arrow (no button)
- `hover:shadow-md` transition

**Section Header:**

- Title: За кога је ово?

---

### 6. HOW IT WORKS — Simplified

**Component:** `HowItWorksMinimal` (adapt from `GettingStartedGuide`)

**Layout:** Horizontal 3-step flow with arrow connectors

**Content:**

```
    1              2              3
┌────────┐    ┌────────┐    ┌────────┐
│ Search │ ►  │BarChart│ ►  │ Share │
└────────┘    └────────┘    └────────┘

Пронађи      Визуелизуј     Подели
```

**Lucide Icons:**

- Step 1: `Search` from `lucide-react`
- Step 2: `BarChart3` from `lucide-react`
- Step 3: `Share2` from `lucide-react`

**Design:**

- Large step numbers (1, 2, 3)
- Lucide icons in circles (`bg-gov-primary/10`)
- Single-word labels
- Arrow connectors (`ChevronRight` or `ArrowRight` from `lucide-react`)
- No verbose descriptions
- Centered layout
- `aria-label` on each step for screen readers

---

### 7. DEVELOPER SECTION (Compact)

**Component:** `DeveloperSectionCompact` (adapt from `CodeExamplePanel`)

**Strategy:** Modify existing `CodeExamplePanel.tsx` in place, adding bullet list above code block.

**External URLs (hardcoded):**

- GitHub: `https://github.com/acailic/vizualni-admin`
- Documentation: `https://github.com/acailic/vizualni-admin/blob/main/docs/GETTING-STARTED.md`

**Layout:** Light background, code snippet with bullets above

**Content:**

**Bullets:**

- React компоненте
- Локализовани графикони
- Српске мапе
- TypeScript подршка

**Code Snippet:** (keep existing example)

**Links:**

- Документација → docs URL
- GitHub → repo URL
- Getting Started → getting-started guide

**Design:**

- `bg-slate-50` background
- `py-12` padding
- Code block with syntax highlighting
- Text links (not buttons) at bottom

---

### 8. FINAL CTA

**Component:** `FinalCta` (existing, minor copy updates)

**Layout:** Full-width card with gov-primary background

**Content:**

```
Спремни за истраживање?
───────────────────────
Погледајте шта српски јавни подаци могу да открију

[Испробај демо]  [Погледај документацију]  [GitHub]

─────────────────────────────────────────────
✓ Отворени код  ✓ WCAG 2.1 AA  ✓ Нема налога
```

**Design:**

- `bg-gov-primary` background
- White text
- Primary CTA: white button
- Secondary CTAs: outline/text style
- Trust badges at bottom

---

## Locale Updates Required

### Serbian Cyrillic (`src/lib/i18n/locales/sr/common.json`)

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
      "subtitle": "Изграђено од првог дана за српске јавне податке"
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
      "bullets": {
        "reactComponents": "React компоненте",
        "localizedCharts": "Локализовани графикони",
        "serbianMaps": "Српске мапе",
        "typescript": "TypeScript подршка"
      },
      "viewDocs": "Документација",
      "viewGithub": "GitHub",
      "gettingStarted": "Како почети"
    },
    "finalCta": {
      "title": "Спремни за истраживање?",
      "subtitle": "Погледајте шта српски јавни подаци могу да открију"
    }
  }
}
```

### Serbian Latin (`src/lib/i18n/locales/lat/common.json`)

Add the same structure with Latin script translations:

### English (`src/lib/i18n/locales/en/common.json`)

```json
{
  "homepage": {
    "hero": {
      "title": "Serbian Public Data",
      "subtitle": "The easiest way to explore Serbian public data",
      "tryDemoCta": "Try Demo Gallery",
      "examplesLink": "Data Examples",
      "docsLink": "Documentation",
      "previewAlt": "Preview of Serbia Population Pyramid"
    },
    "quickProof": {
      "examples": "28+ interactive examples",
      "officialSources": "Official data sources",
      "cyrillicLatin": "Cyrillic and Latin",
      "serbianMaps": "Built-in Serbian maps"
    },
    "featuredExamples": {
      "title": "Featured Examples",
      "subtitle": "Real visualizations from official government data",
      "openInteractive": "Open interactive",
      "source": "Source",
      "period": "Period",
      "lastUpdated": "Updated"
    },
    "comparison": {
      "title": "Why not generic tools?",
      "subtitle": "Built from day one for Serbian public data"
    },
    "audience": {
      "title": "Who is this for?",
      "citizens": {
        "title": "Citizens",
        "subtitle": "Understand data",
        "description": "Explore data about your municipality"
      },
      "journalists": {
        "title": "Journalists",
        "subtitle": "Create visual stories",
        "description": "Turn data into charts for articles"
      },
      "researchers": {
        "title": "Researchers",
        "subtitle": "Analyze trends",
        "description": "Discover patterns across time and regions"
      },
      "developers": {
        "title": "Developers",
        "subtitle": "Embed visualizations",
        "description": "Use open-source code for your projects"
      }
    },
    "howItWorks": {
      "title": "How it works",
      "step1": "Find",
      "step2": "Visualize",
      "step3": "Share"
    },
    "developerSection": {
      "title": "For Developers",
      "bullets": {
        "reactComponents": "React components",
        "localizedCharts": "Localized charts",
        "serbianMaps": "Serbian maps",
        "typescript": "TypeScript support"
      },
      "viewDocs": "Documentation",
      "viewGithub": "GitHub",
      "gettingStarted": "Getting Started"
    },
    "finalCta": {
      "title": "Ready to explore?",
      "subtitle": "See what Serbian public data can reveal"
    }
  }
}
```

**Serbian Latin (`src/lib/i18n/locales/lat/common.json`):** Transliterate the Serbian Cyrillic content to Latin script using standard Serbian Latin orthography.

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
      "subtitle": "Изграђено од првог дана за српске јавне податке"
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
      "bullets": {
        "reactComponents": "React компоненте",
        "localizedCharts": "Локализовани графикони",
        "serbianMaps": "Српске мапе",
        "typescript": "TypeScript подршка"
      },
      "viewDocs": "Документација",
      "viewGithub": "GitHub",
      "gettingStarted": "Како почети"
    },
    "finalCta": {
      "title": "Спремни за истраживање?",
      "subtitle": "Погледајте шта српски јавни подаци могу да открију"
    }
  }
}
```

---

## Components to Create/Modify

### New Components

1. **`QuickProofStrip`** — `src/components/home/QuickProofStrip.tsx`
   - Horizontal strip with 4 proof items
   - Props: labels object
   - **Accessibility:** `role="list"` on container, `role="listitem"` on each item, `aria-label` on icons

2. **`ComparisonCards`** — `src/components/home/ComparisonCards.tsx`
   - Vertical stack of comparison cards
   - Replace current ComparisonTable
   - **Accessibility:** Semantic `<article>` tags, keyboard focusable with visible focus rings

3. **`AudienceSegmentation`** — `src/components/home/AudienceSegmentation.tsx`
   - 4 audience cards with icons and CTAs
   - Adapt from UseCases
   - **Accessibility:** `role="navigation"` or semantic links, skip link if needed

4. **`HowItWorksMinimal`** — `src/components/home/HowItWorksMinimal.tsx`
   - Simplified 3-step horizontal flow
   - Replace verbose GettingStartedGuide
   - **Accessibility:** `aria-current="step"` for flow, `aria-label` on step numbers and icons

5. **`FeaturedExamplesCurated`** — `src/components/home/FeaturedExamplesCurated.tsx` (NEW FILE)
   - Wrapper component that uses `ExampleCard` internally
   - Hardcoded list of 4 example IDs
   - **Does NOT create new `FeaturedCard`** — reuses `ExampleCard` with added data trust display

**Clarification:** `FeaturedCard` is NOT a new component. Instead, modify `ExampleCard.tsx` to optionally show data trust indicators when used in the featured section.

### Modified Components

1. **`HeroSectionAnimated.tsx`** — Update in-place:
   - Simplified headline/subtitle copy
   - Single primary CTA (remove secondary button, keep as text link)
   - Compact trust badges strip (adapt existing `SocialProof` component)
   - Change preview from GDP Growth to Population Pyramid (`populationPyramidConfig`)

2. **`ExampleCard.tsx`** — Add:
   - Data trust row: display `dataSource`, `period`, `lastUpdated`
   - Use `description` as insight text (no new field needed)

3. **`FeaturedExampleConfig` type** — Add to `src/lib/examples/types.ts`:

   ```typescript
   period?: string; // e.g., "2020–2024"
   ```

4. **`FinalCta.tsx`** — Minor updates:
   - Update title/subtitle copy from locale keys
   - No structural changes needed

### Deleted/Replaced

- `ProblemStatement` — Remove entirely
- `FeaturesGrid` — Remove (covered in ComparisonCards)
- `ComparisonTable` — Replace with ComparisonCards
- `GettingStartedGuide` — Replace with HowItWorksMinimal
- `ShowcaseGrid` section — Remove (redundant with FeaturedExamples)

---

## Page Structure After Refactor

```tsx
// src/app/[locale]/page.tsx

<main className='container-custom py-12'>
  {/* 1. Hero */}
  <HeroSectionRedesigned ... />

  {/* 2. Quick Proof Strip */}
  <QuickProofStrip ... />

  {/* 3. Featured Examples */}
  <FeaturedExamplesCurated ... />

  {/* 4. Why Better */}
  <ComparisonCards ... />

  {/* 5. Audience Paths */}
  <AudienceSegmentation ... />

  {/* 6. How It Works */}
  <HowItWorksMinimal ... />

  {/* 7. Developer Section */}
  <DeveloperSectionCompact ... />

  {/* 8. Final CTA */}
  <FinalCta ... />
</main>
```

---

## Success Criteria

After redesign, a new visitor should instantly know:

- [ ] What this platform is
- [ ] Who it is for
- [ ] What they can do immediately
- [ ] Why it is better than generic tools
- [ ] How to start in one click

---

## Files Affected

### Create

- `src/components/home/QuickProofStrip.tsx`
- `src/components/home/ComparisonCards.tsx`
- `src/components/home/AudienceSegmentation.tsx`
- `src/components/home/HowItWorksMinimal.tsx`
- `src/components/home/FeaturedExamplesCurated.tsx`

### Modify

- `src/app/[locale]/page.tsx` — restructure section order
- `src/components/home/HeroSectionAnimated.tsx` — update hero content, preview chart
- `src/components/home/ExampleCard.tsx` — add optional data trust display (source, period, lastUpdated)
- `src/components/home/FinalCta.tsx` — update copy
- `src/components/home/CodeExamplePanel.tsx` — add bullet list above code block,- `src/components/home/index.ts` — export new components and alias DeveloperSectionCompact
- `src/lib/i18n/locales/sr/common.json` — add new homepage keys
- `src/lib/i18n/locales/lat/common.json` — add new homepage keys
- `src/lib/i18n/locales/en/common.json` — add new homepage keys
- `src/lib/examples/types.ts` — add `period?: string` to FeaturedExampleConfig
- `src/lib/examples/demo-gallery-examples.ts` — add period values to the 4 curated examples

### Delete

### Delete

- `src/components/home/ProblemStatement.tsx`
- `src/components/home/FeaturesGrid.tsx`
- `src/components/home/ComparisonTable.tsx`
- `src/components/home/GettingStartedGuide.tsx`

---

## Period Values for Curated Examples

Add to `src/lib/examples/demo-gallery-examples.ts` for each curated example:

| Example ID                   | Period Value  |
| ---------------------------- | ------------- |
| `demo-population-pyramid`    | `"2020–2024"` |
| `demo-cancer-incidence`      | `"2019–2023"` |
| `demo-gdp-growth`            | `"2015–2024"` |
| `demo-diaspora-destinations` | `"2021–2023"` |

### Import Paths

**Hero preview chart:** Import `populationPyramidConfig` from existing demo gallery:

```typescript
// In HeroSectionAnimated.tsx
import { getDemoExampleById } from '@/lib/examples/demo-gallery-examples';

// In component:
const previewExample = getDemoExampleById('demo-population-pyramid');
```
