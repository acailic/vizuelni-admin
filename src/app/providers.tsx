'use client';

import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ErrorModalProvider } from '@/components/ui/ErrorModal';
import { isStaticMode } from '@/lib/app-mode';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {isStaticMode ? (
        <ErrorModalProvider>{children}</ErrorModalProvider>
      ) : (
        <SessionProvider>
          <ErrorModalProvider>{children}</ErrorModalProvider>
        </SessionProvider>
      )}
    </QueryClientProvider>
  );
}
