'use client';

import { AlertTriangle, RefreshCw, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Locale } from '@/lib/i18n/config';

// Labels for each locale
const LABELS: Record<
  Locale,
  {
    title: string;
    description: string;
    retry: string;
    accept: string;
  }
> = {
  'sr-Cyrl': {
    title: 'Званични каталог није доступан',
    description:
      'Нисмо успели да учитамо податке са data.gov.rs након 2 покушаја. Аутоматски смо прешли на демо скупове.',
    retry: 'Покушај поново са званичним',
    accept: 'Настави са демо',
  },
  'sr-Latn': {
    title: 'Zvanični katalog nije dostupan',
    description:
      'Nismo uspeli da učitamo podatke sa data.gov.rs nakon 2 pokušaja. Automatski smo prešli na demo skupove.',
    retry: 'Pokušaj ponovo sa zvaničnim',
    accept: 'Nastavi sa demo',
  },
  en: {
    title: 'Official catalog unavailable',
    description:
      'We could not load data from data.gov.rs after 2 attempts. We have automatically switched to demo datasets.',
    retry: 'Retry with official',
    accept: 'Continue with demo',
  },
};

export interface ErrorFallbackBannerProps {
  /** Current locale for translations */
  locale: Locale;
  /** Callback when user clicks retry button */
  onRetry: () => void;
  /** Callback when user clicks accept button */
  onAccept: () => void;
  /** Optional additional className */
  className?: string;
}

/**
 * ErrorFallbackBanner - Explain fallback situation and provide actions
 *
 * Visual design:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ ⚠️  Званични каталог није доступан                          │
 * │                                                              │
 * │ Нисмо успели да учитамо податке са data.gov.rs након 2     │
 * │ покушаја. Аутоматски смо прешли на демо скупове.           │
 * │                                                              │
 * │ [🔄 Покушај поново са званичним]  [✓ Настави са демо]      │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Usage:
 * - Show when status === 'fallback' AND !isFallbackDismissed
 * - "Retry" button calls onRetry (which should call context.retry())
 * - "Accept" button calls onAccept (which should call context.dismissFallback())
 */
export function ErrorFallbackBanner({
  locale,
  onRetry,
  onAccept,
  className,
}: ErrorFallbackBannerProps) {
  const labels = LABELS[locale];

  return (
    <div
      className={cn(
        'rounded-lg border border-amber-200 bg-amber-50 p-4',
        'text-amber-900',
        className
      )}
      role='alert'
      aria-live='polite'
    >
      {/* Header with icon and title */}
      <div className='flex items-start gap-3'>
        <AlertTriangle
          className='w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5'
          aria-hidden='true'
        />
        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-semibold text-amber-800 mb-1'>
            {labels.title}
          </h3>
          <p className='text-sm text-amber-700 mb-3'>{labels.description}</p>

          {/* Action buttons */}
          <div className='flex flex-col gap-2 sm:flex-row sm:gap-3'>
            <button
              onClick={onRetry}
              className={cn(
                'inline-flex items-center justify-center gap-2',
                'px-4 py-2 rounded-lg text-sm font-medium',
                'bg-amber-600 text-white',
                'hover:bg-amber-700 active:bg-amber-800',
                'transition-colors duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-amber-50'
              )}
            >
              <RefreshCw className='w-4 h-4' aria-hidden='true' />
              {labels.retry}
            </button>
            <button
              onClick={onAccept}
              className={cn(
                'inline-flex items-center justify-center gap-2',
                'px-4 py-2 rounded-lg text-sm font-medium',
                'bg-white text-amber-700 border border-amber-300',
                'hover:bg-amber-100 active:bg-amber-200',
                'transition-colors duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-amber-50'
              )}
            >
              <Check className='w-4 h-4' aria-hidden='true' />
              {labels.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallbackBanner;
