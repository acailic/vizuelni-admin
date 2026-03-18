'use client';

import { memo } from 'react';
import { GlobalSearch } from './GlobalSearch';
import { UserMenu } from './UserMenu';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import type { Locale } from '@/lib/i18n/config';
import { appFeatures, getStaticModeBadge } from '@/lib/app-mode';
import { getLocalizedPathname } from '@/lib/url/base-path';

interface AppHeaderProps {
  locale: Locale;
  messages: {
    searchPlaceholder: string;
    profile: string;
    settings: string;
    signOut: string;
    signIn: string;
  };
}

function AppHeaderComponent({ locale, messages }: AppHeaderProps) {
  const handleLanguageChange = (lang: 'sr' | 'lat' | 'en') => {
    const localeMap: Record<string, Locale> = {
      sr: 'sr-Cyrl',
      lat: 'sr-Latn',
      en: 'en',
    };
    const newLocale = localeMap[lang];
    if (newLocale && newLocale !== locale) {
      const nextPath = getLocalizedPathname(
        window.location.pathname,
        newLocale
      );
      window.location.href = `${nextPath}${window.location.search}${window.location.hash}`;
    }
  };

  const currentLang: 'sr' | 'lat' | 'en' =
    locale === 'sr-Cyrl' ? 'sr' : locale === 'sr-Latn' ? 'lat' : 'en';

  return (
    <header className='flex h-16 items-center justify-between border-b border-slate-300 bg-white px-6'>
      {appFeatures.serverSearch ? (
        <GlobalSearch
          locale={locale}
          placeholder={messages.searchPlaceholder}
        />
      ) : (
        <div className='text-sm font-medium text-slate-500'>
          {getStaticModeBadge(locale)}
        </div>
      )}
      <div className='flex items-center gap-4'>
        <LanguageSwitcher
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
        />
        {appFeatures.auth && <UserMenu locale={locale} messages={messages} />}
      </div>
    </header>
  );
}

export const AppHeader = memo(AppHeaderComponent);
