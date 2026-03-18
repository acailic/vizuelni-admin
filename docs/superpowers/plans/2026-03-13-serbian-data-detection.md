# Serbian Data Detection Pattern Library Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a smart data detection system that identifies Serbian data patterns (age groups, gender, geography, time, health, economic) and suggests appropriate chart types.

**Architecture:** Pattern library in `src/lib/data/patterns/` that enriches the existing classifier with semantic detection, chart suggestions, and quality analysis.

**Tech Stack:** TypeScript, Zod for validation, existing classifier infrastructure

---

## File Structure

```
src/lib/data/patterns/
├── index.ts               # Main entry point - detectPatterns()
├── types.ts               # DetectionResult, SemanticType, etc.
├── serbian-vocabulary.ts  # Regex patterns for Serbian data
├── chart-suggestions.ts   # Dimension combos → chart suggestions
└── quality-analyzer.ts    # Missing data, outliers, consistency

tests/unit/data/patterns/
├── serbian-vocabulary.test.ts
├── chart-suggestions.test.ts
└── quality-analyzer.test.ts
```

---

## Chunk 1: Types and Vocabulary

### Task 1: Create Pattern Types

**Files:**
- Create: `src/lib/data/patterns/types.ts`

- [ ] **Step 1: Create types file with SemanticType and DetectionResult**

```typescript
// src/lib/data/patterns/types.ts
import type { DimensionMeta, MeasureMeta } from '@/types/observation'
import type { SupportedChartType } from '@/types/chart-config'

/**
 * Semantic types for detected patterns
 */
export type SemanticType =
  | 'age-group'
  | 'gender'
  | 'region'
  | 'district'
  | 'municipality'
  | 'year'
  | 'quarter'
  | 'month'
  | 'icd-code'
  | 'nace-code'
  | 'currency'
  | 'percentage'
  | 'unknown'

/**
 * Enriched dimension metadata with semantic detection
 */
export interface EnrichedDimensionMeta extends DimensionMeta {
  semanticType?: SemanticType
  hierarchy?: string[]
  unit?: string
}

/**
 * Enriched measure metadata
 */
export interface EnrichedMeasureMeta extends MeasureMeta {
  format?: string
}

/**
 * Chart suggestion with confidence score
 */
export interface ChartSuggestion {
  type: SupportedChartType
  confidence: number // 0-1
  reason: string
  config?: Record<string, unknown>
}

/**
 * Quality warning types
 */
export type QualityWarningType =
  | 'missing-values'
  | 'outliers'
  | 'inconsistent-format'
  | 'mixed-types'

export type QualitySeverity = 'info' | 'warning' | 'error'

/**
 * Quality warning for a column
 */
export interface QualityWarning {
  column: string
  type: QualityWarningType
  severity: QualitySeverity
  message: string
  affectedRows: number
}

/**
 * Data quality report
 */
export interface QualityReport {
  completeness: number // 0-1 ratio of non-null values
  consistency: number // 0-1 based on pattern violations
  warnings: QualityWarning[]
  suggestions: string[]
}

/**
 * Complete detection result
 */
export interface DetectionResult {
  dimensions: EnrichedDimensionMeta[]
  measures: EnrichedMeasureMeta[]
  suggestedCharts: ChartSuggestion[]
  quality: QualityReport
}

/**
 * Pattern definition for vocabulary
 */
export interface PatternDefinition {
  columnPatterns: RegExp[]
  valuePatterns?: RegExp[]
  knownValues?: Record<string, string[]>
  unit?: string
}
```

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit src/lib/data/patterns/types.ts`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/patterns/types.ts
git commit -m "feat(patterns): add detection types and interfaces"
```

---

### Task 2: Create Serbian Vocabulary

**Files:**
- Create: `src/lib/data/patterns/serbian-vocabulary.ts`
- Create: `tests/unit/data/patterns/serbian-vocabulary.test.ts`

- [ ] **Step 1: Write failing tests for age group detection**

