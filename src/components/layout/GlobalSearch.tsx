'use client';

import { memo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

interface GlobalSearchProps {
  locale: string;
  placeholder: string;
  clearLabel?: string;
}

function GlobalSearchComponent({
  locale,
  placeholder,
  clearLabel = 'Clear search',
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/browse?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSearch} className='relative w-full max-w-md'>
      <div
        className={cn(
          'flex items-center rounded-lg border bg-white transition-colors',
          isFocused
            ? 'border-[#C6363C] ring-1 ring-[#C6363C]'
            : 'border-slate-200'
        )}
      >
        <Search className='ml-3 h-4 w-4 text-slate-400' />
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label={placeholder}
          placeholder={placeholder}
          className='w-full border-none bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0'
        />
        {query && (
          <button
            type='button'
            onClick={handleClear}
            aria-label={clearLabel}
            className='mr-2 text-slate-400 hover:text-slate-600'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>
    </form>
  );
}

export const GlobalSearch = memo(GlobalSearchComponent);
