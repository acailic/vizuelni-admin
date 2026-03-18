'use client';

import { useEffect, useMemo } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowUpRight,
  BarChart3,
  Database,
  Download,
  FileSpreadsheet,
  Layers3,
  Loader2,
  Table2,
} from 'lucide-react';

import { SearchBar } from '@/components/browse/SearchBar';
import { FilterSidebar } from '@/components/browse/FilterSidebar';
import { EmptyState } from '@/components/browse/EmptyState';
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import {
  CatalogStatusBar,
  DataSourceSwitcher,
  ErrorFallbackBanner,
} from '@/components/data';
import {
  DataSourceProvider,
  useDataSource,
} from '@/contexts/DataSourceContext';
import {
  useBrowseFacets,
  useDataset,
  useDatasetList,
  useResourceData,
} from '@/hooks/useDataset';
import {
  buildPreviewRows,
  findPreviewableResource,
  isPreviewableFormat,
} from '@/lib/data-gov-api';
import { useSearch } from '@/lib/hooks/useSearch';
import {
  formatDate,
  formatNumber,
  formatRelativeTime,
  type Locale,
} from '@/lib/i18n/config';
import { PRIORITY_DATASET_PRESETS } from '@/lib/priority-datasets';
import type { BrowseSearchParams, BrowseResource } from '@/types/browse';
import type { ParsedDataset } from '@/types/observation';

interface DataGovBrowserProps {
  locale: Locale;
}

function buildSearchState(params: {
  get(name: string): string | null;
}): BrowseSearchParams & { dataset?: string; resource?: string } {
  const page = Number.parseInt(params.get('page') ?? '1', 10);
  const pageSize = Number.parseInt(params.get('pageSize') ?? '12', 10);

  return {
    q: params.get('q')?.trim() || undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 12,
    organization: params.get('organization') || undefined,
    topic: params.get('topic') || undefined,
    format: params.get('format') || undefined,
    frequency: params.get('frequency') || undefined,
    sort: params.get('sort') || '-last_update',
    dataset: params.get('dataset') || undefined,
    resource: params.get('resource') || undefined,
  };
}

