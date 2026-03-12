'use client';

import { useState, useEffect, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import {
  GalleryFilterBar,
  type SortOption,
  type ChartTypeFilter,
} from './GalleryFilterBar';
import { GalleryChartCard, type GalleryChartMeta } from './GalleryChartCard';
import { GalleryFeaturedSection } from './GalleryFeaturedSection';

interface GalleryPageProps {
  locale: string;
  labels: {
    title: string;
    description: string;
    featuredTitle: string;
    searchPlaceholder: string;
    allTypes: string;
    filterByType: string;
    sortBy: string;
    newest: string;
    mostViewed: string;
    noCharts: string;
    tryDifferent: string;
    chartTypes: {
      line: string;
      bar: string;
      column: string;
      area: string;
      pie: string;
      scatterplot: string;
      combo: string;
      table: string;
    };
    views: string;
    by: string;
    loading: string;
    error: string;
  };
}

export function GalleryPage({ locale, labels }: GalleryPageProps) {
  const [charts, setCharts] = useState<GalleryChartMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [chartType, setChartType] = useState<ChartTypeFilter>('all');
  const [sort, setSort] = useState<SortOption>('newest');

  useEffect(() => {
    fetchCharts();
  }, [sort]);

  const fetchCharts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const sortBy = sort === 'newest' ? 'createdAt' : 'views';
      const sortOrder = sort === 'newest' ? 'desc' : 'desc';
      const response = await fetch(
        `/api/gallery?sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (!response.ok) throw new Error('Failed to fetch charts');
      const data = await response.json();
      setCharts(data.charts || []);
    } catch (err) {
      setError(labels.error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCharts = useMemo(() => {
    let result = charts;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (chart) =>
          chart.title.toLowerCase().includes(searchLower) ||
          chart.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by chart type
    if (chartType !== 'all') {
      result = result.filter((chart) => chart.chartType === chartType);
    }

    return result;
  }, [charts, search, chartType]);

  if (isLoading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <div className='text-slate-500'>{labels.loading}</div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-slate-900'>{labels.title}</h1>
        <p className='mt-2 text-slate-600'>{labels.description}</p>
      </div>

      {/* Featured Examples Section */}
      <GalleryFeaturedSection locale={locale} title={labels.featuredTitle} />

      {/* Error state */}
      {error && (
        <div className='mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600'>
          {error}
        </div>
      )}

      {/* Filter bar */}
      <GalleryFilterBar
        search={search}
        onSearchChange={setSearch}
        chartType={chartType}
        onChartTypeChange={setChartType}
        sort={sort}
        onSortChange={setSort}
        labels={{
          searchPlaceholder: labels.searchPlaceholder,
          allTypes: labels.allTypes,
          filterByType: labels.filterByType,
          sortBy: labels.sortBy,
          newest: labels.newest,
          mostViewed: labels.mostViewed,
          chartTypes: labels.chartTypes,
        }}
      />

      {/* Results count */}
      {!isLoading && !error && (
        <p className='mb-4 text-sm text-slate-500'>
          {filteredCharts.length}{' '}
          {filteredCharts.length === 1 ? 'chart' : 'charts'}
        </p>
      )}

      {/* Empty state */}
      {!isLoading && !error && filteredCharts.length === 0 && (
        <div className='flex flex-col items-center justify-center py-16 text-center'>
          <BarChart3 className='h-16 w-16 text-slate-300' />
          <p className='mt-4 text-lg text-slate-600'>{labels.noCharts}</p>
          <p className='mt-2 text-sm text-slate-500'>{labels.tryDifferent}</p>
        </div>
      )}

      {/* Charts grid */}
      {!isLoading && !error && filteredCharts.length > 0 && (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {filteredCharts.map((chart) => (
            <GalleryChartCard
              key={chart.id}
              chart={chart}
              locale={locale}
              labels={{
                chartTypes: labels.chartTypes,
                views: labels.views,
                by: labels.by,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
