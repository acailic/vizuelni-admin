'use client';

import { useMemo, useState } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  Map,
  CalendarDays,
} from 'lucide-react';

import type { FeaturedExampleConfig } from '@/lib/examples/types';
import { getLocalizedText } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { ChartPreview } from './ChartPreview';
import { ChartTypeBadge } from './ChartTypeBadge';
import { QuickActionButtons } from './QuickActionButtons';
import { SourceBadge } from './SourceBadge';
import {
  formatGalleryDate,
  getDerivedVisualizationMeta,
  type GalleryPanel,
} from './galleryUtils';

function ChartTypeIcon({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    line: LineChart,
    bar: BarChart3,
    pie: PieChart,
    map: Map,
  };
  const Icon = iconMap[type] ?? BarChart3;
  return <Icon className={className} aria-hidden='true' />;
}

interface VisualizationCardProps {
  example: FeaturedExampleConfig;
  locale: Locale;
  onOpenExample: (example: FeaturedExampleConfig, panel?: GalleryPanel) => void;
  labels: {
    openExample: string;
    previewLoading: string;
    previewUnavailable: string;
    previewFailed: string;
    preview: string;
    open: string;
    embed: string;
    embedCopied: string;
    metadataLabel: string;
    officialLabel: string;
    trustedSourceLabel: string;
    updatedLabel: string;
  };
  variant?: 'default' | 'featured' | 'featured-primary';
}

export function VisualizationCard({
  example,
  locale,
  onOpenExample,
  labels,
  variant = 'default',
}: VisualizationCardProps) {
  const [embedCopied, setEmbedCopied] = useState(false);
  const title = getLocalizedText(example.title, locale);
  const meta = useMemo(
    () => getDerivedVisualizationMeta(example, locale),
    [example, locale]
  );
  const href = `/${locale}/demo-gallery?example=${example.id}`;

  const handleEmbed = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const embedCode = `<!-- ${title} -->\n<iframe src="${origin}${href}" title="${title}" width="100%" height="640" loading="lazy"></iframe>`;
    try {
      await navigator.clipboard.writeText(embedCode);
      setEmbedCopied(true);
      setTimeout(() => setEmbedCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy embed code', error);
    }
  };

  const isFeaturedPrimary = variant === 'featured-primary';

  return (
    <article
      className={`group flex h-full flex-col gap-4 rounded-[1.9rem] border border-slate-200 bg-white p-4 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.48)] transition-transform duration-200 hover:-translate-y-1 ${
        isFeaturedPrimary
          ? 'xl:col-span-2 xl:grid xl:grid-cols-[1.2fr_0.95fr] xl:gap-5'
          : ''
      }`}
    >
      <div className={isFeaturedPrimary ? 'xl:min-h-full' : ''}>
        <button
          type='button'
          onClick={() => onOpenExample(example, 'overview')}
          aria-label={`${labels.openExample}: ${title}`}
          className='block w-full rounded-[1.8rem] text-left focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2'
        >
          <ChartPreview example={example} locale={locale} labels={labels} />
        </button>
      </div>

      <div className='flex min-w-0 flex-1 flex-col gap-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <SourceBadge
            badge={meta.sourceBadge}
            label={meta.sourceLabel}
            icon={meta.sourceIcon}
            href={meta.dataSourceUrl}
            locale={locale}
          />
          <ChartTypeBadge label={meta.chartTypeLabel} />
          <span className='rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-emerald-700'>
            {labels.officialLabel}
          </span>
        </div>

        <div>
          <button
            type='button'
            onClick={() => onOpenExample(example, 'overview')}
            className='text-left focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2'
          >
            <h3 className='text-lg font-semibold leading-7 text-slate-950 transition-colors group-hover:text-gov-primary'>
              {title}
            </h3>
          </button>
          <p className='mt-2 line-clamp-3 text-sm leading-6 text-slate-600'>
            {meta.insightSubtitle}
          </p>
        </div>

        <dl className='grid gap-2 rounded-[1.4rem] bg-slate-50 p-3 text-sm text-slate-600'>
          <div className='flex flex-wrap items-center gap-1'>
            <dt className='sr-only'>{labels.metadataLabel}</dt>
            <dd className='font-medium text-slate-700'>
              <ChartTypeIcon
                type={example.chartConfig.type}
                className='mr-1.5 inline h-3.5 w-3.5 text-slate-500'
              />
              {meta.chartTypeLabel}
            </dd>
            <span aria-hidden='true'>·</span>
            <dd>{meta.sourceBadge}</dd>
            <span aria-hidden='true'>·</span>
            <dd>{meta.timeRangeLabel}</dd>
          </div>
          <div className='flex flex-wrap items-center gap-3 text-xs text-slate-500'>
            <span>{meta.reliabilityLabel}</span>
            <span>{meta.freshnessLabel}</span>
            {example.lastUpdated ? (
              <span className='inline-flex items-center gap-1'>
                <CalendarDays className='h-3.5 w-3.5' />
                {labels.updatedLabel}:{' '}
                {formatGalleryDate(example.lastUpdated, locale)}
              </span>
            ) : null}
          </div>
        </dl>

        <QuickActionButtons
          href={href}
          labels={{
            preview: labels.preview,
            open: labels.open,
            embed: labels.embed,
            embedCopied: labels.embedCopied,
          }}
          embedCopied={embedCopied}
          onPreview={() => onOpenExample(example, 'overview')}
          onEmbed={handleEmbed}
        />
      </div>
    </article>
  );
}
