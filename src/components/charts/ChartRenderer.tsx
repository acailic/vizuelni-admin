'use client';

import { Suspense, useMemo, useRef } from 'react';

import { prepareChartData } from '@vizualni/application';
import {
  getChartId,
  normalizeChartType,
  parseChartConfig,
  supportsCalculationToggle,
  supportsLegendFilter,
  type ChartConfig,
  type ChartConfigInput,
  type ChartRendererDataRow,
} from '@vizualni/charts';

import {
  getAxisLabel,
  getTableColumns,
} from '@/components/charts/shared/chart-data';
import { ChartErrorBoundary } from '@/components/charts/shared/ChartErrorBoundary';
import { ChartFrame } from '@/components/charts/shared/ChartFrame';
import { ExportMenu } from '@/components/charts/shared/ExportMenu';
import { FilterBar } from '@/components/filters';
import { getChartDefinition } from '@/lib/charts/registry';
import { getMessages, resolveLocale } from '@/lib/i18n/messages';
import { useChartInteractiveFilters } from '@/stores/interactive-filters';

/**
 * Prettify a raw field key into a human-readable label.
 * - Capitalizes first letter
 * - Replaces underscores with spaces
 * - Splits camelCase into words
 */
function prettifyKey(key: string): string {
  // Handle common known patterns first
  const knownPatterns: Record<string, string> = {
    male: 'Male',
    female: 'Female',
    immigrants: 'Immigrants',
    emigrants: 'Emigrants',
    births: 'Births',
    deaths: 'Deaths',
  };

  const lowerKey = key.toLowerCase();
  if (knownPatterns[lowerKey]) {
    return knownPatterns[lowerKey];
  }

  // Replace underscores with spaces
  let result = key.replace(/_/g, ' ');

  // Split camelCase into words (e.g., "gdpGrowth" -> "gdp Growth")
  result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Capitalize first letter of each word
  result = result
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return result;
}

/**
 * Get a human-readable label for a series key.
 * Priority:
 * 1. If key matches y_axis.field -> use getAxisLabel()
 * 2. If key matches secondaryField -> use secondaryFieldLabel option or prettify
 * 3. If key matches pyramid male/female fields -> return "Male"/"Female"
 * 4. Fall back to prettified key
 */
function getSeriesLabel(key: string, config: ChartConfig): string {
  const yAxisField = config.y_axis?.field;
  const secondaryField = config.options?.secondaryField;
  const pyramidMaleField = config.options?.pyramidMaleField;
  const pyramidFemaleField = config.options?.pyramidFemaleField;

  // Check if this is the y-axis field
  if (key === yAxisField && config.y_axis) {
    return getAxisLabel(config.y_axis);
  }

  // Check if this is the secondary field
  if (key === secondaryField) {
    // Future: could check for secondaryFieldLabel option if added
    return prettifyKey(key);
  }

  // Check for population pyramid fields
  if (key === pyramidMaleField) {
    return 'Male';
  }
  if (key === pyramidFemaleField) {
    return 'Female';
  }

  // Fall back to prettified key
  return prettifyKey(key);
}

interface ChartRendererProps {
  config: ChartConfigInput;
  data: ChartRendererDataRow[];
  height?: number;
  locale?: string;
  sourceDataset?: string;
  previewMode?: boolean;
  preselectedFilters?: {
    dataFilters?: Record<string, string | string[] | null>;
    timeRange?: { from: string | null; to: string | null };
    calculation?: 'absolute' | 'percent';
  };
}

