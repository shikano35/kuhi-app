'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  useUserFavorites,
  useUserVisits,
  useRemoveFavorite,
  useRemoveVisit,
} from '@/lib/api-hooks';
import { convertUserHaikuMonumentToHaikuMonument } from '@/lib/user-monument-converter';
import { getUserFriendlyErrorMessage } from '@/lib/error-utils';
import { HaikuMonument } from '@/types/definitions/haiku';

interface ToastState {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
}

export function useProfileData() {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const { data: favoritesData, isLoading: favoritesLoading } =
    useUserFavorites();
  const { data: visitsData, isLoading: visitsLoading } = useUserVisits();
  const removeFavoriteMutation = useRemoveFavorite();
  const removeVisitMutation = useRemoveVisit();

  const loading = favoritesLoading || visitsLoading;

  // メモ化された変換済みデータ
  const favorites = useMemo<HaikuMonument[]>(() => {
    if (!favoritesData?.favorites) return [];

    return favoritesData.favorites.map((fav) =>
      convertUserHaikuMonumentToHaikuMonument(fav.monument)
    );
  }, [favoritesData]);

  const visited = useMemo<HaikuMonument[]>(() => {
    if (!visitsData?.visits) return [];

    return visitsData.visits.map((visit) =>
      convertUserHaikuMonumentToHaikuMonument(visit.monument)
    );
  }, [visitsData]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error') => {
      setToast({ message, type, isVisible: true });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const handleRemoveFavorite = useCallback(
    async (monumentId: number) => {
      try {
        await removeFavoriteMutation.mutateAsync({ monumentId });
        showToast('お気に入りから削除しました', 'success');
      } catch (error) {
        const userMessage = getUserFriendlyErrorMessage(error);
        showToast(userMessage, 'error');
      }
    },
    [removeFavoriteMutation, showToast]
  );

  const handleRemoveVisit = useCallback(
    async (monumentId: number) => {
      try {
        await removeVisitMutation.mutateAsync(monumentId);
        showToast('訪問記録から削除しました', 'success');
      } catch (error) {
        const userMessage = getUserFriendlyErrorMessage(error);
        showToast(userMessage, 'error');
      }
    },
    [removeVisitMutation, showToast]
  );

  return {
    favorites,
    visited,
    loading,
    isRemovingFavorite: removeFavoriteMutation.isPending,
    isRemovingVisit: removeVisitMutation.isPending,
    handleRemoveFavorite,
    handleRemoveVisit,
    toast,
    hideToast,
  };
}
