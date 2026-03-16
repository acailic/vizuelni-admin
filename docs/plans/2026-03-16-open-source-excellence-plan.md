# Open Source Excellence Plan

**Date:** 2026-03-16  
**Owner:** Vizuelni maintainers  
**Baseline:** `vizuelni-admin-srbije`  
**Goal:** Turn the repo into a category-defining open-source project by fixing trust gaps first, then sharpening the product wedge, release quality, documentation, and community operations.

---

## Summary

This repo already has the right raw ingredients:

- A differentiated mission: Serbian-first public data visualization
- A real technical surface: app, packages, tests, docs, examples, deployment templates
- A plausible ecosystem wedge: `data.gov.rs`, multilingual support, civic use cases

The main blocker is not lack of ambition. It is lack of consistency across the public surface:

- metadata still points to placeholder or legacy identities
- workflows still reference stale `app/` paths
- typecheck is not clean on the default branch
- docs are broad but not consistently accurate
- package, repo, and governance surfaces do not all describe the same project

Top-tier open source projects win trust quickly. A stranger should be able to:

1. discover the project
2. understand what it is for
3. clone it successfully
4. run it successfully
5. trust that the docs match reality
6. contribute or consume packages without guessing

This plan prioritizes that outcome.

---

## North Star

Vizuelni should become the best open-source way to turn Serbian public data into trustworthy, shareable, multilingual visualizations.

That means:

- the repo tells one coherent story
- `main` is boringly green
- the docs are accurate and short enough to trust
- the packages are publishable and easy to adopt
- the app has one unmistakably strong "golden path"
- maintainers operate with visible discipline

---

## Non-Goals

Until the trust and execution foundations are fixed, do not prioritize:

- regional expansion beyond Serbia
- plugin marketplaces
- enterprise positioning that outpaces the actual product
- new major surfaces that add docs and maintenance burden without deepening the core workflow
- broad strategic writing that is not tied to current product truth

---

## Success Criteria

The repo is materially stronger when all of the following are true:

- `npm install`, `npm run lint`, `npm run type-check`, `npm test`, and `npm run build` pass in CI on pull requests
- root metadata, package metadata, README, docs hub, and governance all point to the same repo, package names, and support channels
- the README offers one verified path from clone to visible result in under 5 minutes
- one canonical user flow is excellent: dataset -> chart -> publish/share/embed
- package release flow is documented, automated, and semver-disciplined
- there is a real security policy, support path, and contributor workflow
- issue triage and release cadence are visible and predictable

---

## Priority Order

1. Restore truth and trust across the public repo surface.
2. Make `main` reliably green and CI enforce it.
3. Define and polish one killer product path.
4. Treat packages and releases like a library company.
5. Reduce docs sprawl into a trustworthy core.
6. Build maintainership and community operations around the now-stable project.

---

## Phase 0: Trust Restoration

**Priority:** P0  
**Why it matters:** If the project looks inconsistent, every later investment compounds confusion instead of trust.

### Main problems to fix

- Placeholder repo URLs in root metadata
- Legacy repo/package references across package manifests and docs
- README examples and install instructions that do not match the current monorepo
- Missing or overclaimed security and support surfaces

### Primary files

- `package.json`
- `README.md`
- `CONTRIBUTING.md`
- `docs/README.md`
- `docs/GOVERNANCE.md`
- `docs/reference/SECURITY.md`
- `packages/*/package.json`
- `examples/*/README.md`

### Work

- Replace all placeholder repo URLs, issue URLs, and author placeholders with the actual public identity.
- Remove or correct references to packages or surfaces that do not exist.
- Align package names, repo URLs, license statements, and npm references across root and package manifests.
- Replace speculative support/security language with real support channels and realistic guarantees.
- Remove placeholder demo links and example domains from public-facing docs.

### Acceptance criteria

- A user does not encounter `your-org`, `YOUR_USERNAME`, `security@example.com`, or example-only demo URLs in the public docs or package metadata.
- Root and package manifests all point to the same repo identity.
- Governance, docs hub, and README all describe the same project and license.
- No public doc claims support, security programs, or release maturity that the project does not actually provide.

---

## Phase 1: Green Main and Quality Gates

