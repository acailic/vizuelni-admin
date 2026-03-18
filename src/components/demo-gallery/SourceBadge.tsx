'use client';

import { ExternalLink } from 'lucide-react';

import type { Locale } from '@/lib/i18n/config';

interface SourceBadgeProps {
  badge: string;
  label: string;
  icon: string;
  href?: string;
  locale?: Locale;
}

const OPENS_IN_NEW_TAB: Record<Locale, string> = {
  'sr-Cyrl': 'отвара се у новом језичку',
  'sr-Latn': 'otvara se u novom jezičku',
  en: 'opens in new tab',
};

export function SourceBadge({ badge, label, icon, href, locale = 'en' }: SourceBadgeProps) {
  const opensInNewTab = OPENS_IN_NEW_TAB[locale];

  const content = (
    <>
      <span aria-hidden='true'>{icon}</span>
      {badge}
      {href && (
        <ExternalLink
          className='h-3 w-3'
          aria-hidden='true'
        />
      )}
    </>
  );

  const baseClassName = 'inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700';

  if (href) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={`${baseClassName} hover:bg-slate-200 transition-colors`}
        title={`${label} - ${opensInNewTab}`}
        aria-label={`${label} - ${opensInNewTab}`}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      className={baseClassName}
      title={label}
      aria-label={label}
    >
      {content}
    </span>
  );
}
