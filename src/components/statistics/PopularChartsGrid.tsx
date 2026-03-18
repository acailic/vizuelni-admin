import { PopularChartCard } from './PopularChartCard';
import type { PopularChart } from '@/lib/statistics/types';

export interface PopularChartsGridProps {
  charts: PopularChart[];
  title: string;
  subtitle?: string;
  locale: string;
  labels: {
    views: string;
  };
}

export function PopularChartsGrid({
  charts,
  title,
  subtitle,
  locale,
  labels,
}: PopularChartsGridProps) {
  if (charts.length === 0) {
    return null;
  }

  return (
    <section className='py-8'>
      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-[#0C1E42]'>{title}</h2>
        {subtitle && <p className='mt-1 text-sm text-gray-500'>{subtitle}</p>}
      </div>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {charts.map((chart) => (
          <PopularChartCard
            key={chart.id}
            chart={chart}
            locale={locale}
            labels={labels}
          />
        ))}
      </div>
    </section>
  );
}