**Priority:** P0  
**Why it matters:** Serious projects do not ask users or contributors to guess whether the default branch is healthy.

### Main problems to fix

- Typecheck currently fails on the homepage message shape
- Existing workflows reference stale `app/` layout assumptions
- There is no credible PR gate covering the current repo structure

### Primary files

- `src/app/[locale]/page.tsx`
- `.github/workflows/lint.yml`
- `.github/workflows/deploy-github-pages.yml`
- `package.json`
- `playwright.config.ts`
- `jest.config.js`
- `packages/*/package.json`

### Work

- Fix the current type errors and make `npm run type-check` pass locally and in CI.
- Replace stale workflows with repo-accurate CI jobs for install, lint, typecheck, unit tests, package builds, and at least one smoke build.
- Make CI use the actual package manager and workspace layout used by the repo.
- Fail on warnings only where the team is ready to enforce them; do not add fake strictness that will immediately be bypassed.
- Add a small verification matrix for app build plus package build.

### Acceptance criteria

- `main` is green without manual caveats.
- Pull requests run a modern CI pipeline that matches the current monorepo.
- A broken type, build, or packaging contract blocks merge automatically.
- Deployment workflows no longer reference directories that do not exist.

---

## Phase 2: Product Wedge and Golden Path

**Priority:** P0/P1  
**Why it matters:** Great open-source repos are not only clean. They are memorable because they solve one concrete problem unusually well.

### Product thesis

The repo should lead with one unmistakable promise:

> Take Serbian public data, especially from `data.gov.rs`, and turn it into clear, multilingual, publishable visualizations quickly.

### Golden path

1. Browse or paste a Serbian public dataset
2. Generate a first useful chart
3. Adjust labels, locale, and presentation
4. Publish or embed it
5. Share it with confidence

### Primary files

- `src/app/[locale]/page.tsx`
- `src/app/[locale]/browse/*`
- `src/app/[locale]/create/*`
- `src/app/api/*`
- `src/components/home/*`
- `src/components/charts/*`
- `src/lib/examples/*`
- `tests/e2e/*`
- `tests/ai/flows/*`

### Work

- Reduce homepage and README messaging to this core promise.
- Choose 3 flagship Serbian datasets and make them the canonical examples across the site and docs.
- Ensure the create/publish/embed path is stable enough to demo live.
- Add one end-to-end test for the full golden path.
- Tighten copy, defaults, and examples so the first chart feels fast and credible.

### Acceptance criteria

- A new user can complete the golden path in one session without reading deep docs.
- The homepage, README, and examples all point to the same use case.
- There is at least one reliable E2E test that covers the golden path.
- The flagship examples are visually strong, accurate, and reusable in launch materials.

---

## Phase 3: Package and Release Discipline

**Priority:** P1  
**Why it matters:** If the repo wants to be treated as a platform and a library, publishing quality must be intentional.

### Main problems to fix

- packages exist, but repo identity and docs are inconsistent
- release surfaces describe multiple historical states
- there is not yet one obvious, trusted release contract for consumers

### Primary files

- `.changeset/config.json`
- `packages/*/package.json`
- `packages/*/README.md`
- `CHANGELOG.md`
- `docs/release/*`
- `typedoc.json`

### Work

- Decide the actual public package strategy and document it once.
- Align package READMEs around verified install and usage examples.
- Add or tighten package build checks so every published package is buildable and importable.
- Define release channels clearly: stable, beta, internal-only if relevant.
- Use Changesets consistently for versioning and changelog generation.
- Document migration expectations when APIs or package names change.

### Acceptance criteria

- Every published package has accurate metadata, README, and build output.
- Release docs match the current package strategy.
- Changesets are part of the normal contributor workflow.
- Consumers can tell which packages are stable, experimental, or internal.

---

## Phase 4: Docs Consolidation

**Priority:** P1  
**Why it matters:** Huge docs sets are a liability when they drift faster than the code.

### Main problems to fix

- too many docs compete to define the project
- stale architecture and historical migration content are mixed with live onboarding
- the docs hub is not a reliable map of what to read first

### Primary files

- `README.md`
- `docs/README.md`
- `docs/GETTING-STARTED.md`
- `docs/API_REFERENCE.md`
- `docs/ARCHITECTURE.md`
- `docs/DEPLOYMENT.md`
- `docs/guide/*`
- `docs/reference/*`

