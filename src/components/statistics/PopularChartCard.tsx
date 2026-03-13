// src/components/statistics/PopularChartCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import type { PopularChart } from '@/lib/statistics/types';

export interface PopularChartCardProps {
  chart: PopularChart;
  locale: string;
  labels: {
    views: string;
  };
}

export function PopularChartCard({
  chart,
  locale,
  labels,
}: PopularChartCardProps) {
  return (
    <Link
      href={`/${locale}/chart/${chart.id}`}
      className='group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md'
    >
      <div className='relative aspect-video bg-gray-100'>
        {chart.thumbnail ? (
          <Image
            src={chart.thumbnail}
            alt={chart.title}
            fill
            className='object-cover'
          />
        ) : (
          <div className='flex h-full items-center justify-center text-gray-300'>
            <svg
              className='h-12 w-12'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
          </div>
        )}
      </div>
      <div className='p-4'>
        <h3 className='line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-gov-secondary'>
          {chart.title}
        </h3>
        <div className='mt-2 flex items-center gap-1 text-xs text-gray-500'>
          <Eye className='h-3 w-3' />
          <span>
            {chart.views.toLocaleString()} {labels.views}
          </span>
        </div>
      </div>
    </Link>
  );
}
