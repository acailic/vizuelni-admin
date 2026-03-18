# Public Launch Landing Page - Workstream A Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` or equivalent execution workflow. Track progress with checkbox updates in this file.

## Scope

This document implements **Workstream A: Landing Page** from the revised launch spec.

In scope:

- homepage hero refresh
- truthful social proof
- problem statement
- solution showcase
- features grid
- how-it-works section
- use cases
- code example section
- live examples gallery
- comparison section
- final CTA
- homepage copy in `sr-Cyrl`, `sr-Latn`, and `en`
- homepage metadata
- static-export-safe verification

Out of scope for this file:

- StackBlitz project generation
- demo-package architecture beyond homepage links
- docs-site restructuring
- sitemap/robots/global SEO files
- analytics provider rollout
- launch-content/community-post templates

Those belong in companion plans after this homepage plan is complete.

## Execution Principles

- Reuse existing components and data sources where practical.
- Do **not** add a second language switcher in the hero; the app shell already provides one.
- Do **not** fetch GitHub stars client-side from the homepage.
- Do **not** hide social proof behind arbitrary thresholds.
- Do **not** remove developer-facing value without adding a dedicated replacement section.
- Do **not** include blanket `git add .` or commit steps in the plan.
- Verify `npm run export`, not only `npm run build`.

## Current Repo Surfaces To Reuse

- `src/app/[locale]/page.tsx`
- `src/components/home/HeroSectionAnimated.tsx`
- `src/components/home/FeaturedExamples.tsx`
- `src/components/home/GettingStartedGuide.tsx`
- `src/components/showcase/ShowcaseGrid.tsx`
- `src/lib/examples/demo-gallery-examples.ts`
- `src/lib/examples/showcase-examples.ts`
- `src/components/layout/AppHeader.tsx`
- `src/components/ui/LanguageSwitcher.tsx`
- `src/lib/i18n/locales/*`

## File Plan

### Create

```text
src/components/home/SocialProof.tsx
src/components/home/ProblemStatement.tsx
src/components/home/FeaturesGrid.tsx
src/components/home/UseCases.tsx
src/components/home/CodeExamplePanel.tsx
src/components/home/ComparisonTable.tsx
src/components/home/FinalCta.tsx
```

### Modify

```text
src/app/[locale]/page.tsx
src/components/home/HeroSectionAnimated.tsx
src/components/home/FeaturedExamples.tsx
src/components/home/GettingStartedGuide.tsx
src/components/home/index.ts
src/lib/i18n/locales/en/common.json
src/lib/i18n/locales/sr/common.json
src/lib/i18n/locales/lat/common.json
```

## Content And Data Decisions

### Hero

- Primary CTA: `Try Demo`
- Secondary CTA: `Star on GitHub`
- Hero preview uses real example-backed data, not placeholder bars
- Keep `HeroAnimatedChart` only as background decoration if the foreground preview uses real data

### Social Proof

Use static truthful facts already supported by the repo:

- demo/example count from `demoGalleryExamples.length`
- locale count from `locales.length`
- `WCAG 2.1 AA`
- `Open Source`

If GitHub star count is added later, do it via build-time enrichment or explicit static copy refresh, not runtime homepage fetches.

### Language Toggle

Execution note: the visible language switch already exists in the app shell header via `AppHeader` + `LanguageSwitcher`. This plan must preserve that experience, not duplicate it.

### Code Example

Remove the toggleable in-hero code panel only **after** adding a dedicated `CodeExamplePanel` lower on the page.

## Section Mapping

This plan maps the approved landing-page sections to repo implementation as follows:

| Approved section      | Execution approach                                                         |
| --------------------- | -------------------------------------------------------------------------- |
| Hero                  | Modify `HeroSectionAnimated.tsx`                                           |
| Social proof          | New `SocialProof.tsx`, rendered in hero                                    |
| Problem statement     | New `ProblemStatement.tsx`                                                 |
| Solution showcase     | Rework `FeaturedExamples.tsx` copy and framing                             |
| Features grid         | New `FeaturesGrid.tsx`                                                     |
| How it works          | Extend `GettingStartedGuide.tsx` instead of creating a duplicate component |
| Use cases             | New `UseCases.tsx`                                                         |
| Live examples gallery | Keep `ShowcaseGrid` section in `page.tsx`, update copy/CTA framing         |
| Code example          | New `CodeExamplePanel.tsx`                                                 |
| Comparison table      | New `ComparisonTable.tsx`                                                  |
| Final CTA             | New `FinalCta.tsx`                                                         |

## Chunk 1: Copy Contract And Message Shape

- [ ] Add homepage message groups for:
  - `hero`
  - `socialProof`
  - `problem`
  - `features`
  - `useCases`
  - `comparison`
  - `finalCta`
  - `codeExample`
  - `liveExamples`