function getLabels(locale: Locale) {
  return {
    eyebrow:
      locale === 'sr-Cyrl'
        ? 'Званични каталог'
        : locale === 'sr-Latn'
          ? 'Zvanični katalog'
          : 'Official catalog',
    title:
      locale === 'sr-Cyrl'
        ? 'Истражите стварне скупове података са data.gov.rs'
        : locale === 'sr-Latn'
          ? 'Istražite stvarne skupove podataka sa data.gov.rs'
          : 'Browse live datasets from data.gov.rs',
    description:
      locale === 'sr-Cyrl'
        ? 'Статичка GitHub Pages верзија сада директно учитава званични каталог и приказује преглед ресурса који могу одмах да се визуализују.'
        : locale === 'sr-Latn'
          ? 'Statička GitHub Pages verzija sada direktno učitava zvanični katalog i prikazuje pregled resursa koji mogu odmah da se vizualizuju.'
          : 'The static GitHub Pages build now talks directly to the official catalog and previews resources that can be charted immediately.',
    curated:
      locale === 'sr-Cyrl'
        ? 'Брзи улази'
        : locale === 'sr-Latn'
          ? 'Brzi ulazi'
          : 'Curated entry points',
    searchPlaceholder:
      locale === 'sr-Cyrl'
        ? 'Претрага скупа података, организације или теме'
        : locale === 'sr-Latn'
          ? 'Pretraga skupa podataka, organizacije ili teme'
          : 'Search datasets, organizations, or topics',
    filters: {
      title:
        locale === 'sr-Cyrl'
          ? 'Филтери'
          : locale === 'sr-Latn'
            ? 'Filteri'
            : 'Filters',
      organization:
        locale === 'sr-Cyrl'
          ? 'Организација'
          : locale === 'sr-Latn'
            ? 'Organizacija'
            : 'Organization',
      topic:
        locale === 'sr-Cyrl' ? 'Тема' : locale === 'sr-Latn' ? 'Tema' : 'Topic',
      format:
        locale === 'sr-Cyrl'
          ? 'Формат'
          : locale === 'sr-Latn'
            ? 'Format'
            : 'Format',
      frequency:
        locale === 'sr-Cyrl'
          ? 'Учесталост'
          : locale === 'sr-Latn'
            ? 'Učestalost'
            : 'Frequency',
      clear:
        locale === 'sr-Cyrl'
          ? 'Очисти'
          : locale === 'sr-Latn'
            ? 'Očisti'
            : 'Clear',
      showAll:
        locale === 'sr-Cyrl' ? 'Све' : locale === 'sr-Latn' ? 'Sve' : 'All',
    },
    loading:
      locale === 'sr-Cyrl'
        ? 'Учитавање каталога…'
        : locale === 'sr-Latn'
          ? 'Učitavanje kataloga…'
          : 'Loading the catalog…',
    loadError:
      locale === 'sr-Cyrl'
        ? 'Није могуће учитати data.gov.rs каталог.'
        : locale === 'sr-Latn'
          ? 'Nije moguće učitati data.gov.rs katalog.'
          : 'Unable to load the data.gov.rs catalog.',
    emptyTitle:
      locale === 'sr-Cyrl'
        ? 'Нема резултата'
        : locale === 'sr-Latn'
          ? 'Nema rezultata'
          : 'No matching datasets',
    emptyDescription:
      locale === 'sr-Cyrl'
        ? 'Покушајте шири појам или уклоните неки филтер.'
        : locale === 'sr-Latn'
          ? 'Pokušajte širi pojam ili uklonite neki filter.'
          : 'Try a broader query or clear one of the filters.',
    selectDataset:
      locale === 'sr-Cyrl'
        ? 'Изаберите скуп'
        : locale === 'sr-Latn'
          ? 'Izaberite skup'
          : 'Select a dataset',
    selectedDataset:
      locale === 'sr-Cyrl'
        ? 'Изабран скуп'
        : locale === 'sr-Latn'
          ? 'Izabran skup'
          : 'Selected dataset',
    resources:
      locale === 'sr-Cyrl'
        ? 'Ресурси'
        : locale === 'sr-Latn'
          ? 'Resursi'
          : 'Resources',
    preview:
      locale === 'sr-Cyrl'
        ? 'Преглед ресурса'
        : locale === 'sr-Latn'
          ? 'Pregled resursa'
          : 'Resource preview',
    previewUnavailable:
      locale === 'sr-Cyrl'
        ? 'Овај скуп нема CSV или JSON ресурс погодан за директан преглед.'
        : locale === 'sr-Latn'
          ? 'Ovaj skup nema CSV ili JSON resurs pogodan za direktan pregled.'
          : 'This dataset has no CSV or JSON resource that can be previewed directly.',
    previewLoading:
      locale === 'sr-Cyrl'
        ? 'Учитавање ресурса…'
        : locale === 'sr-Latn'
          ? 'Učitavanje resursa…'
          : 'Loading resource…',
    previewError:
      locale === 'sr-Cyrl'
        ? 'Ресурс није могуће приказати.'
        : locale === 'sr-Latn'
          ? 'Resurs nije moguće prikazati.'
          : 'This resource could not be previewed.',
    autoChart:
      locale === 'sr-Cyrl'
        ? 'Аутоматски графикон'
        : locale === 'sr-Latn'
          ? 'Automatski grafikon'
          : 'Auto chart',
    tablePreview:
      locale === 'sr-Cyrl'
        ? 'Табеларни исечак'
        : locale === 'sr-Latn'
          ? 'Tabelarni isečak'
          : 'Table excerpt',
    openDataset:
      locale === 'sr-Cyrl'
        ? 'Отвори на data.gov.rs'
        : locale === 'sr-Latn'
          ? 'Otvori na data.gov.rs'
          : 'Open on data.gov.rs',
    download:
      locale === 'sr-Cyrl'
        ? 'Преузми ресурс'
        : locale === 'sr-Latn'
          ? 'Preuzmi resurs'
          : 'Download resource',
    updated:
      locale === 'sr-Cyrl'
        ? 'Ажурирано'
        : locale === 'sr-Latn'
          ? 'Ažurirano'
          : 'Updated',
    rows:
      locale === 'sr-Cyrl'
        ? 'редова'
        : locale === 'sr-Latn'
          ? 'redova'
          : 'rows',
    columns:
      locale === 'sr-Cyrl'
        ? 'колона'
        : locale === 'sr-Latn'
          ? 'kolona'
          : 'columns',
    chartFallback:
      locale === 'sr-Cyrl'
        ? 'За овај ресурс није могуће поуздано направити аутоматски графикон, али табеларни преглед је доступан.'
        : locale === 'sr-Latn'
          ? 'Za ovaj resurs nije moguće pouzdano napraviti automatski grafikon, ali tabelarni pregled je dostupan.'
          : 'This resource does not expose a reliable auto-chart shape, but the table preview is available.',
    chartable:
      locale === 'sr-Cyrl'
        ? '✓ Визуализабилно'
        : locale === 'sr-Latn'
          ? '✓ Vizualizabilno'
          : '✓ Chartable',
    chartableTooltip:
      locale === 'sr-Cyrl'
        ? 'Овај скуп података садржи ресурсе који могу бити визуализовани као графикови'
        : locale === 'sr-Latn'
          ? 'Ovaj skup podataka sadrži resurse koji mogu biti vizualizovani kao grafikoni'
          : 'This dataset contains resources that can be visualized as charts',
    dataOnly:
      locale === 'sr-Cyrl'
        ? 'Само подаци'
        : locale === 'sr-Latn'
          ? 'Samo podaci'
          : 'Data only',
    dataOnlyTooltip:
      locale === 'sr-Cyrl'
        ? 'Овај скуп садржи само фајлове који не могу бити аутоматски визуализовани (нпр. PDF, DOC)'
        : locale === 'sr-Latn'
          ? 'Ovaj skup sadrži samo fajlove koji ne mogu biti automatski vizualizovani (npr. PDF, DOC)'
          : 'This dataset contains only files that cannot be auto-visualized (e.g. PDF, DOC)',
  };
}

