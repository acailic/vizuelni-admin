import type {
  FeaturedExampleConfig,
  ShowcaseCategory,
} from '@/lib/examples/types';
import { getLocalizedText } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';

export type GallerySortOption =
  | 'recommended'
  | 'newest'
  | 'popular'
  | 'alphabetical';

export type GalleryPanel = 'overview' | 'data' | 'code';

export interface DerivedVisualizationMeta {
  chartTypeLabel: string;
  sourceBadge: string;
  sourceLabel: string;
  sourceIcon: string;
  reliabilityLabel: string;
  timeRangeLabel: string;
  freshnessLabel: string;
  insightSubtitle: string;
  popularityScore: number;
  featuredRank: number;
  dataSourceUrl?: string;
  resourceUrl?: string;
}

const FEATURED_ORDER = [
  'demo-population-pyramid',
  'demo-birth-rates',
  'demo-budget-execution',
  'demo-cancer-trends',
  'demo-fdi-inflows',
];

const INSIGHT_OVERRIDES: Record<string, Partial<Record<Locale, string>>> = {
  'demo-birth-rates': {
    'sr-Cyrl': 'Дугорочни пад наталитета у Србији од 1950. године.',
    'sr-Latn': 'Dugoročni pad nataliteta u Srbiji od 1950. godine.',
    en: 'The long decline of Serbia’s birth rate since 1950.',
  },
  'demo-population-decline': {
    'sr-Cyrl': 'Континуирано смањење броја становника после пописа из 1991.',
    'sr-Latn': 'Kontinuirano smanjenje broja stanovnika posle popisa iz 1991.',
    en: 'A sustained population decline after the 1991 census benchmark.',
  },
  'demo-cancer-trends': {
    'sr-Cyrl': 'Кретање инциденце рака открива дугорочни здравствени притисак.',
    'sr-Latn':
      'Kretanje incidencije raka otkriva dugoročni zdravstveni pritisak.',
    en: 'Cancer incidence trends show persistent long-term health pressure.',
  },
  'demo-budget-execution': {
    'sr-Cyrl': 'Извршење буџета показује где јавна потрошња најбрже расте.',
    'sr-Latn': 'Izvršenje budžeta pokazuje gde javna potrošnja najbrže raste.',
    en: 'Budget execution reveals where public spending is growing fastest.',
  },
  'demo-population-pyramid': {
    'sr-Cyrl': 'Старосна структура јасно открива старење становништва Србије.',
    'sr-Latn': 'Starosna struktura jasno otkriva starenje stanovništva Srbije.',
    en: 'The age structure makes Serbia’s population ageing immediately visible.',
  },
};

const CHART_TYPE_LABELS: Record<string, Record<Locale, string>> = {
  line: {
    'sr-Cyrl': 'Временска серија',
    'sr-Latn': 'Vremenska serija',
    en: 'Time series',
  },
  bar: {
    'sr-Cyrl': 'Стубичасти график',
    'sr-Latn': 'Stubičasti grafik',
    en: 'Bar chart',
  },
  column: {
    'sr-Cyrl': 'Стубичасти график',
    'sr-Latn': 'Stubičasti grafik',
    en: 'Column chart',
  },
  pie: {
    'sr-Cyrl': 'Пита график',
    'sr-Latn': 'Pita grafik',
    en: 'Pie chart',
  },
  map: {
    'sr-Cyrl': 'Мапа',
    'sr-Latn': 'Mapa',
    en: 'Map',
  },
  sankey: {
    'sr-Cyrl': 'Структурни график',
    'sr-Latn': 'Strukturni grafik',
    en: 'Flow diagram',
  },
  treemap: {
    'sr-Cyrl': 'Структурни график',
    'sr-Latn': 'Strukturni grafik',
    en: 'Treemap',
  },
  funnel: {
    'sr-Cyrl': 'Структурни график',
    'sr-Latn': 'Strukturni grafik',
    en: 'Funnel chart',
  },
  heatmap: {
    'sr-Cyrl': 'Мапа интензитета',
    'sr-Latn': 'Mapa intenziteta',
    en: 'Heatmap',
  },
  'population-pyramid': {
    'sr-Cyrl': 'Структурни график',
    'sr-Latn': 'Strukturni grafik',
    en: 'Population pyramid',
  },
  radar: {
    'sr-Cyrl': 'Радарски график',
    'sr-Latn': 'Radarski grafik',
    en: 'Radar chart',
  },
  'box-plot': {
    'sr-Cyrl': 'Распонски график',
    'sr-Latn': 'Rasponski grafik',
    en: 'Box plot',
  },
  waterfall: {
    'sr-Cyrl': 'Структурни график',
    'sr-Latn': 'Strukturni grafik',
    en: 'Waterfall chart',
  },
  gauge: {
    'sr-Cyrl': 'Индикатор',
    'sr-Latn': 'Indikator',
    en: 'Gauge',
  },
};