```typescript
// tests/unit/data/patterns/serbian-vocabulary.test.ts
import { detectSemanticType, isAgeGroupColumn, isAgeGroupValue } from '@/lib/data/patterns/serbian-vocabulary'
import type { Observation } from '@/types/observation'

describe('serbian-vocabulary', () => {
  describe('isAgeGroupValue', () => {
    it('matches standard age ranges', () => {
      expect(isAgeGroupValue('0-14')).toBe(true)
      expect(isAgeGroupValue('15-29')).toBe(true)
      expect(isAgeGroupValue('65+')).toBe(true)
      expect(isAgeGroupValue('0-14 god')).toBe(true)
    })

    it('rejects non-age values', () => {
      expect(isAgeGroupValue('Beograd')).toBe(false)
      expect(isAgeGroupValue('2024')).toBe(false)
      expect(isAgeGroupValue('muški')).toBe(false)
    })
  })

  describe('isAgeGroupColumn', () => {
    it('matches age column names', () => {
      expect(isAgeGroupColumn('starost')).toBe(true)
      expect(isAgeGroupColumn('godine')).toBe(true)
      expect(isAgeGroupColumn('age')).toBe(true)
      expect(isAgeGroupColumn('uzrast')).toBe(true)
    })

    it('rejects non-age columns', () => {
      expect(isAgeGroupColumn('grad')).toBe(false)
      expect(isAgeGroupColumn('godina')).toBe(false)
    })
  })

  describe('detectSemanticType', () => {
    it('detects age-group from column name', () => {
      const data: Observation[] = [
        { starost: '0-14', broj: 100 },
        { starost: '15-29', broj: 200 },
      ]
      expect(detectSemanticType('starost', data)).toBe('age-group')
    })

    it('detects age-group from values', () => {
      const data: Observation[] = [
        { grupa: '0-14', broj: 100 },
        { grupa: '15-29', broj: 200 },
        { grupa: '30-44', broj: 150 },
      ]
      expect(detectSemanticType('grupa', data)).toBe('age-group')
    })

    it('detects gender from values', () => {
      const data: Observation[] = [
        { pol: 'muški', broj: 100 },
        { pol: 'ženski', broj: 120 },
      ]
      expect(detectSemanticType('pol', data)).toBe('gender')
    })

    it('detects year from values', () => {
      const data: Observation[] = [
        { godina: '2020', broj: 100 },
        { godina: '2021', broj: 120 },
        { godina: '2022', broj: 130 },
      ]
      expect(detectSemanticType('godina', data)).toBe('year')
    })

    it('detects quarter from values', () => {
      const data: Observation[] = [
        { period: 'Q1', broj: 100 },
        { period: 'Q2', broj: 120 },
        { period: 'Q3', broj: 90 },
      ]
      expect(detectSemanticType('period', data)).toBe('quarter')
    })

    it('returns unknown for unrecognized patterns', () => {
      const data: Observation[] = [
        { naziv: 'Proizvod A', broj: 100 },
        { naziv: 'Proizvod B', broj: 120 },
      ]
      expect(detectSemanticType('naziv', data)).toBe('unknown')
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/data/patterns/serbian-vocabulary.test.ts`
Expected: FAIL - module not found

- [ ] **Step 3: Create serbian-vocabulary.ts with pattern definitions**

