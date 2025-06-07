'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  searchImages,
  searchByTheme,
  searchRelatedMaterials,
  getItemDetail,
} from './japansearch';

export const japanSearchKeys = {
  all: ['japanSearch'] as const,
  images: () => [...japanSearchKeys.all, 'images'] as const,
  imageSearch: (query: string) => [...japanSearchKeys.images(), query] as const,
  themes: () => [...japanSearchKeys.all, 'themes'] as const,
  themeSearch: (type: string, query: string) =>
    [...japanSearchKeys.themes(), type, query] as const,
  materials: () => [...japanSearchKeys.all, 'materials'] as const,
  relatedMaterials: (poetName: string) =>
    [...japanSearchKeys.materials(), poetName] as const,
  relatedImages: (poetName: string) =>
    [...japanSearchKeys.images(), 'related', poetName] as const,
  detail: (itemId: string) =>
    [...japanSearchKeys.all, 'detail', itemId] as const,
};

export function useImageSearch(query: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: japanSearchKeys.imageSearch(query),
    queryFn: () => searchImages(query, 60, 1),
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useInfiniteImageSearch(
  query: string,
  options?: { enabled?: boolean }
) {
  return useInfiniteQuery({
    queryKey: japanSearchKeys.imageSearch(query),
    queryFn: ({ pageParam = 1 }) => searchImages(query, 60, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length < 60) return undefined;
      return lastPageParam + 1;
    },
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useDefaultImages() {
  return useQuery({
    queryKey: japanSearchKeys.imageSearch('桜'),
    queryFn: () => searchImages('桜', 60, 1),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useThemeSearch(
  theme: 'season' | 'region' | 'poet' | 'era',
  query: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: japanSearchKeys.themeSearch(theme, query),
    queryFn: () => searchByTheme(theme, query, 60, 1),
    enabled: !!query.trim(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useInfiniteThemeSearch(
  theme: 'season' | 'region' | 'poet' | 'era',
  query: string,
  options?: { enabled?: boolean }
) {
  return useInfiniteQuery({
    queryKey: japanSearchKeys.themeSearch(theme, query),
    queryFn: async ({ pageParam = 1 }) => {
      const pageSize = 60;
      const results = await searchByTheme(theme, query, pageSize, pageParam);
      return results;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage || lastPage.length === 0 || lastPage.length < 60) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    enabled: !!query.trim(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useRelatedMaterials(
  poetName: string,
  options?: { enabled?: boolean }
) {
  return useInfiniteQuery({
    queryKey: japanSearchKeys.relatedMaterials(poetName),
    queryFn: ({ pageParam = 1 }) =>
      searchRelatedMaterials(poetName, 12, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length < 12) return undefined;
      return lastPageParam + 1;
    },
    enabled: !!poetName,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useRelatedImages(
  poetName: string,
  options?: { enabled?: boolean }
) {
  return useInfiniteQuery({
    queryKey: japanSearchKeys.relatedImages(poetName),
    queryFn: ({ pageParam = 1 }) =>
      searchImages(`${poetName} 俳句 句碑`, 12, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length < 12) return undefined;
      return lastPageParam + 1;
    },
    enabled: !!poetName,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useItemDetail(itemId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: japanSearchKeys.detail(itemId),
    queryFn: () => getItemDetail(itemId),
    enabled: !!itemId && options?.enabled !== false,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    ...options,
  });
}
