# Application Shell Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the application shell to unlock access to 28 existing features for the Serbian government data visualization platform.

**Architecture:** Collapsible sidebar navigation with main content area. Six phases: Foundation, Browse, Create, Gallery, Dashboard, Profile & Embed. Each phase produces working, testable software.

**Tech Stack:** Next.js 14 App Router, TypeScript, Zustand, TanStack Query, Tailwind CSS, next-intl for i18n, NextAuth.js for auth

---

## File Structure

### New Files to Create

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx           # Main shell with sidebar + content
│   │   ├── Sidebar.tsx            # Collapsible navigation sidebar
│   │   ├── SidebarNavItem.tsx     # Individual nav item
│   │   ├── AppHeader.tsx          # Header within main content area
│   │   ├── GlobalSearch.tsx       # Global search component
│   │   └── UserMenu.tsx           # User dropdown menu
│   ├── home/
│   │   ├── HeroSection.tsx        # Homepage hero
│   │   ├── FeaturedCharts.tsx     # Featured charts section
│   │   ├── QuickStats.tsx         # Platform statistics
│   │   └── GettingStartedGuide.tsx # 3-step guide
│   ├── gallery/
│   │   ├── GalleryPage.tsx        # Gallery page component
│   │   ├── GalleryFilterBar.tsx   # Filter bar for gallery
│   │   ├── GalleryChartCard.tsx   # Chart card for gallery
│   │   ├── ChartDetailPage.tsx    # Individual chart view
│   │   ├── ChartActions.tsx       # Like, share, embed actions
│   │   └── EmbedCodeGenerator.tsx # Embed code UI
│   └── profile/
│       ├── ProfileInfo.tsx        # User profile display
│       └── ProfileSettings.tsx    # Settings form
├── app/
│   └── [locale]/
│       ├── gallery/
│       │   ├── page.tsx           # Gallery page
│       │   └── [id]/
│       │       └── page.tsx       # Chart detail page
│       ├── dashboard/
│       │   └── page.tsx           # User dashboard (new entry point)
│       └── profile/
│           └── page.tsx           # Update existing profile
└── lib/
    └── hooks/
        └── useSidebarState.ts     # Sidebar collapse state
```

### Files to Modify

```
src/app/[locale]/layout.tsx        # Wrap with AppShell
src/app/[locale]/page.tsx          # Update homepage with new sections
src/components/layout/Header.tsx   # Simplify (move nav to sidebar)
src/components/layout/Footer.tsx   # Minor updates if needed
src/lib/i18n/locales/en.json       # Add new translation keys
src/lib/i18n/locales/sr-Cyrl.json  # Add new translation keys
src/lib/i18n/locales/sr-Latn.json  # Add new translation keys
```

---

## Chunk 1: Foundation - Sidebar Navigation

### Task 1.1: Create Sidebar State Hook

**Files:**
- Create: `src/lib/hooks/useSidebarState.ts`

- [ ] **Step 1: Create the sidebar state hook**

```typescript
// src/lib/hooks/useSidebarState.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isCollapsed: boolean
  toggle: () => void
  setCollapsed: (collapsed: boolean) => void
}

export const useSidebarState = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
    }),
    {
      name: 'sidebar-state',
    }
  )
)
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/hooks/useSidebarState.ts
git commit -m "feat: add sidebar state hook"
```

---

### Task 1.2: Create Sidebar Component

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/SidebarNavItem.tsx`

- [ ] **Step 1: Create SidebarNavItem component**

```typescript
// src/components/layout/SidebarNavItem.tsx
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
```

- [ ] **Step 2: Create Sidebar component**

```typescript
// src/components/layout/Sidebar.tsx
'use client'

import { memo } from 'react'
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
      <div
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
      </div>

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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Sidebar.tsx src/components/layout/SidebarNavItem.tsx
git commit -m "feat: add collapsible sidebar navigation"
```

---

### Task 1.3: Create AppHeader Component

**Files:**
- Create: `src/components/layout/AppHeader.tsx`
- Create: `src/components/layout/GlobalSearch.tsx`
- Create: `src/components/layout/UserMenu.tsx`

- [ ] **Step 1: Create GlobalSearch component**

