'use client';

import {
  useDataSource,
  type DataSourceType,
} from '@/contexts/DataSourceContext';
import { cn } from '@/lib/utils/cn';
import type { Locale } from '@/lib/i18n/config';

// Labels for each locale
const LABELS: Record<
  Locale,
  { official: string; demo: string; label: string }
> = {
  'sr-Cyrl': {
    official: 'Званични каталог',
    demo: 'Демо скупови',
    label: 'Извор података',
  },
  'sr-Latn': {
    official: 'Zvanični katalog',
    demo: 'Demo skupovi',
    label: 'Izvor podataka',
  },
  en: {
    official: 'Official catalog',
    demo: 'Demo datasets',
    label: 'Data source',
  },
};

export interface DataSourceSwitcherProps {
  /** Current locale for translations */
  locale: Locale;
  /** Optional additional className */
  className?: string;
}

/**
 * DataSourceSwitcher - Radio button group to switch between official and demo data sources
 *
 * Visual design:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Извор података                                               │
 * │                                                              │
 * │ ○ Званични каталог    ● Демо скупови                        │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Features:
 * - Styled radio buttons (not native radio inputs)
 * - Keyboard accessible (arrow keys to navigate, space to select)
 * - ARIA attributes for screen readers
 * - Persists selection to localStorage via DataSourceContext
 */
export function DataSourceSwitcher({
  locale,
  className,
}: DataSourceSwitcherProps) {
  const { source, switchSource } = useDataSource();
  const labels = LABELS[locale];

  const options: Array<{ value: DataSourceType; label: string }> = [
    { value: 'official', label: labels.official },
    { value: 'demo', label: labels.demo },
  ];

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const optionsCount = options.length;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight': {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % optionsCount;
        switchSource(options[nextIndex]!.value);
        // Focus the next option
        (
          e.currentTarget.parentElement?.querySelectorAll('[role="radio"]')[
            nextIndex
          ] as HTMLElement
        )?.focus();
        break;
      }
      case 'ArrowUp':
      case 'ArrowLeft': {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + optionsCount) % optionsCount;
        switchSource(options[prevIndex]!.value);
        // Focus the previous option
        (
          e.currentTarget.parentElement?.querySelectorAll('[role="radio"]')[
            prevIndex
          ] as HTMLElement
        )?.focus();
        break;
      }
      case ' ':
      case 'Enter':
        e.preventDefault();
        switchSource(options[currentIndex]!.value);
        break;
    }
  };

  return (
    <div
      className={cn('space-y-2', className)}
      role='radiogroup'
      aria-label={labels.label}
    >
      <span className='text-sm font-medium text-slate-700'>{labels.label}</span>
      <div className='flex flex-col gap-2 sm:flex-row sm:gap-4'>
        {options.map((option, index) => {
          const isSelected = source === option.value;

          return (
            <div
              key={option.value}
              role='radio'
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => switchSource(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer',
                'transition-colors duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                isSelected
                  ? 'bg-blue-50 border border-blue-200 text-blue-700'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              )}
            >
              {/* Custom radio indicator */}
              <span
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                  'transition-colors duration-150',
                  isSelected
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300 bg-white'
                )}
                aria-hidden='true'
              >
                {isSelected && (
                  <span className='w-1.5 h-1.5 rounded-full bg-white' />
                )}
              </span>
              <span className='text-sm font-medium'>{option.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DataSourceSwitcher;
