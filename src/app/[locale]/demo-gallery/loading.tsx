import Skeleton from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="mb-2 h-10 w-64" />
      <Skeleton className="mb-8 h-5 w-96" />
      <div className="mb-6 flex gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border border-slate-200 p-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-56 w-full rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
