/**
 * Export Components Index
 * Feature 42: PDF/PowerPoint Export
 */

'use client';

import React, { useState } from 'react';
import { PPTXBuilder, downloadBlob } from './pptx-builder';
import type {
  ChartSlideData,
  ComparisonSlideData,
  ContentSlideData,
  PPTXExportOptions,
  ExportResult,
} from './pptx-types';

// ============================================================
// EXPORT BUTTON COMPONENT
// ============================================================

interface ExportButtonProps {
  slides: (ChartSlideData | ComparisonSlideData | ContentSlideData)[];
  options: PPTXExportOptions;
  onExport?: (result: ExportResult) => void;
  className?: string;
  locale?: 'en' | 'sr' | 'srLat';
}

export function ExportButton({
  slides,
  options,
  onExport,
  className = '',
  locale = 'srLat',
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    const builder = new PPTXBuilder(options);

    slides.forEach((slide) => {
      if ('chartImage' in slide || 'insights' in slide) {
        builder.addChartSlide(slide as ChartSlideData);
      } else if ('leftTitle' in slide) {
        builder.addComparisonSlide(slide as ComparisonSlideData);
      } else if ('content' in slide) {
        builder.addContentSlide(slide as ContentSlideData);
      }
    });

    const result = await builder.generate();

    if (result.success && result.blob && result.filename) {
      downloadBlob(result.blob, result.filename);
      onExport?.(result);
    } else {
      setError(result.error || 'Export failed');
    }

    setIsExporting(false);
  };

  const labels = {
    en: {
      export: 'Export to PowerPoint',
      exporting: 'Exporting...',
      error: 'Export failed',
    },
    sr: {
      export: 'Извоз у PowerPoint',
      exporting: 'Извоз у току...',
      error: 'Извоз није успео',
    },
    srLat: {
      export: 'Izvoz u PowerPoint',
      exporting: 'Izvoz u toku...',
      error: 'Izvoz nije uspeo',
    },
  };

  const t = labels[locale];

  return (
    <div className='inline-flex flex-col'>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors ${className}`}
      >
        {isExporting ? t.exporting : t.export}
      </button>
      {error && (
        <span className='text-red-600 text-sm mt-1'>
          {t.error}: {error}
        </span>
      )}
    </div>
  );
}

// ============================================================
// BATCH EXPORT COMPONENT
// ============================================================

interface BatchExportProps {
  items: {
    id: string;
    title: string;
    slides: (ChartSlideData | ComparisonSlideData | ContentSlideData)[];
  }[];
  options: PPTXExportOptions;
  onComplete?: (results: ExportResult[]) => void;
  locale?: 'en' | 'sr' | 'srLat';
}

export function BatchExportButton({
  items,
  options,
  onComplete,
  locale = 'srLat',
}: BatchExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [currentItem, setCurrentItem] = useState<string | null>(null);
  const [completed, setCompleted] = useState(0);
  const [_results, setResults] = useState<ExportResult[]>([]);

  const handleBatchExport = async () => {
    setIsExporting(true);
    setResults([]);
    setCompleted(0);

    const allResults: ExportResult[] = [];

    for (const item of items) {
      setCurrentItem(item.title);

      const builder = new PPTXBuilder({
        ...options,
        title: item.title,
      });

      item.slides.forEach((slide) => {
        if ('chartImage' in slide || 'insights' in slide) {
          builder.addChartSlide(slide as ChartSlideData);
        } else if ('leftTitle' in slide) {
          builder.addComparisonSlide(slide as ComparisonSlideData);
        } else if ('content' in slide) {
          builder.addContentSlide(slide as ContentSlideData);
        }
      });

      const result = await builder.generate();
      allResults.push(result);

      if (result.success && result.blob && result.filename) {
        downloadBlob(result.blob, result.filename);
      }

      setCompleted((prev) => prev + 1);
    }

    setIsExporting(false);
    setCurrentItem(null);
    onComplete?.(allResults);
  };

  const labels = {
    en: {
      export: `Export ${items.length} Items`,
      exporting: 'Exporting',
      progress: `${completed} of ${items.length}`,
    },
    sr: {
      export: `Извоз ${items.length} ставки`,
      exporting: 'Извоз у току',
      progress: `${completed} од ${items.length}`,
    },
    srLat: {
      export: `Izvoz ${items.length} stavki`,
      exporting: 'Izvoz u toku',
      progress: `${completed} od ${items.length}`,
    },
  };

  const t = labels[locale];

  return (
    <div className='inline-flex flex-col'>
      <button
        onClick={handleBatchExport}
        disabled={isExporting}
        className='px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors'
      >
        {isExporting ? `${t.exporting}: ${currentItem}...` : t.export}
      </button>
      {isExporting && (
        <div className='mt-2'>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-green-600 h-2 rounded-full transition-all'
              style={{ width: `${(completed / items.length) * 100}%` }}
            />
          </div>
          <span className='text-sm text-gray-500'>{t.progress}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EXPORT PREVIEW COMPONENT
// ============================================================

interface ExportPreviewProps {
  slides: (ChartSlideData | ComparisonSlideData | ContentSlideData)[];
  locale?: 'en' | 'sr' | 'srLat';
}

export function ExportPreview({
  slides,
  locale = 'srLat',
}: ExportPreviewProps) {
  const [selectedSlide, setSelectedSlide] = useState(0);

  const labels = {
    en: { slides: 'Slides', preview: 'Preview' },
    sr: { slides: 'Слајдови', preview: 'Преглед' },
    srLat: { slides: 'Slajdovi', preview: 'Pregled' },
  };

  const t = labels[locale];

  return (
    <div className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
      <div className='flex'>
        {/* Slide list */}
        <div className='w-48 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2'>
          <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-2'>
            {t.slides} ({slides.length})
          </p>
          <div className='space-y-1'>
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setSelectedSlide(index)}
                className={`w-full text-left px-2 py-1.5 text-sm rounded ${
                  selectedSlide === index
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {index + 1}. {slide.title}
              </button>
            ))}
          </div>
        </div>

        {/* Preview area */}
        <div className='flex-1 p-4'>
          <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-2'>
            {t.preview}
          </p>
          <div className='aspect-[16/9] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center'>
            {slides[selectedSlide] && (
              <div className='text-center p-4'>
                <p className='text-lg font-medium text-gray-900 dark:text-white'>
                  {slides[selectedSlide].title}
                </p>
                {'insights' in slides[selectedSlide] &&
                  (slides[selectedSlide] as ChartSlideData).insights && (
                    <ul className='mt-2 text-sm text-gray-500 text-left'>
                      {(slides[selectedSlide] as ChartSlideData).insights?.map(
                        (insight, i) => (
                          <li key={i}>• {insight}</li>
                        )
                      )}
                    </ul>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { PPTXBuilder, downloadBlob };
export type {
  ChartSlideData,
  ComparisonSlideData,
  ContentSlideData,
  PPTXExportOptions,
  ExportResult,
};
