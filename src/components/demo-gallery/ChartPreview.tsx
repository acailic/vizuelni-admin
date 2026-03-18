'use client';

import { useEffect, useRef, useState } from 'react';

import type { FeaturedExampleConfig } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import {
  buildPreviewConfig,
  getDerivedVisualizationMeta,
} from './galleryUtils';
import {
  PreviewErrorBoundary,
  PreviewStateHandler,
} from './PreviewStateHandler';

interface ChartPreviewProps {
  example: FeaturedExampleConfig;
  locale: Locale;
  labels: {
    previewLoading: string;
    previewUnavailable: string;
    previewFailed: string;
  };
}

export function ChartPreview({ example, locale, labels }: ChartPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [shouldRenderPreview, setShouldRenderPreview] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const meta = getDerivedVisualizationMeta(example, locale);
  const TIMEOUT_MS = 10000;

  const handleRetry = () => {
    setIsTimedOut(false);
    setShouldRenderPreview(false);
    // Re-trigger after small delay
    setTimeout(() => setShouldRenderPreview(true), 100);
  };

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
      { rootMargin: '300px' }
    );

    observer.observe(previewNode);

    return () => observer.disconnect();
  }, [example.inlineData]);

  useEffect(() => {
    if (!shouldRenderPreview) return;

    setIsTimedOut(false); // Reset on new render

    const timeout = setTimeout(() => {
      setIsTimedOut(true);
    }, TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [shouldRenderPreview, example.id]);

  const fallback = (
    <PreviewStateHandler
      state='error'
      chartType={meta.chartTypeLabel}
      labels={labels}
    />
  );

  if (isTimedOut) {
    return (
      <PreviewStateHandler
        state='error'
        chartType={meta.chartTypeLabel}
        labels={labels}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div
      ref={previewRef}
      className='relative h-52 rounded-[1.75rem] bg-slate-100'
    >
      {!example.inlineData ? (
        <PreviewStateHandler
          state='unavailable'
          chartType={meta.chartTypeLabel}
          labels={labels}
        />
      ) : !shouldRenderPreview ? (
        <PreviewStateHandler
          state='loading'
          chartType={meta.chartTypeLabel}
          labels={labels}
        />
      ) : (
        <PreviewErrorBoundary fallback={fallback} resetKey={example.id}>
          <div className='pointer-events-none h-full' aria-hidden='true'>
            <ChartRenderer
              config={buildPreviewConfig(example)}
              data={example.inlineData.observations}
              locale={locale}
              previewMode={true}
              height={184}
            />
          </div>
        </PreviewErrorBoundary>
      )}
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-[1.75rem] bg-gradient-to-t from-slate-950/10 to-transparent' />
    </div>
  );
}
