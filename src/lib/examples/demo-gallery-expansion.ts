import type { FeaturedExampleConfig } from './types'
import type { Observation, ParsedDataset } from '@/types/observation'

import { getDataSource } from '@/lib/data-sources'

import pisaScoresData from '@/data/demo-gallery/education/pisa-scores.json'
import teacherStudentRatiosData from '@/data/demo-gallery/education/teacher-student-ratios.json'
import enrollmentByLevelData from '@/data/demo-gallery/education/enrollment-by-level.json'
import airQualityByCityData from '@/data/demo-gallery/environment/air-quality-by-city.json'
import waterQualityStationsData from '@/data/demo-gallery/environment/water-quality-stations.json'
import wasteManagementData from '@/data/demo-gallery/environment/waste-management.json'
import fdiInflowsData from '@/data/demo-gallery/economy/fdi-inflows.json'
import tradeBalancePartnersData from '@/data/demo-gallery/economy/trade-balance-partners.json'
import sectorGdpData from '@/data/demo-gallery/economy/sector-gdp.json'
import internetPenetrationData from '@/data/demo-gallery/infrastructure/internet-penetration.json'
import energyProductionFlowData from '@/data/demo-gallery/infrastructure/energy-production-flow.json'
import roadNetworkData from '@/data/demo-gallery/infrastructure/road-network.json'
import budgetExecutionData from '@/data/demo-gallery/public-finance/budget-execution.json'
import taxRevenueMixData from '@/data/demo-gallery/public-finance/tax-revenue-mix.json'
import municipalSpendingDistributionData from '@/data/demo-gallery/public-finance/municipal-spending-distribution.json'

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
    values: [...new Set(data.map((item) => String(item[key])))],
    cardinality: [...new Set(data.map((item) => String(item[key])))].length,
  }))

  const measureMeta = measures.map((key) => {
    const values = data.map((item) => Number(item[key])).filter((value) => !Number.isNaN(value))
    return {
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      min: Math.min(...values),
      max: Math.max(...values),
      hasNulls: data.some((item) => item[key] === null || item[key] === undefined),
    }
  })

  return {
    observations: data.map((item) => ({ ...item })) as Observation[],
    dimensions: dimensionMeta,
    measures: measureMeta,
    metadataColumns: [],
    columns: [...dimensions, ...measures],
    rowCount: data.length,
    source: { format: 'json', name: sourceName },
  }
}

const getData = (json: { data: Record<string, unknown>[] }) => json.data

function sourceLabel(id: string, fallback: string) {
  return getDataSource(id)?.name ?? fallback
}

