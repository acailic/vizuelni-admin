'use client';

import { useCallback, useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type SearchValue = string | number | undefined;

export function useSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const searchParams = useMemo(
    () => currentParams ?? new URLSearchParams(),
    [currentParams]
  );
  const currentPathname = pathname ?? '/';

  const setSearchParams = useCallback(
    (values: Record<string, SearchValue>, resetPage: boolean = false) => {
      const params = new URLSearchParams(searchParams.toString());

      if (resetPage) {
        params.delete('page');
      }

      for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      const query = params.toString();
      if (query === searchParams.toString()) {
        return;
      }

      router.replace(query ? `${currentPathname}?${query}` : currentPathname, {
        scroll: false,
      });
    },
    [currentPathname, router, searchParams]
  );

  return {
    searchParams,
    setSearchParams,
  };
}