```typescript
// src/lib/data/patterns/serbian-vocabulary.ts
import type { Observation, ObservationValue } from '@/types/observation'
import type { SemanticType, PatternDefinition } from './types'

/**
 * Serbian data pattern definitions
 */
export const PATTERNS: Record<SemanticType, PatternDefinition> = {
  'age-group': {
    columnPatterns: [/godin/i, /starost/i, /uzrast/i, /age/i, /dob/i, /godine/i],
    valuePatterns: [
      /^\d{1,2}-\d{1,2}$/,           // "0-14", "15-29"
      /^\d{1,2}\+$/,                  // "65+"
      /^\d{1,2}-\d{1,2}\s*(god|год)/i, // "0-14 god"
      /^pre\s*\d{1,2}/i,              // "pre 18"
      /^posle\s*\d{1,2}/i,            // "posle 65"
      /^пре\s*\d{1,2}/i,              // Cyrillic
      /^после\s*\d{1,2}/i,            // Cyrillic
    ],
    unit: 'godine',
  },

  gender: {
    columnPatterns: [/^pol$/i, /gender/i, /spol/i, /polnost/i],
    valuePatterns: [
      /^[Мм]ушк/i, /^male$/i, /^m$/i,
      /^[Жж]енск/i, /^female$/i, /^ž$/i, /^f$/i,
      /^[Мм]ушки/i, /^[Жж]енски/i,
    ],
    knownValues: {
      male: ['muški', 'muški', 'm', 'male'],
      female: ['ženski', 'ženski', 'ž', 'female', 'f'],
    },
  },

  region: {
    columnPatterns: [/region/i, /регион/i, /područje/i, /подручје/i],
    knownValues: {
      regions: ['Београд', 'Војводина', 'Шумадија', 'Јужна', 'Источна', 'Западна',
                'Beograd', 'Vojvodina', 'Sumadija', 'Juzna', 'Istocna', 'Zapadna'],
    },
  },

  district: {
    columnPatterns: [/okrug/i, /округ/i, /district/i],
    knownValues: {
      districts: [
        'Град Београд', 'Јужнобачки', 'Сремски', 'Рашки', 'Златиборски',
        'Grad Beograd', 'Južnobački', 'Sremski', 'Raški', 'Zlatiborski',
      ],
    },
  },

  municipality: {
    columnPatterns: [/op[šs]tin/i, /општин/i, /municipal/i, /grad/i, /град/i],
  },

  year: {
    columnPatterns: [/godin/i, /годин/i, /year/i],
    valuePatterns: [/^(19|20)\d{2}$/],
  },

  quarter: {
    columnPatterns: [/kvartal/i, /квартал/i, /quarter/i, /period/i],
    valuePatterns: [/^Q[1-4]$/i, /^[1-4]\.?\s*(kv|кв)/i],
  },

  month: {
    columnPatterns: [/mesec/i, /месец/i, /month/i],
    valuePatterns: [
      /^(jan|feb|mar|apr|maj|jun|jul|avg|sep|okt|nov|dec)/i,
      /^(јан|феб|мар|апр|мај|јун|јул|авг|сеп|окт|нов|дец)/i,
    ],
  },

  'icd-code': {
    columnPatterns: [/dijagnoz/i, /дијагноз/i, /diagnos/i, /bolest/i, /болест/i],
    valuePatterns: [/^[A-Z]\d{2}(\.\d+)?$/],
  },

  'nace-code': {
    columnPatterns: [/nace/i, /delatnost/i, /делатност/i, /industry/i],
    valuePatterns: [/^[A-Z]\d{1,2}(\.\d{1,2})?$/],
  },

  currency: {
    columnPatterns: [/iznos/i, /износ/i, /amount/i, /cena/i, /цена/i, /price/i],
    valuePatterns: [/RSD/i, /din/i, /EUR/i, /\d+\s*(hiljade|милион|милијарда)/i],
  },

  percentage: {
    columnPatterns: [/procenat/i, /проценат/i, /stopa/i, /стопа/i, /percent/i, /rate/i],
    valuePatterns: [/^\d+\.?\d*\s*%?$/],
    unit: '%',
  },

  unknown: {
    columnPatterns: [],
  },
}

/**
 * Check if a value matches age group patterns
 */
export function isAgeGroupValue(value: string): boolean {
  const patterns = PATTERNS['age-group'].valuePatterns ?? []
  return patterns.some(pattern => pattern.test(value))
}

/**
 * Check if a column name suggests age groups
 */
export function isAgeGroupColumn(columnName: string): boolean {
  const patterns = PATTERNS['age-group'].columnPatterns
  return patterns.some(pattern => pattern.test(columnName))
}

/**
 * Detect semantic type for a column based on name and values
 */
export function detectSemanticType(
  columnName: string,
  data: Observation[]
): SemanticType {
  const normalizedName = columnName.toLowerCase().trim()

  // Check column name patterns first
  for (const [type, pattern] of Object.entries(PATTERNS)) {
    if (pattern.columnPatterns.some(p => p.test(normalizedName))) {
      // Verify with value patterns if available
      if (pattern.valuePatterns && pattern.valuePatterns.length > 0) {
        const values = data
          .map(row => String(row[columnName] ?? ''))
          .filter(v => v.length > 0)
          .slice(0, 20)

        const matchRatio = values.filter(v =>
          pattern.valuePatterns!.some(p => p.test(v))
        ).length / values.length

        if (matchRatio >= 0.5) {
          return type as SemanticType
        }
      } else {
        return type as SemanticType
      }
    }
  }

  // Check value patterns for all data
  const values = data
    .map(row => String(row[columnName] ?? ''))
    .filter(v => v.length > 0)
    .slice(0, 50)

  if (values.length === 0) return 'unknown'

  // Try each pattern type
  for (const [type, pattern] of Object.entries(PATTERNS)) {
    if (!pattern.valuePatterns) continue

    const matchRatio = values.filter(v =>
      pattern.valuePatterns.some(p => p.test(v))
    ).length / values.length

    if (matchRatio >= 0.6) {
      return type as SemanticType
    }
  }

  return 'unknown'
}

/**
 * Get unit for a semantic type
 */
export function getSemanticUnit(type: SemanticType): string | undefined {
  return PATTERNS[type]?.unit
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/data/patterns/serbian-vocabulary.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/patterns/serbian-vocabulary.ts tests/unit/data/patterns/serbian-vocabulary.test.ts
git commit -m "feat(patterns): add Serbian vocabulary pattern detection"
```

---

## Chunk 2: Chart Suggestions and Quality Analysis

### Task 3: Create Chart Suggestions

