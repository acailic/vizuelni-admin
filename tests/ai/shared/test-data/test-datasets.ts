/**
 * Test data constants for AI-driven tests
 */

import type { Locale } from '../../stagehand.config';

export type DatasetName =
  | 'populationByMunicipality'
  | 'gdpByYear'
  | 'electionResults';

export interface TestDataset {
  id: string;
  name: Record<Locale, string>;
  expectedRows: number;
  numericColumns: string[];
  categoricalColumns: string[];
  geoColumn?: string;
}

export const TEST_DATASETS: Record<DatasetName, TestDataset> = {
  populationByMunicipality: {
    id: '678e312d0aae3fe3ad3e361c',
    name: {
      'sr-Latn': 'Populacija po opštinama',
      'sr-Cyrl': 'Популација по општинама',
      en: 'Population by Municipality',
    },
    expectedRows: 174,
    numericColumns: ['population', 'area_km2', 'density'],
    categoricalColumns: ['municipality', 'district', 'region'],
  },

  gdpByYear: {
    id: '678e312d0aae3fe3ad3e361d',
    name: {
      'sr-Latn': 'BDP po godinama',
      'sr-Cyrl': 'БДП по годинама',
      en: 'GDP by Year',
    },
    expectedRows: 20,
    numericColumns: ['gdp', 'gdp_growth', 'gdp_per_capita'],
    categoricalColumns: ['year', 'currency'],
  },

  electionResults: {
    id: '678e312d0aae3fe3ad3e361e',
    name: {
      'sr-Latn': 'Izborni rezultati po okruzima',
      'sr-Cyrl': 'Изборни резултати по окрузима',
      en: 'Election Results by District',
    },
    expectedRows: 24,
    geoColumn: 'district_code',
    numericColumns: ['votes_total', 'turnout_percent'],
    categoricalColumns: ['district', 'winner'],
  },
} as const;

export function getDatasetName(dataset: DatasetName, locale: Locale): string {
  return TEST_DATASETS[dataset].name[locale];
}

export const TEST_VIEWPORTS = {
  mobile: { width: 375, height: 667, name: 'mobile' },
  tablet: { width: 768, height: 1024, name: 'tablet' },
  desktop: { width: 1280, height: 800, name: 'desktop' },
  wide: { width: 1920, height: 1080, name: 'wide' },
} as const;

export const WAIT_TIMES = {
  pageLoad: 1000,
  animation: 500,
  debounce: 300,
} as const;

export const TEST_USERS = {
  editor: {
    email: process.env.TEST_EDITOR_EMAIL ?? 'test-editor@example.com',
    password: process.env.TEST_EDITOR_PASSWORD ?? 'test-password',
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL ?? 'test-admin@example.com',
    password: process.env.TEST_ADMIN_PASSWORD ?? 'test-password',
  },
} as const;