function pickAutoChartConfig(dataset: ParsedDataset, title: string) {
  const dimension =
    dataset.dimensions.find((entry) => entry.type === 'temporal') ??
    dataset.dimensions[0];
  const measure = dataset.measures[0];

  if (!dimension || !measure) {
    return null;
  }

  return {
    type: dimension.type === 'temporal' ? 'line' : 'bar',
    title,
    dataset_id: dataset.source.datasetId || title,
    x_axis: {
      field: dimension.key,
    },
    y_axis: {
      field: measure.key,
    },
  };
}

function ResourceButtons({
  locale,
  resources,
  selectedResourceId,
  onSelect,
}: {
  locale: Locale;
  resources: BrowseResource[];
  selectedResourceId?: string;
  onSelect: (resource: BrowseResource) => void;
}) {
  if (resources.length === 0) {
    return null;
  }

  return (
    <div className='grid gap-2'>
      {resources.map((resource) => {
        const previewable = isPreviewableFormat(resource.format);

        return (
          <button
            key={resource.id}
            type='button'
            onClick={() => onSelect(resource)}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              selectedResourceId === resource.id
                ? 'border-gov-secondary bg-gov-secondary/10'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='font-semibold text-slate-900'>{resource.title}</p>
                <p className='mt-1 text-xs uppercase tracking-[0.14em] text-slate-500'>
                  {resource.format}
                  {resource.filesize
                    ? ` • ${formatNumber(resource.filesize, locale)} B`
                    : ''}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  previewable
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {previewable ? 'Preview' : 'Raw'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Wrapper component that provides the DataSourceContext
 */
export function DataGovBrowser({ locale }: DataGovBrowserProps) {
  return (
    <DataSourceProvider>
      <DataGovBrowserContent locale={locale} />
    </DataSourceProvider>
  );
}

/**
 * Main browser content - uses the DataSourceContext
 */
function DataGovBrowserContent({ locale }: { locale: Locale }) {
  const { status, isFallbackDismissed, retry, dismissFallback } =
    useDataSource();

  const labels = getLabels(locale);
  const searchParams = useSearchParams();
  const { setSearchParams } = useSearch();

  const queryState = useMemo(
    () => buildSearchState(searchParams ?? new URLSearchParams()),
    [searchParams]
  );
  const browseQuery = useMemo(
    () => ({
      q: queryState.q,
      page: queryState.page,
      pageSize: queryState.pageSize,
      organization: queryState.organization,
      topic: queryState.topic,
      format: queryState.format,
      frequency: queryState.frequency,
      sort: queryState.sort,
    }),
    [queryState]
  );

  const datasetQuery = useDatasetList(browseQuery);
  const datasetResults = useMemo(
    () => datasetQuery.data?.data ?? [],
    [datasetQuery.data?.data]
  );
  const facetsQuery = useBrowseFacets(datasetResults, browseQuery.format);

  const selectedDatasetId = queryState.dataset || datasetResults[0]?.id || null;
  const selectedDatasetQuery = useDataset(selectedDatasetId);
  const selectedDataset = selectedDatasetQuery.data;

  const previewResource = useMemo(() => {
    if (!selectedDataset) {
      return null;
    }

    if (queryState.resource) {
      return (
        selectedDataset.resources.find(
          (resource) => resource.id === queryState.resource
        ) ??
        findPreviewableResource(selectedDataset.resources) ??
        null
      );
    }

    return findPreviewableResource(selectedDataset.resources) ?? null;
  }, [queryState.resource, selectedDataset]);

  const resourceQuery = useResourceData(
    previewResource?.url ?? null,
    previewResource?.format ?? null,
    { limit: 100 }
  );

  const previewDataset = resourceQuery.data;

  useEffect(() => {
    if (!datasetResults.length) {
      return;
    }

    const hasSelectedDataset = datasetResults.some(
      (dataset) => dataset.id === queryState.dataset
    );

    if (!queryState.dataset || !hasSelectedDataset) {
      setSearchParams(
        {
          dataset: datasetResults[0]?.id,
          resource: undefined,
        },
        false
      );
    }
  }, [datasetResults, queryState.dataset, setSearchParams]);

  useEffect(() => {
    if (!previewResource) {
      return;
    }

    if (queryState.resource !== previewResource.id) {
      setSearchParams(
        {
          resource: previewResource.id,
        },
        false
      );
    }
  }, [previewResource, queryState.resource, setSearchParams]);

  const previewRows = useMemo(
    () => (previewDataset ? buildPreviewRows(previewDataset, 8) : []),
    [previewDataset]
  );

  const autoChartConfig = useMemo(() => {
    if (!previewDataset || !selectedDataset) {
      return null;
    }

    return pickAutoChartConfig(previewDataset, selectedDataset.title);
  }, [previewDataset, selectedDataset]);

  return (
    <div className='space-y-8'>
      {/* Catalog status bar - always visible */}
      <CatalogStatusBar locale={locale} />

      {/* Error fallback banner - shown when in fallback mode and not dismissed */}
      {status === 'fallback' && !isFallbackDismissed && (
        <ErrorFallbackBanner
          locale={locale}
          onRetry={retry}
          onAccept={dismissFallback}
        />
      )}

      <section className='overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(12,30,66,0.98),rgba(17,71,116,0.94))] p-8 text-slate-50 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.55)]'>
        <div className='grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]'>
          <div className='space-y-5'>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/80'>
              {labels.eyebrow}
            </p>
            <div className='space-y-3'>
              <h1 className='max-w-3xl text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl'>
                {labels.title}
              </h1>
              <p className='max-w-3xl text-sm leading-7 text-slate-200/90'>
                {labels.description}
              </p>
            </div>
            <SearchBar
              clearLabel={labels.filters.clear}
              initialQuery={queryState.q}
              placeholder={labels.searchPlaceholder}
            />
          </div>

          <div className='grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm'>
            <div className='grid grid-cols-3 gap-3 text-left'>
              <div className='rounded-2xl bg-white/10 p-4'>
                <p className='text-xs uppercase tracking-[0.16em] text-cyan-100/75'>
                  {locale === 'en' ? 'Datasets' : 'Skupovi'}
                </p>
                <p className='mt-2 text-2xl font-semibold'>
                  {formatNumber(datasetQuery.data?.total ?? 0, locale)}
                </p>
              </div>
              <div className='rounded-2xl bg-white/10 p-4'>
                <p className='text-xs uppercase tracking-[0.16em] text-cyan-100/75'>
                  {locale === 'en' ? 'Topics' : 'Teme'}
                </p>
                <p className='mt-2 text-2xl font-semibold'>
                  {formatNumber(facetsQuery.data?.topics.length ?? 0, locale)}
                </p>
              </div>
              <div className='rounded-2xl bg-white/10 p-4'>
                <p className='text-xs uppercase tracking-[0.16em] text-cyan-100/75'>
                  CSV / JSON
                </p>
                <p className='mt-2 text-2xl font-semibold'>
                  {formatNumber(
                    datasetResults.filter((dataset) =>
                      dataset.resources.some((resource) =>
                        isPreviewableFormat(resource.format)
                      )
                    ).length,
                    locale
                  )}
                </p>
              </div>
            </div>

            <div className='space-y-3'>
              <p className='text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/75'>
                {labels.curated}
              </p>
              <div className='grid gap-3'>
                {PRIORITY_DATASET_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type='button'
                    onClick={() =>
                      setSearchParams(
                        {
                          q: preset.searchParams.q,
                          topic: preset.searchParams.topic,
                          format: preset.searchParams.format,
                          dataset: undefined,
                          resource: undefined,
                          page: 1,
                        },
                        true
                      )
                    }
                    className='rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-left transition hover:border-white/20 hover:bg-black/20'
                  >
                    <p className='font-semibold'>{preset.title[locale]}</p>
                    <p className='mt-1 text-sm text-slate-200/80'>
                      {preset.description[locale]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_minmax(360px,420px)]'>
        <aside className='space-y-4'>
          {/* Data source switcher */}
          <DataSourceSwitcher locale={locale} />

          {/* Existing filters */}
          <FilterSidebar
            facets={
              facetsQuery.data ?? {
                organizations: [],
                topics: [],
                formats: [],
                frequencies: [],
              }
            }
            labels={{
              title: labels.filters.title,
              organization: labels.filters.organization,
              topic: labels.filters.topic,
              format: labels.filters.format,
              frequency: labels.filters.frequency,
              clear: labels.filters.clear,
              all: labels.filters.showAll,
              showAll: labels.filters.showAll,
            }}
            selected={queryState}
          />
        </aside>

        <section className='space-y-4'>
          <div className='flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm'>
            <div className='flex items-center gap-3'>
              <Database className='h-5 w-5 text-gov-secondary' />
              <p className='text-sm text-slate-600'>
                {formatNumber(datasetQuery.data?.total ?? 0, locale)}{' '}
                {locale === 'en' ? 'datasets found' : 'резултата у каталогу'}
              </p>
            </div>
            {queryState.q ? (
              <p className='text-sm font-medium text-slate-500'>
                “{queryState.q}”
              </p>
            ) : null}
          </div>

          {datasetQuery.isLoading ? (
            <div className='rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-sm'>
              <Loader2 className='mx-auto mb-3 h-6 w-6 animate-spin' />
              {labels.loading}
            </div>
          ) : datasetQuery.isError ? (
            <EmptyState
              title={labels.loadError}
              description={
                datasetQuery.error instanceof Error
                  ? datasetQuery.error.message
                  : labels.loadError
              }
            />
          ) : datasetResults.length === 0 ? (
            <EmptyState
              title={labels.emptyTitle}
              description={labels.emptyDescription}
            />
          ) : (
            <div className='grid gap-4'>
              {datasetResults.map((dataset) => {
                const selected = dataset.id === selectedDatasetId;
                const previewableCount = dataset.resources.filter((resource) =>
                  isPreviewableFormat(resource.format)
                ).length;

                return (
                  <button
                    key={dataset.id}
                    type='button'
                    onClick={(e) => {
                      // Preserve scroll position of the main container
                      const mainEl = document.querySelector(
                        'main.flex-1.overflow-auto'
                      );
                      const scrollPos = mainEl?.scrollTop ?? 0;
                      setSearchParams(
                        {
                          dataset: dataset.id,
                          resource: undefined,
                        },
                        false
                      );
                      // Restore scroll position after state update
                      requestAnimationFrame(() => {
                        if (mainEl) {
                          mainEl.scrollTop = scrollPos;
                        }
                      });
                      // Keep focus on the clicked button
                      (e.currentTarget as HTMLButtonElement).focus();
                    }}
                    className={`group rounded-3xl border px-5 py-5 text-left shadow-sm transition ${
                      selected
                        ? 'border-gov-secondary bg-gov-secondary/5'
                        : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className='flex items-start justify-between gap-4'>
                      <div>
                        <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>
                          {dataset.organization?.name ?? 'data.gov.rs'}
                        </p>
                        <h2 className='mt-2 text-xl font-semibold text-slate-950'>
                          {dataset.title}
                        </h2>
                      </div>
                      <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500'>
                        {dataset.resources.length}{' '}
                        {labels.resources.toLowerCase()}
                      </span>
                    </div>

                    {dataset.description ? (
                      <p className='mt-3 line-clamp-3 text-sm leading-6 text-slate-600'>
                        {dataset.description}
                      </p>
                    ) : null}

                    <div className='mt-4 flex flex-wrap gap-2'>
                      {dataset.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className='rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600'
                        >
                          {tag}
                        </span>
                      ))}
                      {previewableCount > 0 ? (
                        <span
                          className='rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800'
                          title={
                            labels.chartableTooltip ??
                            'This dataset has resources that can be visualized as charts'
                          }
                        >
                          {labels.chartable ?? '✓ Chartable'}
                        </span>
                      ) : (
                        <span
                          className='rounded-full bg-slate-200 px-2.5 py-1 text-xs text-slate-500'
                          title={
                            labels.dataOnlyTooltip ??
                            'This dataset contains files that cannot be auto-visualized'
                          }
                        >
                          {labels.dataOnly ?? 'Data only'}
                        </span>
                      )}
                    </div>

                    <div className='mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500'>
                      <span>
                        {labels.updated}:{' '}
                        {dataset.last_modified
                          ? formatRelativeTime(dataset.last_modified, locale)
                          : '—'}
                      </span>
                      <span className='font-medium text-gov-secondary'>
                        {selected
                          ? labels.selectedDataset
                          : labels.selectDataset}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <aside className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-auto'>
          {selectedDatasetQuery.isLoading && !selectedDataset ? (
            <div className='text-sm text-slate-500'>{labels.loading}</div>
          ) : selectedDataset ? (
            <div className='space-y-6'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>
                  <Layers3 className='h-4 w-4' />
                  {labels.selectedDataset}
                </div>
                <h2 className='text-2xl font-semibold text-slate-950'>
                  {selectedDataset.title}
                </h2>
                {selectedDataset.description ? (
                  <p className='text-sm leading-7 text-slate-600'>
                    {selectedDataset.description}
                  </p>
                ) : null}
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div className='rounded-2xl bg-slate-50 p-4'>
                  <p className='text-xs uppercase tracking-[0.16em] text-slate-400'>
                    {labels.resources}
                  </p>
                  <p className='mt-2 text-lg font-semibold text-slate-950'>
                    {formatNumber(selectedDataset.resources.length, locale)}
                  </p>
                </div>
                <div className='rounded-2xl bg-slate-50 p-4'>
                  <p className='text-xs uppercase tracking-[0.16em] text-slate-400'>
                    {labels.updated}
                  </p>
                  <p className='mt-2 text-sm font-semibold text-slate-950'>
                    {selectedDataset.last_modified
                      ? formatDate(selectedDataset.last_modified, locale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
              </div>

              <div className='flex flex-wrap gap-3'>
                <Link
                  href={selectedDataset.page ?? 'https://data.gov.rs'}
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex items-center gap-2 rounded-2xl bg-[#0C1E42] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#102a5d]'
                >
                  <ArrowUpRight className='h-4 w-4' />
                  {labels.openDataset}
                </Link>
                {previewResource ? (
                  <Link
                    href={previewResource.url}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50'
                  >
                    <Download className='h-4 w-4' />
                    {labels.download}
                  </Link>
                ) : null}
              </div>

              <div className='space-y-3'>
                <div className='flex items-center gap-2 text-sm font-semibold text-slate-900'>
                  <FileSpreadsheet className='h-4 w-4 text-gov-secondary' />
                  {labels.resources}
                </div>
                <ResourceButtons
                  locale={locale}
                  resources={selectedDataset.resources}
                  selectedResourceId={previewResource?.id}
                  onSelect={(resource) => {
                    const mainEl = document.querySelector(
                      'main.flex-1.overflow-auto'
                    );
                    const scrollPos = mainEl?.scrollTop ?? 0;
                    setSearchParams(
                      {
                        resource: resource.id,
                      },
                      false
                    );
                    requestAnimationFrame(() => {
                      if (mainEl) {
                        mainEl.scrollTop = scrollPos;
                      }
                    });
                  }}
                />
              </div>

              {!previewResource ? (
                <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600'>
                  {labels.previewUnavailable}
                </div>
              ) : resourceQuery.isLoading ? (
                <div className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600'>
                  {labels.previewLoading}
                </div>
              ) : resourceQuery.isError ? (
                <div className='rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-700'>
                  {resourceQuery.error instanceof Error
                    ? resourceQuery.error.message
                    : labels.previewError}
                </div>
              ) : previewDataset ? (
                <div className='space-y-6'>
                  <section className='space-y-3'>
                    <div className='flex items-center gap-2 text-sm font-semibold text-slate-900'>
                      <BarChart3 className='h-4 w-4 text-gov-secondary' />
                      {labels.autoChart}
                    </div>
                    {autoChartConfig ? (
                      <div className='overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/70 p-3'>
                        <ChartRenderer
                          config={autoChartConfig}
                          data={
                            previewDataset.observations as Record<
                              string,
                              unknown
                            >[]
                          }
                          height={320}
                          locale={locale}
                          previewMode={true}
                          sourceDataset={selectedDataset.title}
                        />
                      </div>
                    ) : (
                      <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600'>
                        {labels.chartFallback}
                      </div>
                    )}
                  </section>

                  <section className='space-y-3'>
                    <div className='flex items-center justify-between gap-3'>
                      <div className='flex items-center gap-2 text-sm font-semibold text-slate-900'>
                        <Table2 className='h-4 w-4 text-gov-secondary' />
                        {labels.tablePreview}
                      </div>
                      <p className='text-xs uppercase tracking-[0.14em] text-slate-400'>
                        {formatNumber(previewDataset.rowCount, locale)}{' '}
                        {labels.rows} •{' '}
                        {formatNumber(previewDataset.columns.length, locale)}{' '}
                        {labels.columns}
                      </p>
                    </div>
                    <div className='overflow-x-auto rounded-3xl border border-slate-200'>
                      <table className='min-w-full divide-y divide-slate-200 bg-white text-left text-sm'>
                        <thead className='bg-slate-50'>
                          <tr>
                            {previewDataset.columns
                              .slice(0, 6)
                              .map((column) => (
                                <th
                                  key={column}
                                  scope='col'
                                  className='px-4 py-3 font-semibold text-slate-700'
                                >
                                  {column}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-100'>
                          {previewRows.map((row, index) => (
                            <tr key={index}>
                              {previewDataset.columns
                                .slice(0, 6)
                                .map((column) => (
                                  <td
                                    key={`${index}-${column}`}
                                    className='max-w-[220px] truncate px-4 py-3 text-slate-600'
                                  >
                                    {row[column]}
                                  </td>
                                ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              ) : null}
            </div>
          ) : (
            <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-600'>
              {labels.selectDataset}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