**Files:**
- Create: `src/lib/data/patterns/chart-suggestions.ts`
- Create: `tests/unit/data/patterns/chart-suggestions.test.ts`

- [ ] **Step 1: Write failing tests for chart suggestions**

```typescript
// tests/unit/data/patterns/chart-suggestions.test.ts
import { suggestCharts, type ChartSuggestionContext } from '@/lib/data/patterns/chart-suggestions'

describe('chart-suggestions', () => {
  describe('suggestCharts', () => {
    it('suggests bar chart for population pyramid pattern', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: true,
        hasGender: true,
        hasTemporal: false,
        hasGeography: false,
        measureCount: 1,
        dimensionCount: 2,
        maxCardinality: 10,
      }
      const suggestions = suggestCharts(ctx)
      expect(suggestions[0]).toMatchObject({
        type: 'bar',
        confidence: expect.any(Number),
      })
      expect(suggestions[0].confidence).toBeGreaterThan(0.9)
    })

    it('suggests map for geographic data', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: false,
        hasGender: false,
        hasTemporal: false,
        hasGeography: true,
        measureCount: 1,
        dimensionCount: 1,
        maxCardinality: 30,
      }
      const suggestions = suggestCharts(ctx)
      expect(suggestions[0].type).toBe('map')
    })

    it('suggests line chart for time series', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: false,
        hasGender: false,
        hasTemporal: true,
        hasGeography: false,
        measureCount: 1,
        dimensionCount: 1,
        maxCardinality: 100,
      }
      const suggestions = suggestCharts(ctx)
      expect(suggestions[0].type).toBe('line')
    })

    it('suggests combo for multi-measure time series', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: false,
        hasGender: false,
        hasTemporal: true,
        hasGeography: false,
        measureCount: 2,
        dimensionCount: 1,
        maxCardinality: 50,
      }
      const suggestions = suggestCharts(ctx)
      expect(suggestions[0].type).toBe('combo')
    })

    it('suggests column for simple categorical data', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: false,
        hasGender: false,
        hasTemporal: false,
        hasGeography: false,
        measureCount: 1,
        dimensionCount: 1,
        maxCardinality: 15,
      }
      const suggestions = suggestCharts(ctx)
      expect(suggestions[0].type).toBe('column')
    })

    it('suggests pie for low cardinality part-to-whole', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: false,
        hasGender: false,
        hasTemporal: false,
        hasGeography: false,
        measureCount: 1,
        dimensionCount: 1,
        maxCardinality: 5,
      }
      const suggestions = suggestCharts(ctx)
      const pieSuggestion = suggestions.find(s => s.type === 'pie')
      expect(pieSuggestion).toBeDefined()
    })

    it('returns suggestions sorted by confidence', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: true,
        hasGender: true,
        hasTemporal: true,
        hasGeography: false,
        measureCount: 1,
        dimensionCount: 3,
        maxCardinality: 20,
      }
      const suggestions = suggestCharts(ctx)
      for (let i = 1; i < suggestions.length; i++) {
        expect(suggestions[i].confidence).toBeLessThanOrEqual(suggestions[i - 1].confidence)
      }
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/data/patterns/chart-suggestions.test.ts`
Expected: FAIL - module not found

- [ ] **Step 3: Create chart-suggestions.ts**

