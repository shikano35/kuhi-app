'use client';

import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getAllHaikuMonuments,
  getHaikuMonumentsByPoet,
  getAllPoets,
  getAllLocations,
  getHaikuMonumentById,
} from './api';
import {
  getUserFavorites,
  addFavorite,
  removeFavorite,
  getUserVisits,
  addVisit,
  removeVisitByMonumentId,
} from './user-haiku-api';
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

export function useUserFavorites() {
  return useQuery({
    queryKey: ['user-favorites'],
    queryFn: getUserFavorites,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    onMutate: async (newFavorite) => {
      await queryClient.cancelQueries({ queryKey: ['user-favorites'] });

      const previousData = queryClient.getQueryData(['user-favorites']);

      queryClient.setQueryData(['user-favorites'], (old: any) => {
        if (!old?.favorites) return old;

        // 既にお気に入りに登録されていないかチェック
        const isAlreadyFavorited = old.favorites.some(
          (fav: any) => fav.monument.id === newFavorite.monumentId
        );
        if (isAlreadyFavorited) return old;

        // 新しいお気に入りを追加
        const newFavoriteData = {
          id: `temp-${Date.now()}`,
          userId: 'current-user',
          monumentId: newFavorite.monumentId,
          createdAt: new Date(),
          monument: {
            id: newFavorite.monumentId,
            inscription: '読み込み中...',
          },
        };

        return {
          ...old,
          favorites: [...old.favorites, newFavoriteData],
        };
      });

      return { previousData };
    },
    onError: (err, newFavorite, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['user-favorites'], context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    onMutate: async (removeFavorite) => {
      await queryClient.cancelQueries({ queryKey: ['user-favorites'] });

      const previousData = queryClient.getQueryData(['user-favorites']);

      queryClient.setQueryData(['user-favorites'], (old: any) => {
        if (!old?.favorites) return old;

        return {
          ...old,
          favorites: old.favorites.filter(
            (fav: any) => fav.monument.id !== removeFavorite.monumentId
          ),
        };
      });

      return { previousData };
    },
    onError: (err, removeFavorite, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['user-favorites'], context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
    },
  });
}

export function useUserVisits() {
  return useQuery({
    queryKey: ['user-visits'],
    queryFn: getUserVisits,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-visits'] });
    },
  });
}

export function useRemoveVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeVisitByMonumentId,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-visits'] });
    },
  });
}
