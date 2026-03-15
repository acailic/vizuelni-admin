import type { FeaturedExampleConfig, ShowcaseCategory } from './types';
import type { Observation, ParsedDataset } from '@/types/observation';

// Import all data files - Demographics
import populationPyramidData from '@/data/demo-gallery/demographics/population-pyramid.json';
import birthRatesData from '@/data/demo-gallery/demographics/birth-rates.json';
import fertilityRatesData from '@/data/demo-gallery/demographics/fertility-rates.json';
import naturalChangeData from '@/data/demo-gallery/demographics/natural-change.json';
import populationDeclineData from '@/data/demo-gallery/demographics/population-decline.json';
import ageDistributionData from '@/data/demo-gallery/demographics/age-distribution.json';

// Import all data files - Healthcare
import cancerIncidenceData from '@/data/demo-gallery/healthcare/cancer-incidence.json';
import cancerBySexData from '@/data/demo-gallery/healthcare/cancer-by-sex.json';
import cancerMortalityData from '@/data/demo-gallery/healthcare/cancer-mortality.json';
import cancerTrendsData from '@/data/demo-gallery/healthcare/cancer-trends.json';
import healthcareWorkersData from '@/data/demo-gallery/healthcare/healthcare-workers.json';
import screeningRatesData from '@/data/demo-gallery/healthcare/screening-rates.json';
import survivalRatesData from '@/data/demo-gallery/healthcare/survival-rates.json';

// Import all data files - Economy
import gdpGrowthData from '@/data/demo-gallery/economy/gdp-growth.json';
import inflationData from '@/data/demo-gallery/economy/inflation.json';
import industrialProductionData from '@/data/demo-gallery/economy/industrial-production.json';
import wagesData from '@/data/demo-gallery/economy/wages.json';
import employmentData from '@/data/demo-gallery/economy/employment.json';

// Import all data files - Migration
import diasporaDestinationsData from '@/data/demo-gallery/migration/diaspora-destinations.json';
import migrationBalanceData from '@/data/demo-gallery/migration/migration-balance.json';
import immigrationTrendsData from '@/data/demo-gallery/migration/immigration-trends.json';
import emigrationTrendsData from '@/data/demo-gallery/migration/emigration-trends.json';

// Import all data files - Society
import educationLevelsData from '@/data/demo-gallery/society/education-levels.json';
import tourismData from '@/data/demo-gallery/society/tourism.json';
import crimeStatisticsData from '@/data/demo-gallery/society/crime-statistics.json';
import vitalStatisticsData from '@/data/demo-gallery/society/vital-statistics.json';
import labourMarketData from '@/data/demo-gallery/society/labour-market.json';
import regionalDisparitiesData from '@/data/demo-gallery/society/regional-disparities.json';

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
  }));

  const measureMeta = measures.map((key) => {
    const values = data.map((d) => Number(d[key])).filter((v) => !isNaN(v));
    return {
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      min: Math.min(...values),
      max: Math.max(...values),
      hasNulls: data.some((d) => d[key] === null || d[key] === undefined),
    };
  });

  return {
    observations: data.map((d) => ({ ...d })) as Observation[],
    dimensions: dimensionMeta,
    measures: measureMeta,
    metadataColumns: [],
    columns: [...dimensions, ...measures],
    rowCount: data.length,
    source: { format: 'json', name: sourceName },
  };
}

// Helper to extract data array from imported JSON
const getData = (json: { data: Record<string, unknown>[] }) => json.data;

/**
 * All 28 demo gallery examples organized by category
 */