```typescript
// src/lib/data/patterns/chart-suggestions.ts
import type { SupportedChartType } from '@/types/chart-config'

/**
 * Context for chart suggestion
 */
export interface ChartSuggestionContext {
  hasAgeGroup: boolean
  hasGender: boolean
  hasTemporal: boolean
  hasGeography: boolean
  measureCount: number
  dimensionCount: number
  maxCardinality: number
}

/**
 * Internal suggestion rule
 */
interface SuggestionRule {
  match: (ctx: ChartSuggestionContext) => boolean
  type: SupportedChartType
  confidence: number
  reason: string
}

/**
 * Chart suggestion rules ordered by priority
 */
const RULES: SuggestionRule[] = [
  // Population pyramid: age-group + gender
  {
    match: (ctx) => ctx.hasAgeGroup && ctx.hasGender && ctx.measureCount >= 1,
    type: 'bar',
    confidence: 0.95,
    reason: 'Population pyramid pattern detected (age groups + gender)',
  },

  // Choropleth map: single geographic dimension
  {
    match: (ctx) => ctx.hasGeography && ctx.measureCount === 1 && ctx.dimensionCount === 1,
    type: 'map',
    confidence: 0.90,
    reason: 'Geographic distribution detected',
  },

  // Combo: temporal + multiple measures
  {
    match: (ctx) => ctx.hasTemporal && ctx.measureCount >= 2,
    type: 'combo',
    confidence: 0.85,
    reason: 'Multi-measure time series detected',
  },

  // Line: temporal + single measure
  {
    match: (ctx) => ctx.hasTemporal && ctx.measureCount === 1,
    type: 'line',
    confidence: 0.85,
    reason: 'Time series pattern detected',
  },

  // Area: temporal with multiple series
  {
    match: (ctx) => ctx.hasTemporal && ctx.dimensionCount >= 2 && ctx.measureCount === 1,
    type: 'area',
    confidence: 0.80,
    reason: 'Multi-series time pattern detected',
  },

  // Grouped bar: 2 categorical dimensions
  {
    match: (ctx) => !ctx.hasTemporal && ctx.dimensionCount === 2 && ctx.measureCount === 1,
    type: 'bar',
    confidence: 0.75,
    reason: 'Categorical comparison with grouping detected',
  },

  // Column: single categorical dimension
  {
    match: (ctx) => !ctx.hasTemporal && ctx.dimensionCount === 1 && ctx.measureCount === 1 && ctx.maxCardinality <= 20,
    type: 'column',
    confidence: 0.70,
    reason: 'Categorical comparison detected',
  },

  // Pie: low cardinality part-to-whole
  {
    match: (ctx) => ctx.dimensionCount === 1 && ctx.measureCount === 1 && ctx.maxCardinality <= 8,
    type: 'pie',
    confidence: 0.60,
    reason: 'Part-to-whole comparison detected',
  },

  // Scatterplot: 2 measures
  {
    match: (ctx) => ctx.measureCount >= 2 && ctx.dimensionCount >= 1,
    type: 'scatterplot',
    confidence: 0.65,
    reason: 'Correlation analysis detected',
  },

  // Table: high cardinality or many dimensions
  {
    match: (ctx) => ctx.maxCardinality > 20 || ctx.dimensionCount > 3,
    type: 'table',
    confidence: 0.50,
    reason: 'High-cardinality data suitable for table view',
  },
]

/**
 * Suggest chart types based on data characteristics
 */
export function suggestCharts(ctx: ChartSuggestionContext): Array<{
  type: SupportedChartType
  confidence: number
  reason: string
}> {
  const suggestions = RULES
    .filter(rule => rule.match(ctx))
    .map(rule => ({
      type: rule.type,
      confidence: rule.confidence,
      reason: rule.reason,
    }))
    .sort((a, b) => b.confidence - a.confidence)

  return suggestions
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/data/patterns/chart-suggestions.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/patterns/chart-suggestions.ts tests/unit/data/patterns/chart-suggestions.test.ts
git commit -m "feat(patterns): add chart suggestion engine"
```

---

### Task 4: Create Quality Analyzer

**Files:**
- Create: `src/lib/data/patterns/quality-analyzer.ts`
- Create: `tests/unit/data/patterns/quality-analyzer.test.ts`

- [ ] **Step 1: Write failing tests for quality analysis**