const SOURCE_MAP = [
  {
    match: /(SORS|Statistical Office|Републички завод|Republički zavod)/i,
    badge: { 'sr-Cyrl': 'РЗС', 'sr-Latn': 'RZS', en: 'SORS' },
    label: {
      'sr-Cyrl': 'Републички завод за статистику',
      'sr-Latn': 'Republički zavod za statistiku',
      en: 'Statistical Office of the Republic of Serbia',
    },
    icon: '🏛',
  },
  {
    match: /(data\.gov\.rs|Open Data Portal|Portal otvorenih podataka)/i,
    badge: {
      'sr-Cyrl': 'data.gov.rs',
      'sr-Latn': 'data.gov.rs',
      en: 'data.gov.rs',
    },
    label: {
      'sr-Cyrl': 'Портал отворених података',
      'sr-Latn': 'Portal otvorenih podataka',
      en: 'Open Data Portal of Serbia',
    },
    icon: '🌐',
  },
  {
    match: /(National Bank|Народна банка|Narodna banka)/i,
    badge: { 'sr-Cyrl': 'НБС', 'sr-Latn': 'NBS', en: 'NBS' },
    label: {
      'sr-Cyrl': 'Народна банка Србије',
      'sr-Latn': 'Narodna banka Srbije',
      en: 'National Bank of Serbia',
    },
    icon: '🏛',
  },
  {
    match: /(Institute of Public Health|Batut|јавно здравље)/i,
    badge: { 'sr-Cyrl': 'Батут', 'sr-Latn': 'Batut', en: 'Batut' },
    label: {
      'sr-Cyrl': 'Институт за јавно здравље Србије',
      'sr-Latn': 'Institut za javno zdravlje Srbije',
      en: 'Institute of Public Health of Serbia',
    },
    icon: '🏛',
  },
  {
    match: /(Ministry of Health|Министарство здравља|Ministarstvo zdravlja)/i,
    badge: { 'sr-Cyrl': 'МЗ', 'sr-Latn': 'MZ', en: 'MoH' },
    label: {
      'sr-Cyrl': 'Министарство здравља',
      'sr-Latn': 'Ministarstvo zdravlja',
      en: 'Ministry of Health',
    },
    icon: '🏛',
  },
  {
    match: /(SEPA|Environmental Protection)/i,
    badge: { 'sr-Cyrl': 'СЕПА', 'sr-Latn': 'SEPA', en: 'SEPA' },
    label: {
      'sr-Cyrl': 'Агенција за заштиту животне средине',
      'sr-Latn': 'Agencija za zaštitu životne sredine',
      en: 'Serbian Environmental Protection Agency',
    },
    icon: '🏛',
  },
];

const LOCALE_PREFIX: Record<Locale, string> = {
  'sr-Cyrl': 'sr-Cyrl-RS',
  'sr-Latn': 'sr-Latn-RS',
  en: 'en-US',
};

export function getChartTypeLabel(type: string, locale: Locale) {
  return CHART_TYPE_LABELS[type]?.[locale] ?? type;
}

export function buildInsightSubtitle(
  example: FeaturedExampleConfig,
  locale: Locale
) {
  const override = INSIGHT_OVERRIDES[example.id]?.[locale];
  if (override) {
    return override;
  }

  const rawDescription = getLocalizedText(example.description, locale).trim();
  const lowered =
    rawDescription.charAt(0).toLowerCase() + rawDescription.slice(1);
  const type = example.chartConfig.type;

  const prefix =
    type === 'line'
      ? { 'sr-Cyrl': 'Тренд:', 'sr-Latn': 'Trend:', en: 'Trend:' }
      : type === 'pie' || type === 'treemap' || type === 'funnel'
        ? {
            'sr-Cyrl': 'Структура:',
            'sr-Latn': 'Struktura:',
            en: 'Composition:',
          }
        : { 'sr-Cyrl': 'Увид:', 'sr-Latn': 'Uvid:', en: 'Insight:' };

  return `${prefix[locale]} ${lowered}`;
}