export const demoGalleryExamples: FeaturedExampleConfig[] = [
  // ============================================
  // DEMOGRAPHICS (6 charts)
  // ============================================
  {
    id: 'demo-population-pyramid',
    title: {
      sr: 'Пирамида старости Србије',
      lat: 'Piramida starosti Srbije',
      en: 'Serbia Population Pyramid',
    },
    description: {
      sr: 'Расподела становништва по старосним групама и полу',
      lat: 'Raspodela stanovništva po starosnim grupama i polu',
      en: 'Population distribution by age groups and gender',
    },
    datasetId: 'demo-population-pyramid',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Population Pyramid',
      x_axis: { field: 'male', type: 'linear', label: 'Population' },
      y_axis: { field: 'ageGroup', type: 'category', label: 'Age Group' },
      options: {
        showGrid: true,
        showLegend: true,
        grouping: 'grouped',
        colors: ['#4B90F5', '#EC4899'],
      },
    },
    inlineData: toParsedDataset(
      getData(populationPyramidData),
      ['ageGroup'],
      ['male', 'female'],
      'Population Pyramid'
    ),
    category: 'demographics',
    tags: ['population', 'demographics', 'age', 'gender'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'demo-birth-rates',
    title: {
      sr: 'Стопа наталитета',
      lat: 'Stopa nataliteta',
      en: 'Birth Rate Trend',
    },
    description: {
      sr: 'Промена стопе наталитета од 1950. године',
      lat: 'Promena stope nataliteta od 1950. godine',
      en: 'Birth rate changes since 1950',
    },
    datasetId: 'demo-birth-rates',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'Birth Rate Trend',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'rate', type: 'linear', label: 'Rate (per 1000)' },
      options: {
        showGrid: true,
        showLegend: false,
        curveType: 'monotone',
        showDots: true,
        colors: ['#0D4077'],
      },
    },
    inlineData: toParsedDataset(
      getData(birthRatesData),
      ['year'],
      ['rate'],
      'Birth Rates'
    ),
    category: 'demographics',
    tags: ['births', 'demographics', 'trend'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'demo-fertility-rates',
    title: {
      sr: 'Укупна стопа фертилности',
      lat: 'Ukupna stopa fertiliteta',
      en: 'Total Fertility Rate',
    },
    description: {
      sr: 'Поређење са нивоом замене популације',
      lat: 'Poređenje sa nivoom zamene populacije',
      en: 'Comparison with replacement level',
    },
    datasetId: 'demo-fertility-rates',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'Total Fertility Rate',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'fertility', type: 'linear', label: 'Fertility Rate' },
      options: {
        showGrid: true,
        showLegend: true,
        curveType: 'monotone',
        showDots: true,
        colors: ['#0D4077', '#C6363C'],
      },
    },
    inlineData: toParsedDataset(
      getData(fertilityRatesData),
      ['year'],
      ['fertility', 'replacement'],
      'Fertility Rates'
    ),
    category: 'demographics',
    tags: ['fertility', 'demographics', 'replacement'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'demo-natural-change',
    title: {
      sr: 'Природни прираштај',
      lat: 'Prirodni priraštaj',
      en: 'Natural Population Change',
    },
    description: {
      sr: 'Број рођених и умрлих по годинама',
      lat: 'Broj rođenih i umrlih po godinama',
      en: 'Number of births and deaths by year',
    },
    datasetId: 'demo-natural-change',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Natural Population Change',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'births', type: 'linear', label: 'Count' },
      options: {
        showGrid: true,
        showLegend: true,
        grouping: 'grouped',
        colors: ['#10B981', '#C6363C'],
      },
    },
    inlineData: toParsedDataset(
      getData(naturalChangeData),
      ['year'],
      ['births', 'deaths'],
      'Natural Change'
    ),
    category: 'demographics',
    tags: ['births', 'deaths', 'demographics'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'demo-population-decline',
    title: {
      sr: 'Опадање популације',
      lat: 'Opadanje populacije',
      en: 'Population Decline',
    },
    description: {
      sr: 'Смањење броја становника од 1991. године',
      lat: 'Smanjenje broja stanovnika od 1991. godine',
      en: 'Population decrease since 1991',
    },
    datasetId: 'demo-population-decline',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'Population Decline',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'population', type: 'linear', label: 'Population' },
      options: {
        showGrid: true,
        showLegend: false,
        curveType: 'monotone',
        showDots: true,
        colors: ['#0D4077'],
      },
    },
    inlineData: toParsedDataset(
      getData(populationDeclineData),
      ['year'],
      ['population'],
      'Population Decline'
    ),
    category: 'demographics',
    tags: ['population', 'demographics', 'decline'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'demo-age-distribution',
    title: {
      sr: 'Расподела по старости',
      lat: 'Raspodela po starosti',
      en: 'Age Distribution',
    },
    description: {
      sr: 'Процентуална расподела по старосним групама',
      lat: 'Procentualna raspodela po starosnim grupama',
      en: 'Percentage distribution by age groups',
    },
    datasetId: 'demo-age-distribution',
    resourceUrl: '',
    chartConfig: {
      type: 'pie',
      title: 'Age Distribution',
      x_axis: { field: 'ageGroup', type: 'category' },
      y_axis: { field: 'percentage', type: 'linear' },
      options: {
        showLegend: true,
        showLabels: true,
        showPercentages: true,
        colors: ['#0D4077', '#4B90F5', '#3558A2', '#C6363C', '#10B981'],
      },
    },
    inlineData: toParsedDataset(
      getData(ageDistributionData),
      ['ageGroup'],
      ['percentage'],
      'Age Distribution'
    ),
    category: 'demographics',
    tags: ['age', 'demographics', 'distribution'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-15',
  },

  // ============================================
  // HEALTHCARE (7 charts)
  // ============================================
  {
    id: 'demo-cancer-incidence',
    title: {
      sr: 'Инциденца рака',
      lat: 'Incidencija raka',
      en: 'Cancer Incidence',
    },
    description: {
      sr: 'Најчешће врсте рака у Србији',
      lat: 'Najčešće vrste raka u Srbiji',
      en: 'Most common cancer types in Serbia',
    },
    datasetId: 'demo-cancer-incidence',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Cancer Incidence',
      x_axis: { field: 'type', type: 'category', label: 'Cancer Type' },
      y_axis: { field: 'cases', type: 'linear', label: 'Cases' },
      options: {
        showGrid: true,
        showLegend: false,
        colors: ['#0D4077'],
      },
    },
    inlineData: toParsedDataset(
      getData(cancerIncidenceData),
      ['type'],
      ['cases'],
      'Cancer Incidence'
    ),
    category: 'healthcare',
    tags: ['cancer', 'healthcare', 'incidence'],
    dataSource: 'Institute of Public Health of Serbia',
    lastUpdated: '2023-12-01',
  },
  {
    id: 'demo-cancer-by-sex',
    title: {
      sr: 'Рак по полу',
      lat: 'Rak po polu',
      en: 'Cancer by Sex',
    },
    description: {
      sr: 'Поређење инциденце између мушкараца и жена',
      lat: 'Poređenje incidencije između muškaraca i žena',
      en: 'Comparison of incidence between males and females',
    },
    datasetId: 'demo-cancer-by-sex',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Cancer by Sex',
      x_axis: { field: 'type', type: 'category', label: 'Cancer Type' },
      y_axis: { field: 'male', type: 'linear', label: 'Cases' },
      options: {
        showGrid: true,
        showLegend: true,
        grouping: 'grouped',
        colors: ['#4B90F5', '#EC4899'],
      },
    },
    inlineData: toParsedDataset(
      getData(cancerBySexData),
      ['type'],
      ['male', 'female'],
      'Cancer by Sex'
    ),
    category: 'healthcare',
    tags: ['cancer', 'healthcare', 'gender'],
    dataSource: 'Institute of Public Health of Serbia',
    lastUpdated: '2023-12-01',
  },
  {
    id: 'demo-cancer-mortality',
    title: {
      sr: 'Морталитет од рака',
      lat: 'Mortalitet od raka',
      en: 'Cancer Mortality',
    },
    description: {
      sr: 'Стопа смртности по врстама рака',
      lat: 'Stopa smrtnosti po vrstama raka',
      en: 'Mortality rate by cancer type',
    },
    datasetId: 'demo-cancer-mortality',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Cancer Mortality',
      x_axis: { field: 'type', type: 'category', label: 'Cancer Type' },
      y_axis: { field: 'mortality', type: 'linear', label: 'Mortality Rate' },
      options: {
        showGrid: true,
        showLegend: false,
        colors: ['#C6363C'],
      },
    },
    inlineData: toParsedDataset(
      getData(cancerMortalityData),
      ['type'],
      ['mortality'],
      'Cancer Mortality'
    ),
    category: 'healthcare',
    tags: ['cancer', 'healthcare', 'mortality'],
    dataSource: 'Institute of Public Health of Serbia',
    lastUpdated: '2023-12-01',
  },
  {
    id: 'demo-cancer-trends',
    title: {
      sr: 'Трендови рака',
      lat: 'Trendovi raka',
      en: 'Cancer Trends',
    },
    description: {
      sr: 'Промена стопе инциденце током времена',
      lat: 'Promena stope incidencije tokom vremena',
      en: 'Incidence rate changes over time',
    },
    datasetId: 'demo-cancer-trends',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'Cancer Trends',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'rate', type: 'linear', label: 'Incidence Rate' },
      options: {
        showGrid: true,
        showLegend: false,
        curveType: 'monotone',
        showDots: true,
        colors: ['#0D4077'],
      },
    },
    inlineData: toParsedDataset(
      getData(cancerTrendsData),
      ['year'],
      ['rate'],
      'Cancer Trends'
    ),
    category: 'healthcare',
    tags: ['cancer', 'healthcare', 'trends'],
    dataSource: 'Institute of Public Health of Serbia',
    lastUpdated: '2023-12-01',
  },
  {
    id: 'demo-healthcare-workers',
    title: {
      sr: 'Здравствени радници',
      lat: 'Zdravstveni radnici',
      en: 'Healthcare Workers',
    },
    description: {
      sr: 'Број здравствених радника по категоријама',
      lat: 'Broj zdravstvenih radnika po kategorijama',
      en: 'Number of healthcare workers by category',
    },
    datasetId: 'demo-healthcare-workers',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Healthcare Workers',
      x_axis: { field: 'type', type: 'category', label: 'Category' },
      y_axis: { field: 'count', type: 'linear', label: 'Count' },
      options: {
        showGrid: true,
        showLegend: false,
        colors: ['#10B981'],
      },
    },
    inlineData: toParsedDataset(
      getData(healthcareWorkersData),
      ['type'],
      ['count'],
      'Healthcare Workers'
    ),
    category: 'healthcare',
    tags: ['healthcare', 'workers', 'doctors', 'nurses'],
    dataSource: 'Ministry of Health of Serbia',
    lastUpdated: '2023-12-01',
  },
  {
    id: 'demo-screening-rates',
    title: {
      sr: 'Стопе скрининга',
      lat: 'Stope skrininga',
      en: 'Screening Rates',
    },
    description: {
      sr: 'Поређење Србије са ЕУ у скринингу',
      lat: 'Poređenje Srbije sa EU u skriningu',
      en: 'Serbia vs EU screening comparison',
    },
    datasetId: 'demo-screening-rates',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Screening Rates: Serbia vs EU',
      x_axis: { field: 'type', type: 'category', label: 'Screening Type' },
      y_axis: { field: 'serbia', type: 'linear', label: 'Rate (%)' },
      options: {
        showGrid: true,
        showLegend: true,
        grouping: 'grouped',
        colors: ['#0D4077', '#10B981'],
      },
    },
    inlineData: toParsedDataset(
      getData(screeningRatesData),
      ['type'],
      ['serbia', 'eu'],
      'Screening Rates'
    ),
    category: 'healthcare',
    tags: ['healthcare', 'screening', 'eu'],
    dataSource: 'WHO - World Health Organization',
    lastUpdated: '2023-12-01',
  },
  {
    id: 'demo-survival-rates',
    title: {
      sr: 'Стопе преживљавања',
      lat: 'Stope preživljavanja',
      en: 'Survival Rates',
    },
    description: {
      sr: 'Петогодишње стопе преживљавања',
      lat: 'Petogodišnje stope preživljavanja',
      en: '5-year survival rates comparison',
    },
    datasetId: 'demo-survival-rates',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: '5-Year Survival Rates: Serbia vs EU',
      x_axis: { field: 'cancer', type: 'category', label: 'Cancer Type' },
      y_axis: { field: 'serbia', type: 'linear', label: 'Survival Rate (%)' },
      options: {
        showGrid: true,
        showLegend: true,
        grouping: 'grouped',
        colors: ['#0D4077', '#10B981'],
      },
    },
    inlineData: toParsedDataset(
      getData(survivalRatesData),
      ['cancer'],
      ['serbia', 'eu'],
      'Survival Rates'
    ),
    category: 'healthcare',
    tags: ['healthcare', 'survival', 'cancer', 'eu'],
    dataSource: 'WHO - World Health Organization',
    lastUpdated: '2023-12-01',
  },

  // ============================================
  // ECONOMY (5 charts)
  // ============================================
  {
    id: 'demo-gdp-growth',
    title: {
      sr: 'Раст БДП',
      lat: 'Rast BDP',
      en: 'GDP Growth',
    },
    description: {
      sr: 'Годишња стопа раста бруто домаћег производа',
      lat: 'Godišnja stopa rasta bruto domaćeg proizvoda',
      en: 'Annual GDP growth rate',
    },
    datasetId: 'demo-gdp-growth',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'GDP Growth',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'gdp', type: 'linear', label: 'GDP Growth (%)' },
      options: {
        showGrid: true,
        showLegend: false,
        curveType: 'monotone',
        showDots: true,
        colors: ['#0D4077'],
      },
    },
    inlineData: toParsedDataset(
      getData(gdpGrowthData),
      ['year'],
      ['gdp'],
      'GDP Growth'
    ),
    category: 'economy',
    tags: ['economy', 'gdp', 'growth'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-02-01',
  },
  {
    id: 'demo-inflation',
    title: {
      sr: 'Инфлација',
      lat: 'Inflacija',
      en: 'Inflation Rate',
    },
    description: {
      sr: 'Поређење инфлације, раста и индустријске производње',
      lat: 'Poređenje inflacije, rasta i industrijske proizvodnje',
      en: 'Inflation, growth and industrial production comparison',
    },
    datasetId: 'demo-inflation',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'Inflation Rate',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'inflation', type: 'linear', label: 'Rate (%)' },
      options: {
        showGrid: true,
        showLegend: true,
        curveType: 'monotone',
        showDots: true,
        colors: ['#C6363C', '#0D4077'],
      },
    },
    inlineData: toParsedDataset(
      getData(inflationData),
      ['year'],
      ['inflation', 'gdp'],
      'Inflation'
    ),
    category: 'economy',
    tags: ['economy', 'inflation', 'prices'],
    dataSource: 'National Bank of Serbia',
    lastUpdated: '2024-02-01',
  },
  {
    id: 'demo-industrial-production',
    title: {
      sr: 'Индустријска производња',
      lat: 'Industrijska proizvodnja',
      en: 'Industrial Production',
    },
    description: {
      sr: 'Годишња стопа раста индустријске производње',
      lat: 'Godišnja stopa rasta industrijske proizvodnje',
      en: 'Annual industrial production growth rate',
    },
    datasetId: 'demo-industrial-production',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'Industrial Production',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'industrial', type: 'linear', label: 'Growth (%)' },
      options: {
        showGrid: true,
        showLegend: false,
        curveType: 'monotone',
        showDots: true,
        colors: ['#F59E0B'],
      },
    },
    inlineData: toParsedDataset(
      getData(industrialProductionData),
      ['year'],
      ['industrial'],
      'Industrial Production'
    ),
    category: 'economy',
    tags: ['economy', 'industry', 'production'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-02-01',
  },
  {
    id: 'demo-wages',
    title: {
      sr: 'Просечне зараде',
      lat: 'Prosečne zarade',
      en: 'Average Wages',
    },
    description: {
      sr: 'Просечна нето зарада у динарима',
      lat: 'Prosečna neto zarada u dinarima',
      en: 'Average net salary in dinars',
    },
    datasetId: 'demo-wages',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Average Wages',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'salary', type: 'linear', label: 'Salary (RSD)' },
      options: {
        showGrid: true,
        showLegend: false,
        colors: ['#10B981'],
      },
    },
    inlineData: toParsedDataset(
      getData(wagesData),
      ['year'],
      ['salary'],
      'Wages'
    ),
    category: 'economy',
    tags: ['economy', 'wages', 'salary'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-02-01',
  },
  {
    id: 'demo-employment',
    title: {
      sr: 'Запосленост',
      lat: 'Zaposlenost',
      en: 'Employment Rate',
    },
    description: {
      sr: 'Стопа незапослености и запослености',
      lat: 'Stopa nezaposlenosti i zaposlenosti',
      en: 'Unemployment and employment rates',
    },
    datasetId: 'demo-employment',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'Employment Rate',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'unemployment', type: 'linear', label: 'Rate (%)' },
      options: {
        showGrid: true,
        showLegend: true,
        curveType: 'monotone',
        showDots: true,
        colors: ['#C6363C', '#10B981'],
      },
    },
    inlineData: toParsedDataset(
      getData(employmentData),
      ['year'],
      ['unemployment', 'employment'],
      'Employment'
    ),
    category: 'economy',
    tags: ['economy', 'employment', 'unemployment'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-02-01',
  },

  // ============================================
  // MIGRATION (4 charts)
  // ============================================
  {
    id: 'demo-diaspora-destinations',
    title: {
      sr: 'Дестинације дијаспоре',
      lat: 'Destinacije dijaspore',
      en: 'Diaspora Destinations',
    },
    description: {
      sr: 'Најпопуларније дестинације српске дијаспоре',
      lat: 'Najpopularnije destinacije srpske dijaspore',
      en: 'Most popular destinations of Serbian diaspora',
    },
    datasetId: 'demo-diaspora-destinations',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Diaspora Destinations',
      x_axis: { field: 'country', type: 'category', label: 'Country' },
      y_axis: { field: 'population', type: 'linear', label: 'Population' },
      options: {
        showGrid: true,
        showLegend: false,
        colors: ['#0D4077'],
      },
    },
    inlineData: toParsedDataset(
      getData(diasporaDestinationsData),
      ['country'],
      ['population'],
      'Diaspora Destinations'
    ),
    category: 'migration',
    tags: ['diaspora', 'migration', 'destinations'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'demo-migration-balance',
    title: {
      sr: 'Миграциони биланс',
      lat: 'Migracioni bilans',
      en: 'Migration Balance',
    },
    description: {
      sr: 'Број имиграната и емиграната по годинама',
      lat: 'Broj imigranata i emigranata po godinama',
      en: 'Number of immigrants and emigrants by year',
    },
    datasetId: 'demo-migration-balance',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Migration Balance',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'immigrants', type: 'linear', label: 'Count' },
      options: {
        showGrid: true,
        showLegend: true,
        grouping: 'grouped',
        colors: ['#10B981', '#C6363C'],
      },
    },
    inlineData: toParsedDataset(
      getData(migrationBalanceData),
      ['year'],
      ['immigrants', 'emigrants'],
      'Migration Balance'
    ),
    category: 'migration',
    tags: ['migration', 'immigration', 'emigration'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'demo-immigration-trends',
    title: {
      sr: 'Трендови имиграције',
      lat: 'Trendovi imigracije',
      en: 'Immigration Trends',
    },
    description: {
      sr: 'Број људи који се селе у Србију',
      lat: 'Broj ljudi koji se sele u Srbiju',
      en: 'Number of people moving to Serbia',
    },
    datasetId: 'demo-immigration-trends',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'Immigration Trends',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'immigrants', type: 'linear', label: 'Immigrants' },
      options: {
        showGrid: true,
        showLegend: false,
        curveType: 'monotone',
        showDots: true,
        colors: ['#10B981'],
      },
    },
    inlineData: toParsedDataset(
      getData(immigrationTrendsData),
      ['year'],
      ['immigrants'],
      'Immigration Trends'
    ),
    category: 'migration',
    tags: ['migration', 'immigration', 'trends'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'demo-emigration-trends',
    title: {
      sr: 'Трендови емиграције',
      lat: 'Trendovi emigracije',
      en: 'Emigration Trends',
    },
    description: {
      sr: 'Број људи који напуштају Србију',
      lat: 'Broj ljudi koji napuštaju Srbiju',
      en: 'Number of people leaving Serbia',
    },
    datasetId: 'demo-emigration-trends',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'Emigration Trends',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'emigrants', type: 'linear', label: 'Emigrants' },
      options: {
        showGrid: true,
        showLegend: false,
        curveType: 'monotone',
        showDots: true,
        colors: ['#C6363C'],
      },
    },
    inlineData: toParsedDataset(
      getData(emigrationTrendsData),
      ['year'],
      ['emigrants'],
      'Emigration Trends'
    ),
    category: 'migration',
    tags: ['migration', 'emigration', 'trends'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-15',
  },

  // ============================================
  // SOCIETY (6 charts)
  // ============================================
  {
    id: 'demo-education-levels',
    title: {
      sr: 'Нивои образовања',
      lat: 'Nivoi obrazovanja',
      en: 'Education Levels',
    },
    description: {
      sr: 'Број ученика и студената по нивоима образовања',
      lat: 'Broj učenika i studenata po nivoima obrazovanja',
      en: 'Number of students by education level',
    },
    datasetId: 'demo-education-levels',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Education Levels',
      x_axis: { field: 'level', type: 'category', label: 'Education Level' },
      y_axis: { field: 'students', type: 'linear', label: 'Students' },
      options: {
        showGrid: true,
        showLegend: false,
        colors: ['#4B90F5'],
      },
    },
    inlineData: toParsedDataset(
      getData(educationLevelsData),
      ['level'],
      ['students'],
      'Education Levels'
    ),
    category: 'society',
    tags: ['education', 'students', 'society'],
    dataSource: 'Ministry of Education of Serbia',
    lastUpdated: '2024-01-01',
  },
  {
    id: 'demo-tourism',
    title: {
      sr: 'Туризам',
      lat: 'Turizam',
      en: 'Tourism',
    },
    description: {
      sr: 'Број туриста по месецима 2023-2024',
      lat: 'Broj turista po mesecima 2023-2024',
      en: 'Number of tourists by month 2023-2024',
    },
    datasetId: 'demo-tourism',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'Tourism',
      x_axis: { field: 'month', type: 'category', label: 'Month' },
      y_axis: { field: 'tourists2024', type: 'linear', label: 'Tourists' },
      options: {
        showGrid: true,
        showLegend: true,
        curveType: 'monotone',
        showDots: true,
        colors: ['#0D4077', '#10B981'],
      },
    },
    inlineData: toParsedDataset(
      getData(tourismData),
      ['month'],
      ['tourists2024', 'tourists2023'],
      'Tourism'
    ),
    category: 'society',
    tags: ['tourism', 'society', 'travel'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-01',
  },
  {
    id: 'demo-crime-statistics',
    title: {
      sr: 'Криминална статистика',
      lat: 'Kriminalna statistika',
      en: 'Crime Statistics',
    },
    description: {
      sr: 'Број кривичних дела по врстама',
      lat: 'Broj krivičnih dela po vrstama',
      en: 'Number of criminal offenses by type',
    },
    datasetId: 'demo-crime-statistics',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Crime Statistics',
      x_axis: { field: 'type', type: 'category', label: 'Crime Type' },
      y_axis: { field: 'cases', type: 'linear', label: 'Cases' },
      options: {
        showGrid: true,
        showLegend: false,
        colors: ['#C6363C'],
      },
    },
    inlineData: toParsedDataset(
      getData(crimeStatisticsData),
      ['type'],
      ['cases'],
      'Crime Statistics'
    ),
    category: 'society',
    tags: ['crime', 'society', 'safety'],
    dataSource: 'Ministry of Interior of Serbia',
    lastUpdated: '2024-01-01',
  },
  {
    id: 'demo-vital-statistics',
    title: {
      sr: 'Витална статистика',
      lat: 'Vitalna statistika',
      en: 'Vital Statistics',
    },
    description: {
      sr: 'Број рођених и умрлих по годинама',
      lat: 'Broj rođenih i umrlih po godinama',
      en: 'Number of births and deaths by year',
    },
    datasetId: 'demo-vital-statistics',
    resourceUrl: '',
    chartConfig: {
      type: 'line',
      title: 'Vital Statistics',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'births', type: 'linear', label: 'Count' },
      options: {
        showGrid: true,
        showLegend: true,
        curveType: 'monotone',
        showDots: true,
        colors: ['#10B981', '#C6363C'],
      },
    },
    inlineData: toParsedDataset(
      getData(vitalStatisticsData),
      ['year'],
      ['births', 'deaths'],
      'Vital Statistics'
    ),
    category: 'society',
    tags: ['vital', 'births', 'deaths', 'society'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-01',
  },
  {
    id: 'demo-labour-market',
    title: {
      sr: 'Тржиште рада',
      lat: 'Tržište rada',
      en: 'Labour Market',
    },
    description: {
      sr: 'Незапосленост, запосленост и зараде',
      lat: 'Nezaposlenost, zaposlenost i zarade',
      en: 'Unemployment, employment and wages',
    },
    datasetId: 'demo-labour-market',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Labour Market',
      x_axis: { field: 'year', type: 'linear', label: 'Year' },
      y_axis: { field: 'salary', type: 'linear', label: 'Salary (RSD)' },
      options: {
        showGrid: true,
        showLegend: false,
        colors: ['#10B981'],
      },
    },
    inlineData: toParsedDataset(
      getData(labourMarketData),
      ['year'],
      ['salary'],
      'Labour Market'
    ),
    category: 'society',
    tags: ['labour', 'employment', 'wages', 'society'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-01',
  },
  {
    id: 'demo-regional-disparities',
    title: {
      sr: 'Регионалне разлике',
      lat: 'Regionalne razlike',
      en: 'Regional Disparities',
    },
    description: {
      sr: 'БДП по глави становника по регионима',
      lat: 'BDP po glavi stanovnika po regionima',
      en: 'GDP per capita by region',
    },
    datasetId: 'demo-regional-disparities',
    resourceUrl: '',
    chartConfig: {
      type: 'bar',
      title: 'Regional Disparities',
      x_axis: { field: 'region', type: 'category', label: 'Region' },
      y_axis: {
        field: 'gdpPerCapita',
        type: 'linear',
        label: 'GDP per Capita (EUR)',
      },
      options: {
        showGrid: true,
        showLegend: false,
        colors: ['#0D4077'],
      },
    },
    inlineData: toParsedDataset(
      getData(regionalDisparitiesData),
      ['region'],
      ['gdpPerCapita'],
      'Regional Disparities'
    ),
    category: 'society',
    tags: ['regions', 'gdp', 'disparities', 'society'],
    dataSource: 'SORS - Statistical Office of the Republic of Serbia',
    lastUpdated: '2024-01-01',
  },
];

/**
 * Get demo examples by category
 */
export function getDemoExamplesByCategory(
  category: ShowcaseCategory
): FeaturedExampleConfig[] {
  return demoGalleryExamples.filter((ex) => ex.category === category);
}

/**
 * Get demo example by ID
 */
export function getDemoExampleById(
  id: string
): FeaturedExampleConfig | undefined {
  return demoGalleryExamples.find((ex) => ex.id === id);
}

/**
 * Get count of examples per category
 */
export function getDemoExampleCount(): Record<ShowcaseCategory, number> {
  return {
    demographics: demoGalleryExamples.filter(
      (ex) => ex.category === 'demographics'
    ).length,
    healthcare: demoGalleryExamples.filter((ex) => ex.category === 'healthcare')
      .length,
    economy: demoGalleryExamples.filter((ex) => ex.category === 'economy')
      .length,
    migration: demoGalleryExamples.filter((ex) => ex.category === 'migration')
      .length,
    society: demoGalleryExamples.filter((ex) => ex.category === 'society')
      .length,
  };
}