- [ ] Keep locale edits in `src/lib/i18n/locales/*`, because `getMessages()` reads from those files.
- [ ] Update hero CTA keys to launch language. Do not leave homepage wired to `browseCta` / `createCta`.
- [ ] Add copy for all three locales before component implementation to avoid prop churn.
- [ ] Ensure copy supports both primary audiences:
  - civic-data users
  - developers

## Chunk 2: Hero And Social Proof

- [ ] Create `src/components/home/SocialProof.tsx`.
- [ ] Implement `SocialProof` as a presentational component only.
- [ ] Pass factual values from the page or hero props; do not fetch GitHub API data from the client.
- [ ] Modify `HeroSectionAnimated.tsx` to:
  - render `SocialProof` near the top
  - replace primary CTA target with `/${locale}/demo-gallery`
  - replace secondary CTA target with `https://github.com/acailic/vizualni-admin`
  - remove the in-hero code toggle
  - replace the fake preview bars with a real example-backed preview card
  - remove or repurpose the bottom stats bar so it does not duplicate social proof
- [ ] Keep the hero performant and static-export-safe.

## Chunk 3: Mid-Page Narrative Sections

- [ ] Create `src/components/home/ProblemStatement.tsx`.
- [ ] Build the section as 3 columns:
  - transparency gap
  - technical barrier
  - language barrier
- [ ] Create `src/components/home/FeaturesGrid.tsx`.
- [ ] Include the launch feature set:
  - Serbian-first design
  - real public-data examples
  - accessibility
  - built-in geography or local context
  - open-source customization
  - low-friction getting started
- [ ] Create `src/components/home/UseCases.tsx`.
- [ ] Keep use-case links truthful and executable with current routes:
  - demo gallery category links
  - GitHub link for developers

## Chunk 4: Reuse Existing Showcase Surfaces

- [ ] Update `src/components/home/FeaturedExamples.tsx` to serve as the **solution showcase** section.
- [ ] Change the section framing and labels so it reads as marketing-facing, not just “examples.”
- [ ] Keep the current example data/hooks if they are already stable.
- [ ] Keep the existing `ShowcaseGrid` block in `src/app/[locale]/page.tsx` as the **live examples gallery**.
- [ ] Update the section heading and helper copy in `page.tsx` so it distinguishes “solution showcase” from “live examples gallery.”

## Chunk 5: How It Works

- [ ] Reuse `src/components/home/GettingStartedGuide.tsx` instead of creating a new `HowItWorks.tsx`.
- [ ] Extend `GettingStartedGuide.tsx` only if needed for:
  - stronger visual hierarchy
  - better launch copy
  - optional CTA button to demo gallery
- [ ] Rename the section copy through locale messages so the rendered heading is “How It Works” / equivalent locale text.

## Chunk 6: Lower-Funnel Sections

- [ ] Create `src/components/home/CodeExamplePanel.tsx`.
- [ ] Move the developer-facing code snippet experience here, below the main discovery sections.
- [ ] Create `src/components/home/ComparisonTable.tsx`.
- [ ] Compare Vizuelni Admin to generic chart libraries using truthful Serbian-specific advantages.
- [ ] Create `src/components/home/FinalCta.tsx`.
- [ ] Make the final CTA reinforce:
  - `Try Demo`
  - `Star on GitHub`
  - optional docs/supporting link if copy supports it

## Chunk 7: Page Assembly

- [ ] Update `src/components/home/index.ts` exports.
- [ ] Update `src/app/[locale]/page.tsx` section order to:
  1. Hero
  2. Problem statement
  3. Solution showcase
  4. Features grid
  5. How it works
  6. Use cases
  7. Live examples gallery
  8. Code example
  9. Comparison table
  10. Final CTA
- [ ] Remove the standalone `QuickStats` section from the homepage if its claims are not verified and required by the new flow.
- [ ] Add localized homepage `generateMetadata` in `src/app/[locale]/page.tsx` so the homepage itself ships with better title/description metadata.

## Chunk 8: Verification

- [ ] Run `npm run type-check`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run `npm run export`.
- [ ] Manually verify homepage rendering in:
  - `/sr-Cyrl`
  - `/sr-Latn`
  - `/en`
- [ ] Verify:
  - primary CTA opens demo gallery
  - secondary CTA opens GitHub
  - header language switch still works
  - hero contains real-data preview, not placeholder bars
  - code example exists outside the hero
  - no section order regressions
  - static export succeeds without homepage errors

## Definition Of Done

- [ ] Homepage matches Workstream A scope from the revised spec.
- [ ] No runtime GitHub stars fetch exists in the homepage path.
- [ ] No duplicate hero language toggle is introduced.
- [ ] Developer-facing code value still exists via `CodeExamplePanel`.
- [ ] Homepage builds and exports successfully.
- [ ] The plan is ready for direct execution without additional scope clarification.

## Execution Notes

- If implementation reveals that homepage metadata or section copy needs a separate follow-up, create a companion plan rather than inflating this one mid-flight.
- If any existing values such as chart counts or demo counts are uncertain, prefer neutral truthful labels over invented numbers.