### Work

- Define a small docs core:
  - README
  - Getting Started
  - API Reference
  - Architecture
  - Deployment
  - Contributing
  - Security
- Move older strategy, exploration, and historical plans into clearly secondary sections.
- Verify every code sample in the primary docs.
- Rewrite the docs hub so it routes users by intent instead of by document collection.
- Prefer fewer canonical documents over many overlapping ones.

### Acceptance criteria

- A first-time contributor can find the right starting doc in under 30 seconds.
- Primary docs are actively verified and visibly current.
- Historical and strategic materials no longer compete with onboarding docs.
- The README is shorter, more factual, and more runnable.

---

## Phase 5: Maintainer Operations and Community

**Priority:** P2  
**Why it matters:** Once the repo is trustworthy, maintainership quality becomes the next differentiator.

### Primary surfaces

- `.github/ISSUE_TEMPLATE/*`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `docs/GOVERNANCE.md`
- `docs/COMMUNITY_INFRASTRUCTURE.md`

### Work

- Simplify governance to the actual current maintainer model.
- Add discussion categories or an equivalent lightweight support channel if maintainers are ready to operate it.
- Define triage labels, response expectations, and contributor-friendly issue buckets.
- Create a small queue of high-quality `good first issue` and `help wanted` tasks.
- Publish release notes consistently and highlight contributor credits.
- Add a showcase intake path for real civic, journalism, research, or NGO examples.

### Acceptance criteria

- Contributors can tell where to ask, where to report, and how to help.
- Governance describes reality, not aspiration.
- The repo shows consistent evidence of maintenance: triage, releases, responses, or public updates.
- Community participation deepens around real examples, not generic announcements.

---

## Phase 6: Proof of Quality

**Priority:** P2  
**Why it matters:** Elite projects back claims with visible evidence.

### Work

- Publish benchmark or quality scorecards only for metrics that are actually measured.
- Use screenshots, live examples, and tests to prove accessibility, responsiveness, and package quality.
- Highlight one or two polished case studies instead of many speculative scenarios.
- Add a release checklist that includes docs verification, smoke testing, and example validation.

### Acceptance criteria

- Public quality claims map to evidence in the repo.
- Launch materials and README screenshots are current.
- Accessibility, performance, and packaging claims are backed by checks or documented audits.

---

## First 10 PR Sequence

Execute these in order. Do not start broad marketing or ecosystem expansion before the first six are complete.

1. **Repo identity cleanup**
   - Fix root `package.json`, package manifests, README clone URLs, docs hub links, and support/security placeholders.

2. **Homepage typecheck fix**
   - Fix the current `messages.homepage.hero.*` contract mismatch and get local typecheck passing.

3. **Real CI**
   - Replace stale workflows with PR gates for install, lint, typecheck, tests, package builds, and app build.

4. **Security and support truthfulness**
   - Add a real root security policy and remove overclaims from buried docs.

5. **README rewrite**
   - Make the README shorter, factual, runnable, and centered on the golden path.

6. **Docs hub consolidation**
   - Turn `docs/README.md` into a reliable navigation page for the active docs set.

7. **Golden path E2E**
   - Add one test that proves the main data-to-chart journey works.

8. **Flagship examples**
   - Curate 3 Serbian dataset demos and make them the canonical showcase.

9. **Release contract**
   - Align Changesets, package READMEs, changelog policy, and release docs.

10. **Community operating system**

- Finalize governance, issue labels, contributor queue, and showcase intake.

---

## Definition of Done

This plan is complete when the repo behaves like one coherent product and one coherent library ecosystem:

- one identity
- one trustworthy onboarding path
- one enforced quality gate
- one excellent core workflow
- one believable release story
- one maintainable community model

That is the standard required before chasing "top 0.1%" positioning publicly.

---

## Risks

- Over-documenting before stabilizing the code will recreate the same drift.
- Adding more surfaces before fixing CI and metadata will increase distrust.
- Overclaiming security, accessibility, or maturity will hurt credibility faster than missing features.
- Expanding scope beyond the Serbian public-data wedge too early will weaken differentiation.

---

## Guiding Principle

Do fewer things, but make each of them obviously real.
