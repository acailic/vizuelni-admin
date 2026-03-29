'use client';

import { useEffect, useMemo, useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import type { FeaturedExampleConfig } from '@/lib/examples/types';
import { getLocalizedText } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { formatMessage } from '@/lib/i18n/messages';
import { ChartRenderer } from '@/components/charts/ChartRenderer';

import { generateCodeExample, CodeExampleBlock } from './CopyCodeButton';
import { DataSourceSection } from './DataSourceSection';

interface DemoGalleryModalEnhancedProps {
  example: FeaturedExampleConfig | null;
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  initialPanel?: 'overview' | 'data' | 'code';
  labels: {
    close: string;
    viewData: string;
    hideData: string;
    showingRows: string;
    tableCaption: string;
    initialViewData: string;
    initialViewCode: string;
  };
}

export function DemoGalleryModalEnhanced({
  example,
  isOpen,
  onClose,
  locale,
  initialPanel = 'overview',
  labels,
}: DemoGalleryModalEnhancedProps) {
  const [showData, setShowData] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowData(false);
      setShowCode(false);
      return;
    }

    setShowData(initialPanel === 'data');
    setShowCode(initialPanel === 'code');
  }, [example?.id, initialPanel, isOpen]);

  const uiLabels = useMemo(
    () => ({
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
      lastUpdated:
        locale === 'sr-Cyrl'
          ? 'Ажурирано'
          : locale === 'sr-Latn'
            ? 'Ažurirano'
            : 'Last updated',
    }),
    [locale]
  );

  const formatLastUpdated = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      const localeCode =
        locale === 'sr-Cyrl' ? 'sr' : locale === 'sr-Latn' ? 'sr-Latn' : 'en';
      return date.toLocaleDateString(localeCode, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (!example) {
    return null;
  }

  const title = getLocalizedText(example.title, locale);
  const description = getLocalizedText(example.description, locale);
  const data = example.inlineData?.observations ?? [];
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const previewRows = data.slice(0, 20);
  const codeExample = generateCodeExample(example);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        <Dialog.Content className='fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[min(calc(100%-2rem),72rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'>
          <div className='flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5'>
            <div className='min-w-0'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gov-primary'>
                {example.dataSource}
              </p>
              <Dialog.Title className='mt-2 text-xl font-semibold text-slate-950'>
                {title}
              </Dialog.Title>
              <Dialog.Description className='mt-2 max-w-3xl text-sm leading-6 text-slate-600'>
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type='button'
                className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2'
                aria-label={labels.close}
              >
                <X className='h-5 w-5' />
              </button>
            </Dialog.Close>
          </div>

          <div className='flex-1 overflow-y-auto'>
            <div className='p-6'>
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                {example.inlineData && (
                  <ChartRenderer
                    config={example.chartConfig}
                    data={example.inlineData.observations}
                    locale={locale}
                  />
                )}
              </div>

              <DataSourceSection
                dataSource={example.dataSource}
                dataSourceUrl={example.dataSourceUrl}
                resourceUrl={example.resourceUrl}
                lastUpdated={example.lastUpdated}
                locale={locale}
              />
            </div>

            <div className='flex flex-wrap gap-3 px-6 pb-5'>
              <button
                type='button'
                onClick={() => setShowData((current) => !current)}
                disabled={data.length === 0}
                className='inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400'
              >
                {showData ? labels.hideData : labels.viewData}
              </button>
              <button
                type='button'
                onClick={() => setShowCode((current) => !current)}
                className='inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2'
              >
                {showCode ? uiLabels.hideCode : uiLabels.viewCode}
              </button>
            </div>

            {showCode && (
              <div className='border-t border-slate-200 px-6 py-6'>
                <CodeExampleBlock code={codeExample} locale={locale} />
                <div className='mt-4 flex flex-wrap gap-3'>
                  <a
                    href={`https://stackblitz.com/github/acailic/vizuelni-admin?file=src%2Fapp%2Fchart.tsx&showChart=${example.id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex min-h-11 items-center gap-2 rounded-lg bg-gov-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gov-secondary focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2'
                  >
                    <svg
                      className='h-4 w-4'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      aria-hidden='true'
                    >
                      <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
                    </svg>
                    {uiLabels.openInStackblitz}
                  </a>
                  <a
                    href={`https://codesandbox.io/s/vizualni-${example.id}?file=/src/App.tsx`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:ring-offset-2'
                  >
                    <svg
                      className='h-4 w-4'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      aria-hidden='true'
                    >
                      <path d='M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H9v-4H5v-2h4V7h2v4h4v2h-4v4z' />
                    </svg>
                    {uiLabels.openInCodesandbox}
                  </a>
                </div>
              </div>
            )}

            {showData && data.length > 0 && (
              <div className='border-t border-slate-200 px-6 py-6'>
                <div className='overflow-x-auto rounded-2xl border border-slate-200'>
                  <table className='min-w-full divide-y divide-slate-200 bg-white'>
                    <caption className='sr-only'>
                      {formatMessage(labels.tableCaption, { title })}
                    </caption>
                    <thead className='bg-slate-50'>
                      <tr>
                        {columns.map((column) => (
                          <th
                            key={column}
                            scope='col'
                            className='px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-200'>
                      {previewRows.map((row, index) => (
                        <tr key={index}>
                          {columns.map((column) => (
                            <td
                              key={column}
                              className='px-3 py-2.5 text-sm text-slate-700'
                            >
                              {String(row[column])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data.length > previewRows.length && (
                  <p className='mt-3 text-sm text-slate-600'>
                    {formatMessage(labels.showingRows, {
                      shown: previewRows.length,
                      total: data.length,
                    })}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className='border-t border-slate-200 bg-slate-50 px-6 py-4'>
            <dl className='grid gap-4 text-sm sm:grid-cols-3'>
              <div className='min-w-0'>
                <dt className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
                  {uiLabels.source}
                </dt>
                <dd className='mt-1 text-slate-700'>
                  {example.resourceUrl ? (
                    <a
                      href={example.resourceUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-gov-primary hover:text-gov-secondary hover:underline'
                    >
                      {example.dataSource}
                    </a>
                  ) : (
                    example.dataSource
                  )}
                </dd>
              </div>
              {example.lastUpdated && (
                <div className='min-w-0'>
                  <dt className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
                    {uiLabels.lastUpdated}
                  </dt>
                  <dd className='mt-1 text-slate-700'>
                    {formatLastUpdated(example.lastUpdated)}
                  </dd>
                </div>
              )}
              <div className='min-w-0'>
                <dt className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
                  {uiLabels.tags}
                </dt>
                <dd className='mt-1 text-slate-700'>
                  {example.tags?.join(', ') || '-'}
                </dd>
              </div>
            </dl>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
