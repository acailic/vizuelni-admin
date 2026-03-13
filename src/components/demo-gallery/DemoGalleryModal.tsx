'use client';

import { useState } from 'react';
import type { FeaturedExampleConfig } from '@/lib/examples/types';
import { getLocalizedText } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { ChartRenderer } from '@/components/charts/ChartRenderer';

interface DemoGalleryModalProps {
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

export function DemoGalleryModal({
  example,
  isOpen,
  onClose,
  locale,
  labels,
}: DemoGalleryModalProps) {
  const [showData, setShowData] = useState(false);

  if (!isOpen || !example) return null;

  const title = getLocalizedText(example.title, locale);
  const description = getLocalizedText(example.description, locale);
  const data = example.inlineData?.observations ?? [];
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto' onClick={onClose}>
      <div className='min-h-screen px-4 flex items-center justify-center'>
        <div className='fixed inset-0 bg-black/50' />
        <div
          className='relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
              {title}
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600'
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

          {/* Data Toggle */}
          <div className='px-6 pb-4'>
            <button
              onClick={() => setShowData(!showData)}
              className='text-sm text-blue-600 hover:text-blue-800 font-medium'
            >
              {showData ? labels.hideData : labels.viewData}
            </button>
          </div>

          {/* Data Table */}
          {showData && data.length > 0 && (
            <div className='px-6 pb-6 overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase'
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {data.slice(0, 20).map((row, i) => (
                    <tr key={i}>
                      {columns.map((col) => (
                        <td
                          key={col}
                          className='px-3 py-2 text-sm text-gray-900'
                        >
                          {String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 20 && (
                <p className='text-xs text-gray-400 mt-2'>
                  Showing first 20 of {data.length} rows
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
