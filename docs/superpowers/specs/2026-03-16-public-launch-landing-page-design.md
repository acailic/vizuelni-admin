# Public Launch Presentation, Demo, and Landing Page Plan

**Date:** 2026-03-16  
**Status:** Revised Plan  
**Author:** Codex

## Purpose

This document replaces the earlier landing-page-only brief with a repo-grounded public launch plan for Vizuelni Admin. It is intended to guide implementation for the broader launch prompt: landing page, public demos, documentation, deployment, SEO, analytics, and marketing collateral.

## Context

Vizuelni Admin is an open-source Serbian government data visualization project built with Next.js 14, React 18, TypeScript, and a monorepo structure. The repository already contains:

- a localized app shell under `src/app/[locale]/*`
- an existing homepage at `src/app/[locale]/page.tsx`
- reusable home components under `src/components/home/*`
- a demo gallery at `src/app/[locale]/demo-gallery/page.tsx`
- demo/example definitions in `src/lib/examples/*`
- privacy-friendly analytics wiring in `src/components/Analytics.tsx`
- static deployment support and GitHub Pages workflow in `.github/workflows/deploy-github-pages.yml`
- TypeDoc output and docs content under `docs/*`
- StackBlitz templates and guides under `templates/stackblitz/*` and `docs/STACKBLITZ_DEMO.md`

The earlier spec was too narrow. It focused on a hero refresh and a few marketing sections, but the public launch requires a complete go-to-market surface.

## Launch Objective

Launch a zero-to-low-cost public presence that:

1. makes the project immediately understandable in under 5 seconds
2. drives users into a working demo before asking them to read docs
3. supports both civic-data practitioners and developers without mixing the message
4. improves GitHub stars, example usage, and partnership/funding credibility
5. stays compatible with static hosting and graceful degradation requirements

## Positioning

### Primary Promise

Vizuelni Admin helps people explore and present Serbian public data through ready-made visualizations, reusable examples, and Serbian-first UX.

### Audience Hierarchy

| Audience                            | Priority  | What they need                                             |
| ----------------------------------- | --------- | ---------------------------------------------------------- |
| Data journalists, researchers, NGOs | Primary   | Immediate demo value, Serbian data relevance, easy sharing |
| Developers and civic-tech teams     | Secondary | GitHub credibility, code examples, StackBlitz, docs        |
| Government/public institutions      | Tertiary  | Trust, accessibility, localization, embeddable visuals     |

### Messaging Rule

Do not position the product as purely "no-code" or purely "developer library." The launch should present:

- a public demo experience first
- an open-source platform second
- implementation details and code paths third

### CTA Hierarchy

1. `Try Demo`
2. `Star on GitHub`
3. `View Docs`

## Constraints

- zero or minimal hosting cost in the first year
- no required database for public demo paths
- no authentication required for launch demos
- public demo must work client-side
- static-content-first architecture for launch
- WCAG 2.1 AA compliance preserved
- mobile-first layout
- content remains understandable without JavaScript

## Key Decisions

| Decision                 | Choice                                                                                            | Rationale                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Main public site hosting | Keep current GitHub Pages path for launch                                                         | Already wired and free                                           |
| Interactive coding demos | Use StackBlitz                                                                                    | Fits zero-backend requirement and repo already has template/docs |
| Docs strategy            | Use existing `docs/` + TypeDoc + VitePress-style content; avoid framework migration before launch | Lower risk than introducing Nextra/Docusaurus now                |
| Locale content source    | Continue using `public/locales/*`                                                                 | Matches current app                                              |
| Analytics                | Privacy-friendly, optional, defaulting to Plausible-style events                                  | Already supported by `src/components/Analytics.tsx`              |
| Social proof             | Use truthful live or build-time repo stats; never invent thresholds like "1,000+"                 | Launch trust matters more than vanity                            |
| Primary conversion       | Demo engagement                                                                                   | Stronger top-of-funnel than docs-first                           |

## What This Plan Covers

### Workstream A: Landing Page

Deliver a public launch homepage that includes:

- hero with embedded real-data preview
- language toggle for `sr-Cyrl`, `sr-Latn`, `en`
- primary CTA `Try Demo`
- secondary CTA `Star on GitHub`
- social proof bar using truthful project facts
- problem statement
- solution showcase
- features grid
- use cases
- code example block
- live examples gallery
- comparison section
- final CTA

### Workstream B: Public Demo Package

Deliver a public demo system that includes:

- embedded hero preview
- expanded demo gallery using existing `src/components/demo-gallery/*`
- StackBlitz entry points for:
  - basic chart demo
  - Serbia map demo
  - full guided demo
- static sample datasets stored in-repo
- local-first data loading with online fallback
- shareable links for examples

### Workstream C: Documentation Surface

