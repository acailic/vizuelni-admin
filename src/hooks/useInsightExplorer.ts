'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  useDatasetList,
  useDataset,
  useResourceData,
  useDemoPreviewData,
} from '@/hooks/useDataset';
import { extractKeywords } from '@/lib/insight-explorer';
import { findPreviewableResource } from '@/lib/data-gov-api';
import { isDemoMode } from '@/lib/app-mode';
import type { UseInsightExplorerReturn } from '@/types/insight-explorer';
import type { Locale } from '@/lib/i18n/config';

interface UseInsightExplorerOptions {
  locale: Locale;
}

export function useInsightExplorer(
  options: UseInsightExplorerOptions
): UseInsightExplorerReturn {
  const { locale } = options;
  const router = useRouter();
  const pathname = usePathname();
  const rawSearchParams = useSearchParams();

  // Provide a stable fallback for null searchParams
  const searchParams = useMemo(
    () => rawSearchParams ?? new URLSearchParams(),
    [rawSearchParams]
  );

  const searchQuery = searchParams.get('q') ?? '';
  const selectedTopic = searchParams.get('topic') ?? null;
  const selectedDatasetId = searchParams.get('dataset');

  const extractedParams = useMemo(
    () => extractKeywords(searchQuery, locale),
    [searchQuery, locale]
  );

  const browseQuery = useMemo(
    () => ({
      q: (extractedParams.q ?? searchQuery) || undefined,
      topic: selectedTopic ?? extractedParams.topic ?? undefined,
      page: Number.parseInt(searchParams.get('page') ?? '1', 10),
      pageSize: 12,
    }),
    [searchQuery, selectedTopic, extractedParams, searchParams]
  );

  const datasetListQuery = useDatasetList(browseQuery);
  const datasets = datasetListQuery.data?.data ?? [];

  const datasetQuery = useDataset(selectedDatasetId);
  const selectedDataset = datasetQuery.data;

  const previewResource = useMemo(() => {
    if (!selectedDataset) return null;
    return findPreviewableResource(selectedDataset.resources);
  }, [selectedDataset]);

  // In demo/static mode, load embedded data directly from the demo catalog
  // instead of fetching from URLs that would fail host-allowlist checks.
  const demoPreviewQuery = useDemoPreviewData(
    isDemoMode ? selectedDatasetId : null
  );
  const resourceQuery = useResourceData(
    !isDemoMode ? (previewResource?.url ?? null) : null,
    !isDemoMode ? (previewResource?.format ?? null) : null,
    { limit: 100 }
  );
  const activePreviewQuery = isDemoMode ? demoPreviewQuery : resourceQuery;

  const handleSetSearchQuery = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams);
      if (query) params.set('q', query);
      else params.delete('q');
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const handleSetSelectedTopic = useCallback(
    (topicId: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (topicId) params.set('topic', topicId);
      else params.delete('topic');
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const handleSelectDataset = useCallback(
    (datasetId: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('dataset', datasetId);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const handleClearFilters = useCallback(() => {
    router.push(pathname ?? '/');
  }, [router, pathname]);

  return {
    searchQuery,
    selectedTopic,
    selectedLocation: null,
    selectedYear: null,
    selectedInsightType: null,
    selectedDataset: selectedDataset ?? null,
    selectedResource: previewResource,
    datasets,
    datasetsLoading: datasetListQuery.isLoading,
    datasetsError: datasetListQuery.error ?? null,
    totalDatasets: datasetListQuery.data?.total ?? 0,
    previewData: activePreviewQuery.data?.observations ?? null,
    previewLoading: activePreviewQuery.isLoading,
    previewError: activePreviewQuery.error ?? null,
    chartConfig: null,
    setSearchQuery: handleSetSearchQuery,
    setSelectedTopic: handleSetSelectedTopic,
    setSelectedLocation: () => {},
    setSelectedYear: () => {},
    setSelectedInsightType: () => {},
    selectDataset: handleSelectDataset,
    selectResource: () => {},
    clearFilters: handleClearFilters,
  };
}
