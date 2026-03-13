'use client'

import { memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Database,
  PlusCircle,
  LayoutGrid,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Image from 'next/image'

import { cn } from '@/lib/utils/cn'
import { SidebarNavItem } from './SidebarNavItem'
import { useSidebarState } from '@/lib/hooks/useSidebarState'
import type { Locale } from '@/lib/i18n/config'

interface SidebarProps {
  locale: Locale
  messages: {
    browse: string
    create: string
    gallery: string
    dashboard: string
  }
  /** Callback fired when navigation occurs (used to close mobile menu) */
  onNavigate?: () => void
}

function SidebarComponent({ locale, messages, onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebarState()

  const navItems = [
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
      href: `/${locale}/dashboard`,
      icon: User,
      label: messages.dashboard,
    },
  ]

  return (
    <aside
      className={cn(
        'flex h-screen w-64 flex-col border-r border-slate-200 bg-white',
        // On desktop, respect collapse state; on mobile always full width
        'lg:transition-all lg:duration-300',
        isCollapsed && 'lg:w-16'
      )}
    >
      {/* Logo */}
      <Link
        href={`/${locale}`}
        className={cn(
          'flex h-16 items-center border-b border-slate-200 px-4',
          isCollapsed ? 'lg:justify-center' : 'gap-3'
        )}
        onClick={onNavigate}
      >
        <Image
          src="/serbia-logo.png"
          alt="Serbia"
          width={32}
          height={38}
          className="h-8 w-auto"
          priority
        />
        {(!isCollapsed) && (
          <span className="text-sm font-bold text-[#0C1E42]">Vizuelni Admin</span>
        )}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            {...item}
            isCollapsed={isCollapsed}
            isActive={pathname.startsWith(item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Collapse toggle - desktop only */}
      <button
        onClick={toggle}
        className="hidden lg:flex h-12 items-center justify-center border-t border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>
    </aside>
  )
}

export const Sidebar = memo(SidebarComponent)
