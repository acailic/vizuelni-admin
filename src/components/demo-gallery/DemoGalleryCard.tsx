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
      className='bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer hover:border-blue-300'
    >
      <div className='h-48 bg-gray-50 dark:bg-gray-900 p-2'>
        {example.inlineData ? (
          <ChartRenderer
            config={example.chartConfig}
            data={example.inlineData.observations}
            locale={locale}
            previewMode={true}
          />
        ) : (
          <div className='h-full flex items-center justify-center text-gray-400'>
            No preview
          </div>
        )}
      </div>
      <div className='p-3'>
        <h3 className='font-medium text-gray-900 dark:text-white text-sm line-clamp-1'>
          {title}
        </h3>
      </div>
    </div>
  );
}
