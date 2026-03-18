# Dataset Preview and Recommendation Flow

**Date:** 2026-03-16  
**Status:** Proposed  
**Owner:** Vizuelni maintainers  
**Scope:** Configurator dataset selection, chart recommendation, and template selection

---

## Summary

The configurator should not make users guess what to do after picking a dataset.

After dataset selection, the product should immediately show:

1. a compact preview of the loaded data
2. detected structure and quality signals
3. ranked chart recommendations with reasons
4. dataset-aware template suggestions

This keeps the workflow fast for new users while preserving manual control for advanced users.

---

## Problem

The current flow already loads and classifies datasets, and it can generate a suggested chart config internally. However, that intelligence is not clearly exposed in the UI.

Current issues:

- users can select a dataset without seeing a meaningful raw-data preview
- chart selection is framed as compatibility, not recommendation
- the system can infer good defaults, but it does not explain them
- template browsing is generic, not strongly tied to the active dataset

As a result, the product does useful work behind the scenes but does not turn that work into trust or speed for the user.

---

## Existing Foundation

The feature is a good fit for the current codebase because the main building blocks already exist:

- `src/components/configurator/DatasetStep.tsx`
  Loads and classifies previewable datasets after selection.
- `src/components/configurator/ConfiguratorShell.tsx`
  Preloads datasets and generates a suggested chart config.
- `src/lib/data/patterns/index.ts`
  Detects semantic patterns from dimensions and measures.
- `src/lib/data/patterns/chart-suggestions.ts`
  Produces ranked chart suggestions with confidence and reasons.
- `src/types/dashboard-templates.ts`
  Defines reusable dashboard template layouts.
- `src/components/configurator/ChartTypeStep.tsx`
  Already lists chart options and compatibility states.

The main missing piece is presentation and orchestration, not core capability.

---

## Goals

- Reduce the time from dataset selection to first useful chart.
- Make the recommendation logic visible and explainable.
- Preserve manual override for every decision.
- Help less technical users choose good defaults without learning chart theory first.
- Reuse existing chart and template infrastructure rather than introducing a parallel flow.

---

## Non-Goals

- Full AI-generated dashboards from arbitrary prompts
- Hiding manual chart selection behind an automated-only flow
- Replacing the current configurator with a separate wizard
- Solving every edge case in the first pass

---

## Proposed User Flow

### 1. Dataset Selection

User searches and selects a dataset as today.

### 2. Immediate Dataset Preview

Once the dataset is loaded, show a compact preview panel before or alongside chart selection:

- dataset title and source
- row count, dimension count, measure count
- first 8-12 rows in a small table
- detected field roles such as time, geography, category, age group, gender
- quality warnings if relevant, such as high cardinality or missing values

This should answer the question: "What kind of data is this?"

### 3. Recommendation Rail

Show recommendation cards above the full chart picker:

- `Best fit`
- `Good alternative`
- `Use table instead`

Each card should include:

- chart type
- confidence or strength label
- one plain-language reason
- an action to apply the recommendation

Examples:

- "Line chart: time series detected"
- "Map: geographic distribution detected"
- "Table: too many categories for a clean chart"

This should answer the question: "What should I start with?"

### 4. Dataset-Aware Template Suggestions

After chart recommendations, show a smaller set of template cards derived from the same dataset signals:

- time series data -> trend-focused layout
- geography data -> map plus supporting comparison
- single categorical comparison -> hero chart or side-by-side comparison
- multi-measure dataset -> combo or comparison layout

Templates should not be generic decoration. They should be pre-filtered and ranked for the active dataset.

This should answer the question: "What finished shape fits this dataset?"

### 5. Manual Override

Keep the full chart type grid available below recommendations.

The user must still be able to:

- ignore recommendations
- pick any compatible chart
- remap fields manually
- continue through the existing configurator steps

This keeps the system assistive rather than controlling.

---

## Recommendation Model

### Inputs

- parsed dataset dimensions and measures
- semantic detection output
- dataset cardinality
- row count and quality warnings

### Outputs

- ranked chart type suggestions
- explanation string for each suggestion
- recommended mappings when available
- optional template suggestions derived from chart recommendations

### Initial Rules

Use the existing rule-based suggestion layer as the first implementation:

- age group + gender -> grouped horizontal bar
- temporal + one measure -> line
- temporal + multiple measures -> combo
- geography + one measure -> map
- low-cardinality category split -> pie or column
- high-cardinality datasets -> table fallback

This is enough for a credible first release. It does not need machine learning.

---

## UX Principles

- Show the raw data before asking for chart decisions.
- Explain every recommendation in plain language.
- Do not overwhelm the user with too many "good" options.
- Default to 2-3 ranked recommendations, then reveal the full list.
- Keep manual chart selection visible.
- Treat tables as a valid recommendation, not a failure state.

---

## Implementation Plan

### Phase 1: Surface Existing Intelligence

- Add a dataset preview panel to the configurator after dataset load.
- Expose the current chart suggestion output in the chart type step.
- Add ranked recommendation cards with reasons.
- Allow one-click application of recommended type and default mappings.

### Primary Files

- `src/components/configurator/DatasetStep.tsx`
- `src/components/configurator/ChartTypeStep.tsx`
- `src/components/configurator/ConfiguratorShell.tsx`
- `src/stores/configurator.ts`
- `src/lib/data/patterns/index.ts`
- `src/lib/data/patterns/chart-suggestions.ts`

### Phase 2: Template Mapping

- Map chart suggestions to a curated set of dataset-aware templates.
- Filter out templates that do not fit the current dataset shape.
- Add a small explanation for why each template is suggested.

### Primary Files

- `src/components/configurator/ConfiguratorSidebar.tsx`
- `src/types/dashboard-templates.ts`
- `src/components/showcase/TemplatesPanel.tsx`

### Phase 3: Quality and Trust

- Add empty, error, and unsupported-data states for the preview panel.
- Add analytics for recommendation usage and manual overrides.
- Refine ranking based on real usage and known Serbian public datasets.

---

## Acceptance Criteria

- Selecting a dataset shows a visible preview without leaving the configurator flow.
- The user sees at least one ranked chart recommendation with a reason.
- Applying a recommendation sets chart type and sensible default mappings.
- The user can still choose any compatible chart manually.
- The system can recommend a table when charting would likely be poor.
- Template suggestions are filtered by dataset shape instead of being purely generic.

---

## Risks

- Too many recommendations will create noise instead of clarity.
- Weak explanations will make the feature feel arbitrary.
- Generic template suggestions will reduce trust if they do not match the dataset.
- Over-automation could frustrate advanced users if manual paths become secondary.

---

## Open Questions

- Should the preview live in the dataset step, the chart step, or both?
- Should confidence be shown numerically, or as labels like `Best fit` and `Alternative`?
- Should template recommendations be chart-first or dashboard-first?
- Which Serbian public datasets should be used as gold-standard examples for validation?

---

## Recommendation

Build this in phases, starting with explicit chart recommendations and a compact data preview.

That yields the highest user value for the lowest implementation risk because the core inference logic already exists. The first release should focus on trust, visibility, and speed rather than ambitious automation.
