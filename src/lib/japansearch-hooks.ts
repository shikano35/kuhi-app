'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  searchRelatedMaterials,
  searchRelatedImages,
  searchJapanSearchItems,
  getItemDetail,
} from '@/lib/japansearch';
import type { JapanSearchItem } from '@/lib/japansearch-types';

const ITEMS_PER_PAGE = 60;

/**
 * 俳人に関連する文献・資料を取得
 */
export function useRelatedMaterials(poetName: string) {
  return useInfiniteQuery({
    queryKey: ['related-materials', poetName],
    queryFn: async ({ pageParam = 1 }): Promise<JapanSearchItem[]> => {
      return await searchRelatedMaterials(poetName, ITEMS_PER_PAGE, pageParam);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < ITEMS_PER_PAGE) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!poetName,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 俳人に関連する画像を取得
 */
export function useRelatedImages(poetName: string) {
  return useInfiniteQuery({
    queryKey: ['related-images', poetName],
    queryFn: async ({ pageParam = 1 }): Promise<JapanSearchItem[]> => {
      return await searchRelatedImages(poetName, ITEMS_PER_PAGE, pageParam);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < ITEMS_PER_PAGE) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!poetName,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * テーマ別検索を取得
 */
export function useInfiniteThemeSearch(theme: string, query: string) {
  return useInfiniteQuery({
    queryKey: ['theme-search', theme, query],
    queryFn: async ({ pageParam = 1 }): Promise<JapanSearchItem[]> => {
      const from = (pageParam - 1) * ITEMS_PER_PAGE;
      const response = await searchJapanSearchItems({
        keyword: query,
        size: ITEMS_PER_PAGE,
        from,
      });
      return response.list;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < ITEMS_PER_PAGE) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * ギャラリーホーム用のデフォルト画像を取得
 */
export function useDefaultImages() {
  return useInfiniteQuery({
    queryKey: ['default-gallery-images'],
    queryFn: async ({ pageParam = 1 }): Promise<JapanSearchItem[]> => {
      const from = (pageParam - 1) * ITEMS_PER_PAGE;
      const response = await fetch(
        `/api/japansearch/search?keyword=${encodeURIComponent('俳句 文化財')}&size=${ITEMS_PER_PAGE}&from=${from}`
      );

      if (!response.ok) {
        console.error('Gallery API error:', response.status);
        return [];
      }

      const data = await response.json();
      return data.items || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < ITEMS_PER_PAGE) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
}

/**
 * 個別アイテムの詳細を取得
 */
export function useItemDetail(itemId: string) {
  return useQuery({
    queryKey: ['item-detail', itemId],
    queryFn: async (): Promise<JapanSearchItem | null> => {
      return await getItemDetail(itemId);
    },
    enabled: !!itemId,
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
}

/**
 * 画像検索を取得
 */
export function useInfiniteImageSearch(keyword: string) {
  return useInfiniteQuery({
    queryKey: ['image-search', keyword],
    queryFn: async ({ pageParam = 1 }): Promise<JapanSearchItem[]> => {
      const from = (pageParam - 1) * ITEMS_PER_PAGE;
      const response = await searchJapanSearchItems({
        keyword,
        size: ITEMS_PER_PAGE,
        from,
        'f-contents': 'image',
      });
      // 画像を持つアイテムのみをフィルタリング
      return response.list.filter((item) => item.common?.thumbnailUrl);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < ITEMS_PER_PAGE) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!keyword,
    staleTime: 1000 * 60 * 5,
  });
}
