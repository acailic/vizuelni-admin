'use client';

import { useState } from 'react';
import type { FeaturedExampleConfig } from '@/lib/examples/types';
import { getLocalizedText } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import { generateCodeExample, CodeExampleBlock } from './CopyCodeButton';

interface DemoGalleryModalEnhancedProps {
  example: FeaturedExampleConfig | null;
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  labels: {
    close: string;
    viewData: string;
    hideData: string;
  };
}

export function DemoGalleryModalEnhanced({
  example,
  isOpen,
  onClose,
  locale,
  labels,
}: DemoGalleryModalEnhancedProps) {
  const [showData, setShowData] = useState(false);
  const [showCode, setShowCode] = useState(false);

  if (!isOpen || !example) return null;

  const title = getLocalizedText(example.title, locale);
  const description = getLocalizedText(example.description, locale);
  const data = example.inlineData?.observations ?? [];
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const codeExample = generateCodeExample(example);

  const uiLabels = {
    viewCode:
      locale === 'sr-Cyrl'
        ? 'Прикажи код'
        : locale === 'sr-Latn'
          ? 'Prikaži kod'
          : 'View Code',
    hideCode:
      locale === 'sr-Cyrl'
        ? 'Сакриј код'
        : locale === 'sr-Latn'
          ? 'Sakrij kod'
          : 'Hide Code',
    openInStackblitz: 'StackBlitz',
    openInCodesandbox: 'CodeSandbox',
    difficulty:
      locale === 'sr-Cyrl'
        ? 'Тежина'
        : locale === 'sr-Latn'
          ? 'Težina'
          : 'Difficulty',
    beginner:
      locale === 'sr-Cyrl'
        ? 'Почетник'
        : locale === 'sr-Latn'
          ? 'Početnik'
          : 'Beginner',
    intermediate:
      locale === 'sr-Cyrl'
        ? 'Средње'
        : locale === 'sr-Latn'
          ? 'Srednje'
          : 'Intermediate',
    advanced:
      locale === 'sr-Cyrl'
        ? 'Напредно'
        : locale === 'sr-Latn'
          ? 'Napredno'
          : 'Advanced',
    source:
      locale === 'sr-Cyrl'
        ? 'Извор'
        : locale === 'sr-Latn'
          ? 'Izvor'
          : 'Source',
    tags:
      locale === 'sr-Cyrl'
        ? 'Ознаке'
        : locale === 'sr-Latn'
          ? 'Oznake'
          : 'Tags',
  };

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto' onClick={onClose}>
      <div className='min-h-screen px-4 flex items-center justify-center'>
        <div className='fixed inset-0 bg-black/50' />
        <div
          className='relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10'>
            <div>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                {title}
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                {example.dataSource}
              </p>
            </div>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              aria-label={labels.close}
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {/* Chart */}
          <div className='p-6'>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              {description}
            </p>
            <div className='h-96 bg-gray-50 dark:bg-gray-900 rounded-lg p-4'>
              {example.inlineData && (
                <ChartRenderer
                  config={example.chartConfig}
                  data={example.inlineData.observations}
                  locale={locale}
                />
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className='px-6 pb-4 flex flex-wrap gap-3'>
            <button
              onClick={() => setShowData(!showData)}
              className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium'
            >
              {showData ? labels.hideData : labels.viewData}
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium'
            >
              {showCode ? uiLabels.hideCode : uiLabels.viewCode}
            </button>
          </div>

          {/* Code Example */}
          {showCode && (
            <div className='px-6 pb-6'>
              <CodeExampleBlock code={codeExample} locale={locale} />

              {/* Try it buttons */}
              <div className='mt-4 flex flex-wrap gap-3'>
                <a
                  href={`https://stackblitz.com/github/vizualni/vizualni-starter?file=src%2Fapp%2Fchart.tsx&showChart=${example.id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  <svg
                    className='w-4 h-4'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
                  </svg>
                  {uiLabels.openInStackblitz}
                </a>
                <a
                  href={`https://codesandbox.io/s/vizualni-${example.id}?file=/src/App.tsx`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors'
                >
                  <svg
                    className='w-4 h-4'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H9v-4H5v-2h4V7h2v4h4v2h-4v4z' />
                  </svg>
                  {uiLabels.openInCodesandbox}
                </a>
              </div>
            </div>
          )}

          {/* Data Table */}
          {showData && data.length > 0 && (
            <div className='px-6 pb-6 overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className='px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                  {data.slice(0, 20).map((row, i) => (
                    <tr key={i}>
                      {columns.map((col) => (
                        <td
                          key={col}
                          className='px-3 py-2 text-sm text-gray-900 dark:text-gray-100'
                        >
                          {String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 20 && (
                <p className='text-xs text-gray-400 dark:text-gray-500 mt-2'>
                  Showing first 20 of {data.length} rows
                </p>
              )}
            </div>
          )}

          {/* Metadata footer */}
          <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'>
            <div className='flex flex-wrap gap-6 text-sm'>
              <div>
                <span className='text-gray-500 dark:text-gray-400'>
                  {uiLabels.source}:{' '}
                </span>
                <span className='text-gray-900 dark:text-gray-100'>
                  {example.dataSource}
                </span>
              </div>
              <div>
                <span className='text-gray-500 dark:text-gray-400'>
                  {uiLabels.tags}:{' '}
                </span>
                <span className='text-gray-900 dark:text-gray-100'>
                  {example.tags?.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
