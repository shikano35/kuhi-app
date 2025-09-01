'use client';

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'status' in error) {
          if (error.status === 503 || error.status === 429) {
            return failureCount < 2;
          }
          if (error.status === 404) {
            return false;
          }
        }
        return failureCount < 1;
      },
      retryDelay: (attemptIndex, error) => {
        if (error && typeof error === 'object' && 'status' in error) {
          if (error.status === 503 || error.status === 429) {
            return Math.min(1000 * Math.pow(2, attemptIndex), 10000);
          }
        }
        return Math.min(1000 * Math.pow(2, attemptIndex), 5000);
      },
    },
    mutations: {
      retry: 1,
    },
  },
});