```typescript
// src/components/layout/GlobalSearch.tsx
'use client'

import { memo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface GlobalSearchProps {
  locale: string
  placeholder: string
}

function GlobalSearchComponent({ locale, placeholder }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${locale}/browse?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleClear = () => {
    setQuery('')
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div
        className={cn(
          'flex items-center rounded-lg border bg-white transition-colors',
          isFocused ? 'border-[#C6363C] ring-1 ring-[#C6363C]' : 'border-slate-200'
        )}
      >
        <Search className="ml-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full border-none bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="mr-2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  )
}

export const GlobalSearch = memo(GlobalSearchComponent)
```

- [ ] **Step 2: Create UserMenu component**

```typescript
// src/components/layout/UserMenu.tsx
'use client'

import { memo, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils/cn'

interface UserMenuProps {
  locale: string
  messages: {
    profile: string
    settings: string
    signOut: string
    signIn: string
  }
}

function UserMenuComponent({ locale, messages }: UserMenuProps) {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (status === 'loading') {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
  }

  if (!session) {
    return (
      <Link
        href={`/${locale}/login`}
        className="flex items-center gap-2 rounded-lg bg-[#C6363C] px-4 py-2 text-sm font-medium text-white hover:bg-[#a82d32]"
      >
        {messages.signIn}
      </Link>
    )
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0C1E42] text-xs text-white">
          {session.user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="hidden sm:block">{session.user?.name}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <Link
            href={`/${locale}/profile`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <User className="h-4 w-4" />
            {messages.profile}
          </Link>
          <Link
            href={`/${locale}/dashboard`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Settings className="h-4 w-4" />
            {messages.settings}
          </Link>
          <hr className="my-1 border-slate-200" />
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            {messages.signOut}
          </button>
        </div>
      )}
    </div>
  )
}

export const UserMenu = memo(UserMenuComponent)
```

- [ ] **Step 3: Create AppHeader component**

```typescript
// src/components/layout/AppHeader.tsx
'use client'

import { memo } from 'react'
import { GlobalSearch } from './GlobalSearch'
import { UserMenu } from './UserMenu'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import type { Locale } from '@/lib/i18n/config'

interface AppHeaderProps {
  locale: Locale
  messages: {
    searchPlaceholder: string
    profile: string
    settings: string
    signOut: string
    signIn: string
  }
}

function AppHeaderComponent({ locale, messages }: AppHeaderProps) {
  const handleLanguageChange = (lang: 'sr' | 'lat' | 'en') => {
    const localeMap: Record<string, Locale> = {
      sr: 'sr-Cyrl',
      lat: 'sr-Latn',
      en: 'en',
    }
    const newLocale = localeMap[lang]
    if (newLocale && newLocale !== locale) {
      const pathWithoutLocale = window.location.pathname.replace(/^\/(sr-Cyrl|sr-Latn|en)/, '')
      window.location.href = `/${newLocale}${pathWithoutLocale || ''}`
    }
  }

  const currentLang: 'sr' | 'lat' | 'en' =
    locale === 'sr-Cyrl' ? 'sr' : locale === 'sr-Latn' ? 'lat' : 'en'

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <GlobalSearch locale={locale} placeholder={messages.searchPlaceholder} />
      <div className="flex items-center gap-4">
        <LanguageSwitcher currentLang={currentLang} onLanguageChange={handleLanguageChange} />
        <UserMenu locale={locale} messages={messages} />
      </div>
    </header>
  )
}

export const AppHeader = memo(AppHeaderComponent)
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/AppHeader.tsx src/components/layout/GlobalSearch.tsx src/components/layout/UserMenu.tsx
git commit -m "feat: add app header with global search and user menu"
```

---

### Task 1.4: Create AppShell Component

**Files:**
- Create: `src/components/layout/AppShell.tsx`

- [ ] **Step 1: Create AppShell component**

```typescript
// src/components/layout/AppShell.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/AppShell.tsx
git commit -m "feat: add app shell layout component"
```

---

### Task 1.5: Update Locale Layout

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Update layout to use AppShell**

Replace the content of `src/app/[locale]/layout.tsx`:

```typescript
import { notFound } from 'next/navigation'

import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { AppShell } from '@/components/layout/AppShell'

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = resolveLocale(params.locale)

  if (locale !== params.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  return (
    <AppShell
      locale={locale}
      messages={{
        sidebar: {
          browse: messages.sidebar?.browse || messages.common.datasets,
          create: messages.sidebar?.create || messages.common.create,
          gallery: messages.sidebar?.gallery || messages.common.gallery,
          dashboard: messages.sidebar?.dashboard || messages.common.dashboard,
        },
        header: {
          searchPlaceholder: messages.header?.searchPlaceholder || 'Search datasets...',
          profile: messages.header?.profile || messages.common.profile,
          settings: messages.header?.settings || messages.common.settings,
          signOut: messages.header?.signOut || messages.common.signOut,
          signIn: messages.header?.signIn || messages.common.signIn,
        },
      }}
    >
      {children}
    </AppShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat: integrate app shell into locale layout"
```

---

### Task 1.6: Add Translation Keys

**Files:**
- Modify: `src/lib/i18n/locales/en.json`
- Modify: `src/lib/i18n/locales/sr-Cyrl.json`
- Modify: `src/lib/i18n/locales/sr-Latn.json`

- [ ] **Step 1: Add English translations**

Add to `common` section in `en.json`:

```json
{
  "common": {
    "create": "Create",
    "gallery": "Gallery",
    "dashboard": "Dashboard",
    "profile": "Profile",
    "settings": "Settings",
    "signOut": "Sign Out",
    "signIn": "Sign In"
  },
  "sidebar": {
    "browse": "Browse",
    "create": "Create",
    "gallery": "Gallery",
    "dashboard": "Dashboard"
  },
  "header": {
    "searchPlaceholder": "Search datasets...",
    "profile": "Profile",
    "settings": "Settings",
    "signOut": "Sign Out",
    "signIn": "Sign In"
  }
}
```

- [ ] **Step 2: Add Serbian Cyrillic translations**

Add to `sr-Cyrl.json`:

```json
{
  "common": {
    "create": "Креирај",
    "gallery": "Галерија",
    "dashboard": "Контролна табла",
    "profile": "Профил",
    "settings": "Подешавања",
    "signOut": "Одјава",
    "signIn": "Пријава"
  },
  "sidebar": {
    "browse": "Прегледај",
    "create": "Креирај",
    "gallery": "Галерија",
    "dashboard": "Контролна табла"
  },
  "header": {
    "searchPlaceholder": "Претражи скупове података...",
    "profile": "Профил",
    "settings": "Подешавања",
    "signOut": "Одјава",
    "signIn": "Пријава"
  }
}
```

- [ ] **Step 3: Add Serbian Latin translations**

Add to `sr-Latn.json`:

```json
{
  "common": {
    "create": "Kreiraj",
    "gallery": "Galerija",
    "dashboard": "Kontrolna tabla",
    "profile": "Profil",
    "settings": "Podešavanja",
    "signOut": "Odjava",
    "signIn": "Prijava"
  },
  "sidebar": {
    "browse": "Pregledaj",
    "create": "Kreiraj",
    "gallery": "Galerija",
    "dashboard": "Kontrolna tabla"
  },
  "header": {
    "searchPlaceholder": "Pretraži skupove podataka...",
    "profile": "Profil",
    "settings": "Podešavanja",
    "signOut": "Odjava",
    "signIn": "Prijava"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/i18n/locales/*.json
git commit -m "feat: add sidebar and header translations"
```

---

## Chunk 2: Homepage

### Task 2.1: Create HeroSection Component

**Files:**
- Create: `src/components/home/HeroSection.tsx`

- [ ] **Step 1: Create HeroSection**

```typescript
// src/components/home/HeroSection.tsx
'use client'

import { memo } from 'react'
import Link from 'next/link'
import { ArrowRight, Database, BarChart3 } from 'lucide-react'

interface HeroSectionProps {
  locale: string
  messages: {
    title: string
    subtitle: string
    browseDatasets: string
    createChart: string
  }
}

function HeroSectionComponent({ locale, messages }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-[#0C1E42] to-[#1a365d] py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {messages.title}
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            {messages.subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/${locale}/browse`}
              className="flex items-center gap-2 rounded-lg bg-[#C6363C] px-6 py-3 text-base font-medium text-white hover:bg-[#a82d32] transition-colors"
            >
              <Database className="h-5 w-5" />
              {messages.browseDatasets}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/create`}
              className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-base font-medium text-white hover:bg-white/20 transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              {messages.createChart}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export const HeroSection = memo(HeroSectionComponent)
```

- [ ] **Step 2: Commit**

```bash
git add src/components/home/HeroSection.tsx
git commit -m "feat: add homepage hero section"
```

---