export function ChartRenderer({
  config,
  data,
  height = 400,
  locale = 'sr-Cyrl',
  sourceDataset,
  previewMode = false,
  preselectedFilters,
}: ChartRendererProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const prepareResult = useMemo(() => {
    try {
      return {
        preparedData: prepareChartData(config, data, undefined, locale),
        error: null,
      };
    } catch (error) {
      return {
        preparedData: null,
        error,
      };
    }
  }, [config, data, locale]);

  const localeMessages = getMessages(resolveLocale(locale));
  const preparedData = prepareResult.preparedData;

  const parsedConfig =
    preparedData?.parsedConfig ??
    parseChartConfig({
      type: 'table',
      title: config.title || 'Chart',
    });

  const normalizedType = normalizeChartType(parsedConfig.type);
  const chartId = useMemo(() => getChartId(parsedConfig), [parsedConfig]);
  const seriesKeys = useMemo(
    () => preparedData?.seriesKeys ?? [],
    [preparedData]
  );
  const temporalValues = useMemo(
    () => preparedData?.temporalValues ?? [],
    [preparedData]
  );
  const dimensions = useMemo(
    () => preparedData?.dimensions ?? [],
    [preparedData]
  );

  const filterDefaults = useMemo(
    () => ({
      legend: Object.fromEntries(seriesKeys.map((key) => [key, true])),
      timeRange: preselectedFilters?.timeRange ?? { from: null, to: null },
      timeSlider: null,
      dataFilters: {
        ...Object.fromEntries(
          dimensions.map((dimension) => [dimension.key, null])
        ),
        ...(preselectedFilters?.dataFilters ?? {}),
      },
      calculation: preselectedFilters?.calculation ?? ('absolute' as const),
    }),
    [dimensions, seriesKeys, preselectedFilters]
  );

  const filters = useChartInteractiveFilters({
    chartId,
    defaults: filterDefaults,
  });

  const hiddenSeriesKeys = useMemo(
    () =>
      Object.entries(filters.legend)
        .filter(([, visible]) => !visible)
        .map(([key]) => key),
    [filters.legend]
  );

  const filteredData = useMemo(() => {
    if (prepareResult.error) {
      return data;
    }

    return prepareChartData(parsedConfig, data, filters, locale).filteredData;
  }, [data, filters, locale, parsedConfig, prepareResult.error]);

  const exportHeaders = useMemo(
    () => getTableColumns(filteredData, parsedConfig),
    [filteredData, parsedConfig]
  );

  const sourceAttribution = sourceDataset
    ? localeMessages.common.export?.sourceAttribution?.replace(
        '{{dataset}}',
        sourceDataset
      ) || `Source: data.gov.rs — ${sourceDataset}`
    : undefined;

  const filtersApplied = useMemo(() => {
    const parts: string[] = [];
    if (filters.calculation === 'percent') {
      parts.push(localeMessages.charts.filters.percent);
    }
    Object.entries(filters.dataFilters).forEach(([key, value]) => {
      if (value !== null) {
        parts.push(`${key}: ${value}`);
      }
    });
    return parts.length > 0 ? parts.join(', ') : undefined;
  }, [filters, localeMessages]);

  const exportLabels = {
    download: localeMessages.common.export?.download || 'Download',
    imagePng: localeMessages.common.export?.imagePng || 'Image (PNG)',
    imageSvg: localeMessages.common.export?.imageSvg || 'Vector (SVG)',
    dataCsv: localeMessages.common.export?.dataCsv || 'Data (CSV)',
    spreadsheetExcel:
      localeMessages.common.export?.spreadsheetExcel || 'Spreadsheet (Excel)',
    exporting: localeMessages.common.export?.exporting || 'Exporting...',
    source: localeMessages.common.export?.source || 'Source',
  };

  const showLegendFilter =
    supportsLegendFilter(parsedConfig) && seriesKeys.length > 1;
  const showTimeFilters = temporalValues.length > 1;
  const showCalculationFilter = supportsCalculationToggle(parsedConfig);

  const filterBar = previewMode ? undefined : showLegendFilter ||
    showTimeFilters ||
    showCalculationFilter ||
    dimensions.length > 0 ? (
    <FilterBar
      calculation={filters.calculation}
      dataFilters={filters.dataFilters}
      dimensions={dimensions}
      labels={{
        showAll: localeMessages.charts.filters.legend_show_all,
        hideAll: localeMessages.charts.filters.legend_hide_all,
        all: localeMessages.charts.filters.all,
        search: localeMessages.charts.filters.search,
        noResults: localeMessages.charts.filters.no_results,
        from: localeMessages.charts.filters.from,
        to: localeMessages.charts.filters.to,
        absolute: localeMessages.charts.filters.absolute,
        percent: localeMessages.charts.filters.percent,
        resetAll: localeMessages.charts.filters.reset_all,
        play: localeMessages.charts.filters.play,
        pause: localeMessages.charts.filters.pause,
      }}
      legend={filters.legend}
      locale={locale}
      onResetAll={filters.resetAll}
      onSetCalculation={filters.setCalculation}
      onSetDataFilter={filters.setDataFilter}
      onSetLegendState={filters.setLegendState}
      onSetTimeRange={filters.setTimeRange}
      onSetTimeSliderValue={filters.setTimeSliderValue}
      onToggleLegendItem={filters.toggleLegendItem}
      seriesKeys={seriesKeys}
      seriesLabels={Object.fromEntries(
        seriesKeys.map((key) => [key, getSeriesLabel(key, parsedConfig)])
      )}
      showCalculationToggle={showCalculationFilter}
      showLegendFilter={showLegendFilter}
      showTimeFilters={showTimeFilters}
      temporalValues={temporalValues}
      timeRange={filters.timeRange}
      timeSlider={filters.timeSlider}
    />
  ) : undefined;

  if (prepareResult.error) {
    return (
      <ChartFrame
        title={config.title || 'Chart'}
        description={config.description}
        height={height}
        errorMessage={
          prepareResult.error instanceof Error
            ? prepareResult.error.message
            : 'Chart configuration is invalid.'
        }
      />
    );
  }

  if (!normalizedType) {
    return (
      <ChartFrame
        title={parsedConfig.title}
        description={parsedConfig.description}
        height={height}
        errorMessage='Chart type is not supported.'
      />
    );
  }

  const definition = getChartDefinition(normalizedType);

  if (!definition) {
    return (
      <ChartFrame
        title={parsedConfig.title}
        description={parsedConfig.description}
        height={height}
        errorMessage='Renderer definition is missing for this chart type.'
      />
    );
  }

  const RendererComponent = definition.renderer;

  return (
    <div ref={chartContainerRef} className='relative'>
      {!previewMode && (
        <div className='absolute right-5 top-5 z-10'>
          <ExportMenu
            chartRef={chartContainerRef}
            title={parsedConfig.title}
            data={filteredData as Record<string, unknown>[]}
            headers={exportHeaders}
            source={sourceAttribution}
            locale={locale}
            labels={exportLabels}
            filtersApplied={filtersApplied}
          />
        </div>
      )}

      <ChartErrorBoundary
        title={parsedConfig.title}
        description={parsedConfig.description}
        height={height}
        resetKey={`${chartId}:${locale}:${height}:${filteredData.length}:${hiddenSeriesKeys.join(',')}`}
      >
        <Suspense
          fallback={
            <ChartFrame
              title={parsedConfig.title}
              description={parsedConfig.description}
              height={height}
              emptyMessage='Loading chart renderer...'
            />
          }
        >
          <RendererComponent
            config={parsedConfig}
            data={filteredData}
            filterBar={filterBar}
            height={height}
            hiddenSeriesKeys={hiddenSeriesKeys}
            locale={locale}
            showInternalLegend={!showLegendFilter}
            previewMode={previewMode}
          />
        </Suspense>
      </ChartErrorBoundary>
    </div>
  );
}
