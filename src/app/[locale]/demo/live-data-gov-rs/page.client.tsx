'use client';

import { Database, FileJson, Settings2, BarChart3, Code2 } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';

interface LiveDataDemoClientProps {
  locale: Locale;
  translations: Record<string, string>;
}

export default function LiveDataDemoClient({
  locale,
  translations,
}: LiveDataDemoClientProps) {
  const t = (key: string, fallback: string) => translations[key] || fallback;

  return (
    <main className='min-h-screen bg-slate-50 py-8'>
      <div className='container-custom'>
        {/* Page Header */}
        <header className='mb-8'>
          <h1 className='text-3xl font-bold text-gov-primary mb-2'>
            {t('title', 'Live Data.gov.rs Demo')}
          </h1>
          <p className='text-slate-600 text-lg'>
            {t(
              'subtitle',
              'See how to transform a dataset from data.gov.rs into an interactive visualization'
            )}
          </p>
        </header>

        {/* Demo Layout: 2 columns on desktop */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Left Column */}
          <div className='space-y-6'>
            {/* Panel 1: Dataset Picker */}
            <section
              className='bg-white rounded-lg border border-slate-200 p-6'
              aria-labelledby='dataset-picker-heading'
            >
              <h2
                id='dataset-picker-heading'
                className='flex items-center gap-2 text-lg font-semibold text-gov-primary mb-4'
              >
                <Database className='h-5 w-5' />
                {t('panelDatasetPicker', 'Select Dataset')}
              </h2>
              <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                <p className='text-slate-500'>
                  {t(
                    'placeholderDatasetPicker',
                    'Three dataset selection cards will appear here.'
                  )}
                </p>
              </div>
            </section>

            {/* Panel 2: Metadata */}
            <section
              className='bg-white rounded-lg border border-slate-200 p-6'
              aria-labelledby='metadata-heading'
            >
              <h2
                id='metadata-heading'
                className='flex items-center gap-2 text-lg font-semibold text-gov-primary mb-4'
              >
                <FileJson className='h-5 w-5' />
                {t('panelMetadata', 'Dataset Metadata')}
              </h2>
              <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                <p className='text-slate-500'>
                  {t(
                    'placeholderMetadata',
                    'Metadata for the selected dataset will be shown here.'
                  )}
                </p>
              </div>
            </section>

            {/* Panel 3: Raw Preview */}
            <section
              className='bg-white rounded-lg border border-slate-200 p-6'
              aria-labelledby='raw-preview-heading'
            >
              <h2
                id='raw-preview-heading'
                className='flex items-center gap-2 text-lg font-semibold text-gov-primary mb-4'
              >
                <Code2 className='h-5 w-5' />
                {t('panelRawPreview', 'Raw Data Preview')}
              </h2>
              <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                <p className='text-slate-500'>
                  {t(
                    'placeholderRawPreview',
                    'The first few rows of CSV/JSON data will be displayed here.'
                  )}
                </p>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            {/* Panel 4: Parsed Schema */}
            <section
              className='bg-white rounded-lg border border-slate-200 p-6'
              aria-labelledby='schema-heading'
            >
              <h2
                id='schema-heading'
                className='flex items-center gap-2 text-lg font-semibold text-gov-primary mb-4'
              >
                <Settings2 className='h-5 w-5' />
                {t('panelSchema', 'Parsed Data Schema')}
              </h2>
              <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                <p className='text-slate-500'>
                  {t(
                    'placeholderSchema',
                    'Automatically detected columns and data types will be shown here.'
                  )}
                </p>
              </div>
            </section>

            {/* Panel 5: Chart Output */}
            <section
              className='bg-white rounded-lg border border-slate-200 p-6'
              aria-labelledby='chart-output-heading'
            >
              <h2
                id='chart-output-heading'
                className='flex items-center gap-2 text-lg font-semibold text-gov-primary mb-4'
              >
                <BarChart3 className='h-5 w-5' />
                {t('panelChartOutput', 'Chart Output')}
              </h2>
              <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center min-h-[300px] flex items-center justify-center'>
                <p className='text-slate-500'>
                  {t(
                    'placeholderChartOutput',
                    'A chart generated from the data will be rendered here.'
                  )}
                </p>
              </div>
            </section>

            {/* Panel 6: Copyable Code */}
            <section
              className='bg-white rounded-lg border border-slate-200 p-6'
              aria-labelledby='code-heading'
            >
              <h2
                id='code-heading'
                className='flex items-center gap-2 text-lg font-semibold text-gov-primary mb-4'
              >
                <Code2 className='h-5 w-5' />
                {t('panelCode', 'Copy Code')}
              </h2>
              <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                <p className='text-slate-500'>
                  {t(
                    'placeholderCode',
                    'Code to replicate this visualization will be available here.'
                  )}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
