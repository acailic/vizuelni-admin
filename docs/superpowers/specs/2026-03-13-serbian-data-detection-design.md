# Serbian Data Detection Pattern Library

**Date**: 2026-03-13
**Status**: Approved
**Feature ID**: feature-37

## Overview

Smart data detection system for Serbian government datasets (data.gov.rs). Automatically identifies semantic patterns in CSV/JSON data and suggests appropriate visualizations.

## Goals

1. **Auto-detect** age groups, gender, geography, time periods, health codes, economic data
2. **Suggest chart types** based on detected dimension combinations
3. **Analyze data quality** - completeness, consistency, outliers
4. **Enrich metadata** - units, hierarchies, descriptions

## Architecture

```
src/lib/data/
├── classifier.ts              # Existing - enhanced to call pattern detector
├── patterns/
│   ├── index.ts               # Main detector entry point
│   ├── serbian-vocabulary.ts  # Regex patterns for Serbian data
│   ├── chart-suggestions.ts   # Dimension combos → suggested charts
│   ├── quality-analyzer.ts    # Missing data, outliers, completeness
│   └── types.ts               # Shared types for detection results
```

### Detection Flow

1. `classifyColumns()` in classifier.ts calls `detectPatterns()` from patterns/
2. Patterns enrich `DimensionMeta` with `semanticType`, `hierarchy`, `unit`
3. `suggestCharts()` returns ranked chart types based on detected patterns
4. `analyzeQuality()` returns completeness score and warnings

## Types

```typescript
// src/lib/data/patterns/types.ts

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

export interface EnrichedDimensionMeta extends DimensionMeta {
  semanticType?: SemanticType
  hierarchy?: string[]
  unit?: string
  cardinality?: number
}

export interface EnrichedMeasureMeta extends MeasureMeta {
  unit?: string
  format?: string
}

export interface DetectionResult {
  dimensions: EnrichedDimensionMeta[]
  measures: EnrichedMeasureMeta[]
  suggestedCharts: ChartSuggestion[]
  quality: QualityReport
}

export interface ChartSuggestion {
  type: SupportedChartType
  confidence: number
  reason: string
  config?: Partial<ChartConfig>
}

export interface QualityReport {
  completeness: number
  consistency: number
  warnings: QualityWarning[]
  suggestions: string[]
}

export interface QualityWarning {
  column: string
  type: 'missing-values' | 'outliers' | 'inconsistent-format' | 'mixed-types'
  severity: 'info' | 'warning' | 'error'
  message: string
  affectedRows: number
}
```

## Serbian Vocabulary Patterns

### Age Groups

```typescript
ageGroup: {
  columnPatterns: [/godin/i, /starost/i, /uzrast/i, /age/i, /dob/i],
  valuePatterns: [
    /^\d{1,2}-\d{1,2}$/,           // "0-14", "15-29"
    /^\d{1,2}\+$/,                  // "65+"
    /^(\d{1,2})-(\d{1,2}) god/,     // "0-14 god"
    /^pre (\d{1,2})/,               // "pre 18"
    /^posle (\d{1,2})/,             // "posle 65"
  ],
  standardGroups: ['0-14', '15-29', '30-44', '45-59', '60-74', '75+'],
  unit: 'godine',
}
```

### Gender

```typescript
gender: {
  columnPatterns: [/pol/i, /gender/i, /spol/i],
  valuePatterns: {
    male: [/^[Мм]ушк/i, /^male$/i, /^m$/i],
    female: [/^[Жж]енск/i, /^female$/i, /^ž$/i, /^f$/i],
  },
}
```

### Geography

