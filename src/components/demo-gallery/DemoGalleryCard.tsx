'use client';

import type { FeaturedExampleConfig } from '@/lib/examples/types';
import { getLocalizedText } from '@/lib/examples/types';
import type { Locale } from '@/lib/i18n/config';
import { ChartRenderer } from '@/components/charts/ChartRenderer';

interface DemoGalleryCardProps {
  example: FeaturedExampleConfig;
  locale: Locale;
  onClick: () => void;
}

export function DemoGalleryCard({
  example,
  locale,
  onClick,
}: DemoGalleryCardProps) {
  const title = getLocalizedText(example.title, locale);

  return (
    <div
      onClick={onClick}
      className='bg-white rounded-lg shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-all cursor-pointer hover:border-gov-secondary'
    >
      <div className='h-48 bg-slate-50 p-2'>
        {example.inlineData ? (
          <ChartRenderer
            config={example.chartConfig}
            data={example.inlineData.observations}
            locale={locale}
            previewMode={true}
            height={176}
          />
        ) : (
          <div className='h-full flex items-center justify-center text-slate-400'>
            No preview
          </div>
        )}
      </div>
      <div className='p-3'>
        <h3 className='font-medium text-slate-900 text-sm line-clamp-1'>
          {title}
        </h3>
      </div>
    </div>
  );
}
