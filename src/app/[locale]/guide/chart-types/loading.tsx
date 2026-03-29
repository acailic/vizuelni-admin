import Skeleton from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="mb-2 h-10 w-64" />
      <Skeleton className="mb-8 h-5 w-96" />
      <div className="space-y-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 p-6">
            <Skeleton className="mb-4 h-6 w-32" />
            <Skeleton className="mb-3 h-4 w-full" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
