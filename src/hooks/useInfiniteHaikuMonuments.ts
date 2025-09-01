'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getHaikuMonumentsPage } from '@/lib/api';
import { HaikuMonument } from '@/types/definitions/haiku';

interface UseInfiniteHaikuMonumentsOptions {
  search?: string;
  region?: string;
  prefecture?: string;
  poet_id?: number;
  title_contains?: string;
  name_contains?: string;
  ordering?: string[];
  enabled?: boolean;
}

export function useInfiniteHaikuMonuments(
  options: UseInfiniteHaikuMonumentsOptions = {}
) {
  return useInfiniteQuery({
    queryKey: [
      'haiku-monuments-infinite',
      options.search,
      options.region,
      options.prefecture,
      options.poet_id,
      options.title_contains,
      options.name_contains,
      options.ordering,
    ],
    queryFn: ({ pageParam }) =>
      getHaikuMonumentsPage({
        pageParam: pageParam as number,
        ...options,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: options.enabled !== false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function flattenInfiniteHaikuMonuments(
  data: { data: HaikuMonument[] }[] | undefined
): HaikuMonument[] {
  return data?.flatMap((page) => page.data) ?? [];
}
