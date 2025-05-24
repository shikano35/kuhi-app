'use client';

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1分間はキャッシュを新鮮として扱う
      gcTime: 5 * 60 * 1000, // 5分間はキャッシュを保持
      retry: 1, // エラー時のリトライ回数
    },
  },
});
