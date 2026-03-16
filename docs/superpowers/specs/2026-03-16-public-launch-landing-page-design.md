# Public Launch Landing Page - Design Spec

**Date:** 2026-03-16
**Status:** Approved
**Author:** Claude + User

## Context

Vizuelni Admin Srbije is an open-source Serbian government data visualization platform. The project has excellent technical infrastructure (28 demos, StackBlitz support, i18n, accessibility) but needs marketing polish for a public launch.

**Problem:** Current landing page is functional but lacks social proof, audience-specific CTAs, and clear value proposition for the primary audience (journalists/researchers).

**Goal:** Transform the existing landing page into a compelling marketing page that drives adoption among data journalists and researchers, with a secondary path for developers.

## Decisions Made

| Decision           | Choice                     | Rationale                                             |
| ------------------ | -------------------------- | ----------------------------------------------------- |
| Primary Audience   | Journalists & Researchers  | No-code users who need to visualize data quickly      |
| Secondary Audience | Developers                 | Want npm package and code examples                    |
| npm Package        | Skip for now               | Focus on live app experience first                    |
| Hosting            | GitHub Pages               | Already configured, free forever, zero changes needed |
| Timeline           | Flexible                   | Quality over speed                                    |
| Domain             | Default (get custom later) | Launch first, brand later                             |

## Design Approach

### Hero Section

**Structure:**

```
┌─────────────────────────────────────────────────────────┐
│  Social Proof Bar                                        │
│  ⭐ 28 Chart Types • 🇷🇸 Serbian Data • ♿ WCAG 2.1 AA   │
├─────────────────────────────────────────────────────────┤
│  Headline (Journalist-focused)                          │
│  "Transform Serbian Government Data into Clear          │
│   Visualizations"                                        │
│                                                          │
│  Subheadline                                             │
│  "No coding required. Explore budgets, demographics,    │
│   and public data in minutes."                          │
│                                                          │
│  CTAs                                                    │
│  [Try Demo →]  [View on GitHub]                         │
│                                                          │
│  Live Preview                                            │
│  [Embedded chart showing real Serbian data]             │
└─────────────────────────────────────────────────────────┘
```

**Key Changes from Current:**

- Add social proof bar at top (badges, not links)
- Refine headline for journalist audience
- Emphasize "no coding required"
- Add live chart preview in hero

### Landing Page Sections

1. **Hero + Social Proof** - First impression, value prop
2. **How It Works** - 3 steps: Choose dataset → Customize → Share
3. **Live Demo Gallery** - 4-6 featured charts with "Try it" buttons
4. **Use Cases** - For Journalists, Researchers, Government, Developers
5. **Features Grid** - Chart types, geography, accessibility, embed
6. **Final CTA** - "Ready to explore Serbian data?"

### Component Changes

| Component                   | Change                                              |
| --------------------------- | --------------------------------------------------- |
| `HeroSectionAnimated.tsx`   | Add social proof bar, refine CTAs, add live preview |
| `src/app/[locale]/page.tsx` | Add HowItWorks and UseCases sections                |
| `SocialProof.tsx` (NEW)     | GitHub stars badge, feature badges                  |
| `HowItWorks.tsx` (NEW)      | 3-step visual guide                                 |
| `UseCases.tsx` (NEW)        | Audience-specific value props                       |
| Locale files                | New copy in all 3 languages                         |

## Technical Implementation

### Files to Create

```
src/components/home/
├── SocialProof.tsx       # Badge bar with GitHub stars
├── HowItWorks.tsx        # 3-step guide with icons
└── UseCases.tsx          # 4 audience cards

src/lib/i18n/locales/
├── sr/common.json        # Add new keys
├── lat/common.json       # Add new keys
└── en/common.json        # Add new keys
```

### Files to Modify

```
src/components/home/HeroSectionAnimated.tsx
├── Add SocialProof component above headline
├── Update headline/subheadline copy
├── Refine CTA buttons for journalist audience
└── Add embedded chart preview section

src/app/[locale]/page.tsx
├── Import new components
├── Add HowItWorks section after hero
├── Add UseCases section before features
└── Reorder sections for marketing flow
```

### Copy Changes

**Hero Headline:**

- EN: "Transform Serbian Government Data into Clear Visualizations"
- SR-CYRL: "Трансформишите подаче српске владе у јасне визуализације"
- SR-LATN: "Transformišite podatke srpske vlade u jasne vizualizacije"

**Hero Subheadline:**

- EN: "No coding required. Explore budgets, demographics, and public data in minutes."
- SR-CYRL: "Без програмирања. Истражите буџете, демографију и јавне податке за минуте."
- SR-LATN: "Bez programiranja. Istražite budžete, demografiju i javne podatke za minute."

**Social Proof Badges:**

- "28 Chart Types" / "28 типова графикона"
- "Serbian Data" / "Српски подаци"
- "WCAG 2.1 AA" / "WCAG 2.1 AA"
- "Open Source" / "Отворени код"

**How It Works:**

1. "Choose a Dataset" - Browse 3,400+ Serbian government datasets
2. "Customize Your Chart" - Select chart type, colors, and filters
3. "Share or Embed" - Export as image or embed on your website

**Use Cases:**

1. **For Journalists** - Create data-driven stories with interactive charts
2. **For Researchers** - Analyze trends in demographics, economy, health
3. **For Government** - Present data professionally to citizens
4. **For Developers** - Clone the repo, customize, deploy your own

## Success Criteria

- Landing page clearly communicates value to journalists
- Primary CTA ("Try Demo") is prominent and accessible
- Social proof establishes credibility
- All copy available in Serbian (Cyrillic and Latin) and English
- Page loads fast on GitHub Pages (static export)
- WCAG 2.1 AA compliance maintained

## Out of Scope

- npm package publication
- Custom domain setup
- Vercel migration
- Authentication for demos
- Backend changes
- New chart types

## Verification

1. Run `npm run build` - should complete without errors
2. Run `npm run export` - should generate static files
3. Test all three locales (sr-Cyrl, sr-Latn, en)
4. Verify GitHub Pages deployment works
5. Check hero section renders correctly
6. Verify CTAs link to correct pages
7. Test accessibility with screen reader
