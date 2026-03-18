'use client';

import { useEffect, useRef } from 'react';
import { Globe, Clock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import {
  useDataSource,
  type ConnectionStatus,
} from '@/contexts/DataSourceContext';
import type { Locale } from '@/lib/i18n/config';

// Status color configuration
const STATUS_COLORS: Record<
  ConnectionStatus,
  { bg: string; text: string; dot: string }
> = {
  connected: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  connecting: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  fallback: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
};

// Translation keys for dataSource
interface DataSourceLabels {
  official: string;
  demo: string;
  sourceLabel: string;
  status: {
    connected: string;
    connecting: string;
    fallback: string;
    error: string;
  };
  lastUpdate: string;
}

// Labels for each locale
const LABELS: Record<Locale, DataSourceLabels> = {
  'sr-Cyrl': {
    official: 'Званични каталог',
    demo: 'Демо скупови',
    sourceLabel: 'Извор',
    status: {
      connected: 'Повезан',
      connecting: 'Повезивање...',
      fallback: 'Резервни режим',
      error: 'Недоступан',
    },
    lastUpdate: 'Последње ажурирање',
  },
  'sr-Latn': {
    official: 'Zvanični katalog',
    demo: 'Demo skupovi',
    sourceLabel: 'Izvor',
    status: {
      connected: 'Povezan',
      connecting: 'Povezivanje...',
      fallback: 'Rezervni režim',
      error: 'Nedostupan',
    },
    lastUpdate: 'Poslednje ažuriranje',
  },
  en: {
    official: 'Official catalog',
    demo: 'Demo datasets',
    sourceLabel: 'Source',
    status: {
      connected: 'Connected',
      connecting: 'Connecting...',
      fallback: 'Fallback mode',
      error: 'Unavailable',
    },
    lastUpdate: 'Last update',
  },
};

// Date formatting options per locale
const DATE_LOCALE_MAP: Record<Locale, string> = {
  'sr-Cyrl': 'sr-Cyrl',
  'sr-Latn': 'sr-Latn',
  en: 'en-US',
};

export interface CatalogStatusBarProps {
  /** Current locale for translations */
  locale: Locale;
  /** Compact mode for mobile view */
  compact?: boolean;
  /** Optional additional className */
  className?: string;
}

/**
 * CatalogStatusBar - Always-visible indicator of data source and connection health
 *
 * Visual design:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 🌐 Извор: data.gov.rs (званични)  ● Повезан  🕒 17.03 14:32 │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Status indicators:
 * - connected: green (#10B981) - "Повезан"
 * - connecting: yellow (#F59E0B) - "Повезивање..."
 * - fallback: yellow (#F59E0B) - "Резервни режим"
 * - error: red (#EF4444) - "Недоступан"
 *
 * Accessibility features:
 * - aria-live region announces status changes
 * - Screen reader text for status indicator
 * - Semantic structure with proper roles
 */
export function CatalogStatusBar({
  locale,
  compact = false,
  className,
}: CatalogStatusBarProps) {
  const { source, status, lastUpdated } = useDataSource();
  const labels = LABELS[locale];
  const statusColors = STATUS_COLORS[status];
  const previousStatusRef = useRef<ConnectionStatus>(status);

  // Format the last updated timestamp
  const formattedTimestamp = lastUpdated
    ? new Intl.DateTimeFormat(DATE_LOCALE_MAP[locale], {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(lastUpdated)
    : null;

  // Get source display name
  const sourceName = source === 'official' ? 'data.gov.rs' : 'Demo';
  const sourceType = source === 'official' ? labels.official : labels.demo;

  // Announce status changes to screen readers
  useEffect(() => {
    if (previousStatusRef.current !== status) {
      // The aria-live region will automatically announce the new status
      previousStatusRef.current = status;
    }
  }, [status]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-200',
        'bg-slate-50 text-slate-700',
        'text-sm',
        compact ? 'flex-wrap gap-2' : '',
        className
      )}
      role='status'
      aria-label={`${labels.sourceLabel}: ${sourceName} (${sourceType})`}
    >
      {/* Source indicator */}
      <div className='flex items-center gap-2'>
        <Globe className='w-4 h-4 text-slate-500' aria-hidden='true' />
        <span className='font-medium'>
          <span className='text-slate-500'>{labels.sourceLabel}:</span>{' '}
          <span className='text-slate-900'>{sourceName}</span>
          {!compact && (
            <span className='text-slate-400 ml-1'>({sourceType})</span>
          )}
        </span>
      </div>

      {/* Separator */}
      <div
        className='hidden sm:block w-px h-4 bg-slate-200'
        aria-hidden='true'
      />

      {/* Status indicator */}
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-0.5 rounded-full',
          statusColors.bg,
          statusColors.text
        )}
        aria-live='polite'
        aria-atomic='true'
      >
        {/* Status dot */}
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            statusColors.dot,
            status === 'connecting' && 'animate-pulse'
          )}
          aria-hidden='true'
        />
        <span className='font-medium'>{labels.status[status]}</span>
      </div>

      {/* Last updated timestamp - only show when connected */}
      {status === 'connected' && formattedTimestamp && (
        <>
          <div
            className='hidden sm:block w-px h-4 bg-slate-200'
            aria-hidden='true'
          />
          <div className='flex items-center gap-1.5 text-slate-500'>
            <Clock className='w-3.5 h-3.5' aria-hidden='true' />
            <span className='sr-only'>{labels.lastUpdate}:</span>
            <time dateTime={lastUpdated?.toISOString()} className='text-xs'>
              {formattedTimestamp}
            </time>
          </div>
        </>
      )}
    </div>
  );
}

export default CatalogStatusBar;
