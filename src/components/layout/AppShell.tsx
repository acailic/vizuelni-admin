'use client';

import { memo, useState, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import type { Locale } from '@/lib/i18n/config';

interface AppShellProps {
  locale: Locale;
  children: React.ReactNode;
  messages: {
    sidebar: {
      browse: string;
      create: string;
      gallery: string;
      demoGallery: string;
      dashboard: string;
    };
    header: {
      searchPlaceholder: string;
      profile: string;
      settings: string;
      signOut: string;
      signIn: string;
    };
  };
}

function AppShellComponent({ locale, children, messages }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className='flex h-screen overflow-hidden bg-slate-50'>
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={closeMobileMenu}
          aria-hidden='true'
        />
      )}

      {/* Sidebar - hidden on mobile, always visible on desktop */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        <Sidebar
          locale={locale}
          messages={messages.sidebar}
          onNavigate={closeMobileMenu}
        />
      </div>

      {/* Main content area */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Mobile menu button - only visible on mobile */}
        <div className='flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden'>
          <button
            onClick={toggleMobileMenu}
            className='flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-primary'
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
          <span className='ml-3 text-lg font-bold text-[#0C1E42]'>
            Vizuelni Admin
          </span>
        </div>

        {/* Desktop header */}
        <div className='hidden lg:block'>
          <AppHeader locale={locale} messages={messages.header} />
        </div>

        <main className='flex-1 overflow-auto'>{children}</main>
      </div>
    </div>
  );
}

export const AppShell = memo(AppShellComponent);
