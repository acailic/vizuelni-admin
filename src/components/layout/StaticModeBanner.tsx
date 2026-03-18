import Link from 'next/link';
import { Info } from 'lucide-react';

import {
  getSampleDataLabel,
  getStaticModeBadge,
  getStaticModeCtaLabel,
  getStaticModeMessage,
} from '@/lib/app-mode';
import type { Locale } from '@/lib/i18n/config';

interface StaticModeBannerProps {
  locale: Locale;
}

export function StaticModeBanner({ locale }: StaticModeBannerProps) {
  return (
    <div className='border-b border-amber-200 bg-amber-50 px-4 py-3 text-amber-950'>
      <div className='mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex items-start gap-3'>
          <span className='mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700'>
            <Info className='h-4 w-4' />
          </span>
          <div className='min-w-0'>
            <p className='text-sm font-semibold'>
              {getStaticModeBadge(locale)}
            </p>
            <p className='text-sm leading-6 text-amber-900/90'>
              {getStaticModeMessage(locale)}
            </p>
          </div>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Link
            href={`/${locale}/demo-gallery`}
            className='inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700'
          >
            {getStaticModeCtaLabel(locale)}
          </Link>
          <Link
            href={`/${locale}/data`}
            className='inline-flex items-center justify-center rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100'
          >
            {getSampleDataLabel(locale)}
          </Link>
        </div>
      </div>
    </div>
  );
}
