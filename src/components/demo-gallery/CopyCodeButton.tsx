'use client';

import { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';
import type { FeaturedExampleConfig } from '@/lib/examples/types';

interface CopyCodeButtonProps {
  code: string;
  locale?: string;
  className?: string;
}

export function CopyCodeButton({
  code,
  locale = 'en',
  className = '',
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const labels = {
    copy:
      locale === 'sr-Cyrl'
        ? 'Копирај код'
        : locale === 'sr-Latn'
          ? 'Kopiraj kod'
          : 'Copy code',
    copied:
      locale === 'sr-Cyrl'
        ? 'Копирано!'
        : locale === 'sr-Latn'
          ? 'Kopirano!'
          : 'Copied!',
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
        copied
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      } ${className}`}
      title={copied ? labels.copied : labels.copy}
    >
      {copied ? (
        <>
          <Check className='w-4 h-4' />
          {labels.copied}
        </>
      ) : (
        <>
          <Copy className='w-4 h-4' />
          {labels.copy}
        </>
      )}
    </button>
  );
}

type CodeExampleSource = Pick<
  FeaturedExampleConfig,
  'id' | 'chartConfig' | 'inlineData'
>;

export function generateCodeExample(example: CodeExampleSource): string {
  const { chartConfig, inlineData } = example;
  const chartType =
    chartConfig.type.charAt(0).toUpperCase() + chartConfig.type.slice(1);

  // Generate data snippet (first 5 rows)
  const dataSnippet = inlineData?.observations?.slice(0, 5) || [];
  const dataString = JSON.stringify(dataSnippet, null, 2)
    .split('\n')
    .map((line) => '  ' + line)
    .join('\n');

  // Generate the code example
  const code = `import { ${chartType}Chart } from '@vizualni/charts';

const data = ${dataString};

export default function Chart() {
  return (
    <${chartType}Chart
      data={data}
      xField="${chartConfig.x_axis?.field || 'category'}"
      yField="${chartConfig.y_axis?.field || 'value'}"
      title="${chartConfig.title || 'Example Chart'}"
      options={{
        showGrid: ${chartConfig.options?.showGrid ?? true},
        showLegend: ${chartConfig.options?.showLegend ?? true},
        colors: ${JSON.stringify((chartConfig.options?.colors as string[]) || ['#0D4077'])}
      }}
    />
  );
}`;

  return code;
}

export function CodeExampleBlock({
  code,
  locale = 'en',
  showCopyButton = true,
}: {
  code: string;
  locale?: string;
  showCopyButton?: boolean;
}) {
  const labels = {
    title:
      locale === 'sr-Cyrl'
        ? 'Пример кода'
        : locale === 'sr-Latn'
          ? 'Primer koda'
          : 'Code Example',
    language:
      locale === 'sr-Cyrl'
        ? 'Копирајте и покрените'
        : locale === 'sr-Latn'
          ? 'Kopirajte i pokrenite'
          : 'Copy and run',
  };

  return (
    <div className='bg-gray-900 rounded-lg overflow-hidden'>
      <div className='flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700'>
        <div className='flex items-center gap-2'>
          <Code2 className='w-4 h-4 text-gray-400' />
          <span className='text-sm font-medium text-gray-300'>
            {labels.title}
          </span>
        </div>
        {showCopyButton && <CopyCodeButton code={code} locale={locale} />}
      </div>
      <pre className='p-4 overflow-x-auto text-sm'>
        <code className='text-gray-100 language-tsx'>{code}</code>
      </pre>
      <div className='px-4 py-2 bg-gray-800 border-t border-gray-700'>
        <span className='text-xs text-gray-500'>{labels.language}</span>
      </div>
    </div>
  );
}
