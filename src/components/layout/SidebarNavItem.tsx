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
}

function SidebarNavItemComponent({
  href,
  icon: Icon,
  label,
  isCollapsed,
  isActive,
}: SidebarNavItemProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-[#C6363C] text-white shadow-md'
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
