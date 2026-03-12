'use client'

import { memo } from 'react'
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
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-[#C6363C] text-white'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  )
}

export const SidebarNavItem = memo(SidebarNavItemComponent)
