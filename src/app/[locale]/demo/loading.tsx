import Skeleton from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="mx-auto mb-4 h-12 w-96" />
      <Skeleton className="mx-auto mb-8 h-6 w-64" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4 rounded-2xl border border-slate-200 p-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
