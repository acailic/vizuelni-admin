// src/lib/examples/index.ts
/**
 * Featured Examples Module
 *
 * This module provides pre-configured chart examples for the homepage.
 */

// Types
export * from './types';

// Cache
export * from './cache';

// Import all configs - Original JSON-based (inline data)
import { populationRegionsConfig } from './configs/population-regions';
import { gdpRegionsConfig } from './configs/gdp-regions';
import { gdpTimeSeriesConfig } from './configs/gdp-time-series';
import { budgetAllocationConfig } from './configs/budget-allocation';
import { unemploymentRateConfig } from './configs/unemployment-rate';

// Import all configs - Original CSV-based (URL fetch)
import { healthIndicatorsConfig } from './configs/health-indicators';
import { educationEnrollmentConfig } from './configs/education-enrollment';
import { energyConsumptionConfig } from './configs/energy-consumption';
import { regionalComparisonConfig } from './configs/regional-comparison';

// Import all configs - New QA-based examples (inline data)
import { populationPyramidConfig } from './configs/population-pyramid';
import { populationDensityConfig } from './configs/population-density';
import { gdpSectorsConfig } from './configs/gdp-sectors';
import { inflationRateConfig } from './configs/inflation-rate';
import { hospitalCapacityConfig } from './configs/hospital-capacity';
import { vaccinationRatesConfig } from './configs/vaccination-rates';
import { educationEnrollmentLevelsConfig } from './configs/education-enrollment-levels';
import { airQualityIndexConfig } from './configs/air-quality-index';
import { budgetExecutionConfig } from './configs/budget-execution';
import { roadAccidentsConfig } from './configs/road-accidents';

import type { FeaturedExampleConfig } from './types';

/**
 * All featured example configurations
 * Order determines display order on homepage
 */
export const featuredExamples: FeaturedExampleConfig[] = [
  // Demographics
  populationRegionsConfig,
  populationPyramidConfig,
  populationDensityConfig,
  // Economy
  gdpRegionsConfig,
  gdpTimeSeriesConfig,
  gdpSectorsConfig,
  inflationRateConfig,
  budgetAllocationConfig,
  budgetExecutionConfig,
  unemploymentRateConfig,
  // Healthcare
  healthIndicatorsConfig,
  hospitalCapacityConfig,
  vaccinationRatesConfig,
  // Education
  educationEnrollmentConfig,
  educationEnrollmentLevelsConfig,
  // Environment
  airQualityIndexConfig,
  energyConsumptionConfig,
  // Transport & Society
  roadAccidentsConfig,
  regionalComparisonConfig,
];