### Task 2.2: Create QuickStats Component

**Files:**
- Create: `src/components/home/QuickStats.tsx`

- [ ] **Step 1: Create QuickStats**

```typescript
// src/components/home/QuickStats.tsx
'use client'

import { memo } from 'react'
import { Database, BarChart3, Users } from 'lucide-react'

interface QuickStatsProps {
  messages: {
    datasets: string
    charts: string
    users: string
  }
  stats?: {
    datasets: number
    charts: number
    users: number
  }
}

function QuickStatsComponent({ messages, stats }: QuickStatsProps) {
  const displayStats = stats || {
    datasets: 3412,
    charts: 0,
    users: 0,
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k+`
    }
    return num.toString()
  }

  return (
    <section className="border-b border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0C1E42]">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(displayStats.datasets)}
              </p>
              <p className="text-sm text-slate-600">{messages.datasets}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C6363C]">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(displayStats.charts)}
              </p>
              <p className="text-sm text-slate-600">{messages.charts}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-600">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatNumber(displayStats.users)}
              </p>
              <p className="text-sm text-slate-600">{messages.users}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const QuickStats = memo(QuickStatsComponent)
```

- [ ] **Step 2: Commit**

```bash
git add src/components/home/QuickStats.tsx
git commit -m "feat: add quick stats component"
```

---

### Task 2.3: Create GettingStartedGuide Component

**Files:**
- Create: `src/components/home/GettingStartedGuide.tsx`

- [ ] **Step 1: Create GettingStartedGuide**

```typescript
// src/components/home/GettingStartedGuide.tsx
'use client'

import { memo } from 'react'
import { Database, BarChart3, Share2, ArrowRight } from 'lucide-react'

interface GettingStartedGuideProps {
  messages: {
    title: string
    step1Title: string
    step1Desc: string
    step2Title: string
    step2Desc: string
    step3Title: string
    step3Desc: string
  }
}

function GettingStartedGuideComponent({ messages }: GettingStartedGuideProps) {
  const steps = [
    {
      icon: Database,
      title: messages.step1Title,
      description: messages.step1Desc,
    },
    {
      icon: BarChart3,
      title: messages.step2Title,
      description: messages.step2Desc,
    },
    {
      icon: Share2,
      title: messages.step3Title,
      description: messages.step3Desc,
    },
  ]

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-2xl font-bold text-slate-900">
          {messages.title}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0C1E42] text-white">
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="mt-4 text-sm font-medium text-[#C6363C]">
                  Step {index + 1}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden translate-x-1/2 md:block">
                  <ArrowRight className="h-6 w-6 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export const GettingStartedGuide = memo(GettingStartedGuideComponent)
```

- [ ] **Step 2: Commit**

```bash
git add src/components/home/GettingStartedGuide.tsx
git commit -m "feat: add getting started guide"
```

---

### Task 2.4: Update Homepage

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Update homepage to use new components**

```typescript
// src/app/[locale]/page.tsx
import { notFound } from 'next/navigation'

import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { HeroSection } from '@/components/home/HeroSection'
import { QuickStats } from '@/components/home/QuickStats'
import { GettingStartedGuide } from '@/components/home/GettingStartedGuide'
import { FeaturedExamples } from '@/components/home/FeaturedExamples'

