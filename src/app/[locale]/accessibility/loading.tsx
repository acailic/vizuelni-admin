import Skeleton from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Skeleton className="mb-8 h-10 w-64" />
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}