```typescript
// tests/unit/data/patterns/quality-analyzer.test.ts
import { analyzeQuality } from '@/lib/data/patterns/quality-analyzer'
import type { Observation } from '@/types/observation'
import type { EnrichedDimensionMeta, EnrichedMeasureMeta } from '@/lib/data/patterns/types'

describe('quality-analyzer', () => {
  describe('analyzeQuality', () => {
    it('detects missing values', () => {
      const data: Observation[] = [
        { name: 'A', value: 100 },
        { name: 'B', value: null },
        { name: 'C', value: 150 },
      ]
      const dimensions: EnrichedDimensionMeta[] = [
        { key: 'name', label: 'Name', type: 'categorical', values: ['A', 'B', 'C'], cardinality: 3 },
      ]
      const measures: EnrichedMeasureMeta[] = [
        { key: 'value', label: 'Value', min: 100, max: 150, hasNulls: true },
      ]

      const result = analyzeQuality(data, dimensions, measures)

      expect(result.completeness).toBeLessThan(1)
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          column: 'value',
          type: 'missing-values',
        })
      )
    })

    it('detects outliers using IQR method', () => {
      const data: Observation[] = [
        { name: 'A', value: 10 },
        { name: 'B', value: 12 },
        { name: 'C', value: 11 },
        { name: 'D', value: 13 },
        { name: 'E', value: 1000 }, // outlier
      ]
      const dimensions: EnrichedDimensionMeta[] = [
        { key: 'name', label: 'Name', type: 'categorical', values: ['A', 'B', 'C', 'D', 'E'], cardinality: 5 },
      ]
      const measures: EnrichedMeasureMeta[] = [
        { key: 'value', label: 'Value', min: 10, max: 1000, hasNulls: false },
      ]

      const result = analyzeQuality(data, dimensions, measures)

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          column: 'value',
          type: 'outliers',
        })
      )
    })

    it('calculates completeness correctly', () => {
      const data: Observation[] = [
        { a: 1, b: 2 },
        { a: 1, b: null },
        { a: null, b: 3 },
      ]
      const dimensions: EnrichedDimensionMeta[] = [
        { key: 'a', label: 'A', type: 'categorical', values: ['1'], cardinality: 1 },
      ]
      const measures: EnrichedMeasureMeta[] = [
        { key: 'b', label: 'B', min: 2, max: 3, hasNulls: true },
      ]

      const result = analyzeQuality(data, dimensions, measures)

      // 4 nulls out of 6 total cells = 2/3 completeness
      expect(result.completeness).toBeCloseTo(2/3, 1)
    })

    it('returns no warnings for clean data', () => {
      const data: Observation[] = [
        { name: 'A', value: 100 },
        { name: 'B', value: 120 },
        { name: 'C', value: 110 },
      ]
      const dimensions: EnrichedDimensionMeta[] = [
        { key: 'name', label: 'Name', type: 'categorical', values: ['A', 'B', 'C'], cardinality: 3 },
      ]
      const measures: EnrichedMeasureMeta[] = [
        { key: 'value', label: 'Value', min: 100, max: 120, hasNulls: false },
      ]

      const result = analyzeQuality(data, dimensions, measures)

      expect(result.warnings.filter(w => w.severity !== 'info')).toHaveLength(0)
    })

    it('generates helpful suggestions', () => {
      const data: Observation[] = [
        { name: 'A', value: null },
      ]
      const dimensions: EnrichedDimensionMeta[] = [
        { key: 'name', label: 'Name', type: 'categorical', values: ['A'], cardinality: 1 },
      ]
      const measures: EnrichedMeasureMeta[] = [
        { key: 'value', label: 'Value', min: 0, max: 0, hasNulls: true },
      ]

      const result = analyzeQuality(data, dimensions, measures)

      expect(result.suggestions.length).toBeGreaterThan(0)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/data/patterns/quality-analyzer.test.ts`
Expected: FAIL - module not found

- [ ] **Step 3: Create quality-analyzer.ts**

```typescript
// src/lib/data/patterns/quality-analyzer.ts
import type { Observation } from '@/types/observation'
import type { EnrichedDimensionMeta, EnrichedMeasureMeta, QualityReport, QualityWarning } from './types'

/**
 * Detect outliers using IQR method
 */
function detectOutliers(values: number[]): number[] {
  if (values.length < 4) return []

  const sorted = [...values].sort((a, b) => a - b)
  const q1 = sorted[Math.floor(sorted.length * 0.25)]
  const q3 = sorted[Math.floor(sorted.length * 0.75)]
  const iqr = q3 - q1
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr

  return values.filter(v => v < lowerBound || v > upperBound)
}

/**
 * Calculate percentage of null values in a column
 */
function getNullRatio(data: Observation[], key: string): number {
  const nullCount = data.filter(row => row[key] == null).length
  return data.length > 0 ? nullCount / data.length : 0
}

/**
 * Analyze data quality
 */
export function analyzeQuality(
  data: Observation[],
  dimensions: EnrichedDimensionMeta[],
  measures: EnrichedMeasureMeta[]
): QualityReport {
  const warnings: QualityWarning[] = []
  let totalCells = 0
  let nullCells = 0

  // Check dimensions
  for (const dim of dimensions) {
    const nullRatio = getNullRatio(data, dim.key)
    const nullCount = data.filter(row => row[dim.key] == null).length
    totalCells += data.length
    nullCells += nullCount

    if (nullRatio > 0) {
      warnings.push({
        column: dim.key,
        type: 'missing-values',
        severity: nullRatio > 0.1 ? 'warning' : 'info',
        message: `${nullCount} missing values (${Math.round(nullRatio * 100)}%)`,
        affectedRows: nullCount,
      })
    }
  }

  // Check measures
  for (const measure of measures) {
    const nullRatio = getNullRatio(data, measure.key)
    const nullCount = data.filter(row => row[measure.key] == null).length
    totalCells += data.length
    nullCells += nullCount

    if (nullRatio > 0) {
      warnings.push({
        column: measure.key,
        type: 'missing-values',
        severity: nullRatio > 0.1 ? 'warning' : 'info',
        message: `${nullCount} missing values (${Math.round(nullRatio * 100)}%)`,
        affectedRows: nullCount,
      })
    }

    // Check for outliers in numeric measures
    const numericValues = data
      .filter(row => typeof row[measure.key] === 'number')
      .map(row => row[measure.key] as number)

    if (numericValues.length >= 4) {
      const outliers = detectOutliers(numericValues)
      if (outliers.length > 0) {
        warnings.push({
          column: measure.key,
          type: 'outliers',
          severity: 'info',
          message: `${outliers.length} potential outlier(s) detected`,
          affectedRows: outliers.length,
        })
      }
    }
  }

  // Calculate metrics
  const completeness = totalCells > 0 ? (totalCells - nullCells) / totalCells : 1
  const warningPenalty = warnings.reduce((acc, w) => {
    if (w.severity === 'error') return acc + 0.2
    if (w.severity === 'warning') return acc + 0.1
    return acc + 0.02
  }, 0)
  const consistency = Math.max(0, 1 - warningPenalty)

  // Generate suggestions
  const suggestions: string[] = []
  if (completeness < 0.9) {
    suggestions.push('Consider filtering or imputing missing values before visualization')
  }
  if (warnings.some(w => w.type === 'outliers')) {
    suggestions.push('Review outliers - they may affect chart scale and readability')
  }

  return {
    completeness,
    consistency,
    warnings,
    suggestions,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/data/patterns/quality-analyzer.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/patterns/quality-analyzer.ts tests/unit/data/patterns/quality-analyzer.test.ts
git commit -m "feat(patterns): add data quality analyzer"
```

