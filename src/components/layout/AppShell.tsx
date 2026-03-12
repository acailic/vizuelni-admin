'use client'

import { memo } from 'react'
import { Sidebar } from './Sidebar'
import { AppHeader } from './AppHeader'
import type { Locale } from '@/lib/i18n/config'

interface AppShellProps {
  locale: Locale
  children: React.ReactNode
  messages: {
    sidebar: {
      browse: string
      create: string
      gallery: string
      dashboard: string
    }
    header: {
      searchPlaceholder: string
      profile: string
      settings: string
      signOut: string
      signIn: string
    }
  }
}

function AppShellComponent({ locale, children, messages }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar locale={locale} messages={messages.sidebar} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader locale={locale} messages={messages.header} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export const AppShell = memo(AppShellComponent)
