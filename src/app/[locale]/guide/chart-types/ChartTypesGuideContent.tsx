'use client';

import Link from 'next/link';
import {
  BarChart3,
  LineChart,
  PieChart,
  Map,
  ScatterChart,
  Table,
  Layers,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Accessibility,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';

interface ChartTypesGuideContentProps {
  locale: Locale;
}

// Serbian geography data - accurate counts (4 statistical regions without Kosovo)
const serbianGeography = {
  regions: {
    count: 4,
    names: [
      'Београдски регион',
      'Регион Војводине',
      'Регион Шумадије и западне Србије',
      'Регион Јужне и источне Србије',
    ],
    namesEn: [
      'Belgrade Region',
      'Vojvodina Region',
      'Šumadija and Western Serbia Region',
      'Southern and Eastern Serbia Region',
    ],
  },
  districts: {
    count: 25,
    description: 'Управни окрузи за регионалну статистику',
    descriptionEn: 'Administrative districts for regional statistics',
  },
  municipalities: {
    count: 174,
    description: 'Локалне самоуправе (градови и општине)',
    descriptionEn: 'Local self-governments (cities and municipalities)',
  },
};

const chartTypes = [
  {
    id: 'column-bar',
    icon: BarChart3,
    title: { sr: 'Стубасти и тракасти графикони', en: 'Column & Bar Charts' },
    description: {
      sr: 'Упоређивање вредности између категорија',
      en: 'Comparing values across categories',
    },
    useCases: {
      sr: [
        'Рангирање категорија',
        'Упоређивање по регионима',
        'Приказ одступања од циља',
        'Мање од 10 категорија',
      ],
      en: [
        'Category rankings',
        'Comparisons across regions',
        'Deviation from target',
        'Fewer than 10 categories',
      ],
    },
    avoidCases: {
      sr: [
        'Више од 15 категорија',
        'Трендови током времена',
        'Пропорције (користити питу)',
        'Негативне вредности за тракасте',
      ],
      en: [
        'More than 15 categories',
        'Trends over time',
        'Proportions (use pie instead)',
        'Negative values for horizontal bars',
      ],
    },
    examples: [
      { sr: 'Популација по градовима', en: 'Population by city' },
      { sr: 'Болнички кревети по окрузима', en: 'Hospital beds by district' },
    ],
    mistakes: {
      sr: 'Превише категорија отежава читање; користи хоризонталне тракасте за дугачке ознаке',
      en: 'Too many categories make reading difficult; use horizontal bars for long labels',
    },
    accessibility: {
      sr: 'Добра подршка за читаче екрана; табела алтернатива доступна',
      en: 'Good screen reader support; table alternative available',
    },
    alternative: {
      sr: 'Табела за прецизне вредности',
      en: 'Table for exact values',
    },
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    id: 'line',
    icon: LineChart,
    title: { sr: 'Линијски графикони', en: 'Line Charts' },
    description: {
      sr: 'Трендови и промене током времена',
      en: 'Trends and changes over time',
    },
    useCases: {
      sr: [
        'Временске серије',
        'Упоређивање више серија',
        'Истицање образаца и трендова',
        'Непрекидне вредности',
      ],
      en: [
        'Time series',
        'Comparing multiple series',
        'Highlighting patterns and trends',
        'Continuous values',
      ],
    },
    avoidCases: {
      sr: [
        'Категоријалне податке',
        'Више од 5 серија (претрпано)',
        'Мали број тачака (користи тачкасти)',
        'Негативне вредности без нуле',
      ],
      en: [
        'Categorical data',
        'More than 5 series (cluttered)',
        'Few data points (use dot plot)',
        'Negative values without zero',
      ],
    },
    examples: [
      { sr: 'Квартални БДП', en: 'Quarterly GDP' },
      { sr: 'Месечна стопа инфлације', en: 'Monthly inflation rate' },
    ],
    mistakes: {
      sr: 'Не укључуј нулу на Y-оси када је битна; превише линија отежава разликовање',
      en: "Don't exclude zero on Y-axis when relevant; too many lines are hard to distinguish",
    },
    accessibility: {
      sr: 'Тренд информације у aria-describedby; подршка за тастатуру (стрелице)',
      en: 'Trend info in aria-describedby; keyboard support (arrow keys)',
    },
    alternative: {
      sr: 'Површински за наглашавање волумена',
      en: 'Area chart for volume emphasis',
    },
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  {
    id: 'pie',
    icon: PieChart,
    title: { sr: 'Пита и прстенасти графикони', en: 'Pie & Donut Charts' },
    description: {
      sr: 'Пропорције и састав целине',
      en: 'Proportions and composition of a whole',
    },
    useCases: {
      sr: [
        'Састав где збир = 100%',
        '3-7 категорија',
        'Једна серија података',
        'Брзи увид у пропорције',
      ],
      en: [
        'Composition where sum = 100%',
        '3-7 categories',
        'Single data series',
        'Quick proportion insight',
      ],
    },
    avoidCases: {
      sr: [
        'Више од 7 категорија',
        'Упоређивање више серија',
        'Сличне вредности (тешко разликовати)',
        'Прецизне вредности (користи табелу)',
      ],
      en: [
        'More than 7 categories',
        'Comparing multiple series',
        'Similar values (hard to distinguish)',
        'Exact values (use table)',
      ],
    },
    examples: [
      { sr: 'БДП по секторима економије', en: 'GDP by economic sector' },
      {
        sr: 'Студенти по нивоима образовања',
        en: 'Students by education level',
      },
    ],
    mistakes: {
      sr: 'Превише сегмената; не ређај по величини ако није логично; избегавај 3D ефекте',
      en: "Too many segments; don't sort by size if illogical; avoid 3D effects",
    },
    accessibility: {
      sr: 'Ограничена подршка; ОБАВЕЗНО обезбедити табелу алтернативу',
      en: 'Limited support; MUST provide table alternative',
    },
    alternative: {
      sr: 'Тракасти за поређење пропорција',
      en: 'Bar chart for comparing proportions',
    },
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
  {
    id: 'area',
    icon: Layers,
    title: { sr: 'Површински графикони', en: 'Area Charts' },
    description: {
      sr: 'Кумулативне вредности и састав током времена',
      en: 'Cumulative values and composition over time',
    },
    useCases: {
      sr: [
        'Волумен током времена',
        'Слоежни састав (stacked)',
        'Део-целина трендови',
        'Наглашавање магнитуда',
      ],
      en: [
        'Volume over time',
        'Stacked composition',
        'Part-to-whole trends',
        'Magnitude emphasis',
      ],
    },
    avoidCases: {
      sr: [
        'Прецизно читање вредности',
        'Више од 4 слоја',
        'Преклапајуће серије без транспарентности',
        'Негативне вредности',
      ],
      en: [
        'Precise value reading',
        'More than 4 layers',
        'Overlapping series without transparency',
        'Negative values',
      ],
    },
    examples: [
      { sr: 'Извоз по секторима (годишње)', en: 'Exports by sector (annual)' },
      { sr: 'Потрошња енергије по извору', en: 'Energy consumption by source' },
    ],
    mistakes: {
      sr: 'Редослед слојева утиче на читање; највећа категорија иде на дно',
      en: 'Layer order affects reading; largest category goes at bottom',
    },
    accessibility: {
      sr: 'Слојеви се тешко разликују; табела алтернатива препоручљива',
      en: 'Layers hard to distinguish; table alternative recommended',
    },
    alternative: {
      sr: 'Линијски за чистије поређење',
      en: 'Line chart for cleaner comparison',
    },
    color:
      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
  {
    id: 'scatter',
    icon: ScatterChart,
    title: { sr: 'Графикони расејања', en: 'Scatter Plots' },
    description: {
      sr: 'Корелација између две варијабле',
      en: 'Correlation between two variables',
    },
    useCases: {
      sr: [
        'Истраживање односа варијабли',
        'Приказ кластера и изузетака',
        'Велики број тачака',
        'Хипотезе о корелацији',
      ],
      en: [
        'Exploring variable relationships',
        'Showing clusters and outliers',
        'Large number of points',
        'Correlation hypotheses',
      ],
    },
    avoidCases: {
      sr: [
        'Мали број тачака (користи тачкасти)',
        'Временске серије',
        'Категоријалне податке',
        'Без јасне корелације',
      ],
      en: [
        'Few data points (use dot plot)',
        'Time series',
        'Categorical data',
        'Without clear correlation',
      ],
    },
    examples: [
      {
        sr: 'Здравствена потрошња vs очекивани живот',
        en: 'Healthcare spending vs life expectancy',
      },
      {
        sr: 'БДП по глави становника vs стопа писмености',
        en: 'GDP per capita vs literacy rate',
      },
    ],
    mistakes: {
      sr: 'Не подразумевај узрочност; укључи тренд линију ако је релевантна',
      en: "Don't assume causation; include trend line if relevant",
    },
    accessibility: {
      sr: 'Тешко за читаче екрана; табела са вредностима обавезна',
      en: 'Difficult for screen readers; table with values mandatory',
    },
    alternative: {
      sr: 'Мехурићи за трећу димензију',
      en: 'Bubble chart for third dimension',
    },
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  },
  {
    id: 'map',
    icon: Map,
    title: { sr: 'Географске карте', en: 'Geographic Maps' },
    description: {
      sr: 'Географска дистрибуција података',
      en: 'Geographic data distribution',
    },
    useCases: {
      sr: [
        'Просторни обрасци',
        'Упоређивање региона',
        'Локалне варијације',
        'Јавни сектор и демографија',
      ],
      en: [
        'Spatial patterns',
        'Comparing regions',
        'Local variations',
        'Public sector and demographics',
      ],
    },
    avoidCases: {
      sr: [
        'Мале географске разлике',
        'Више од 7 боја',
        'Без контекста (додај легенду)',
        'Временске серије (користи анимацију)',
      ],
      en: [
        'Small geographic differences',
        'More than 7 colors',
        'Without context (add legend)',
        'Time series (use animation)',
      ],
    },
    examples: [
      {
        sr: 'Густина насељености по окрузима',
        en: 'Population density by district',
      },
      {
        sr: 'Покривеност вакцинацијом по општинама',
        en: 'Vaccination coverage by municipality',
      },
    ],
    mistakes: {
      sr: 'Избегавај црвено-зелене палете; користи приступачне палете; додај шаблоне за далтонисте',
      en: 'Avoid red-green palettes; use accessible palettes; add patterns for colorblind users',
    },
    accessibility: {
      sr: 'Обезбеди табелу алтернативу; ARIA ознаке за регионе; контраст боја ≥3:1',
      en: 'Provide table alternative; ARIA labels for regions; color contrast ≥3:1',
    },
    alternative: {
      sr: 'Тракасти за прецизно поређење',
      en: 'Bar chart for precise comparison',
    },
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
  },
  {
    id: 'table',
    icon: Table,
    title: { sr: 'Табеле', en: 'Tables' },
    description: {
      sr: 'Прецизне вредности и приступачност',
      en: 'Precise values and accessibility',
    },
    useCases: {
      sr: [
        'Тачне вредности',
        'Приступачност за читаче екрана',
        'Преглед за преузимање',
        'Више мера по категорији',
      ],
      en: [
        'Exact values',
        'Screen reader accessibility',
        'Preview for download',
        'Multiple measures per category',
      ],
    },
    avoidCases: {
      sr: [
        'Визуелни трендови',
        'Велике табеле без пагинације',
        'Превише колона',
        'Брзи увид у обрасце',
      ],
      en: [
        'Visual trends',
        'Large tables without pagination',
        'Too many columns',
        'Quick pattern insight',
      ],
    },
    examples: [
      { sr: 'Статистички годишњак', en: 'Statistical yearbook' },
      {
        sr: 'Буџетска извршења по министарствима',
        en: 'Budget execution by ministry',
      },
    ],
    mistakes: {
      sr: 'Без заглавља колона; нема сортирања; лош контраст; претрпани подаци',
      en: 'Missing column headers; no sorting; poor contrast; cluttered data',
    },
    accessibility: {
      sr: 'Најбоља подршка; користи scope атрибуте; заглавља за сваку колону',
      en: 'Best support; use scope attributes; headers for every column',
    },
    alternative: {
      sr: 'Стубасти за визуелни приказ',
      en: 'Column chart for visual display',
    },
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
];

// Quick reference with comprehensive patterns
const quickReferencePatterns = [
  {
    pattern: { sr: 'Рангирање', en: 'Ranking' },
    chart: { sr: 'Тракасти', en: 'Bar' },
  },
  {
    pattern: { sr: 'Тренд током времена', en: 'Trend over time' },
    chart: { sr: 'Линијски', en: 'Line' },
  },
  {
    pattern: { sr: 'Део-целина', en: 'Part-to-whole' },
    chart: { sr: 'Пита, Површински', en: 'Pie, Area' },
  },
  {
    pattern: { sr: 'Корелација', en: 'Correlation' },
    chart: { sr: 'Расејања', en: 'Scatter' },
  },
  {
    pattern: { sr: 'Географски', en: 'Geographic' },
    chart: { sr: 'Карта', en: 'Map' },
  },
  {
    pattern: { sr: 'Дистрибуција', en: 'Distribution' },
    chart: { sr: 'Хистограм', en: 'Histogram' },
  },
  {
    pattern: { sr: 'Одступање од циља', en: 'Deviation from target' },
    chart: { sr: 'Тракасти (дивергентни)', en: 'Bar (diverging)' },
  },
  {
    pattern: { sr: 'Састав током времена', en: 'Composition over time' },
    chart: { sr: 'Слоежни површински', en: 'Stacked Area' },
  },
  {
    pattern: { sr: 'Прецизне вредности', en: 'Exact values' },
    chart: { sr: 'Табела', en: 'Table' },
  },
  {
    pattern: { sr: 'Хијерархија', en: 'Hierarchy' },
    chart: { sr: 'Тримап', en: 'Treemap' },
  },
];

// Color palette with semantic usage
const colorPalette = [
  {
    hex: '#0D4077',
    name: { sr: 'Примарна плав', en: 'Primary Blue' },
    usage: {
      sr: 'Главни елементи, заглавља, примарне акције',
      en: 'Main elements, headers, primary actions',
    },
  },
  {
    hex: '#1a5290',
    name: { sr: 'Секундарна плав', en: 'Secondary Blue' },
    usage: {
      sr: 'Секундарни елементи, линкови',
      en: 'Secondary elements, links',
    },
  },
  {
    hex: '#4B90F5',
    name: { sr: 'Интерактивна плав', en: 'Interactive Blue' },
    usage: {
      sr: 'Ховер стања, фокус, активни елементи',
      en: 'Hover states, focus, active elements',
    },
  },
  {
    hex: '#C6363C',
    name: { sr: 'Акцент црвена', en: 'Accent Red' },
    usage: {
      sr: 'Упозорења, важни подаци, акценат',
      en: 'Warnings, important data, accent',
    },
  },
];

export function ChartTypesGuideContent({
  locale,
}: ChartTypesGuideContentProps) {
  const t = (sr: string, en: string) =>
    locale === 'sr-Cyrl' || locale === 'sr-Latn' ? sr : en;

  return (
    <main className='container-custom py-12' id='main-content'>
      <article className='mx-auto max-w-4xl space-y-8'>
        {/* Back link */}
        <Link
          href={`/${locale}`}
          className='inline-flex items-center gap-2 text-sm text-slate-600 hover:text-gov-primary'
        >
          <ArrowLeft className='h-4 w-4' />
          {t('Назад на почетну', 'Back to home')}
        </Link>

        {/* Header */}
        <header>
          <h1 className='text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>
            {t('Водич за типове графикона', 'Chart Types Guide')}
          </h1>
          <p className='mt-4 text-lg text-slate-600 dark:text-slate-400'>
            {t(
              'Изаберите прави тип графикона за визуелизацију отворених података Републике Србије',
              'Choose the right chart type for visualizing Serbian open government data'
            )}
          </p>
          <p className='mt-2 text-sm text-slate-500 dark:text-slate-500'>
            <Link
              href={`/${locale}/accessibility`}
              className='text-gov-primary hover:underline'
            >
              {t(
                'Погледајте такође: Изјава о приступачности',
                'See also: Accessibility Statement'
              )}
            </Link>
          </p>
        </header>

        {/* Quick Reference */}
        <section className='rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800'>
          <h2 className='text-xl font-semibold text-slate-900 dark:text-white'>
            {t(
              'Брза референца: Избор графикона',
              'Quick Reference: Chart Selection'
            )}
          </h2>
          <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
            {t(
              'Пронађите прави графикон на основу вашег обрасца података',
              'Find the right chart based on your data pattern'
            )}
          </p>
          <div className='mt-4 overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-slate-200 dark:border-slate-600'>
                  <th className='px-3 py-2 text-left font-medium text-slate-600 dark:text-slate-400'>
                    {t('Образац података', 'Data Pattern')}
                  </th>
                  <th className='px-3 py-2 text-left font-medium text-slate-600 dark:text-slate-400'>
                    {t('Препоручени графикон', 'Recommended Chart')}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
                {quickReferencePatterns.map((row, i) => (
                  <tr key={i}>
                    <td className='px-3 py-2 text-slate-700 dark:text-slate-300'>
                      {t(row.pattern.sr, row.pattern.en)}
                    </td>
                    <td className='px-3 py-2 text-slate-700 dark:text-slate-300'>
                      {t(row.chart.sr, row.chart.en)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Chart Types Grid */}
        <section>
          <h2 className='text-2xl font-semibold text-slate-900 dark:text-white'>
            {t('Типови графикона', 'Chart Types')}
          </h2>
          <div className='mt-6 grid gap-6 md:grid-cols-2'>
            {chartTypes.map((chart) => {
              const Icon = chart.icon;
              return (
                <div
                  key={chart.id}
                  className='rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'
                >
                  {/* Header */}
                  <div className='flex items-start gap-4'>
                    <div className={`rounded-lg p-3 ${chart.color}`}>
                      <Icon className='h-6 w-6' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h3 className='font-semibold text-slate-900 dark:text-white'>
                        {t(chart.title.sr, chart.title.en)}
                      </h3>
                      <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                        {t(chart.description.sr, chart.description.en)}
                      </p>
                    </div>
                  </div>

                  {/* Use when */}
                  <div className='mt-4'>
                    <h4 className='flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400'>
                      <CheckCircle className='h-3.5 w-3.5' />
                      {t('Користити када', 'Use when')}
                    </h4>
                    <ul className='mt-2 space-y-1'>
                      {chart.useCases.sr.map((useCase, i) => (
                        <li
                          key={i}
                          className='flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300'
                        >
                          <span className='text-green-600 dark:text-green-400'>
                            •
                          </span>
                          {t(useCase, chart.useCases.en[i])}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Avoid when */}
                  <div className='mt-3'>
                    <h4 className='flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400'>
                      <XCircle className='h-3.5 w-3.5' />
                      {t('Избегавати када', 'Avoid when')}
                    </h4>
                    <ul className='mt-2 space-y-1'>
                      {chart.avoidCases.sr.map((avoidCase, i) => (
                        <li
                          key={i}
                          className='flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300'
                        >
                          <span className='text-red-600 dark:text-red-400'>
                            •
                          </span>
                          {t(avoidCase, chart.avoidCases.en[i])}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  <div className='mt-3'>
                    <h4 className='text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
                      {t('Примери из јавних података', 'Public Data Examples')}
                    </h4>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {chart.examples.map((example, i) => (
                        <span
                          key={i}
                          className='inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        >
                          {t(example.sr, example.en)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Common mistakes */}
                  <div className='mt-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/30'>
                    <h4 className='flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300'>
                      <AlertTriangle className='h-3.5 w-3.5' />
                      {t('Честе грешке', 'Common Mistakes')}
                    </h4>
                    <p className='mt-1 text-sm text-amber-900 dark:text-amber-200'>
                      {t(chart.mistakes.sr, chart.mistakes.en)}
                    </p>
                  </div>

                  {/* Accessibility note */}
                  <div className='mt-3 flex items-start gap-2 rounded-lg bg-slate-100 p-3 dark:bg-slate-700/50'>
                    <Accessibility className='h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400' />
                    <div>
                      <span className='text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
                        {t('Приступачност', 'Accessibility')}:
                      </span>
                      <span className='ml-1 text-sm text-slate-700 dark:text-slate-300'>
                        {t(chart.accessibility.sr, chart.accessibility.en)}
                      </span>
                    </div>
                  </div>

                  {/* Alternative */}
                  <div className='mt-3 text-sm text-slate-600 dark:text-slate-400'>
                    <span className='font-medium'>
                      {t('Алтернатива', 'Alternative')}:
                    </span>{' '}
                    {t(chart.alternative.sr, chart.alternative.en)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Geographic Levels */}
        <section className='rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
          <h2 className='text-xl font-semibold text-slate-900 dark:text-white'>
            {t('Географски нивои за Србију', 'Geographic Levels for Serbia')}
          </h2>
          <p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
            {t(
              'Статистички нивои за визуелизацију података по регионима',
              'Statistical levels for visualizing regional data'
            )}
          </p>
          <div className='mt-4 grid gap-4 sm:grid-cols-3'>
            <div className='rounded-lg bg-slate-50 p-4 dark:bg-slate-700'>
              <h3 className='font-semibold text-slate-900 dark:text-white'>
                {t(
                  `Региони (${serbianGeography.regions.count})`,
                  `Regions (${serbianGeography.regions.count})`
                )}
              </h3>
              <ul className='mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400'>
                {serbianGeography.regions.names.map((name, i) => (
                  <li key={i}>
                    {t(name, serbianGeography.regions.namesEn[i])}
                  </li>
                ))}
              </ul>
            </div>
            <div className='rounded-lg bg-slate-50 p-4 dark:bg-slate-700'>
              <h3 className='font-semibold text-slate-900 dark:text-white'>
                {t(
                  `Окрузи (${serbianGeography.districts.count})`,
                  `Districts (${serbianGeography.districts.count})`
                )}
              </h3>
              <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                {t(
                  serbianGeography.districts.description,
                  serbianGeography.districts.descriptionEn
                )}
              </p>
              <p className='mt-2 text-xs text-slate-500 dark:text-slate-500'>
                {t('Идеално за хороплет карте', 'Ideal for choropleth maps')}
              </p>
            </div>
            <div className='rounded-lg bg-slate-50 p-4 dark:bg-slate-700'>
              <h3 className='font-semibold text-slate-900 dark:text-white'>
                {t(
                  `Општине (${serbianGeography.municipalities.count})`,
                  `Municipalities (${serbianGeography.municipalities.count})`
                )}
              </h3>
              <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                {t(
                  serbianGeography.municipalities.description,
                  serbianGeography.municipalities.descriptionEn
                )}
              </p>
              <p className='mt-2 text-xs text-slate-500 dark:text-slate-500'>
                {t('За детаљне локалне анализе', 'For detailed local analysis')}
              </p>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className='rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
          <h2 className='text-xl font-semibold text-slate-900 dark:text-white'>
            {t('Владина палета боја', 'Government Color Palette')}
          </h2>
          <p className='mt-2 text-slate-600 dark:text-slate-400'>
            {t(
              'Користите конзистентне боје за препознатљив владини идентитет',
              'Use consistent colors for recognizable government identity'
            )}
          </p>

          {/* Color swatches with usage */}
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            {colorPalette.map((color) => (
              <div
                key={color.hex}
                className='flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-600'
              >
                <div
                  className='h-12 w-12 shrink-0 rounded-lg shadow-sm ring-1 ring-black/5'
                  style={{ backgroundColor: color.hex }}
                  aria-label={t(color.name.sr, color.name.en)}
                />
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium text-slate-900 dark:text-white'>
                      {t(color.name.sr, color.name.en)}
                    </span>
                    <code className='rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400'>
                      {color.hex}
                    </code>
                  </div>
                  <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                    {t(color.usage.sr, color.usage.en)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Accessibility guidance */}
          <div className='mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/30'>
            <h3 className='flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-200'>
              <Eye className='h-4 w-4' />
              {t('Приступачност боја', 'Color Accessibility')}
            </h3>
            <ul className='mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-300'>
              <li>
                •{' '}
                {t(
                  'Све боје испуњавају WCAG AA контраст (≥4.5:1 за текст)',
                  'All colors meet WCAG AA contrast (≥4.5:1 for text)'
                )}
              </li>
              <li>
                •{' '}
                {t(
                  'За графиконе користите Okabe-Ito палету за далтонисте',
                  'Use Okabe-Ito palette for colorblind-safe charts'
                )}
              </li>
              <li>
                •{' '}
                {t(
                  'Никада не поуздајте се само на боју - додајте шаблоне или ознаке',
                  'Never rely on color alone - add patterns or labels'
                )}
              </li>
              <li>
                •{' '}
                {t(
                  'Избегавајте црвено-зелене комбинације',
                  'Avoid red-green combinations'
                )}
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className='rounded-2xl bg-gov-primary p-6 text-white'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h2 className='text-xl font-semibold'>
                {t('Спремни за визуелизацију?', 'Ready to visualize?')}
              </h2>
              <p className='mt-1 text-blue-100'>
                {t(
                  'Истражите примере података или креирајте свој графикон',
                  'Explore example datasets or create your own chart'
                )}
              </p>
            </div>
            <div className='flex gap-3'>
              <Link
                href={`/${locale}/demo-gallery`}
                className='inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-gov-primary transition hover:bg-blue-50'
              >
                {t('Галерија примера', 'Example Gallery')}
              </Link>
              <Link
                href={`/${locale}/data`}
                className='inline-flex items-center justify-center rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10'
              >
                {t('Преглед података', 'Browse Data')}
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400'>
          <p>{t('Последње ажурирање', 'Last updated')}: 2026-03-17</p>
        </footer>
      </article>
    </main>
  );
}