export const expandedDemoGalleryExamples: FeaturedExampleConfig[] = [
  {
    id: 'demo-pisa-scores',
    title: {
      sr: 'PISA rezultati',
      lat: 'PISA rezultati',
      en: 'PISA scores',
    },
    description: {
      sr: 'Poredjenje Srbije i OECD proseka po oblasti',
      lat: 'Poredjenje Srbije i OECD proseka po oblasti',
      en: 'Comparison of Serbia and the OECD average by domain',
    },
    datasetId: 'demo-pisa-scores',
    resourceUrl: '',
    chartConfig: {
      type: 'radar',
      title: 'PISA scores',
      x_axis: { field: 'domain', type: 'category', label: 'Domain' },
      y_axis: { field: 'serbia', type: 'linear', label: 'Serbia' },
      options: { showLegend: true, secondaryField: 'oecd', fillOpacity: 0.3 },
    },
    inlineData: toParsedDataset(getData(pisaScoresData), ['domain'], ['serbia', 'oecd'], 'PISA scores'),
    category: 'society',
    tags: ['education', 'pisa', 'students', 'radar'],
    dataSource: sourceLabel('sors', 'OECD / Ministry of Education'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-teacher-student-ratios',
    title: {
      sr: 'Odnos nastavnika i ucenika',
      lat: 'Odnos nastavnika i ucenika',
      en: 'Teacher-student ratios',
    },
    description: {
      sr: 'Regionalni odnos nastavnika i ucenika',
      lat: 'Regionalni odnos nastavnika i ucenika',
      en: 'Regional teacher-student ratios',
    },
    datasetId: 'demo-teacher-student-ratios',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Teacher-student ratios',
      x_axis: { field: 'region', type: 'category', label: 'Region' },
      y_axis: { field: 'ratio', type: 'linear', label: 'Ratio' },
      options: { showLegend: false, showGrid: true },
    },
    inlineData: toParsedDataset(getData(teacherStudentRatiosData), ['region'], ['ratio'], 'Teacher-student ratios'),
    category: 'society',
    tags: ['education', 'teachers', 'schools'],
    dataSource: sourceLabel('sors', 'Ministry of Education'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-enrollment-by-level',
    title: {
      sr: 'Upis po nivou obrazovanja',
      lat: 'Upis po nivou obrazovanja',
      en: 'Enrollment by education level',
    },
    description: {
      sr: 'Ukupan broj upisanih po obrazovnom nivou',
      lat: 'Ukupan broj upisanih po obrazovnom nivou',
      en: 'Total enrolled students by education level',
    },
    datasetId: 'demo-enrollment-by-level',
    resourceUrl: '',
    chartConfig: {
      type: 'funnel',
      title: 'Enrollment by level',
      x_axis: { field: 'level', type: 'category', label: 'Level' },
      y_axis: { field: 'students', type: 'linear', label: 'Students' },
      options: { showLabels: true },
    },
    inlineData: toParsedDataset(getData(enrollmentByLevelData), ['level'], ['students'], 'Enrollment by level'),
    category: 'society',
    tags: ['education', 'students', 'funnel'],
    dataSource: sourceLabel('sors', 'Ministry of Education'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-air-quality-by-city',
    title: {
      sr: 'Kvalitet vazduha po gradu',
      lat: 'Kvalitet vazduha po gradu',
      en: 'Air quality by city',
    },
    description: {
      sr: 'Koncentracije glavnih zagadjivaca po gradu',
      lat: 'Koncentracije glavnih zagadjivaca po gradu',
      en: 'Concentrations of key pollutants by city',
    },
    datasetId: 'demo-air-quality-by-city',
    resourceUrl: '',
    chartConfig: {
      type: 'heatmap',
      title: 'Air quality by city',
      x_axis: { field: 'pollutant', type: 'category', label: 'Pollutant' },
      y_axis: { field: 'value', type: 'linear', label: 'Value' },
      options: { heatmapXField: 'pollutant', heatmapYField: 'city', showLabels: true },
    },
    inlineData: toParsedDataset(getData(airQualityByCityData), ['city', 'pollutant'], ['value'], 'Air quality by city'),
    category: 'society',
    tags: ['environment', 'air-quality', 'heatmap'],
    dataSource: sourceLabel('data-gov-rs', 'SEPA'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-water-quality-stations',
    title: {
      sr: 'Kvalitet vode na stanicama',
      lat: 'Kvalitet vode na stanicama',
      en: 'Water quality stations',
    },
    description: {
      sr: 'Indeks kvaliteta vode po mernoj stanici',
      lat: 'Indeks kvaliteta vode po mernoj stanici',
      en: 'Water quality index by monitoring station',
    },
    datasetId: 'demo-water-quality-stations',
    resourceUrl: '',
    chartConfig: {
      type: 'column',
      title: 'Water quality stations',
      x_axis: { field: 'station', type: 'category', label: 'Station' },
      y_axis: { field: 'qualityIndex', type: 'linear', label: 'Index' },
      options: { showLegend: false, showGrid: true },
    },
    inlineData: toParsedDataset(getData(waterQualityStationsData), ['station'], ['qualityIndex'], 'Water quality stations'),
    category: 'society',
    tags: ['environment', 'water', 'stations'],
    dataSource: sourceLabel('data-gov-rs', 'SEPA'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-waste-management',
    title: {
      sr: 'Upravljanje otpadom',
      lat: 'Upravljanje otpadom',
      en: 'Waste management',
    },
    description: {
      sr: 'Generisani otpad po vrsti',
      lat: 'Generisani otpad po vrsti',
      en: 'Generated waste by type',
    },
    datasetId: 'demo-waste-management',
    resourceUrl: '',
    chartConfig: {
      type: 'treemap',
      title: 'Waste management',
      x_axis: { field: 'wasteType', type: 'category', label: 'Waste type' },
      y_axis: { field: 'amount', type: 'linear', label: 'Amount' },
      options: { showLabels: true, treemapTiling: 'squarify' },
    },
    inlineData: toParsedDataset(getData(wasteManagementData), ['wasteType'], ['amount'], 'Waste management'),
    category: 'society',
    tags: ['environment', 'waste', 'treemap'],
    dataSource: sourceLabel('data-gov-rs', 'Ministry of Environmental Protection'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-fdi-inflows',
    title: {
      sr: 'Priliv stranih direktnih investicija',
      lat: 'Priliv stranih direktnih investicija',
      en: 'FDI inflows',
    },
    description: {
      sr: 'Kretanje SDI po godinama',
      lat: 'Kretanje SDI po godinama',
      en: 'Foreign direct investment inflows by year',
    },
    datasetId: 'demo-fdi-inflows',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'FDI inflows',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'inflow', type: 'linear', label: 'EUR bn' },
      options: { showLegend: false, curveType: 'monotone', showDots: true },
    },
    inlineData: toParsedDataset(getData(fdiInflowsData), ['year'], ['inflow'], 'FDI inflows'),
    category: 'economy',
    tags: ['economy', 'investment', 'fdi'],
    dataSource: sourceLabel('nbs', 'National Bank of Serbia'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-trade-balance-partners',
    title: {
      sr: 'Trgovinski bilans po partneru',
      lat: 'Trgovinski bilans po partneru',
      en: 'Trade balance by partner',
    },
    description: {
      sr: 'Izvoz minus uvoz po kljucnim partnerima',
      lat: 'Izvoz minus uvoz po kljucnim partnerima',
      en: 'Exports minus imports by major partner',
    },
    datasetId: 'demo-trade-balance-partners',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Trade balance by partner',
      x_axis: { field: 'partner', type: 'category', label: 'Partner' },
      y_axis: { field: 'balance', type: 'linear', label: 'EUR m' },
      options: { showLegend: false, showGrid: true },
    },
    inlineData: toParsedDataset(getData(tradeBalancePartnersData), ['partner'], ['balance'], 'Trade balance by partner'),
    category: 'economy',
    tags: ['economy', 'trade', 'exports', 'imports'],
    dataSource: sourceLabel('sors', 'Statistical Office of the Republic of Serbia'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-sector-gdp',
    title: {
      sr: 'BDP po sektoru',
      lat: 'BDP po sektoru',
      en: 'GDP by sector',
    },
    description: {
      sr: 'Udeo sektora u bruto domacem proizvodu',
      lat: 'Udeo sektora u bruto domacem proizvodu',
      en: 'Sector share of gross domestic product',
    },
    datasetId: 'demo-sector-gdp',
    resourceUrl: '',
    chartConfig: {
      type: 'pie',
      title: 'GDP by sector',
      x_axis: { field: 'sector', type: 'category', label: 'Sector' },
      y_axis: { field: 'share', type: 'linear', label: 'Share' },
      options: { showLegend: true, showLabels: true, showPercentages: true },
    },
    inlineData: toParsedDataset(getData(sectorGdpData), ['sector'], ['share'], 'GDP by sector'),
    category: 'economy',
    tags: ['economy', 'gdp', 'sector'],
    dataSource: sourceLabel('sors', 'Statistical Office of the Republic of Serbia'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-internet-penetration',
    title: {
      sr: 'Internet penetracija',
      lat: 'Internet penetracija',
      en: 'Internet penetration',
    },
    description: {
      sr: 'Domacinstva sa sirokopojasnim internetom',
      lat: 'Domacinstva sa sirokopojasnim internetom',
      en: 'Households with broadband access',
    },
    datasetId: 'demo-internet-penetration',
    resourceUrl: '',
    chartConfig: {
      type: 'gauge',
      title: 'Internet penetration',
      x_axis: { field: 'indicator', type: 'category', label: 'Indicator' },
      y_axis: { field: 'coverage', type: 'linear', label: 'Coverage' },
      options: { gaugeMin: 0, gaugeMax: 100 },
    },
    inlineData: toParsedDataset(getData(internetPenetrationData), ['indicator'], ['coverage'], 'Internet penetration'),
    category: 'economy',
    tags: ['infrastructure', 'digital', 'broadband', 'gauge'],
    dataSource: sourceLabel('world-bank', 'Ministry of Telecommunications'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-energy-production-flow',
    title: {
      sr: 'Tokovi proizvodnje energije',
      lat: 'Tokovi proizvodnje energije',
      en: 'Energy production flow',
    },
    description: {
      sr: 'Tokovi od izvora energije do glavnih potrosaca',
      lat: 'Tokovi od izvora energije do glavnih potrosaca',
      en: 'Flows from energy sources to the main end users',
    },
    datasetId: 'demo-energy-production-flow',
    resourceUrl: '',
    chartConfig: {
      type: 'sankey',
      title: 'Energy production flow',
      x_axis: { field: 'source', type: 'category', label: 'Source' },
      y_axis: { field: 'value', type: 'linear', label: 'Share' },
      options: { sankeySourceField: 'source', sankeyTargetField: 'target' },
    },
    inlineData: toParsedDataset(getData(energyProductionFlowData), ['source', 'target'], ['value'], 'Energy production flow'),
    category: 'economy',
    tags: ['infrastructure', 'energy', 'sankey'],
    dataSource: sourceLabel('data-gov-rs', 'Ministry of Mining and Energy'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-road-network',
    title: {
      sr: 'Putna mreza',
      lat: 'Putna mreza',
      en: 'Road network',
    },
    description: {
      sr: 'Duzina regionalne putne mreze',
      lat: 'Duzina regionalne putne mreze',
      en: 'Length of the regional road network',
    },
    datasetId: 'demo-road-network',
    resourceUrl: '',
    chartConfig: {
      type: 'column',
      title: 'Road network',
      x_axis: { field: 'region', type: 'category', label: 'Region' },
      y_axis: { field: 'kilometers', type: 'linear', label: 'Kilometers' },
      options: { showLegend: false, showGrid: true },
    },
    inlineData: toParsedDataset(getData(roadNetworkData), ['region'], ['kilometers'], 'Road network'),
    category: 'economy',
    tags: ['infrastructure', 'roads', 'transport'],
    dataSource: sourceLabel('data-gov-rs', 'Roads of Serbia'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-budget-execution',
    title: {
      sr: 'Izvrsenje budzeta',
      lat: 'Izvrsenje budzeta',
      en: 'Budget execution',
    },
    description: {
      sr: 'Promene od planiranog do izvrsenog budzeta',
      lat: 'Promene od planiranog do izvrsenog budzeta',
      en: 'Changes from the approved to the executed budget',
    },
    datasetId: 'demo-budget-execution',
    resourceUrl: '',
    chartConfig: {
      type: 'waterfall',
      title: 'Budget execution',
      x_axis: { field: 'stage', type: 'category', label: 'Stage' },
      y_axis: { field: 'amount', type: 'linear', label: 'RSD bn' },
      options: { showLabels: true },
    },
    inlineData: toParsedDataset(getData(budgetExecutionData), ['stage'], ['amount'], 'Budget execution'),
    category: 'economy',
    tags: ['public-finance', 'budget', 'waterfall'],
    dataSource: sourceLabel('data-gov-rs', 'Ministry of Finance'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-tax-revenue-mix',
    title: {
      sr: 'Struktura poreskih prihoda',
      lat: 'Struktura poreskih prihoda',
      en: 'Tax revenue mix',
    },
    description: {
      sr: 'Udeo glavnih izvora poreskih prihoda',
      lat: 'Udeo glavnih izvora poreskih prihoda',
      en: 'Share of the main tax revenue streams',
    },
    datasetId: 'demo-tax-revenue-mix',
    resourceUrl: '',
    chartConfig: {
      type: 'pie',
      title: 'Tax revenue mix',
      x_axis: { field: 'tax', type: 'category', label: 'Tax type' },
      y_axis: { field: 'share', type: 'linear', label: 'Share' },
      options: { showLegend: true, showLabels: true, showPercentages: true },
    },
    inlineData: toParsedDataset(getData(taxRevenueMixData), ['tax'], ['share'], 'Tax revenue mix'),
    category: 'economy',
    tags: ['public-finance', 'tax', 'revenue'],
    dataSource: sourceLabel('nbs', 'Ministry of Finance'),
    lastUpdated: '2025-01-15',
  },
  {
    id: 'demo-municipal-spending-distribution',
    title: {
      sr: 'Raspodela opstinske potrosnje',
      lat: 'Raspodela opstinske potrosnje',
      en: 'Municipal spending distribution',
    },
    description: {
      sr: 'Raspodela potrosnje po regionu',
      lat: 'Raspodela potrosnje po regionu',
      en: 'Distribution of municipal spending by region',
    },
    datasetId: 'demo-municipal-spending-distribution',
    resourceUrl: '',
    chartConfig: {
      type: 'box-plot',
      title: 'Municipal spending distribution',
      x_axis: { field: 'region', type: 'category', label: 'Region' },
      y_axis: { field: 'spending', type: 'linear', label: 'Spending per capita' },
      options: { showGrid: true },
    },
    inlineData: toParsedDataset(
      getData(municipalSpendingDistributionData),
      ['region'],
      ['spending'],
      'Municipal spending distribution'
    ),
    category: 'economy',
    tags: ['public-finance', 'municipalities', 'box-plot'],
    dataSource: sourceLabel('data-gov-rs', 'Ministry of Finance'),
    lastUpdated: '2025-01-15',
  },
]
