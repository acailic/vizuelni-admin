// src/lib/data/patterns/serbian-vocabulary.ts
import type { Observation } from '@/types/observation'
import type { SemanticType, PatternDefinition } from './types'

/**
 * Serbian data pattern definitions
 */
export const PATTERNS: Record<SemanticType, PatternDefinition> = {
  'age-group': {
    columnPatterns: [/starost/i, /godine$/i, /age$/i, /uzrast/i, /godine$/i],
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
    columnPatterns: [/^pol$/i, /gender$/i, /spol$/i, /polnost$/i],
    valuePatterns: [
      /^[Мм]ушк/i, /^mušk/i, /^male$/i, /^m$/i,
      /^[Жж]енск/i, /^žen/i, /^female$/i, /^ž$/i, /^f$/i,
      /^[Мм]ушки/i, /^[Жж]енски/i,
    ],
  },

  region: {
    columnPatterns: [/region$/i, /регион$/i, /područje$/i, /подручје$/i],
  },

  district: {
    columnPatterns: [/okrug$/i, /округ$/i, /district$/i],
  },

  municipality: {
    columnPatterns: [/op[šs]tin$/i, /општин$/i, /municipal$/i, /grad$/i, /град$/i],
  },

  year: {
    columnPatterns: [/godina$/i, /година$/i, /year$/i],
    valuePatterns: [/^(19|20)\d{2}$/],
  },

  quarter: {
    columnPatterns: [/kvartal$/i, /квартал$/i, /quarter$/i, /period$/i],
    valuePatterns: [/^Q[1-4]$/i, /^[1-4]\.?\s*(kv|кв)/i],
  },

  month: {
    columnPatterns: [/mesec$/i, /месец$/i, /month$/i],
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
    columnPatterns: [/nace/i, /delatnost$/i, /делатност$/i, /industry$/i],
    valuePatterns: [/^[A-Z]\d{1,2}(\.\d{1,2})?$/],
  },

  currency: {
    columnPatterns: [/iznos$/i, /износ$/i, /amount$/i, /cena$/i, /цена$/i, /price$/i],
    valuePatterns: [/RSD/i, /din/i, /EUR/i, /\d+\s*(hiljade|милион|милијарда)/i],
  },

  percentage: {
    columnPatterns: [/procenat$/i, /проценат$/i, /stopa$/i, /стопа$/i, /percent$/i, /rate$/i],
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

        if (values.length === 0) continue

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
    if (!pattern.valuePatterns || pattern.valuePatterns.length === 0) continue

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
