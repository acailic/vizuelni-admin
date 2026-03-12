// src/lib/examples/index.ts
/**
 * Featured Examples Module
 *
 * This module provides pre-configured chart examples for the homepage.
 */

// Types
export * from './types'

// Cache
export * from './cache'

// Import all configs - JSON-based (inline data)
import { populationRegionsConfig } from './configs/population-regions'
import { gdpRegionsConfig } from './configs/gdp-regions'
import { gdpTimeSeriesConfig } from './configs/gdp-time-series'
import { budgetAllocationConfig } from './configs/budget-allocation'
import { unemploymentRateConfig } from './configs/unemployment-rate'

// Import all configs - CSV-based (URL fetch)
import { healthIndicatorsConfig } from './configs/health-indicators'
import { educationEnrollmentConfig } from './configs/education-enrollment'
import { energyConsumptionConfig } from './configs/energy-consumption'
import { regionalComparisonConfig } from './configs/regional-comparison'

import type { FeaturedExampleConfig } from './types'

/**
 * All featured example configurations
 * Order determines display order on homepage
 */
export const featuredExamples: FeaturedExampleConfig[] = [
  // JSON-based examples (instant load)
  populationRegionsConfig,
  gdpRegionsConfig,
  gdpTimeSeriesConfig,
  budgetAllocationConfig,
  unemploymentRateConfig,
  // CSV-based examples (runtime fetch)
  healthIndicatorsConfig,
  educationEnrollmentConfig,
  energyConsumptionConfig,
  regionalComparisonConfig,
]
