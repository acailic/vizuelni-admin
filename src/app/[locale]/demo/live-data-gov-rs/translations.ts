import type { Locale } from '@/lib/i18n/config';

/**
 * Dataset preset type for the live data demo
 */
export interface DatasetPreset {
  id: string;
  datasetId: string;
  title: string;
  description: string;
  csvUrl: string;
  recommendedChart: 'line' | 'bar' | 'multi-line';
  category: 'finance' | 'education' | 'environment';
}

/**
 * All translations for the live data demo page
 */
export interface DemoTranslations {
  // Page header
  title: string;
  subtitle: string;
  // Panel titles
  panelDatasetPicker: string;
  panelMetadata: string;
  panelRawPreview: string;
  panelSchema: string;
  panelChartOutput: string;
  panelCode: string;
  // Dataset presets
  presetsTitle: string;
  presetsDescription: string;
  presetFinanceTitle: string;
  presetFinanceDescription: string;
  presetEducationTitle: string;
  presetEducationDescription: string;
  presetEnvironmentTitle: string;
  presetEnvironmentDescription: string;
  recommendedChart: string;
  chartTypeLine: string;
  chartTypeBar: string;
  chartTypeMultiLine: string;
  // Metadata panel
  metadataSelectedDataset: string;
  metadataId: string;
  metadataFormat: string;
  metadataSource: string;
  metadataOrganization: string;
  metadataLastUpdated: string;
  metadataNotAvailable: string;
  metadataViewOnDataGov: string;
  metadataNoSelection: string;
  metadataNoSelectionHint: string;
  // Raw Preview panel
  rawPreviewDelimiter: string;
  rawPreviewResourceHost: string;
  rawPreviewRowCount: string;
  rawPreviewHeaders: string;
  rawPreviewNoSelection: string;
  rawPreviewLoading: string;
  rawPreviewError: string;
  rawPreviewCorsError: string;
  // Schema panel
  schemaDimensions: string;
  schemaMeasures: string;
  schemaTimeField: string;
  schemaGeoField: string;
  schemaWarnings: string;
  schemaNoSelection: string;
  schemaLoading: string;
  schemaNoData: string;
  schemaDetectedColumns: string;
  // Placeholder content
  placeholderRawPreview: string;
  placeholderSchema: string;
  placeholderChartOutput: string;
  placeholderCode: string;
  // Chart Output Panel
  chartRecommendationLine: string;
  chartRecommendationBar: string;
  chartRecommendationMultiLine: string;
  chartAlternativeCharts: string;
  chartNoData: string;
  chartNoSelection: string;
  chartRenderError: string;
  // Code Panel
  codeCopyButton: string;
  codeCopied: string;
  codeTitle: string;
  codeDescription: string;
  codeNoData: string;
  codeNoSelection: string;
  // Schema warnings
  schemaWarningNoNumeric: string;
  schemaWarningManyColumns: string;
  schemaWarningYearNotRecognized: string;
  // Raw Preview row count message
  rawPreviewShowingRows: string;
  // Fallback Banner
  fallbackBannerTitle: string;
  fallbackBannerMessage: string;
  fallbackBannerDate: string;
}

/**
 * Dataset presets - same data for all locales
 */
export const DATASET_PRESETS: DatasetPreset[] = [
  {
    id: 'public-finance',
    datasetId: '66d3e76c2fed9a9923960b61',
    title: '17.1.2 Удео националног буџета који се финансира из домаћих пореза',
    description: 'National budget share financed from domestic taxes',
    csvUrl:
      'https://opendata.stat.gov.rs/data/WcfJsonRestService.Service1.svc/datasetsdg/170102IND01/1/csv',
    recommendedChart: 'line',
    category: 'finance',
  },
  {
    id: 'education-comparison',
    datasetId: '664e02e064ae5cf0d72f30b1',
    title: 'МОЈА СРЕДЊА ШКОЛА',
    description: 'My high school - education data',
    csvUrl:
      'https://data.gov.rs/s/resources/moja-srednja-shkola/20250922-114526/moja-srednja-skola.csv',
    recommendedChart: 'bar',
    category: 'education',
  },
  {
    id: 'environmental-time-series',
    datasetId: '62bdbf547de272b6317a65ce',
    title: 'Подаци о квалитету ваздуха на територији града Панчева',
    description: 'Air quality data for Pančevo city',
    csvUrl:
      'https://data.gov.rs/s/resources/podatsi-o-kvalitetu-vazdukha-na-teritoriji-grada-pancheva/20220630-172101/pancevo-zelenog-ruzmarina-2022.csv',
    recommendedChart: 'multi-line',
    category: 'environment',
  },
];

