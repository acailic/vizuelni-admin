import type { FeaturedExampleConfig } from './types'
import type { ParsedDataset } from '@/types/observation'

// Import data files
import demographicsData from '@/data/showcase/serbia-demographics.json'
import migrationData from '@/data/showcase/serbia-migration.json'
import regionsData from '@/data/showcase/serbia-regions.json'
import healthcareData from '@/data/showcase/serbia-healthcare.json'
import diasporaData from '@/data/showcase/serbia-diaspora.json'

/**
 * Convert raw JSON data to ParsedDataset format
 */
function toParsedDataset(
  data: Record<string, unknown>[],
  dimensions: string[],
  measures: string[],
  sourceName: string
): ParsedDataset {
  const dimensionMeta = dimensions.map((key) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    type: 'categorical' as const,
    values: [...new Set(data.map((d) => String(d[key])))],
    cardinality: [...new Set(data.map((d) => String(d[key])))].length,
  }))

  const measureMeta = measures.map((key) => {
    const values = data.map((d) => Number(d[key])).filter((v) => !isNaN(v))
    return {
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      min: Math.min(...values),
      max: Math.max(...values),
      hasNulls: data.some((d) => d[key] === null || d[key] === undefined),
    }
  })

  return {
    observations: data.map((d) => ({ ...d })),
    dimensions: dimensionMeta,
    measures: measureMeta,
    metadataColumns: [],
    columns: [...dimensions, ...measures],
    rowCount: data.length,
    source: { format: 'json', name: sourceName },
  }
}

/**
 * Showcase examples - pre-built demo charts using Serbian government data
 */