Deliver a clearer documentation experience that includes:

- a launch-oriented docs home
- a getting started path
- a demos/examples index
- component/API references linked to generated TypeDoc
- contributor path

This launch does **not** require a migration to Nextra or Docusaurus. The repo already has docs content and TypeDoc output. Migration can be evaluated later as a separate project.

### Workstream D: Deployment and Infrastructure

Deliver a low-cost deployment setup that includes:

- current GitHub Pages deployment for public site
- StackBlitz for interactive sandboxes
- optional future Vercel path documented, not required for launch
- explicit environment variable template for analytics and public links

### Workstream E: SEO and Social

Deliver:

- page metadata for homepage, demo pages, and example pages
- Open Graph and Twitter cards
- sitemap and robots
- structured data
- social preview image generation plan

### Workstream F: Analytics and Conversion Tracking

Deliver:

- pageview and CTA event tracking
- demo interaction tracking
- StackBlitz open tracking
- GitHub click tracking
- docs search and example interaction tracking where feasible

### Workstream G: Launch Content and Discovery

Deliver:

- homepage copy in 3 languages
- demo descriptions
- GitHub repo profile improvements
- npm/GitHub/About copy if package publication follows later
- Product Hunt and community-post templates
- outreach copy for Serbian civic-tech and media communities

## Repo-Grounded Implementation Map

### Existing Files to Modify

```
src/app/[locale]/page.tsx
src/app/layout.tsx
src/components/home/HeroSectionAnimated.tsx
src/components/home/index.ts
src/components/demo-gallery/DemoGalleryClient.tsx
src/components/demo-gallery/DemoGalleryCard.tsx
src/components/demo-gallery/DemoGalleryModalEnhanced.tsx
src/app/[locale]/demo-gallery/page.tsx
public/locales/en/common.json
public/locales/sr-Cyrl/common.json
public/locales/sr-Latn/common.json
.github/workflows/deploy-github-pages.yml
```

### Likely New App Components

```
src/components/home/SocialProof.tsx
src/components/home/ProblemStatement.tsx
src/components/home/SolutionShowcase.tsx
src/components/home/UseCases.tsx
src/components/home/ComparisonTable.tsx
src/components/home/FinalCta.tsx
src/components/home/CodeExamplePanel.tsx
src/components/home/LanguageToggle.tsx
src/components/home/ShareButtons.tsx
```

### Likely New App/SEO Files

```
src/app/sitemap.ts
src/app/robots.ts
src/app/opengraph-image.tsx
src/lib/analytics/index.ts
src/lib/marketing/social.ts
```

### Likely New Demo/Data Files

```
public/data/budget-2024-sample.json
public/data/population-by-municipality-sample.json
public/data/election-results-sample.json
public/data/environmental-indicators-sample.json
src/lib/demo/data-loader.ts
src/lib/demo/stackblitz.ts
```

### Docs and Launch Content Files

```
docs/index.md
docs/GETTING-STARTED.md
docs/STACKBLITZ_DEMO.md
docs/ANALYTICS_SETUP_GUIDE.md
docs/LAUNCH_MATERIALS.md
docs/DATA_JOURNALISM_TOOLKIT.md
docs/api-reference/*
```

## Landing Page Plan

### Hero

The hero must satisfy the original prompt and current product reality:

- one-sentence value proposition
- real Serbian data visual, not abstract decoration
- visible `Try Demo` button above the fold
- GitHub CTA present but secondary
- locale switch visible
- no stock photos

### Hero Visual Decision

Use an existing example-backed visualization rather than a fake illustration. Recommended default:

- population pyramid or regional population comparison from `src/lib/examples/demo-gallery-examples.ts`

Reason:

- immediately legible
- visually distinctive
- politically safer than elections as the first visual
- already aligned with current examples infrastructure

### Hero Variants to Produce

Implementation should ship one default hero and keep copy variants prepared for testing:

1. Problem-solution
2. Benefit-first
3. Open-source/civic-data credibility

### Section Order

1. Hero
2. Social proof
3. Problem statement
4. Solution showcase with live previews
5. Features grid
6. How it works
7. Use cases
8. Live examples
9. Code example
10. Comparison table
11. Testimonials or request-for-feedback block
12. Final CTA

## Demo Plan

### Public Demo Architecture

For launch, prefer a zero-backend demo path:

- local JSON in `public/data/*`
- client-side rendering
- localStorage for small persisted preferences
- optional fetch from `data.gov.rs` only when available and non-blocking
- local fallback always available

### Demo Types

| Demo        | Goal                      | Where surfaced              |
| ----------- | ------------------------- | --------------------------- |
| Hero Demo   | Fast first interaction    | Homepage hero               |
| Guided Demo | Teach how a chart is made | Feature section / demo page |
| Full Demo   | Explore examples and code | Demo gallery + StackBlitz   |

