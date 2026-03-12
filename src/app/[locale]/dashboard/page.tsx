import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { DashboardContent } from './DashboardContent'

interface DashboardPageProps {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const resolvedParams = await params
  const locale = resolveLocale(resolvedParams.locale)

  if (locale !== resolvedParams.locale) {
    redirect(`/${resolveLocale(resolvedParams.locale)}/dashboard`)
  }

  // Server-side auth check - redirect to login if not authenticated
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard`)
  }

  const messages = getMessages(locale)

  // Extract dashboard labels with fallbacks
  const dashboardLabels = (messages as Record<string, unknown>).userDashboard ?? {}
  const labels = {
    title: (dashboardLabels as Record<string, unknown>).title as string ?? 'My Dashboard',
    subtitle: (dashboardLabels as Record<string, unknown>).subtitle as string ?? 'Manage your visualizations and dashboards',
    tab_my_charts: (dashboardLabels as Record<string, unknown>).tab_my_charts as string ?? 'My Charts',
    tab_my_dashboards: (dashboardLabels as Record<string, unknown>).tab_my_dashboards as string ?? 'My Dashboards',
    tab_favorites: (dashboardLabels as Record<string, unknown>).tab_favorites as string ?? 'Favorites',
    create_chart: (dashboardLabels as Record<string, unknown>).create_chart as string ?? 'Create Chart',
    create_dashboard: (dashboardLabels as Record<string, unknown>).create_dashboard as string ?? 'Create Dashboard',
    no_charts: (dashboardLabels as Record<string, unknown>).no_charts as string ?? 'No charts yet',
    no_charts_hint: (dashboardLabels as Record<string, unknown>).no_charts_hint as string ?? 'Create your first visualization to get started',
    no_dashboards: (dashboardLabels as Record<string, unknown>).no_dashboards as string ?? 'No dashboards yet',
    no_dashboards_hint: (dashboardLabels as Record<string, unknown>).no_dashboards_hint as string ?? 'Create a dashboard to combine multiple charts',
    no_favorites: (dashboardLabels as Record<string, unknown>).no_favorites as string ?? 'No favorites yet',
    no_favorites_hint: (dashboardLabels as Record<string, unknown>).no_favorites_hint as string ?? 'Charts you favorite will appear here',
    last_updated: (dashboardLabels as Record<string, unknown>).last_updated as string ?? 'Last updated',
    views: (dashboardLabels as Record<string, unknown>).views as string ?? 'views',
    edit: (dashboardLabels as Record<string, unknown>).edit as string ?? 'Edit',
    delete: (dashboardLabels as Record<string, unknown>).delete as string ?? 'Delete',
    view: (dashboardLabels as Record<string, unknown>).view as string ?? 'View',
    delete_confirm: (dashboardLabels as Record<string, unknown>).delete_confirm as string ?? 'Are you sure you want to delete this chart?',
    draft: (dashboardLabels as Record<string, unknown>).draft as string ?? 'Draft',
    published: (dashboardLabels as Record<string, unknown>).published as string ?? 'Published',
    coming_soon: (dashboardLabels as Record<string, unknown>).coming_soon as string ?? 'Coming Soon',
  }

  return <DashboardContent locale={locale} labels={labels} />
}