---

## Chunk 3: Main Entry Point and Integration

### Task 5: Create Main Entry Point

**Files:**
- Create: `src/lib/data/patterns/index.ts`
- Create: `tests/unit/data/patterns/index.test.ts`

- [ ] **Step 1: Write failing tests for detectPatterns**

```typescript
// tests/unit/data/patterns/index.test.ts
import { detectPatterns } from '@/lib/data/patterns'
import type { Observation } from '@/types/observation'

describe('detectPatterns', () => {
  it('detects age groups and gender for population data', () => {
    const data: Observation[] = [
      { starost: '0-14', pol: 'muški', broj: 350000 },
      { starost: '0-14', pol: 'ženski', broj: 340000 },
      { starost: '15-29', pol: 'muški', broj: 450000 },
      { starost: '15-29', pol: 'ženski', broj: 440000 },
    ]

    const result = detectPatterns(data, ['starost', 'pol', 'broj'])

    expect(result.dimensions).toContainEqual(
      expect.objectContaining({ key: 'starost', semanticType: 'age-group' })
    )
    expect(result.dimensions).toContainEqual(
      expect.objectContaining({ key: 'pol', semanticType: 'gender' })
    )
    expect(result.suggestedCharts[0].type).toBe('bar')
    expect(result.suggestedCharts[0].confidence).toBeGreaterThan(0.9)
  })

  it('detects time series and suggests line chart', () => {
    const data: Observation[] = [
      { godina: '2020', vrednost: 100 },
      { godina: '2021', vrednost: 120 },
      { godina: '2022', vrednost: 130 },
    ]

    const result = detectPatterns(data, ['godina', 'vrednost'])

    expect(result.dimensions).toContainEqual(
      expect.objectContaining({ key: 'godina', semanticType: 'year' })
    )
    expect(result.suggestedCharts[0].type).toBe('line')
  })

  it('detects geographic data and suggests map', () => {
    const data: Observation[] = [
      { region: 'Београд', stanovnika: 1700000 },
      { region: 'Војводина', stanovnika: 1900000 },
      { region: 'Шумадија', stanovnika: 500000 },
    ]

    const result = detectPatterns(data, ['region', 'stanovnika'])

    expect(result.dimensions).toContainEqual(
      expect.objectContaining({ key: 'region', semanticType: 'region' })
    )
    expect(result.suggestedCharts.some(s => s.type === 'map')).toBe(true)
  })

  it('provides quality report', () => {
    const data: Observation[] = [
      { name: 'A', value: 100 },
      { name: 'B', value: null },
    ]

    const result = detectPatterns(data, ['name', 'value'])

    expect(result.quality.completeness).toBeLessThan(1)
    expect(result.quality.warnings.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/unit/data/patterns/index.test.ts`
Expected: FAIL - module not found

- [ ] **Step 3: Create index.ts main entry point**