```typescript
geography: {
  columnPatterns: [
    /region/i, /okrug/i, /op[šs]tin/i, /grad/i, /naselje/i,
    /district/i, /municipality/i, /city/i, /settlement/i
  ],
  knownValues: {
    regions: ['Београд', 'Војводина', 'Шумадија', 'Јужна', 'Источна', 'Западна'],
    districts: [
      'Град Београд', 'Јужнобачки', 'Сремски', 'Рашки', 'Златиборски',
      'Моравички', 'Поморавски', 'Браничевски', 'Подунавски', 'Нишавски',
      'Топлички', 'Јабланички', 'Пчињски', 'Борски', 'Зајечарски', 'Подрински'
    ],
  },
  hierarchy: {
    region: ['district', 'municipality', 'settlement'],
    district: ['municipality', 'settlement'],
    municipality: ['settlement'],
  },
}
```

### Temporal

```typescript
temporal: {
  yearPattern: /^(19|20)\d{2}$/,
  quarterPattern: /^Q[1-4]$/i,
  monthPatterns: {
    latin: ['januar', 'februar', 'mart', 'april', 'maj', 'jun',
            'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
    cyrillic: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јун',
               'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
  },
  dateFormats: ['YYYY-MM-DD', 'DD.MM.YYYY', 'DD/MM/YYYY'],
}
```

### Health

```typescript
health: {
  icdPattern: /^[A-Z]\d{2}(\.\d+)?$/,
  columnPatterns: [/dijagnoz/i, /diagnos/i, /bolest/i, /disease/i, /uzrok/i],
  categories: {
    infectious: ['A', 'B'],
    neoplasms: ['C', 'D00-D48'],
    circulatory: ['I'],
    respiratory: ['J'],
    external: ['V-Y'],
  },
}
```

### Economic

```typescript
economic: {
  currencyPatterns: [/RSD/i, /din/i, /EUR/i, /\d+\s*(hiljada|милион|милијарда)/],
  nacePattern: /^[A-Z]\d{1,2}(\.\d{1,2})?$/,
  sectors: ['poljoprivreda', 'industrija', 'usluge', 'trgovina', 'građevinarstvo'],
}
```

## Chart Suggestion Rules

| Dimensions | Measures | Suggested Chart | Confidence |
|------------|----------|-----------------|------------|
| age-group + gender | 1 | bar (pyramid) | 95% |
| geography | 1 | map (choropleth) | 90% |
| temporal | 1 | line | 85% |
| temporal | 2+ | combo | 80% |
| 1 categorical (≤8) | 1 | pie | 60% |
| 1 categorical (≤20) | 1 | column | 70% |
| 2+ categorical | 1 | grouped bar | 75% |

## Quality Analysis

### Checks

1. **Missing values** - Null/empty ratio per column
2. **Format consistency** - Values match expected patterns
3. **Outliers** - IQR method for numeric measures
4. **Mixed types** - String/number mixing in same column

### Severity Levels

- **Info**: < 5% affected, minor suggestions
- **Warning**: 5-20% affected, may affect visualization
- **Error**: > 20% affected, blocking issues

## UI Integration

### New Components

```
src/components/data/
├── QualityWarnings.tsx      # Data quality banner
├── SmartFilterControl.tsx   # Semantic-aware filter UI
└── ChartSuggestions.tsx     # Suggested charts picker
```

### Integration Points

1. **CreateChartWorkspace** - Call `detectPatterns()` on data load
2. **ChartRenderer** - Use `semanticType` for smart filter chips
3. **ConfiguratorPanel** - Pre-fill axes based on detection
4. **DatasetInfoFooter** - Show detected metadata

### Smart Filter Controls

| Semantic Type | Filter UI |
|---------------|-----------|
| age-group | Range slider with presets |
| gender | Toggle buttons (М/Ж) |
| geography | Hierarchical dropdown |
| temporal | Time range brush |
| other | Standard multiselect |

## Implementation Plan

1. Create pattern types and vocabulary file
2. Implement `detectPatterns()` function
3. Add chart suggestion rules
4. Implement quality analyzer
5. Create UI components for suggestions
6. Integrate with ChartBuilder
7. Add smart filter controls
8. Update DatasetInfoFooter

## Success Criteria

- Age groups detected with > 95% accuracy on test data
- Chart suggestions match user expectations 80%+ of time
- Quality warnings catch common data issues
- Filter controls reduce configuration time by 50%
