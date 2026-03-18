'use client';

import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Database,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  LayoutGrid,
  PlusCircle,
  ShieldCheck,
  User,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';

import {
  getAccessibilityLabel,
  getSampleDataLabel,
  isStaticMode,
} from '@/lib/app-mode';
import { cn } from '@/lib/utils/cn';
import { withBasePath } from '@/lib/url/base-path';
import { SidebarNavItem } from './SidebarNavItem';
import { useSidebarState } from '@/lib/hooks/useSidebarState';
import type { Locale } from '@/lib/i18n/config';

interface SidebarProps {
  locale: Locale;
  messages: {
    browse: string;
    create: string;
    gallery: string;
    dashboard: string;
    demoGallery: string;
    analytics: string;
  };
  /** Callback fired when navigation occurs (used to close mobile menu) */
  onNavigate?: () => void;
}

function SidebarComponent({ locale, messages, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const currentPathname = pathname ?? '';
  const { isCollapsed, toggle } = useSidebarState();

  const navItems = isStaticMode
    ? [
        {
          href: `/${locale}/data`,
          icon: Database,
          label: getSampleDataLabel(locale),
        },
        {
          href: `/${locale}/demo-gallery`,
          icon: BarChart3,
          label: messages.demoGallery,
        },
        {
          href: `/${locale}/analytics`,
          icon: TrendingUp,
          label: messages.analytics,
        },
        {
          href: `/${locale}/guide/chart-types`,
          icon: BookOpen,
          label:
            locale === 'sr-Cyrl'
              ? 'Водич'
              : locale === 'sr-Latn'
                ? 'Vodič'
                : 'Guide',
        },
        {
          href: `/${locale}/accessibility`,
          icon: ShieldCheck,
          label: getAccessibilityLabel(locale),
        },
      ]
    : [
        {
          href: `/${locale}/browse`,
          icon: Database,
          label: messages.browse,
        },
        {
          href: `/${locale}/create`,
          icon: PlusCircle,
          label: messages.create,
        },
        {
          href: `/${locale}/gallery`,
          icon: LayoutGrid,
          label: messages.gallery,
        },
        {
          href: `/${locale}/demo-gallery`,
          icon: BarChart3,
          label: messages.demoGallery,
        },
        {
          href: `/${locale}/analytics`,
          icon: TrendingUp,
          label: messages.analytics,
        },
        {
          href: `/${locale}/guide/chart-types`,
          icon: BookOpen,
          label:
            locale === 'sr-Cyrl'
              ? 'Водич'
              : locale === 'sr-Latn'
                ? 'Vodič'
                : 'Guide',
        },
        {
          href: `/${locale}/dashboard`,
          icon: User,
          label: messages.dashboard,
        },
      ];

  return (
    <aside
      className={cn(
        'flex h-screen w-64 flex-col border-r border-white/10 bg-[#0C1E42]',
        // On desktop, respect collapse state; on mobile always full width
        'lg:transition-all lg:duration-300',
        isCollapsed && 'lg:w-16'
      )}
    >
      {/* Logo */}
      <Link
        href={`/${locale}`}
        className={cn(
          'flex h-16 items-center border-b border-white/10 px-4',
          isCollapsed ? 'lg:justify-center' : 'gap-3'
        )}
        onClick={onNavigate}
      >
        <Image
          src={withBasePath('/serbia-logo.png')}
          alt='Serbia'
          width={32}
          height={38}
          className='h-8 w-auto'
          priority
        />
        {!isCollapsed && (
          <span className='text-sm font-bold text-white font-display'>
            {locale === 'en' ? 'Vizuelni Admin' : locale === 'sr-Latn' ? 'Vizuelni Admin' : 'Визуелни Админ'}
          </span>
        )}
      </Link>

      {/* Navigation */}
      <nav className='flex-1 space-y-1 p-3'>
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            {...item}
            isCollapsed={isCollapsed}
            isActive={
              item.href === `/${locale}`
                ? currentPathname === item.href
                : currentPathname.startsWith(item.href)
            }
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Collapse toggle - desktop only */}
      <button
        onClick={toggle}
        className='hidden lg:flex h-12 items-center justify-center border-t border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className='h-5 w-5' />
        ) : (
          <ChevronLeft className='h-5 w-5' />
        )}
      </button>
    </aside>
  );
}

export const Sidebar = memo(SidebarComponent);
