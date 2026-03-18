'use client'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container mx-auto max-w-2xl py-16 px-4">
      <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
        <p className="mt-3 text-sm text-slate-600">{error.message || 'An unexpected error occurred.'}</p>
        <button
          className="mt-6 rounded-lg bg-gov-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gov-primary/90 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:ring-offset-2"
          onClick={() => reset()}
          type="button"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