function extractTimeRange(example: FeaturedExampleConfig, locale: Locale) {
  const observations = example.inlineData?.observations ?? [];
  const field =
    example.chartConfig.x_axis?.field ??
    (observations.length > 0 ? Object.keys(observations[0])[0] : undefined);

  if (!field || observations.length === 0) {
    return locale === 'en' ? 'Static snapshot' : 'Статички пресек';
  }

  const years = observations
    .map((row) => String(row[field] ?? ''))
    .map((value) => {
      const match = value.match(/(19|20)\d{2}/);
      return match ? Number(match[0]) : null;
    })
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b);

  if (years.length === 0) {
    return locale === 'en' ? 'Current dataset' : 'Актуелни скуп';
  }

  const first = years[0];
  const last = years[years.length - 1];
  return first === last ? String(first) : `${first}–${last}`;
}

function resolveSource(source: string | undefined, locale: Locale) {
  const matched = SOURCE_MAP.find((item) => item.match.test(source ?? ''));
  if (matched) {
    return {
      badge: matched.badge[locale],
      label: matched.label[locale],
      icon: matched.icon,
    };
  }

  return {
    badge: locale === 'en' ? 'Official' : 'Званично',
    label: source || (locale === 'en' ? 'Official source' : 'Званични извор'),
    icon: '🏛',
  };
}

function getFreshnessLabel(lastUpdated: string | undefined, locale: Locale) {
  if (!lastUpdated) {
    return locale === 'en' ? 'Update pending' : 'Ажурирање у току';
  }

  const today = new Date();
  const updatedAt = new Date(lastUpdated);
  const diffDays = Math.floor(
    (today.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 45) {
    return locale === 'en' ? 'Recently refreshed' : 'Недавно освежено';
  }
  if (diffDays <= 180) {
    return locale === 'en' ? 'Regularly updated' : 'Редовно ажурирано';
  }
  return locale === 'en' ? 'Archive series' : 'Архивска серија';
}

export function getDerivedVisualizationMeta(
  example: FeaturedExampleConfig,
  locale: Locale
): DerivedVisualizationMeta {
  const source = resolveSource(example.dataSource, locale);
  const featuredRank = FEATURED_ORDER.indexOf(example.id);
  const rowCount = example.inlineData?.rowCount ?? 0;
  const years = extractTimeRange(example, locale);
  const updatedAtScore = example.lastUpdated
    ? new Date(example.lastUpdated).getTime() / 100000000
    : 0;

  return {
    chartTypeLabel: getChartTypeLabel(example.chartConfig.type, locale),
    sourceBadge: source.badge,
    sourceLabel: source.label,
    sourceIcon: source.icon,
    reliabilityLabel:
      locale === 'en' ? 'Official public data' : 'Званични јавни подаци',
    timeRangeLabel: years,
    freshnessLabel: getFreshnessLabel(example.lastUpdated, locale),
    insightSubtitle: buildInsightSubtitle(example, locale),
    popularityScore:
      (featuredRank === -1 ? 0 : 100 - featuredRank * 10) +
      rowCount +
      (example.tags?.length ?? 0) * 4 +
      updatedAtScore,
    featuredRank,
    dataSourceUrl: example.dataSourceUrl,
    resourceUrl: example.resourceUrl,
  };
}

export function getFeaturedExamples(examples: FeaturedExampleConfig[]) {
  return FEATURED_ORDER.map((id) =>
    examples.find((example) => example.id === id)
  ).filter((example): example is FeaturedExampleConfig => Boolean(example));
}

export function isShowcaseCategory(
  value: string | null | undefined
): value is ShowcaseCategory {
  return (
    value === 'demographics' ||
    value === 'healthcare' ||
    value === 'economy' ||
    value === 'migration' ||
    value === 'society'
  );
}

export function formatGalleryDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(LOCALE_PREFIX[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function buildPreviewConfig(example: FeaturedExampleConfig) {
  return {
    ...example.chartConfig,
    options: {
      ...example.chartConfig.options,
      showLegend: false,
      showLabels:
        example.chartConfig.type === 'pie' ||
        example.chartConfig.type === 'treemap'
          ? false
          : example.chartConfig.options?.showLabels,
      showDots:
        example.chartConfig.type === 'line'
          ? false
          : example.chartConfig.options?.showDots,
      showGrid:
        example.chartConfig.type === 'bar' ||
        example.chartConfig.type === 'column'
          ? false
          : example.chartConfig.options?.showGrid,
      animation: false,
    },
  };
}
