'use client';

interface GalleryStatsProps {
  total: number;
  shown: number;
  categoryLabel: string;
  searchQuery?: string;
  labels: {
    total: string;
    shown: string;
    category: string;
    trust: string;
    trustValue: string;
    results?: string;
    filtering?: string;
  };
}

export function GalleryStats({
  total,
  shown,
  categoryLabel,
  searchQuery,
  labels,
}: GalleryStatsProps) {
  const isFiltered = shown < total || Boolean(searchQuery);
  const resultsText = isFiltered
    ? `${shown} ${labels.results ?? 'приказано'}`
    : `${total} ${labels.total}`;

  return (
    <div
      className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm'
      role='status'
      aria-live='polite'
    >
      <div className='flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5'>
        <span className='font-semibold text-slate-900'>{resultsText}</span>
      </div>
      <span className='text-slate-400' aria-hidden='true'>
        ·
      </span>
      <div className='flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5'>
        <span className='font-medium text-blue-700'>{categoryLabel}</span>
      </div>
      {isFiltered && (
        <>
          <span className='text-slate-400' aria-hidden='true'>
            ·
          </span>
          <div className='flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5'>
            <span className='text-emerald-700'>{labels.trustValue}</span>
          </div>
        </>
      )}
    </div>
  );
}