/**
 * Get all translations for the demo page based on locale
 */
export function getDemoTranslations(locale: Locale): DemoTranslations {
  switch (locale) {
    case 'sr-Cyrl':
      return {
        // Page header
        title: 'Жива веза са data.gov.rs',
        subtitle:
          'Погледајте како претворити скуп података са data.gov.rs у интерактивну визуелизацију',
        // Panel titles
        panelDatasetPicker: 'Изаберите скуп података',
        panelMetadata: 'Метаподаци скупа података',
        panelRawPreview: 'Сирови приказ података',
        panelSchema: 'Парсирани опис података',
        panelChartOutput: 'Излаз графикона',
        panelCode: 'Копирај код',
        // Dataset presets
        presetsTitle: 'Доступни скупови података',
        presetsDescription:
          'Изаберите један од Verified dataset-а за демо, или унесите сопствени URL',
        presetFinanceTitle: 'Јавне финансије',
        presetFinanceDescription: 'Временска серија удела буџета из домаћих пореза',
        presetEducationTitle: 'Образовање',
        presetEducationDescription: 'Подаци о средњим школама у Србији',
        presetEnvironmentTitle: 'Животна средина',
        presetEnvironmentDescription: 'Квалитет ваздуха у Панчеву',
        recommendedChart: 'Препоручени графикон',
        chartTypeLine: 'Линијски графикон',
        chartTypeBar: 'Стубасти графикон',
        chartTypeMultiLine: 'Вишелинијски графикон',
        // Metadata panel
        metadataSelectedDataset: 'Изабрани скуп података',
        metadataId: 'ИД скупа',
        metadataFormat: 'Формат',
        metadataSource: 'Извор',
        metadataOrganization: 'Организација',
        metadataLastUpdated: 'Последње ажурирање',
        metadataNotAvailable: 'Није доступно',
        metadataViewOnDataGov: 'Погледај на data.gov.rs',
        metadataNoSelection: 'Није изабран скуп података',
        metadataNoSelectionHint: 'Кликните на једну од картица изнад да бисте изабрали скуп података.',
        // Raw Preview panel
        rawPreviewDelimiter: 'Раздвојник',
        rawPreviewResourceHost: 'Домаћин ресурса',
        rawPreviewRowCount: 'Број редова (узорак)',
        rawPreviewHeaders: 'Заглавља',
        rawPreviewNoSelection: 'Није изабран скуп података',
        rawPreviewLoading: 'Учитавање података...',
        rawPreviewError: 'Грешка при учитавању података',
        rawPreviewCorsError: 'CORS грешка: Ресурс не дозвољава приступ из прегледача. Покушајте директно преузимање.',
        // Schema panel
        schemaDimensions: 'Димензије',
        schemaMeasures: 'Мере',
        schemaTimeField: 'Временско поље',
        schemaGeoField: 'Географско поље',
        schemaWarnings: 'Упозорења',
        schemaNoSelection: 'Није изабран скуп података',
        schemaLoading: 'Анализа података...',
        schemaNoData: 'Нема података за анализу',
        schemaDetectedColumns: 'Откривене колоне',
        // Placeholder content
        placeholderRawPreview: 'Првих неколико редова CSV/JSON података ће бити приказано овде.',
        placeholderSchema: 'Аутоматски откривене колоне и типови података ће бити приказани овде.',
        placeholderChartOutput: 'Графикон генерисан из података ће бити приказан овде.',
        placeholderCode: 'Код за репликовање ове визуелизације ће бити доступан овде.',
        // Chart Output Panel
        chartRecommendationLine: 'Линијски графикон је препоручен за временске серије података.',
        chartRecommendationBar: 'Стубасти графикон је препоручен за категоричке податке.',
        chartRecommendationMultiLine: 'Вишелинијски графикон је препоручен за поређење више мера током времена.',
        chartAlternativeCharts: 'Алтернативе',
        chartNoData: 'Нема података за приказ графикона.',
        chartNoSelection: 'Није изабран скуп података.',
        chartRenderError: 'Грешка при приказу графикона.',
        // Code Panel
        codeCopyButton: 'Копирај код',
        codeCopied: 'Копирано!',
        codeTitle: 'Комплетан React код',
        codeDescription: 'Копирајте овај код у свој React пројекат да бисте добили исти графикон.',
        codeNoData: 'Нема података за генерисање кода.',
        codeNoSelection: 'Изаберите скуп података да бисте видели код.',
        // Schema warnings
        schemaWarningNoNumeric: 'Нема нумеричких колона - можда није погодно за графиконе',
        schemaWarningManyColumns: 'Много текстуалних колона - подаци можда захтевају филтрирање',
        schemaWarningYearNotRecognized: 'Откривена колона године, али није аутоматски препозната као временско поље',
        // Raw Preview row count message
        rawPreviewShowingRows: 'Приказује се 10 од {count} редова',
        // Fallback Banner
        fallbackBannerTitle: 'Приказују се архивирани подаци',
        fallbackBannerMessage: 'Жива веза са data.gov.rs није доступна. Приказују се архивирани подаци са',
        fallbackBannerDate: 'датума',
      };
    case 'sr-Latn':
      return {
        // Page header
        title: 'Živa veza sa data.gov.rs',
        subtitle:
          'Pogledajte kako pretvoriti skup podataka sa data.gov.rs u interaktivnu vizuelizaciju',
        // Panel titles
        panelDatasetPicker: 'Izaberite skup podataka',
        panelMetadata: 'Metapodaci skupa podataka',
        panelRawPreview: 'Sirovi prikaz podataka',
        panelSchema: 'Parsirani opis podataka',
        panelChartOutput: 'Izlaz grafikona',
        panelCode: 'Kopiraj kod',
        // Dataset presets
        presetsTitle: 'Dostupni skupovi podataka',
        presetsDescription:
          'Izaberite jedan od verifikovanih dataset-a za demo, ili unesite sopstveni URL',
        presetFinanceTitle: 'Javne finansije',
        presetFinanceDescription: 'Vremenska serija udela budžeta iz domaćih poreza',
        presetEducationTitle: 'Obrazovanje',
        presetEducationDescription: 'Podaci o srednjim školama u Srbiji',
        presetEnvironmentTitle: 'Životna sredina',
        presetEnvironmentDescription: 'Kvalitet vazduha u Pančevu',
        recommendedChart: 'Preporučeni grafikon',
        chartTypeLine: 'Linijski grafikon',
        chartTypeBar: 'Stubasti grafikon',
        chartTypeMultiLine: 'Višelinijski grafikon',
        // Metadata panel
        metadataSelectedDataset: 'Izabrani skup podataka',
        metadataId: 'ID skupa',
        metadataFormat: 'Format',
        metadataSource: 'Izvor',
        metadataOrganization: 'Organizacija',
        metadataLastUpdated: 'Poslednje ažuriranje',
        metadataNotAvailable: 'Nije dostupno',
        metadataViewOnDataGov: 'Pogledaj na data.gov.rs',
        metadataNoSelection: 'Nije izabran skup podataka',
        metadataNoSelectionHint: 'Kliknite na jednu od kartica iznad da biste izabrali skup podataka.',
        // Raw Preview panel
        rawPreviewDelimiter: 'Razdvojnik',
        rawPreviewResourceHost: 'Domaćin resursa',
        rawPreviewRowCount: 'Broj redova (uzorak)',
        rawPreviewHeaders: 'Zaglavlja',
        rawPreviewNoSelection: 'Nije izabran skup podataka',
        rawPreviewLoading: 'Učitavanje podataka...',
        rawPreviewError: 'Greška pri učitavanju podataka',
        rawPreviewCorsError: 'CORS greška: Resurs ne dozvoljava pristup iz pregledača. Pokušajte direktno preuzimanje.',
        // Schema panel
        schemaDimensions: 'Dimenzije',
        schemaMeasures: 'Mere',
        schemaTimeField: 'Vremensko polje',
        schemaGeoField: 'Geografsko polje',
        schemaWarnings: 'Upozorenja',
        schemaNoSelection: 'Nije izabran skup podataka',
        schemaLoading: 'Analiza podataka...',
        schemaNoData: 'Nema podataka za analizu',
        schemaDetectedColumns: 'Otkrivene kolone',
        // Placeholder content
        placeholderRawPreview: 'Prvih nekoliko redova CSV/JSON podataka će biti prikazano ovde.',
        placeholderSchema: 'Automatski otkrivene kolone i tipovi podataka će biti prikazani ovde.',
        placeholderChartOutput: 'Grafikon generisan iz podataka će biti prikazan ovde.',
        placeholderCode: 'Kod za replikovanje ove vizuelizacije će biti dostupan ovde.',
        // Chart Output Panel
        chartRecommendationLine: 'Linijski grafikon je preporučen za vremenske serije podataka.',
        chartRecommendationBar: 'Stubasti grafikon je preporučen za kategoričke podatke.',
        chartRecommendationMultiLine: 'Višelinijski grafikon je preporučen za poređenje više mera tokom vremena.',
        chartAlternativeCharts: 'Alternative',
        chartNoData: 'Nema podataka za prikaz grafikona.',
        chartNoSelection: 'Nije izabran skup podataka.',
        chartRenderError: 'Greška pri prikazu grafikona.',
        // Code Panel
        codeCopyButton: 'Kopiraj kod',
        codeCopied: 'Kopirano!',
        codeTitle: 'Kompletan React kod',
        codeDescription: 'Kopirajte ovaj kod u svoj React projekat da biste dobili isti grafikon.',
        codeNoData: 'Nema podataka za generisanje koda.',
        codeNoSelection: 'Izaberite skup podataka da biste videli kod.',
        // Schema warnings
        schemaWarningNoNumeric: 'Nema numeričkih kolona - možda nije pogodno za grafikone',
        schemaWarningManyColumns: 'Mnogo tekstualnih kolona - podaci možda zahtevaju filtriranje',
        schemaWarningYearNotRecognized: 'Otkrivena kolona godine, ali nije automatski prepoznata kao vremensko polje',
        // Raw Preview row count message
        rawPreviewShowingRows: 'Prikazuje se 10 od {count} redova',
        // Fallback Banner
        fallbackBannerTitle: 'Prikazuju se arhivirani podaci',
        fallbackBannerMessage: 'Živa veza sa data.gov.rs nije dostupna. Prikazuju se arhivirani podaci sa',
        fallbackBannerDate: 'datuma',
      };
    default:
      return {
        // Page header
        title: 'Live Data.gov.rs Demo',
        subtitle:
          'See how to transform a dataset from data.gov.rs into an interactive visualization',
        // Panel titles
        panelDatasetPicker: 'Select Dataset',
        panelMetadata: 'Dataset Metadata',
        panelRawPreview: 'Raw Data Preview',
        panelSchema: 'Parsed Data Schema',
        panelChartOutput: 'Chart Output',
        panelCode: 'Copy Code',
        // Dataset presets
        presetsTitle: 'Available Datasets',
        presetsDescription: 'Select one of the verified datasets for the demo, or enter your own URL',
        presetFinanceTitle: 'Public Finance',
        presetFinanceDescription: 'Time series of budget share from domestic taxes',
        presetEducationTitle: 'Education',
        presetEducationDescription: 'High school data in Serbia',
        presetEnvironmentTitle: 'Environment',
        presetEnvironmentDescription: 'Air quality in Pančevo',
        recommendedChart: 'Recommended chart',
        chartTypeLine: 'Line chart',
        chartTypeBar: 'Bar chart',
        chartTypeMultiLine: 'Multi-line chart',
        // Metadata panel
        metadataSelectedDataset: 'Selected Dataset',
        metadataId: 'Dataset ID',
        metadataFormat: 'Format',
        metadataSource: 'Source',
        metadataOrganization: 'Organization',
        metadataLastUpdated: 'Last Updated',
        metadataNotAvailable: 'Not available',
        metadataViewOnDataGov: 'View on data.gov.rs',
        metadataNoSelection: 'No dataset selected',
        metadataNoSelectionHint: 'Click on one of the cards above to select a dataset.',
        // Raw Preview panel
        rawPreviewDelimiter: 'Delimiter',
        rawPreviewResourceHost: 'Resource Host',
        rawPreviewRowCount: 'Row Count (sample)',
        rawPreviewHeaders: 'Headers',
        rawPreviewNoSelection: 'No dataset selected',
        rawPreviewLoading: 'Loading data...',
        rawPreviewError: 'Error loading data',
        rawPreviewCorsError: 'CORS error: Resource does not allow browser access. Try direct download.',
        // Schema panel
        schemaDimensions: 'Dimensions',
        schemaMeasures: 'Measures',
        schemaTimeField: 'Time Field',
        schemaGeoField: 'Geo Field',
        schemaWarnings: 'Warnings',
        schemaNoSelection: 'No dataset selected',
        schemaLoading: 'Analyzing data...',
        schemaNoData: 'No data to analyze',
        schemaDetectedColumns: 'Detected Columns',
        // Placeholder content
        placeholderRawPreview: 'The first few rows of CSV/JSON data will be displayed here.',
        placeholderSchema: 'Automatically detected columns and data types will be shown here.',
        placeholderChartOutput: 'A chart generated from the data will be rendered here.',
        placeholderCode: 'Code to replicate this visualization will be available here.',
        // Chart Output Panel
        chartRecommendationLine: 'Line chart is recommended for time series data.',
        chartRecommendationBar: 'Bar chart is recommended for categorical data.',
        chartRecommendationMultiLine: 'Multi-line chart is recommended for comparing multiple measures over time.',
        chartAlternativeCharts: 'Alternatives',
        chartNoData: 'No data available to render chart.',
        chartNoSelection: 'No dataset selected.',
        chartRenderError: 'Error rendering chart.',
        // Code Panel
        codeCopyButton: 'Copy Code',
        codeCopied: 'Copied!',
        codeTitle: 'Complete React Code',
        codeDescription: 'Copy this code into your React project to get the same chart.',
        codeNoData: 'No data available to generate code.',
        codeNoSelection: 'Select a dataset to see the code.',
        // Schema warnings
        schemaWarningNoNumeric: 'No numeric columns detected - may not be suitable for charts',
        schemaWarningManyColumns: 'Many text columns detected - data may need filtering',
        schemaWarningYearNotRecognized: 'Year column detected but not auto-recognized as time field',
        // Raw Preview row count message
        rawPreviewShowingRows: 'Showing 10 of {count} rows',
        // Fallback Banner
        fallbackBannerTitle: 'Showing Archived Data',
        fallbackBannerMessage: 'Live connection to data.gov.rs is unavailable. Showing archived data from',
        fallbackBannerDate: 'date',
      };
  }
}

/**
 * Get localized preset labels (category names and descriptions)
 */
export function getPresetLabels(
  preset: DatasetPreset,
  translations: DemoTranslations
): { categoryLabel: string; categoryDescription: string } {
  switch (preset.category) {
    case 'finance':
      return {
        categoryLabel: translations.presetFinanceTitle,
        categoryDescription: translations.presetFinanceDescription,
      };
    case 'education':
      return {
        categoryLabel: translations.presetEducationTitle,
        categoryDescription: translations.presetEducationDescription,
      };
    case 'environment':
      return {
        categoryLabel: translations.presetEnvironmentTitle,
        categoryDescription: translations.presetEnvironmentDescription,
      };
    default:
      return {
        categoryLabel: preset.category,
        categoryDescription: preset.description,
      };
  }
}

/**
 * Get localized chart type label
 */
export function getChartTypeLabel(
  chartType: DatasetPreset['recommendedChart'],
  translations: DemoTranslations
): string {
  switch (chartType) {
    case 'line':
      return translations.chartTypeLine;
    case 'bar':
      return translations.chartTypeBar;
    case 'multi-line':
      return translations.chartTypeMultiLine;
    default:
      return chartType;
  }
}