export const showcaseExamples: FeaturedExampleConfig[] = [
  {
    id: 'serbia-population-decline',
    title: {
      sr: 'Пад становништва Србије',
      lat: 'Pad stanovništva Srbije',
      en: 'Serbia Population Decline',
    },
    description: {
      sr: 'Популациони тренд од 1991. до 2024. године',
      lat: 'Populacioni trend od 1991. do 2024. godine',
      en: 'Population trend from 1991 to 2024',
    },
    datasetId: 'serbia-demographics',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'Population Decline',
      x_axis: { field: 'year', type: 'linear' },
      y_axis: { field: 'population', type: 'linear' },
      options: {
        showGrid: true,
        showLegend: false,
        curveType: 'monotone',
        showDots: true,
        colors: ['#0D4077'],
      },
    },
    inlineData: toParsedDataset(
      demographicsData.data,
      ['year'],
      ['population'],
      'Serbia Demographics'
    ),
    category: 'demographics',
    featured: true,
    tags: ['population', 'demographics', 'census'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'serbia-migration-balance',
    title: {
      sr: 'Миграциони биланс',
      lat: 'Migracioni bilans',
      en: 'Migration Balance',
    },
    description: {
      sr: 'Имигранти наспрам емиграната (2015-2024)',
      lat: 'Imigranti nasuprot emigranata (2015-2024)',
      en: 'Immigrants vs Emigrants (2015-2024)',
    },
    datasetId: 'serbia-migration',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Migration Balance',
      x_axis: { field: 'year', type: 'linear' },
      y_axis: { field: 'immigrants', type: 'linear' },
      options: {
        showGrid: true,
        showLegend: true,
        grouping: 'grouped',
        colors: ['#10B981', '#C6363C'],
      },
    },
    inlineData: toParsedDataset(
      migrationData.data,
      ['year'],
      ['immigrants', 'emigrants'],
      'Serbia Migration'
    ),
    category: 'migration',
    featured: true,
    tags: ['migration', 'immigration', 'emigration', 'demographics'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-02-01',
  },
  {
    id: 'serbia-regional-disparities',
    title: {
      sr: 'Регионалне разлике',
      lat: 'Regionalne razlike',
      en: 'Regional Disparities',
    },
    description: {
      sr: 'БДП индекс и животни век по регионима',
      lat: 'BDP indeks i životni vek po regionima',
      en: 'GDP index and life expectancy by region',
    },
    datasetId: 'serbia-regions',
    resourceUrl: '',
    chartConfig: {
      type: 'scatterplot',
      title: 'Regional Disparities',
      x_axis: { field: 'gdpIndex', type: 'linear', label: 'GDP Index' },
      y_axis: { field: 'lifeExpectancy', type: 'linear', label: 'Life Expectancy' },
      options: {
        showGrid: true,
        showLegend: true,
        dotSize: 12,
        opacity: 0.8,
        colors: ['#4B90F5'],
      },
    },
    inlineData: toParsedDataset(
      regionsData.data,
      ['region'],
      ['gdpIndex', 'lifeExpectancy'],
      'Serbia Regions'
    ),
    category: 'economy',
    featured: true,
    tags: ['economy', 'regions', 'gdp', 'life expectancy'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-20',
  },
  {
    id: 'serbia-healthcare-comparison',
    title: {
      sr: 'Здравствено поређење',
      lat: 'Zdravstveno poređenje',
      en: 'Healthcare Comparison',
    },
    description: {
      sr: 'Србија наспрам ЕУ - лекари, медицинске сестре, болнички кревети',
      lat: 'Srbija nasuprot EU - lekari, medicinske sestre, bolnički kreveti',
      en: 'Serbia vs EU - doctors, nurses, hospital beds per 100,000',
    },
    datasetId: 'serbia-healthcare',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Healthcare Comparison: Serbia vs EU',
      x_axis: { field: 'category', type: 'category' },
      y_axis: { field: 'serbia', type: 'linear', label: 'Per 100,000' },
      options: {
        showGrid: true,
        showLegend: true,
        grouping: 'grouped',
        colors: ['#0D4077', '#10B981'],
      },
    },
    inlineData: toParsedDataset(
      healthcareData.data,
      ['category'],
      ['serbia', 'eu'],
      'Serbia Healthcare'
    ),
    category: 'healthcare',
    featured: true,
    tags: ['healthcare', 'doctors', 'nurses', 'hospital', 'eu comparison'],
    dataSource: 'WHO - World Health Organization',
    lastUpdated: '2023-12-10',
  },
  {
    id: 'serbia-diaspora-destinations',
    title: {
      sr: 'Дестинације дијаспоре',
      lat: 'Destinacije dijaspore',
      en: 'Diaspora Destinations',
    },
    description: {
      sr: 'Где живи српска дијаспора - топ 10 земаља',
      lat: 'Gde živi srpska dijaspora - top 10 zemalja',
      en: 'Where Serbian diaspora lives - top 10 countries',
    },
    datasetId: 'serbia-diaspora',
    resourceUrl: '',
    chartConfig: {
      type: 'pie',
      title: 'Serbian Diaspora by Country',
      x_axis: { field: 'country', type: 'category' },
      y_axis: { field: 'percentage', type: 'linear' },
      options: {
        showLegend: true,
        showLabels: true,
        showPercentages: true,
        colors: ['#0D4077', '#4B90F5', '#3558A2', '#C6363C', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'],
      },
    },
    inlineData: toParsedDataset(
      diasporaData.data,
      ['country'],
      ['percentage', 'emigrants'],
      'Serbia Diaspora'
    ),
    category: 'migration',
    featured: true,
    tags: ['diaspora', 'migration', 'emigration', 'countries'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-15',
  },
]

/**
 * Get featured examples for landing page
 */
export function getFeaturedExamples(): FeaturedExampleConfig[] {
  return showcaseExamples.filter((ex) => ex.featured)
}

/**
 * Get examples by category
 */
export function getExamplesByCategory(
  category: 'demographics' | 'healthcare' | 'economy' | 'migration'
): FeaturedExampleConfig[] {
  return showcaseExamples.filter((ex) => ex.category === category)
}

/**
 * Get example by ID
 */
export function getExampleById(id: string): FeaturedExampleConfig | undefined {
  return showcaseExamples.find((ex) => ex.id === id)
}
