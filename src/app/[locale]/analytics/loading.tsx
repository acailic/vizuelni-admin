import Skeleton from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="mb-8 h-10 w-64" />
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-6">
          <Skeleton className="mb-4 h-6 w-40" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <Skeleton className="mb-4 h-6 w-40" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 p-6">
        <Skeleton className="mb-4 h-6 w-48" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  )
}
