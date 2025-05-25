import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/tanstack-query';
import { SessionProvider } from 'next-auth/react';

interface TanstackProviderProps {
  children: ReactNode;
}

export function TanstackProvider({ children }: TanstackProviderProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
