// src/components/statistics/StatsOverview.tsx
import { BarChart3, Eye, LayoutDashboard, Database } from 'lucide-react';
import { StatCard } from './StatCard';
import type { StatisticsResponse } from '@/lib/statistics/types';

export interface StatsOverviewProps {
  stats: StatisticsResponse;
  labels: {
    chartsCreated: string;
    totalViews: string;
    perMonth: (count: number) => string;
    dashboards: string;
    datasetsUsed: string;
  };
}

export function StatsOverview({ stats, labels }: StatsOverviewProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <StatCard
        value={stats.charts.total}
        label={labels.chartsCreated}
        subtitle={labels.perMonth(stats.charts.perMonthAverage)}
        icon={<BarChart3 className='h-5 w-5' />}
      />
      <StatCard
        value={stats.views.total}
        label={labels.totalViews}
        subtitle={labels.perMonth(stats.views.perMonthAverage)}
        icon={<Eye className='h-5 w-5' />}
      />
      <StatCard
        value={stats.charts.dashboards}
        label={labels.dashboards}
        icon={<LayoutDashboard className='h-5 w-5' />}
      />
      <StatCard
        value={stats.datasets.usedInCharts}
        label={labels.datasetsUsed}
        icon={<Database className='h-5 w-5' />}
      />
    </div>
  );
}