### Demo Gallery Requirements

Use the existing gallery as the base and expand it with:

- better filtering
- search by title and dataset
- stronger card metadata
- share link
- `View Code`
- `Edit in StackBlitz`

## Documentation Plan

### Launch Principle

Do not create a full docs migration project before launch.

Instead:

- tighten the current docs entry points
- make getting started easier to scan
- connect TypeDoc output to human-written guides
- expose examples before deep API docs

### Docs Information Architecture for Launch

1. Docs home
2. Getting started
3. Examples gallery
4. Core concepts
5. API reference
6. Integrations
7. Contributing

### API Docs

Keep `typedoc.json` as the source of truth for generated API docs. Improve source comments where needed, but do not replace the generation pipeline during this launch effort.

## Deployment Plan

### Launch Recommendation

| Surface               | Platform                                      | Cost                          |
| --------------------- | --------------------------------------------- | ----------------------------- |
| Main public app       | GitHub Pages                                  | $0                            |
| Interactive sandboxes | StackBlitz                                    | $0 for public demos           |
| Docs                  | same GitHub Pages/docs surface for launch     | $0                            |
| Analytics             | optional Plausible/Umami/Vercel based on host | low or $0 depending on choice |

### Notes

- keep current GitHub Pages deployment workflow as the default launch path
- do not make Vercel a prerequisite
- document Vercel as an optional future upgrade for preview environments and server features

## SEO and Social Plan

### Homepage Metadata

Add launch-quality metadata beyond the current root defaults in `src/app/layout.tsx`:

- localized titles
- localized descriptions
- canonical URLs
- Open Graph metadata
- Twitter metadata

### Required Additions

- `src/app/sitemap.ts`
- `src/app/robots.ts`
- OG image generation or a fixed generated asset strategy
- structured data for software application / open-source project

## Analytics Plan

### Tracked Events

- page_view
- hero_try_demo_click
- hero_github_click
- docs_click
- example_open
- stackblitz_open
- code_copy
- share_click

### Technical Direction

- keep `src/components/Analytics.tsx` as the script loader
- add a small typed analytics helper in `src/lib/analytics/index.ts`
- all tracking must fail safely when analytics is disabled

## Marketing/Discovery Plan

### Immediate Launch Assets

- GitHub About text and topics
- README refresh aligned to launch messaging
- Product Hunt draft copy
- DEV.to / Hashnode post draft
- Serbian community outreach templates
- partner and grant-ready one-paragraph summary

### Content Themes

- Serbian public data made understandable
- open-source civic-tech infrastructure
- ready-to-use examples with real local context
- accessibility and multilingual support

## Implementation Phases

### Phase 1: Launch-Critical

- homepage restructuring
- hero demo
- social proof and CTA cleanup
- demo gallery improvements
- localized copy refresh
- metadata and social tags
- analytics hooks

### Phase 2: Demo Expansion

- StackBlitz projects and deep links
- sample data package
- code-example section
- share buttons
- comparison section

### Phase 3: Docs and Marketing Packaging

- docs home refresh
- launch materials
- outreach templates
- contributor funnel improvements

## Acceptance Criteria

The revised launch is complete when:

- homepage clearly explains product value in all 3 locales
- `Try Demo` is the dominant CTA
- users can reach a working demo in one click
- at least 3 reusable public datasets back the demo experience
- demo gallery supports stronger discovery and sharing
- SEO metadata exists for core public pages
- analytics can be enabled without breaking static builds
- GitHub Pages build remains functional
- core content remains readable with JavaScript disabled

## Verification Checklist

1. `npm run build`
2. `npm run export`
3. verify homepage in `sr-Cyrl`, `sr-Latn`, and `en`
4. verify GitHub Pages build still renders correctly
5. verify hero CTA routes
6. verify demo gallery routes and share links
7. verify metadata presence on homepage and demo pages
8. verify keyboard navigation across hero, cards, modal, and CTA sections
9. verify `noscript` readability of primary marketing content
10. verify analytics-disabled mode does not throw client errors

## Explicit Non-Goals for This Plan

- paid infrastructure
- authentication flows for public launch
- mandatory database-backed public features
- package-publishing work as a blocker for launch
- full docs-framework migration before launch

## Risks

- current product message can become muddled if "no-code tool" and "developer library" are mixed in the same headline
- static hosting constraints can break features that quietly depend on server routes
- docs sprawl can dilute the launch if the homepage sends users into deep technical material too early

## Recommendation

Treat this as the launch master plan. Subsequent implementation specs should split into:

1. landing page implementation
2. public demo and StackBlitz package
3. SEO/analytics instrumentation
4. docs and launch-content packaging
