'use client';

import { useState } from 'react';
import {
  Copy,
  Download,
  Search,
  Database,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';

interface DatasetInfo {
  id: string;
  name: string;
  nameLocalized: {
    sr: string;
    lat: string;
    en: string;
  };
  description: string;
  descriptionLocalized: {
    sr: string;
    lat: string;
    en: string;
  };
  category: string;
  rows: number;
  columns: string[];
  sampleData: Record<string, unknown>[];
  importStatement: string;
  source: string;
}

const sampleDatasets: DatasetInfo[] = [
  {
    id: 'population-by-region',
    name: 'Population by Region',
    nameLocalized: {
      sr: 'Популација по регионима',
      lat: 'Populacija po regionima',
      en: 'Population by Region',
    },
    description: 'Population counts for Serbian regions',
    descriptionLocalized: {
      sr: 'Број становника по регионима Србије',
      lat: 'Broj stanovnika po regionima Srbije',
      en: 'Population counts for Serbian regions',
    },
    category: 'demographics',
    rows: 5,
    columns: ['region', 'population', 'area_km2'],
    sampleData: [
      { region: 'Belgrade', population: 1688000, area_km2: 3222 },
      { region: 'Vojvodina', population: 1895000, area_km2: 21506 },
      { region: 'Šumadija', population: 514000, area_km2: 5142 },
    ],
    importStatement:
      "import { populationByRegion } from '@vizualni/sample-data';",
    source: 'SORS',
  },
  {
    id: 'gdp-growth',
    name: 'GDP Growth',
    nameLocalized: {
      sr: 'Раст БДП',
      lat: 'Rast BDP',
      en: 'GDP Growth',
    },
    description: 'Annual GDP growth rates',
    descriptionLocalized: {
      sr: 'Годишње стопе раста БДП',
      lat: 'Godišnje stope rasta BDP',
      en: 'Annual GDP growth rates',
    },
    category: 'economy',
    rows: 10,
    columns: ['year', 'gdp', 'gdp_per_capita'],
    sampleData: [
      { year: 2015, gdp: 0.8, gdp_per_capita: 5300 },
      { year: 2016, gdp: 2.8, gdp_per_capita: 5500 },
      { year: 2017, gdp: 3.5, gdp_per_capita: 5800 },
    ],
    importStatement: "import { gdpGrowth } from '@vizualni/sample-data';",
    source: 'SORS',
  },
  {
    id: 'birth-rates',
    name: 'Birth Rates',
    nameLocalized: {
      sr: 'Стопе наталитета',
      lat: 'Stope nataliteta',
      en: 'Birth Rates',
    },
    description: 'Historical birth rate trends',
    descriptionLocalized: {
      sr: 'Историјски трендови стопе наталитета',
      lat: 'Istorijski trendovi stope nataliteta',
      en: 'Historical birth rate trends',
    },
    category: 'demographics',
    rows: 74,
    columns: ['year', 'rate'],
    sampleData: [
      { year: 1950, rate: 28.5 },
      { year: 1960, rate: 25.2 },
      { year: 1970, rate: 20.8 },
    ],
    importStatement: "import { birthRates } from '@vizualni/sample-data';",
    source: 'SORS',
  },
  {
    id: 'healthcare-workers',
    name: 'Healthcare Workers',
    nameLocalized: {
      sr: 'Здравствени радници',
      lat: 'Zdravstveni radnici',
      en: 'Healthcare Workers',
    },
    description: 'Healthcare worker counts by category',
    descriptionLocalized: {
      sr: 'Број здравствених радника по категоријама',
      lat: 'Broj zdravstvenih radnika po kategorijama',
      en: 'Healthcare worker counts by category',
    },
    category: 'healthcare',
    rows: 8,
    columns: ['type', 'count', 'per_1000'],
    sampleData: [
      { type: 'Doctors', count: 21500, per_1000: 3.1 },
      { type: 'Nurses', count: 58000, per_1000: 8.4 },
      { type: 'Dentists', count: 4800, per_1000: 0.7 },
    ],
    importStatement:
      "import { healthcareWorkers } from '@vizualni/sample-data';",
    source: 'Ministry of Health',
  },
  {
    id: 'tourism',
    name: 'Tourism Statistics',
    nameLocalized: {
      sr: 'Туристичка статистика',
      lat: 'Turistička statistika',
      en: 'Tourism Statistics',
    },
    description: 'Tourist arrivals by month',
    descriptionLocalized: {
      sr: 'Број туриста по месецима',
      lat: 'Broj turista po mesecima',
      en: 'Tourist arrivals by month',
    },
    category: 'society',
    rows: 12,
    columns: ['month', 'tourists2023', 'tourists2024'],
    sampleData: [
      { month: 'January', tourists2023: 45000, tourists2024: 52000 },
      { month: 'February', tourists2023: 42000, tourists2024: 48000 },
      { month: 'March', tourists2023: 58000, tourists2024: 67000 },
    ],
    importStatement: "import { tourismStats } from '@vizualni/sample-data';",
    source: 'SORS',
  },
];

interface SampleDataBrowserProps {
  locale: Locale;
}

export function SampleDataBrowser({ locale }: SampleDataBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDataset, setExpandedDataset] = useState<string | null>(null);
  const [copiedImport, setCopiedImport] = useState<string | null>(null);

  const labels = {
    title:
      locale === 'sr-Cyrl'
        ? 'Примери података'
        : locale === 'sr-Latn'
          ? 'Primeri podataka'
          : 'Sample Data',
    subtitle:
      locale === 'sr-Cyrl'
        ? 'Истражите скупове података за визуализацију'
        : locale === 'sr-Latn'
          ? 'Istražite skupove podataka za vizuelizaciju'
          : 'Explore datasets for visualization',
    search:
      locale === 'sr-Cyrl'
        ? 'Претражи...'
        : locale === 'sr-Latn'
          ? 'Pretraži...'
          : 'Search...',
    allCategories:
      locale === 'sr-Cyrl'
        ? 'Све категорије'
        : locale === 'sr-Latn'
          ? 'Sve kategorije'
          : 'All Categories',
    demographics:
      locale === 'sr-Cyrl'
        ? 'Демографија'
        : locale === 'sr-Latn'
          ? 'Demografija'
          : 'Demographics',
    economy:
      locale === 'sr-Cyrl'
        ? 'Економија'
        : locale === 'sr-Latn'
          ? 'Ekonomija'
          : 'Economy',
    healthcare:
      locale === 'sr-Cyrl'
        ? 'Здравство'
        : locale === 'sr-Latn'
          ? 'Zdravstvo'
          : 'Healthcare',
    society:
      locale === 'sr-Cyrl'
        ? 'Друштво'
        : locale === 'sr-Latn'
          ? 'Društvo'
          : 'Society',
    rows:
      locale === 'sr-Cyrl'
        ? 'редова'
        : locale === 'sr-Latn'
          ? 'redova'
          : 'rows',
    copyImport:
      locale === 'sr-Cyrl'
        ? 'Копирај import'
        : locale === 'sr-Latn'
          ? 'Kopiraj import'
          : 'Copy import',
    download:
      locale === 'sr-Cyrl'
        ? 'Преузми'
        : locale === 'sr-Latn'
          ? 'Preuzmi'
          : 'Download',
    preview:
      locale === 'sr-Cyrl'
        ? 'Преглед'
        : locale === 'sr-Latn'
          ? 'Pregled'
          : 'Preview',
    hidePreview:
      locale === 'sr-Cyrl'
        ? 'Сакриј преглед'
        : locale === 'sr-Latn'
          ? 'Sakrij pregled'
          : 'Hide Preview',
    copied:
      locale === 'sr-Cyrl'
        ? 'Копирано!'
        : locale === 'sr-Latn'
          ? 'Kopirano!'
          : 'Copied!',
    source:
      locale === 'sr-Cyrl'
        ? 'Извор'
        : locale === 'sr-Latn'
          ? 'Izvor'
          : 'Source',
    columns:
      locale === 'sr-Cyrl'
        ? 'Колоне'
        : locale === 'sr-Latn'
          ? 'Kolone'
          : 'Columns',
  };

  const categoryLabels: Record<string, string> = {
    demographics: labels.demographics,
    economy: labels.economy,
    healthcare: labels.healthcare,
    society: labels.society,
  };

  const filteredDatasets = sampleDatasets.filter((dataset) => {
    const matchesSearch =
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || dataset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyImport = async (dataset: DatasetInfo) => {
    try {
      await navigator.clipboard.writeText(dataset.importStatement);
      setCopiedImport(dataset.id);
      setTimeout(() => setCopiedImport(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = (dataset: DatasetInfo) => {
    const dataStr = JSON.stringify(dataset.sampleData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-2'>
          <Database className='w-8 h-8 text-gov-primary' />
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            {labels.title}
          </h1>
        </div>
        <p className='text-gray-600 dark:text-gray-400'>{labels.subtitle}</p>
      </div>

      {/* Search and filters */}
      <div className='flex flex-col sm:flex-row gap-4 mb-8'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder={labels.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gov-primary focus:border-transparent'
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gov-primary focus:border-transparent'
        >
          <option value='all'>{labels.allCategories}</option>
          <option value='demographics'>{labels.demographics}</option>
          <option value='economy'>{labels.economy}</option>
          <option value='healthcare'>{labels.healthcare}</option>
          <option value='society'>{labels.society}</option>
        </select>
      </div>

      {/* Dataset grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredDatasets.map((dataset) => (
          <div
            key={dataset.id}
            className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow'
          >
            {/* Card header */}
            <div className='p-4 border-b border-gray-100 dark:border-gray-700'>
              <div className='flex items-start justify-between mb-2'>
                <h3 className='font-semibold text-gray-900 dark:text-white'>
                  {
                    dataset.nameLocalized[
                      locale === 'sr-Cyrl'
                        ? 'sr'
                        : locale === 'sr-Latn'
                          ? 'lat'
                          : 'en'
                    ]
                  }
                </h3>
                <span className='text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300'>
                  {categoryLabels[dataset.category]}
                </span>
              </div>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                {
                  dataset.descriptionLocalized[
                    locale === 'sr-Cyrl'
                      ? 'sr'
                      : locale === 'sr-Latn'
                        ? 'lat'
                        : 'en'
                  ]
                }
              </p>
              <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
                <span>
                  {dataset.rows} {labels.rows}
                </span>
                <span>
                  {labels.source}: {dataset.source}
                </span>
              </div>
            </div>

            {/* Import statement */}
            <div className='p-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700'>
              <code className='text-xs text-gray-700 dark:text-gray-300 block truncate'>
                {dataset.importStatement}
              </code>
            </div>

            {/* Actions */}
            <div className='p-3 flex items-center justify-between'>
              <div className='flex gap-2'>
                <button
                  onClick={() => handleCopyImport(dataset)}
                  className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                >
                  {copiedImport === dataset.id ? (
                    <>
                      <span className='text-green-500'>✓</span>
                      {labels.copied}
                    </>
                  ) : (
                    <>
                      <Copy className='w-3 h-3' />
                      {labels.copyImport}
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownload(dataset)}
                  className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                >
                  <Download className='w-3 h-3' />
                  {labels.download}
                </button>
              </div>
              <button
                onClick={() =>
                  setExpandedDataset(
                    expandedDataset === dataset.id ? null : dataset.id
                  )
                }
                className='inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline'
              >
                {expandedDataset === dataset.id ? (
                  <>
                    <ChevronUp className='w-3 h-3' />
                    {labels.hidePreview}
                  </>
                ) : (
                  <>
                    <ChevronDown className='w-3 h-3' />
                    {labels.preview}
                  </>
                )}
              </button>
            </div>

            {/* Expanded preview */}
            {expandedDataset === dataset.id && (
              <div className='p-3 border-t border-gray-100 dark:border-gray-700 overflow-x-auto'>
                <div className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-2'>
                  {labels.columns}: {dataset.columns.join(', ')}
                </div>
                <table className='min-w-full text-xs'>
                  <thead>
                    <tr>
                      {dataset.columns.map((col) => (
                        <th
                          key={col}
                          className='px-2 py-1 text-left font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600'
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.sampleData.map((row, i) => (
                      <tr key={i}>
                        {dataset.columns.map((col) => (
                          <td
                            key={col}
                            className='px-2 py-1 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800'
                          >
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredDatasets.length === 0 && (
        <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
          {locale === 'sr-Cyrl'
            ? 'Нема резултата за вашу претрагу'
            : locale === 'sr-Latn'
              ? 'Nema rezultata za vašu pretragu'
              : 'No results found for your search'}
        </div>
      )}
    </div>
  );
}
