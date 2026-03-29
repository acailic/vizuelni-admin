export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 ${className}`}
      aria-hidden="true"
    />
  )
}

export function PageSkeleton({ title = true }: { title?: boolean }) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {title && <Skeleton className="mx-auto mb-8 h-10 w-96" />}
      <Skeleton className="mb-6 h-px w-full" />
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-48" />
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <Skeleton className="h-10 w-full rounded-none" />
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-none border-t border-slate-100" />
        ))}
      </div>
    </div>
  )
}