export default function HomePage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = resolveLocale(params.locale)

  if (locale !== params.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  return (
    <div className="min-h-screen">
      <HeroSection
        locale={locale}
        messages={{
          title: messages.home?.hero?.title || messages.common.title,
          subtitle:
            messages.home?.hero?.subtitle ||
            'Explore and visualize Serbian government data',
          browseDatasets:
            messages.home?.hero?.browseDatasets || messages.common.browseDatasets,
          createChart: messages.home?.hero?.createChart || messages.common.createChart,
        }}
      />
      <QuickStats
        messages={{
          datasets: messages.home?.stats?.datasets || 'Datasets',
          charts: messages.home?.stats?.charts || 'Charts',
          users: messages.home?.stats?.users || 'Users',
        }}
      />
      <FeaturedExamples locale={locale} />
      <GettingStartedGuide
        messages={{
          title: messages.home?.gettingStarted?.title || 'Getting Started',
          step1Title: messages.home?.gettingStarted?.step1Title || 'Find Data',
          step1Desc:
            messages.home?.gettingStarted?.step1Desc ||
            'Browse thousands of datasets from the Serbian open data portal',
          step2Title: messages.home?.gettingStarted?.step2Title || 'Visualize',
          step2Desc:
            messages.home?.gettingStarted?.step2Desc ||
            'Create beautiful charts and visualizations',
          step3Title: messages.home?.gettingStarted?.step3Title || 'Share',
          step3Desc:
            messages.home?.gettingStarted?.step3Desc ||
            'Share your visualizations with others',
        }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Add homepage translations**

Add to each locale file:

```json
{
  "home": {
    "hero": {
      "title": "Визуелни Административни Подаци Србије",
      "subtitle": "Претражујте и визуализујте податке српске владе",
      "browseDatasets": "Прегледај скупове података",
      "createChart": "Креирај графикон"
    },
    "stats": {
      "datasets": "Скупови података",
      "charts": "Графикони",
      "users": "Корисници"
    },
    "gettingStarted": {
      "title": "Како започети",
      "step1Title": "Пронађи податке",
      "step1Desc": "Претражујте хиљаде скупова података са портала отворених података Србије",
      "step2Title": "Визуализуј",
      "step2Desc": "Креирајте прелепе графике и визуализације",
      "step3Title": "Подели",
      "step3Desc": "Поделите своје визуализације са другима"
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx src/lib/i18n/locales/*.json
git commit -m "feat: update homepage with hero, stats, and getting started"
```

---

## Chunk 3: Gallery Page

### Task 3.1: Create Gallery Components

**Files:**
- Create: `src/components/gallery/GalleryFilterBar.tsx`
- Create: `src/components/gallery/GalleryChartCard.tsx`
- Create: `src/components/gallery/GalleryPage.tsx`

- [ ] **Step 1: Create GalleryFilterBar**

```typescript
// src/components/gallery/GalleryFilterBar.tsx
'use client'

import { memo } from 'react'
import { Search } from 'lucide-react'

interface GalleryFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  chartType: string
  onChartTypeChange: (type: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  messages: {
    searchPlaceholder: string
    allTypes: string
    sortByNewest: string
    sortByViews: string
  }
}

function GalleryFilterBarComponent({
  searchQuery,
  onSearchChange,
  chartType,
  onChartTypeChange,
  sortBy,
  onSortChange,
  messages,
}: GalleryFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={messages.searchPlaceholder}
          className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-[#C6363C] focus:outline-none focus:ring-1 focus:ring-[#C6363C]"
        />
      </div>
      <div className="flex gap-3">
        <select
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#C6363C] focus:outline-none"
        >
          <option value="">{messages.allTypes}</option>
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="column">Column</option>
          <option value="area">Area</option>
          <option value="pie">Pie</option>
          <option value="scatter">Scatter</option>
          <option value="combo">Combo</option>
          <option value="table">Table</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#C6363C] focus:outline-none"
        >
          <option value="newest">{messages.sortByNewest}</option>
          <option value="views">{messages.sortByViews}</option>
        </select>
      </div>
    </div>
  )
}

export const GalleryFilterBar = memo(GalleryFilterBarComponent)
```

- [ ] **Step 2: Create GalleryChartCard**

```typescript
// src/components/gallery/GalleryChartCard.tsx
'use client'

import { memo } from 'react'
import Link from 'next/link'
import { Eye, Heart } from 'lucide-react'

interface GalleryChartCardProps {
  id: string
  title: string
  thumbnail?: string
  author: {
    name: string
    avatar?: string
  }
  viewCount: number
  chartType: string
  createdAt: string
  locale: string
}

function GalleryChartCardComponent({
  id,
  title,
  thumbnail,
  author,
  viewCount,
  chartType,
  createdAt,
  locale,
}: GalleryChartCardProps) {
  return (
    <Link
      href={`/${locale}/gallery/${id}`}
      className="group block overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="aspect-video bg-slate-100">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            Chart Preview
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-slate-900 group-hover:text-[#C6363C] line-clamp-1">
          {title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
            {author.name[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-slate-600">{author.name}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span className="rounded bg-slate-100 px-2 py-1 capitalize">
            {chartType}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {viewCount}
            </span>
            <span>{createdAt}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export const GalleryChartCard = memo(GalleryChartCardComponent)
```

- [ ] **Step 3: Create GalleryPage**

```typescript
// src/components/gallery/GalleryPage.tsx
'use client'

import { memo, useState, useMemo } from 'react'
import { GalleryFilterBar } from './GalleryFilterBar'
import { GalleryChartCard } from './GalleryChartCard'

interface Chart {
  id: string
  title: string
  thumbnail?: string
  author: { name: string; avatar?: string }
  viewCount: number
  chartType: string
  createdAt: string
  isPublic: boolean
}

interface GalleryPageProps {
  charts: Chart[]
  locale: string
  messages: {
    searchPlaceholder: string
    allTypes: string
    sortByNewest: string
    sortByViews: string
    emptyTitle: string
    emptyDesc: string
  }
}

function GalleryPageComponent({ charts, locale, messages }: GalleryPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [chartType, setChartType] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filteredCharts = useMemo(() => {
    let result = charts.filter((chart) => chart.isPublic)

    if (searchQuery) {
      result = result.filter((chart) =>
        chart.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (chartType) {
      result = result.filter((chart) => chart.chartType === chartType)
    }

    result.sort((a, b) => {
      if (sortBy === 'views') {
        return b.viewCount - a.viewCount
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return result
  }, [charts, searchQuery, chartType, sortBy])

  return (
    <div className="min-h-screen bg-slate-50">
      <GalleryFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        chartType={chartType}
        onChartTypeChange={setChartType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        messages={messages}
      />
      <div className="p-6">
        {filteredCharts.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-lg font-medium text-slate-900">
              {messages.emptyTitle}
            </h3>
            <p className="mt-2 text-slate-600">{messages.emptyDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCharts.map((chart) => (
              <GalleryChartCard
                key={chart.id}
                {...chart}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const GalleryPage = memo(GalleryPageComponent)
```

- [ ] **Step 4: Commit**

```bash
git add src/components/gallery/
git commit -m "feat: add gallery page components"
```

---

### Task 3.2: Create Gallery Routes

**Files:**
- Create: `src/app/[locale]/gallery/page.tsx`
- Create: `src/app/[locale]/gallery/[id]/page.tsx`

- [ ] **Step 1: Create gallery page**

```typescript
// src/app/[locale]/gallery/page.tsx
import { notFound } from 'next/navigation'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { GalleryPage } from '@/components/gallery/GalleryPage'
import { prisma } from '@/lib/db/prisma'

export default async function GalleryRoute({
  params,
}: {
  params: { locale: string }
}) {
  const locale = resolveLocale(params.locale)

  if (locale !== params.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  // Fetch public charts from database
  const charts = await prisma.savedChart.findMany({
    where: { status: 'PUBLISHED' },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const formattedCharts = charts.map((chart) => ({
    id: chart.id,
    title: chart.title,
    thumbnail: chart.thumbnail || undefined,
    author: {
      name: chart.user?.name || 'Anonymous',
      avatar: chart.user?.image || undefined,
    },
    viewCount: chart.viewCount,
    chartType: chart.config?.chartType || 'unknown',
    createdAt: chart.createdAt.toISOString(),
    isPublic: true,
  }))

  return (
    <GalleryPage
      charts={formattedCharts}
      locale={locale}
      messages={{
        searchPlaceholder:
          messages.gallery?.searchPlaceholder || 'Search charts...',
        allTypes: messages.gallery?.allTypes || 'All types',
        sortByNewest: messages.gallery?.sortByNewest || 'Newest',
        sortByViews: messages.gallery?.sortByViews || 'Most viewed',
        emptyTitle: messages.gallery?.emptyTitle || 'No charts found',
        emptyDesc:
          messages.gallery?.emptyDesc ||
          'Be the first to create and share a chart!',
      }}
    />
  )
}
```

- [ ] **Step 2: Create chart detail page**

```typescript
// src/app/[locale]/gallery/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { prisma } from '@/lib/db/prisma'
import { ChartRenderer } from '@/components/charts/ChartRenderer'
import { EmbedCodeGenerator } from '@/components/gallery/EmbedCodeGenerator'

export default async function ChartDetailRoute({
  params,
}: {
  params: { locale: string; id: string }
}) {
  const locale = resolveLocale(params.locale)

  if (locale !== params.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  const chart = await prisma.savedChart.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true, image: true } } },
  })

  if (!chart || chart.status === 'ARCHIVED') {
    notFound()
  }

  // Increment view count
  await prisma.savedChart.update({
    where: { id: params.id },
    data: { viewCount: { increment: 1 } },
  })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/${locale}/gallery`}
          className="mb-4 inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
        >
          ← {messages.gallery?.backToGallery || 'Back to Gallery'}
        </Link>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-6">
            <h1 className="text-2xl font-bold text-slate-900">{chart.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
              <span>
                {messages.gallery?.by || 'By'} {chart.user?.name || 'Anonymous'}
              </span>
              <span>•</span>
              <span>
                {new Date(chart.createdAt).toLocaleDateString(locale)}
              </span>
              <span>•</span>
              <span>
                {chart.viewCount} {messages.gallery?.views || 'views'}
              </span>
            </div>
          </div>

          <div className="p-6">
            <ChartRenderer
              config={chart.config as any}
              data={chart.data as any}
              width={800}
              height={500}
            />
          </div>

          <div className="border-t border-slate-200 p-6">
            <EmbedCodeGenerator
              chartId={chart.id}
              messages={{
                title: messages.gallery?.embed?.title || 'Embed this chart',
                width: messages.gallery?.embed?.width || 'Width',
                height: messages.gallery?.embed?.height || 'Height',
                copy: messages.gallery?.embed?.copy || 'Copy',
                copied: messages.gallery?.embed?.copied || 'Copied!',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create EmbedCodeGenerator**

```typescript
// src/components/gallery/EmbedCodeGenerator.tsx
'use client'

import { memo, useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface EmbedCodeGeneratorProps {
  chartId: string
  messages: {
    title: string
    width: string
    height: string
    copy: string
    copied: string
  }
}

function EmbedCodeGeneratorComponent({
  chartId,
  messages,
}: EmbedCodeGeneratorProps) {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(500)
  const [copied, setCopied] = useState(false)

  const embedCode = `<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed/${chartId}" width="${width}" height="${height}" frameborder="0"></iframe>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h3 className="font-medium text-slate-900">{messages.title}</h3>
      <div className="mt-3 flex gap-4">
        <div>
          <label className="text-sm text-slate-600">{messages.width}</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="mt-1 block w-24 rounded border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">{messages.height}</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="mt-1 block w-24 rounded border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <code className="flex-1 rounded bg-slate-100 px-3 py-2 text-xs">
          {embedCode}
        </code>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded bg-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-700"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              {messages.copied}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {messages.copy}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export const EmbedCodeGenerator = memo(EmbedCodeGeneratorComponent)
```

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/gallery/ src/components/gallery/EmbedCodeGenerator.tsx
git commit -m "feat: add gallery routes and embed code generator"
```

---

## Chunk 4: Dashboard Page

### Task 4.1: Create Dashboard Entry Page

**Files:**
- Create: `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1: Create dashboard page**

```typescript
// src/app/[locale]/dashboard/page.tsx
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/db/prisma'
import { DashboardContent } from './DashboardContent'

export default async function DashboardRoute({
  params,
}: {
  params: { locale: string }
}) {
  const locale = resolveLocale(params.locale)

  if (locale !== params.locale) {
    notFound()
  }

  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard`)
  }

  const messages = getMessages(locale)

  const [charts, dashboards] = await Promise.all([
    prisma.savedChart.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    }),
    // Dashboards would come from a separate table if implemented
    Promise.resolve([]),
  ])

  return (
    <DashboardContent
      locale={locale}
      charts={charts}
      dashboards={dashboards}
      messages={{
        myCharts: messages.dashboard?.myCharts || 'My Charts',
        myDashboards: messages.dashboard?.myDashboards || 'My Dashboards',
        favorites: messages.dashboard?.favorites || 'Favorites',
        createChart: messages.dashboard?.createChart || 'Create Chart',
        createDashboard: messages.dashboard?.createDashboard || 'Create Dashboard',
        noCharts: messages.dashboard?.noCharts || 'No charts yet',
        noDashboards: messages.dashboard?.noDashboards || 'No dashboards yet',
        edit: messages.common?.edit || 'Edit',
        delete: messages.common?.delete || 'Delete',
        published: messages.common?.published || 'Published',
        draft: messages.common?.draft || 'Draft',
      }}
    />
  )
}
```

- [ ] **Step 2: Create DashboardContent client component**

```typescript
// src/app/[locale]/dashboard/DashboardContent.tsx
'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Chart {
  id: string
  title: string
  thumbnail?: string | null
  status: string
  updatedAt: Date
  viewCount: number
}

interface DashboardContentProps {
  locale: string
  charts: Chart[]
  dashboards: any[]
  messages: {
    myCharts: string
    myDashboards: string
    favorites: string
    createChart: string
    createDashboard: string
    noCharts: string
    noDashboards: string
    edit: string
    delete: string
    published: string
    draft: string
  }
}

function DashboardContentComponent({
  locale,
  charts,
  dashboards,
  messages,
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<'charts' | 'dashboards' | 'favorites'>('charts')

  const tabs = [
    { id: 'charts', label: messages.myCharts, count: charts.length },
    { id: 'dashboards', label: messages.myDashboards, count: dashboards.length },
    { id: 'favorites', label: messages.favorites, count: 0 },
  ] as const

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">{messages.myCharts}</h1>
          <Link
            href={`/${locale}/create`}
            className="flex items-center gap-2 rounded-lg bg-[#C6363C] px-4 py-2 text-sm font-medium text-white hover:bg-[#a82d32]"
          >
            <Plus className="h-4 w-4" />
            {messages.createChart}
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-[#C6363C] text-[#C6363C]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              )}
            >
              {tab.label}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'charts' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {charts.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <p className="text-slate-600">{messages.noCharts}</p>
                <Link
                  href={`/${locale}/create`}
                  className="mt-4 inline-flex items-center text-sm text-[#C6363C] hover:underline"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  {messages.createChart}
                </Link>
              </div>
            ) : (
              charts.map((chart) => (
                <div
                  key={chart.id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <div className="aspect-video bg-slate-100">
                    {chart.thumbnail ? (
                      <img
                        src={chart.thumbnail}
                        alt={chart.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        Chart Preview
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-slate-900">{chart.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Updated {new Date(chart.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'rounded px-2 py-1 text-xs font-medium',
                          chart.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {chart.status === 'PUBLISHED'
                          ? messages.published
                          : messages.draft}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/${locale}/create?chart=${chart.id}`}
                        className="flex flex-1 items-center justify-center gap-1 rounded border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        <Edit className="h-3 w-3" />
                        {messages.edit}
                      </Link>
                      <button className="flex flex-1 items-center justify-center gap-1 rounded border border-slate-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3 w-3" />
                        {messages.delete}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'dashboards' && (
          <div className="py-12 text-center">
            <p className="text-slate-600">{messages.noDashboards}</p>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="py-12 text-center">
            <p className="text-slate-600">No favorites yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const DashboardContent = memo(DashboardContentComponent)
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/dashboard/page.tsx src/app/[locale]/dashboard/DashboardContent.tsx
git commit -m "feat: add user dashboard page with charts list"
```

---

## Chunk 5: Final Polish & Translations

### Task 5.1: Add All Translation Keys

**Files:**
- Modify: `src/lib/i18n/locales/en.json`
- Modify: `src/lib/i18n/locales/sr-Cyrl.json`
- Modify: `src/lib/i18n/locales/sr-Latn.json`

- [ ] **Step 1: Add comprehensive translations for all new features**

Update each locale file with complete translations for:
- sidebar
- header
- home (hero, stats, gettingStarted)
- gallery
- dashboard

- [ ] **Step 2: Verify translations are complete**

Run the app and verify all text appears correctly in all three locales.

- [ ] **Step 3: Commit**

```bash
git add src/lib/i18n/locales/*.json
git commit -m "feat: add complete translations for app shell"
```

---

### Task 5.2: Run Tests and Fix Issues

- [ ] **Step 1: Run type check**

```bash
npm run type-check
```

Expected: No TypeScript errors

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No lint errors

- [ ] **Step 3: Run tests**

```bash
npm run test
```

Expected: All tests pass

- [ ] **Step 4: Fix any issues found**

- [ ] **Step 5: Commit fixes**

```bash
git add .
git commit -m "fix: resolve type and lint errors"
```

---

## Success Criteria

- [ ] Sidebar navigation works with collapse/expand
- [ ] All routes are accessible: `/`, `/browse`, `/create`, `/gallery`, `/dashboard`, `/profile`
- [ ] Homepage displays hero, stats, and getting started sections
- [ ] Gallery shows public charts with filtering
- [ ] Dashboard shows user's charts with edit/delete options
- [ ] All pages support three locales (sr-Cyrl, sr-Latn, en)
- [ ] No TypeScript or lint errors
- [ ] All existing tests pass
