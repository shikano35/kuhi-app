/**
 * 新しいKuhi API用のReact Queryフック
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  getMonuments,
  getMonumentById,
  getPoets,
  getPoetById,
  getMonumentsByPoet,
  getLocations,
  getSources,
} from '@/lib/kuhi-api';
import {
  MonumentWithRelations,
  MonumentsQueryParams,
  Location,
  PoetsQueryParams,
  LocationsQueryParams,
  SourcesQueryParams,
} from '@/types/definitions/api';

// Monument hooks
export function useMonuments(params: MonumentsQueryParams = {}) {
  return useQuery({
    queryKey: ['monuments', params],
    queryFn: () => getMonuments(params),
    staleTime: 5 * 60 * 1000, // 5分
  });
}

export function useInfiniteMonuments(params: MonumentsQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ['monuments', 'infinite', params],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam as number;
      const monuments = await getMonuments({
        ...params,
        offset,
        limit: params.limit || 20,
      });
      return {
        data: monuments,
        nextOffset:
          monuments.length === (params.limit || 20)
            ? offset + (params.limit || 20)
            : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMonument(id: number) {
  return useQuery({
    queryKey: ['monument', id],
    queryFn: () => getMonumentById(id),
    staleTime: 10 * 60 * 1000, // 10分
  });
}

// Poet hooks
export function usePoets(params: PoetsQueryParams = {}) {
  return useQuery({
    queryKey: ['poets', params],
    queryFn: () => getPoets(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePoet(id: number) {
  return useQuery({
    queryKey: ['poet', id],
    queryFn: () => getPoetById(id),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMonumentsByPoet(poetId: number) {
  return useQuery({
    queryKey: ['monuments', 'by-poet', poetId],
    queryFn: () => getMonumentsByPoet(poetId),
    staleTime: 5 * 60 * 1000,
  });
}

// Location hooks
export function useLocations(params: LocationsQueryParams = {}) {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => getLocations(params),
    staleTime: 15 * 60 * 1000, // 15分
  });
}

// Source hooks
export function useSources(params: SourcesQueryParams = {}) {
  return useQuery({
    queryKey: ['sources', params],
    queryFn: () => getSources(params),
    staleTime: 15 * 60 * 1000,
  });
}

// ユーティリティフック
export function useFlattenedInfiniteMonuments(
  data: { data: MonumentWithRelations[]; nextOffset?: number }[] | undefined
): MonumentWithRelations[] {
  if (!data) return [];
  return data.flatMap((page) => page.data);
}

// 地域別句碑フック
export function useMonumentsByRegion() {
  return useQuery({
    queryKey: ['monuments', 'by-region'],
    queryFn: async () => {
      const monuments = await getMonuments({ limit: 500 }); // 大きめのlimitで全体を取得

      const regionMap: Record<string, MonumentWithRelations[]> = {};

      monuments.forEach((monument: MonumentWithRelations) => {
        monument.locations.forEach((location: Location) => {
          if (!regionMap[location.region]) {
            regionMap[location.region] = [];
          }
          regionMap[location.region].push(monument);
        });
      });

      return regionMap;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// 検索用フック
export function useSearchMonuments(searchParams: {
  q?: string;
  poet_name_contains?: string;
  inscription_contains?: string;
  prefecture?: string;
  region?: string;
  season?: string;
  kigo?: string;
}) {
  return useInfiniteMonuments({
    ...searchParams,
    limit: 20,
  });
}
