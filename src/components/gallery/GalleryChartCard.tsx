'use client';

import Link from 'next/link';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Grid3X3,
  Eye,
  Calendar,
  User,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { srLatn, enUS } from 'date-fns/locale';

export interface GalleryChartMeta {
  id: string;
  title: string;
  description?: string | null;
  chartType: string;
  views: number;
  thumbnail?: string | null;
  createdAt: string;
  author?: {
    name?: string | null;
    image?: string | null;
  } | null;
}

interface GalleryChartCardProps {
  chart: GalleryChartMeta;
  locale: string;
  labels: {
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
  };
}

const chartTypeIcons: Record<string, React.ComponentType<unknown>> = {
  line: LineChart,
  bar: BarChart3,
  column: BarChart3,
  area: TrendingUp,
  pie: PieChart,
  scatterplot: TrendingUp,
  combo: BarChart3,
  table: Grid3X3,
};

export function GalleryChartCard({
  chart,
  locale,
  labels,
}: GalleryChartCardProps) {
  const Icon = chartTypeIcons[chart.chartType] || BarChart3;
  const dateLocale =
    locale === 'sr-Latn' ? srLatn : locale === 'en' ? enUS : undefined;

  const timeAgo = formatDistanceToNow(new Date(chart.createdAt), {
    addSuffix: true,
    ...(dateLocale && { locale: dateLocale }),
  });

  const chartTypeLabel =
    labels.chartTypes[chart.chartType as keyof typeof labels.chartTypes] ||
    chart.chartType;

  return (
    <Link
      href={`/${locale}/v/${chart.id}`}
      className='group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-slate-300'
    >
      {/* Thumbnail */}
      <div className='relative aspect-video bg-slate-100'>
        {chart.thumbnail ? (
          <img
            src={`data:image/png;base64,${chart.thumbnail}`}
            alt={chart.title}
            className='h-full w-full object-cover'
          />
        ) : (
          <div className='flex h-full items-center justify-center'>
            <Icon className='h-12 w-12 text-slate-300' />
          </div>
        )}
        {/* Chart type badge */}
        <div className='absolute right-2 top-2 rounded bg-white/90 px-2 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm'>
          {chartTypeLabel}
        </div>
      </div>

      {/* Content */}
      <div className='p-4'>
        <h3
          className='mb-2 line-clamp-1 font-semibold text-slate-900 group-hover:text-blue-600 transition-colors md:break-words'
          title={chart.title}
        >
          {chart.title}
        </h3>

        {chart.description && (
          <p
            className='mb-3 line-clamp-2 text-sm text-slate-600 md:break-words'
            title={chart.description}
          >
            {chart.description}
          </p>
        )}

        {/* Author */}
        {chart.author && (
          <div className='mb-2 flex items-center gap-2'>
            {chart.author.image ? (
              <img
                src={chart.author.image}
                alt={chart.author.name || ''}
                className='h-5 w-5 rounded-full object-cover'
              />
            ) : (
              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-slate-200'>
                <User className='h-3 w-3 text-slate-500' />
              </div>
            )}
            <span className='text-xs text-slate-500'>
              {labels.by} {chart.author.name || 'Anonymous'}
            </span>
          </div>
        )}

        {/* Meta */}
        <div className='flex items-center gap-4 text-xs text-slate-500'>
          <span className='inline-flex items-center gap-1'>
            <Eye className='h-3 w-3' />
            {chart.views} {labels.views}
          </span>
          <span className='inline-flex items-center gap-1'>
            <Calendar className='h-3 w-3' />
            {timeAgo}
          </span>
        </div>
      </div>
    </Link>
  );
}
