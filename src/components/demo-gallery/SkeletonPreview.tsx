'use client';

export function SkeletonPreview() {
  return (
    <div className='h-full w-full animate-pulse rounded-[1.75rem] bg-slate-200'>
      <div className='flex h-full flex-col justify-between p-4'>
        <div className='space-y-3'>
          <div className='h-3 w-3/4 rounded-full bg-slate-300' />
          <div className='h-2 w-1/2 rounded-full bg-slate-300' />
        </div>
        <div className='space-y-2'>
          <div className='h-20 rounded-lg bg-slate-300' />
          <div className='flex justify-between'>
            <div className='h-2 w-1/4 rounded-full bg-slate-300' />
            <div className='h-2 w-1/4 rounded-full bg-slate-300' />
          </div>
        </div>
      </div>
    </div>
  );
}
