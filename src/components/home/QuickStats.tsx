import { BarChart3, Database, Users } from 'lucide-react'

interface QuickStatsProps {
  datasetsLabel: string
  chartsLabel: string
  usersLabel: string
}

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
      <div className="mb-3 rounded-full bg-gray-100 p-3 text-gov-primary">{icon}</div>
      <span className="text-3xl font-bold text-gov-primary">{value}</span>
      <span className="mt-1 text-sm text-gray-600">{label}</span>
    </div>
  )
}

export function QuickStats({ datasetsLabel, chartsLabel, usersLabel }: QuickStatsProps) {
  // These values can be made dynamic in the future by fetching from an API
  const stats = [
    {
      icon: <Database className="h-6 w-6" />,
      value: '3,412+',
      label: datasetsLabel,
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      value: '150+',
      label: chartsLabel,
    },
    {
      icon: <Users className="h-6 w-6" />,
      value: '500+',
      label: usersLabel,
    },
  ]

  return (
    <section className="py-8" aria-labelledby="quick-stats-title">
      <h2 id="quick-stats-title" className="sr-only">
        Platform Statistics
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </section>
  )
}
