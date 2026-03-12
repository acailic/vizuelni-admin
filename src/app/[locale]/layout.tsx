import { notFound } from 'next/navigation'

import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { AppShell } from '@/components/layout/AppShell'
import { locales } from '@/lib/i18n/config'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = resolveLocale(localeParam)

  if (locale !== localeParam) {
    notFound()
  }

  const messages = getMessages(locale)

  return (
    <AppShell
      locale={locale}
      messages={{
        sidebar: {
          browse: messages.sidebar?.browse || messages.common.datasets,
          create: messages.sidebar?.create || messages.common.create || 'Create',
          gallery: messages.sidebar?.gallery || messages.common.gallery || 'Gallery',
          dashboard: messages.sidebar?.dashboard || messages.common.dashboard || 'Dashboard',
        },
        header: {
          searchPlaceholder: messages.header?.searchPlaceholder || 'Search datasets...',
          profile: messages.header?.profile || messages.common.profile || 'Profile',
          settings: messages.header?.settings || messages.common.settings || 'Settings',
          signOut: messages.header?.signOut || messages.common.signOut || 'Sign Out',
          signIn: messages.header?.signIn || messages.common.signIn || 'Sign In',
        },
      }}
    >
      {children}
    </AppShell>
  )
}
