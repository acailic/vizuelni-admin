import Skeleton, { TableSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Skeleton className="mb-8 h-10 w-80" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Skeleton className="mb-4 h-8 w-full rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
        <div className="lg:col-span-3">
          <TableSkeleton rows={8} />
        </div>
      </div>
    </div>
  )
}
