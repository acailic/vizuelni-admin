import type { Locale } from '@/lib/i18n/config';

/**
 * Data source reliability level
 */
export type DataSourceReliability = 'official' | 'international';

/**
 * Data source update frequency
 */
export type UpdateFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

/**
 * Represents a data source in the registry
 */
export interface DataSource {
  /** Unique identifier for the data source */
  id: string;
  /** English name of the data source */
  name: string;
  /** Localized names for the data source */
  nameLocalized: {
    'sr-Cyrl': string;
    'sr-Latn': string;
    en: string;
  };
  /** Main website URL */
  url: string;
  /** API endpoint URL if available */
  apiUrl?: string;
  /** Reliability classification */
  reliability: DataSourceReliability;
  /** How often the data is updated */
  updateFrequency: UpdateFrequency;
  /** Optional description */
  description?: string;
}

/**
 * Registry of all data sources used by the platform
 */
export const DATA_SOURCES: Record<string, DataSource> = {
  SORS: {
    id: 'sors',
    name: 'Statistical Office of the Republic of Serbia',
    nameLocalized: {
      'sr-Cyrl': 'Републички завод за статистику',
      'sr-Latn': 'Republički zavod za statistiku',
      en: 'Statistical Office of the Republic of Serbia',
    },
    url: 'https://www.stat.gov.rs',
    reliability: 'official',
    updateFrequency: 'monthly',
    description:
      'Official statistical data from the Republic of Serbia including demographics, economy, and social indicators.',
  },
  DATA_GOV_RS: {
    id: 'data-gov-rs',
    name: 'Open Data Portal of Serbia',
    nameLocalized: {
      'sr-Cyrl': 'Портал отворених података',
      'sr-Latn': 'Portal otvorenih podataka',
      en: 'Open Data Portal of Serbia',
    },
    url: 'https://data.gov.rs',
    apiUrl: 'https://data.gov.rs/api/1',
    reliability: 'official',
    updateFrequency: 'weekly',
    description:
      'Central portal for open government data from Serbian institutions.',
  },
  WHO_GLOBOCAN: {
    id: 'who-globocan',
    name: 'WHO/International Agency for Research on Cancer',
    nameLocalized: {
      'sr-Cyrl': 'СЗО/Међународна агенција за истраживање рака',
      'sr-Latn': 'SZO/Međunarodna agencija za istraživanje raka',
      en: 'WHO/International Agency for Research on Cancer',
    },
    url: 'https://gco.iarc.fr/today',
    reliability: 'international',
    updateFrequency: 'yearly',
    description:
      'Global cancer statistics and research data from WHO and IARC.',
  },
  WORLD_BANK: {
    id: 'world-bank',
    name: 'World Bank Open Data',
    nameLocalized: {
      'sr-Cyrl': 'Светска банка',
      'sr-Latn': 'Svetska banka',
      en: 'World Bank Open Data',
    },
    url: 'https://data.worldbank.org',
    apiUrl: 'https://api.worldbank.org/v2',
    reliability: 'international',
    updateFrequency: 'quarterly',
    description:
      'Development indicators and economic data from the World Bank.',
  },
  EUROSTAT: {
    id: 'eurostat',
    name: 'Eurostat',
    nameLocalized: {
      'sr-Cyrl': 'Евростат',
      'sr-Latn': 'Evrostat',
      en: 'Eurostat',
    },
    url: 'https://ec.europa.eu/eurostat',
    apiUrl: 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0',
    reliability: 'international',
    updateFrequency: 'monthly',
    description:
      'Statistical office of the European Union providing comparable data.',
  },
  UNDESA: {
    id: 'undesa',
    name: 'UN Department of Economic and Social Affairs',
    nameLocalized: {
      'sr-Cyrl': 'УН DESA',
      'sr-Latn': 'UN DESA',
      en: 'UN DESA',
    },
    url: 'https://www.un.org/development/desa',
    reliability: 'international',
    updateFrequency: 'yearly',
    description:
      'Population projections and demographic data from the United Nations.',
  },
  NBS: {
    id: 'nbs',
    name: 'National Bank of Serbia',
    nameLocalized: {
      'sr-Cyrl': 'Народна банка Србије',
      'sr-Latn': 'Narodna banka Srbije',
      en: 'National Bank of Serbia',
    },
    url: 'https://www.nbs.rs',
    apiUrl: 'https://www.nbs.rs/export/internet/english',
    reliability: 'official',
    updateFrequency: 'monthly',
    description:
      'Monetary policy, exchange rates, and financial statistics from the central bank.',
  },
  MINISTRY_OF_HEALTH: {
    id: 'ministry-of-health',
    name: 'Ministry of Health of Serbia',
    nameLocalized: {
      'sr-Cyrl': 'Министарство здравља Републике Србије',
      'sr-Latn': 'Ministarstvo zdravlja Republike Srbije',
      en: 'Ministry of Health of Serbia',
    },
    url: 'https://www.zdravlje.gov.rs',
    reliability: 'official',
    updateFrequency: 'monthly',
    description: 'Healthcare statistics and public health data from Serbia.',
  },
  MINISTRY_OF_EDUCATION: {
    id: 'ministry-of-education',
    name: 'Ministry of Education of Serbia',
    nameLocalized: {
      'sr-Cyrl': 'Министарство просвете Републике Србије',
      'sr-Latn': 'Ministarstvo prosvete Republike Srbije',
      en: 'Ministry of Education of Serbia',
    },
    url: 'https://www.mpn.gov.rs',
    reliability: 'official',
    updateFrequency: 'yearly',
    description: 'Education statistics and school enrollment data from Serbia.',
  },
  MINISTRY_OF_INTERIOR: {
    id: 'ministry-of-interior',
    name: 'Ministry of Interior of Serbia',
    nameLocalized: {
      'sr-Cyrl': 'Министарство унутрашњих послова Републике Србије',
      'sr-Latn': 'Ministarstvo unutrašnjih poslova Republike Srbije',
      en: 'Ministry of Interior of Serbia',
    },
    url: 'https://www.mup.gov.rs',
    reliability: 'official',
    updateFrequency: 'monthly',
    description: 'Crime statistics and public safety data from Serbia.',
  },
  MINISTRY_OF_FINANCE: {
    id: 'ministry-of-finance',
    name: 'Ministry of Finance of Serbia',
    nameLocalized: {
      'sr-Cyrl': 'Министарство финансија Републике Србије',
      'sr-Latn': 'Ministarstvo finansija Republike Srbije',
      en: 'Ministry of Finance of Serbia',
    },
    url: 'https://www.mfin.gov.rs',
    reliability: 'official',
    updateFrequency: 'monthly',
    description: 'Budget execution and public finance data from Serbia.',
  },
  INSTITUTE_OF_PUBLIC_HEALTH: {
    id: 'institute-of-public-health',
    name: 'Institute of Public Health of Serbia',
    nameLocalized: {
      'sr-Cyrl': 'Институт за јавно здравље Србије',
      'sr-Latn': 'Institut za javno zdravlje Srbije',
      en: 'Institute of Public Health of Serbia',
    },
    url: 'https://www.batut.org.rs',
    reliability: 'official',
    updateFrequency: 'monthly',
    description: 'Public health statistics, cancer registry, and health indicators.',
  },
  SEPA: {
    id: 'sepa',
    name: 'Serbian Environmental Protection Agency',
    nameLocalized: {
      'sr-Cyrl': 'Агенција за заштиту животне средине',
      'sr-Latn': 'Agencija za zaštitu životne sredine',
      en: 'Serbian Environmental Protection Agency',
    },
    url: 'https://www.sepa.gov.rs',
    reliability: 'official',
    updateFrequency: 'weekly',
    description: 'Air quality, water quality, and environmental monitoring data.',
  },
};

/**
 * Get a data source by its ID
 */
export function getDataSource(id: string): DataSource | undefined {
  return DATA_SOURCES[id];
}

/**
 * Get all data sources as an array
 */
export function getAllDataSources(): DataSource[] {
  return Object.values(DATA_SOURCES);
}

/**
 * Get data sources by reliability type
 */
export function getDataSourcesByReliability(
  reliability: DataSourceReliability
): DataSource[] {
  return Object.values(DATA_SOURCES).filter(
    (source) => source.reliability === reliability
  );
}

/**
 * Get the localized name for a data source
 */
export function getDataSourceLocalizedName(
  sourceId: string,
  locale: Locale
): string {
  const source = getDataSource(sourceId);
  if (!source) {
    return sourceId;
  }
  return source.nameLocalized[locale] || source.nameLocalized.en;
}

/**
 * Format data source attribution text
 */
export function formatDataSourceAttribution(
  sourceId: string,
  locale: Locale = 'en'
): string {
  const source = getDataSource(sourceId);
  if (!source) {
    return sourceId;
  }
  return `${source.nameLocalized[locale] || source.nameLocalized.en}`;
}
