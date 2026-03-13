'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SidebarNavItemProps {
  href: string
  icon: LucideIcon
  label: string
  isCollapsed: boolean
  isActive: boolean
  /** Callback fired when navigation occurs */
  onNavigate?: () => void
}

function SidebarNavItemComponent({
  href,
  icon: Icon,
  label,
  isCollapsed,
  isActive,
  onNavigate,
}: SidebarNavItemProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200',
        // Touch target: minimum 44px height for mobile accessibility (WCAG 2.1)
        isCollapsed ? 'min-h-[44px] py-3 justify-center' : 'py-3',
        isActive
          ? 'bg-serbia-red text-white shadow-md'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Icon className={cn(
        'h-5 w-5 shrink-0 transition-transform duration-200',
        isCollapsed && 'group-hover:scale-110'
      )} />
      {!isCollapsed && <span>{label}</span>}

      {/* Animated tooltip for collapsed state */}
      {isCollapsed && (
        <div
          className={cn(
            'absolute left-full ml-2 z-50 whitespace-nowrap',
            'px-3 py-1.5 rounded-lg text-sm font-medium',
            'bg-slate-900 text-white shadow-lg',
            'pointer-events-none transition-all duration-200',
            showTooltip
              ? 'opacity-100 translate-x-0 visible'
              : 'opacity-0 -translate-x-2 invisible'
          )}
          role="tooltip"
        >
          {label}
          {/* Tooltip arrow */}
          <div className="absolute right-full top-1/2 -translate-y-1/2">
            <div className="border-8 border-transparent border-r-slate-900" />
          </div>
        </div>
      )}
    </Link>
  )
}

export const SidebarNavItem = memo(SidebarNavItemComponent)
