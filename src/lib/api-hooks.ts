'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getAllHaikuMonuments,
  getHaikuMonumentsByPoet,
  getAllPoets,
  getAllLocations,
  getHaikuMonumentById,
} from './api';
import { HaikuMonument } from '@/types/haiku';

const PAGE_SIZE = 12;

export function useHaikuList(options?: {
  region?: string;
  poet_id?: number;
  search?: string;
  prefecture?: string;
}) {
  return useInfiniteQuery({
    queryKey: ['haiku-monuments', options],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        let data: HaikuMonument[] = [];

        if (options?.poet_id) {
          data = await getHaikuMonumentsByPoet(options.poet_id);
        } else {
          data = await getAllHaikuMonuments({
            search: options?.search,
            region: options?.region,
            prefecture: options?.prefecture,
          });
        }

        const start = pageParam * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const paginatedData = data.slice(start, end);

        return {
          monuments: paginatedData,
          nextPage: end < data.length ? pageParam + 1 : null,
          totalCount: data.length,
        };
      } catch (error) {
        console.error('句碑リストの取得エラー:', error);
        throw error;
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}

export function usePoetsList() {
  return useQuery({
    queryKey: ['poets'],
    queryFn: getAllPoets,
  });
}

export function useLocationsList() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: getAllLocations,
  });
}

export function useHaikuDetail(id: number) {
  return useQuery({
    queryKey: ['haiku-monument', id],
    queryFn: () => getHaikuMonumentById(id),
    enabled: !!id,
  });
}
