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
}

function SidebarComponent({ locale, messages }: SidebarProps) {
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
        'flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <Link
        href={`/${locale}`}
        className={cn(
          'flex h-16 items-center border-b border-slate-200 px-4',
          isCollapsed ? 'justify-center' : 'gap-3'
        )}
      >
        <Image
          src="/serbia-logo.png"
          alt="Serbia"
          width={32}
          height={38}
          className="h-8 w-auto"
          priority
        />
        {!isCollapsed && (
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
          />
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className="flex h-12 items-center justify-center border-t border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
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