```typescript
// src/lib/data/patterns/index.ts
import type { Observation } from '@/types/observation'
import type { DimensionMeta, MeasureMeta } from '@/types/observation'
import { classifyColumns } from '../classifier'
import { detectSemanticType, getSemanticUnit } from './serbian-vocabulary'
import { suggestCharts, type ChartSuggestionContext } from './chart-suggestions'
import { analyzeQuality } from './quality-analyzer'
import type {
  DetectionResult,
  EnrichedDimensionMeta,
  EnrichedMeasureMeta,
} from './types'

export type {
  DetectionResult,
  EnrichedDimensionMeta,
  EnrichedMeasureMeta,
  ChartSuggestion,
  QualityReport,
  QualityWarning,
  SemanticType,
} from './types'

/**
 * Detect patterns in data and provide enriched metadata with chart suggestions
 */
export function detectPatterns(
  data: Observation[],
  columns?: string[]
): DetectionResult {
  // Get base classification from existing classifier
  const base = classifyColumns(data, columns)

  // Enrich dimensions with semantic types
  const enrichedDimensions: EnrichedDimensionMeta[] = base.dimensions.map(dim => {
    const semanticType = detectSemanticType(dim.key, data)
    const unit = getSemanticUnit(semanticType)

    return {
      ...dim,
      semanticType,
      unit: unit || dim.label,
    }
  })

  // Enrich measures
  const enrichedMeasures: EnrichedMeasureMeta[] = base.measures.map(measure => ({
    ...measure,
  }))

  // Build context for chart suggestions
  const ctx: ChartSuggestionContext = {
    hasAgeGroup: enrichedDimensions.some(d => d.semanticType === 'age-group'),
    hasGender: enrichedDimensions.some(d => d.semanticType === 'gender'),
    hasTemporal: enrichedDimensions.some(d =>
      d.semanticType === 'year' ||
      d.semanticType === 'quarter' ||
      d.semanticType === 'month' ||
      d.type === 'temporal'
    ),
    hasGeography: enrichedDimensions.some(d =>
      d.semanticType === 'region' ||
      d.semanticType === 'district' ||
      d.semanticType === 'municipality' ||
      d.type === 'geographic'
    ),
    measureCount: enrichedMeasures.length,
    dimensionCount: enrichedDimensions.length,
    maxCardinality: Math.max(...enrichedDimensions.map(d => d.cardinality), 0),
  }

  // Get chart suggestions
  const suggestedCharts = suggestCharts(ctx)

  // Analyze quality
  const quality = analyzeQuality(data, enrichedDimensions, enrichedMeasures)

  return {
    dimensions: enrichedDimensions,
    measures: enrichedMeasures,
    suggestedCharts,
    quality,
  }
}

/**
 * Re-export pattern detection utilities
 */
export { detectSemanticType, getSemanticUnit, PATTERNS } from './serbian-vocabulary'
export { suggestCharts, type ChartSuggestionContext } from './chart-suggestions'
export { analyzeQuality } from './quality-analyzer'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/unit/data/patterns/index.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/data/patterns/index.ts tests/unit/data/patterns/index.test.ts
git commit -m "feat(patterns): add main detectPatterns entry point"
```

---

### Task 6: Update Data Module Exports

**Files:**
- Modify: `src/lib/data/index.ts`

- [ ] **Step 1: Add patterns exports to data module**

```typescript
// Add to src/lib/data/index.ts

// Pattern detection exports
export {
  detectPatterns,
  detectSemanticType,
  getSemanticUnit,
  suggestCharts,
  analyzeQuality,
  PATTERNS,
  type DetectionResult,
  type EnrichedDimensionMeta,
  type EnrichedMeasureMeta,
  type ChartSuggestion,
  type QualityReport,
  type QualityWarning,
  type SemanticType,
  type ChartSuggestionContext,
} from './patterns'
```

- [ ] **Step 2: Run all pattern tests**

Run: `npx vitest run tests/unit/data/patterns/`
Expected: All tests PASS

- [ ] **Step 3: Run full test suite**

Run: `npm test`
Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/data/index.ts
git commit -m "feat(data): export pattern detection from data module"
```

---

### Task 7: Run Build Verification

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds without errors

- [ ] **Step 2: Final commit with all changes**

```bash
git add -A
git commit -m "feat(patterns): complete Serbian data detection pattern library

- Add semantic type detection for age groups, gender, geography, time, health codes
- Add chart suggestion engine with confidence scores
- Add data quality analyzer for missing values and outliers
- Integrate with existing classifier via detectPatterns()

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Create pattern types | `patterns/types.ts` |
| 2 | Create Serbian vocabulary | `patterns/serbian-vocabulary.ts` |
| 3 | Create chart suggestions | `patterns/chart-suggestions.ts` |
| 4 | Create quality analyzer | `patterns/quality-analyzer.ts` |
| 5 | Create main entry point | `patterns/index.ts` |
| 6 | Update module exports | `data/index.ts` |
| 7 | Build verification | - |

**Total estimated time:** 45-60 minutes
