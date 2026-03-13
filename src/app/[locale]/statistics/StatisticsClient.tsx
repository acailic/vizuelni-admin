'use client';

import useSWR from 'swr';
import { StatsOverview } from '@/components/statistics/StatsOverview';
import { PopularChartsGrid } from '@/components/statistics/PopularChartsGrid';
import type { StatisticsResponse } from '@/lib/statistics/types';
import type { Locale } from '@/lib/i18n/config';

interface StatisticsMessages {
  statistics: {
    title: string;
    chartsCreated: string;
    totalViews: string;
    perMonth: string;
    popularChartsAllTime: string;
    popularChartsLast30Days: string;
    views: string;
    dashboards: string;
    datasetsUsed: string;
  };
}

interface StatisticsClientProps {
  locale: Locale;
  messages: StatisticsMessages;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function StatisticsClient({ locale, messages }: StatisticsClientProps) {
  const {
    data: stats,
    error,
    isLoading,
  } = useSWR<StatisticsResponse>('/api/statistics', fetcher, {
    revalidateOnFocus: false,
  });

  const t = messages.statistics;

  if (isLoading) {
    return (
      <div className='mx-auto max-w-7xl px-4 py-12'>
        <div className='animate-pulse space-y-8'>
          <div className='h-8 w-48 rounded bg-gray-200' />
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='h-32 rounded-2xl bg-gray-200' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className='mx-auto max-w-7xl px-4 py-12'>
        <p className='text-red-500'>Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl px-4 py-12'>
      <h1 className='mb-8 text-3xl font-bold text-[#0C1E42]'>{t.title}</h1>

      <StatsOverview
        stats={stats}
        labels={{
          chartsCreated: t.chartsCreated,
          totalViews: t.totalViews,
          perMonth: (count) => t.perMonth.replace('{{count}}', String(count)),
          dashboards: t.dashboards,
          datasetsUsed: t.datasetsUsed,
        }}
      />

      <div className='mt-12'>
        <PopularChartsGrid
          charts={stats.popularCharts.allTime}
          title={t.popularChartsAllTime}
          locale={locale}
          labels={{ views: t.views }}
        />
      </div>

      <div className='mt-8'>
        <PopularChartsGrid
          charts={stats.popularCharts.last30Days}
          title={t.popularChartsLast30Days}
          locale={locale}
          labels={{ views: t.views }}
        />
      </div>
    </div>
  );
}
