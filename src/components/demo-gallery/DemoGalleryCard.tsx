'use client';

import { useEffect, useRef, useState } from 'react';

import type { FeaturedExampleConfig } from '@/lib/examples/types';
import { getLocalizedText } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { ChartRenderer } from '@/components/charts/ChartRenderer';

interface DemoGalleryCardProps {
  example: FeaturedExampleConfig;
  locale: Locale;
  onClick: () => void;
  labels: {
    openExample: string;
    previewLoading: string;
    previewUnavailable: string;
  };
  categoryLabel?: string;
}

export function DemoGalleryCard({
  example,
  locale,
  onClick,
  labels,
  categoryLabel,
}: DemoGalleryCardProps) {
  const title = getLocalizedText(example.title, locale);
  const description = getLocalizedText(example.description, locale);
  const previewRef = useRef<HTMLDivElement>(null);
  const [shouldRenderPreview, setShouldRenderPreview] = useState(false);

  useEffect(() => {
    if (!example.inlineData) {
      return;
    }

    const previewNode = previewRef.current;

    if (!previewNode || typeof IntersectionObserver === 'undefined') {
      setShouldRenderPreview(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRenderPreview(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px' }
    );

    observer.observe(previewNode);

    return () => observer.disconnect();
  }, [example.inlineData]);

  return (
    <button
      type='button'
      onClick={onClick}
      aria-haspopup='dialog'
      aria-label={`${labels.openExample}: ${title}`}
      className='group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-gov-primary/40 hover:shadow-lg focus:outline-none focus-visible:border-gov-primary focus-visible:ring-2 focus-visible:ring-gov-primary/20 focus-visible:ring-offset-2'
    >
      <div ref={previewRef} className='h-48 bg-slate-50 p-3'>
        {example.inlineData ? (
          shouldRenderPreview ? (
            <div className='pointer-events-none h-full' aria-hidden='true'>
              <ChartRenderer
                config={example.chartConfig}
                data={example.inlineData.observations}
                locale={locale}
                previewMode={true}
                height={168}
              />
            </div>
          ) : (
            <div className='flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white/70 text-center'>
              <div className='h-16 w-32 animate-pulse rounded-xl bg-slate-200/70' />
              <p className='text-sm font-medium text-slate-500'>
                {labels.previewLoading}
              </p>
            </div>
          )
        ) : (
          <div className='flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 text-center text-sm font-medium text-slate-500'>
            {labels.previewUnavailable}
          </div>
        )}
      </div>
      <div className='flex flex-1 flex-col gap-2 p-4'>
        <div className='flex items-center justify-between gap-2'>
          <h3 className='text-base font-semibold text-slate-950 line-clamp-1'>
            {title}
          </h3>
          {categoryLabel && (
            <span className='shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600'>
              {categoryLabel}
            </span>
          )}
        </div>
        <p className='line-clamp-2 text-sm leading-6 text-slate-600'>
          {description}
        </p>
      </div>
    </button>
  );
}
