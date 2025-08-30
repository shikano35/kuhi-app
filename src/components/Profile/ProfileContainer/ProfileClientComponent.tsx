'use client';

import { useState, useMemo, useCallback } from 'react';
import { Session } from 'next-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Heart } from 'lucide-react';
import {
  UserFavorite,
  UserVisit,
  UserHaikuMonument,
} from '@/types/definitions/haiku';
import { MonumentWithRelations } from '@/types/definitions/api';
import { convertUserHaikuMonumentToMonumentWithRelations } from '@/lib/user-monument-converter';
import { logError, getUserFriendlyErrorMessage } from '@/lib/error-utils';
import {
  useUserFavorites,
  useUserVisits,
  useRemoveFavorite,
  useRemoveVisit,
} from '@/lib/api-hooks';
import { ProfileHeader } from '@/components/Profile/ProfileHeader';
import { FavoritesTabContent } from '@/components/Profile/FavoritesTabContent';
import { VisitedTabContent } from '@/components/Profile/VisitedTabContent';
import { Toast } from '@/components/ui/toast';

type ProfileClientComponentProps = {
  user: Session['user'];
  initialFavorites: (UserFavorite & { monument: UserHaikuMonument })[];
  initialVisits: (UserVisit & { monument: UserHaikuMonument })[];
};

type ToastState = {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
};

export function ProfileClientComponent({
  user,
  initialFavorites,
  initialVisits,
}: ProfileClientComponentProps) {
  const [activeTab, setActiveTab] = useState('favorites');
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  // リアルタイムデータを取得
  const { data: favoritesData, isLoading: favoritesLoading } = useUserFavorites(
    {
      initialData: { favorites: initialFavorites },
    }
  );
  const { data: visitsData, isLoading: visitsLoading } = useUserVisits({
    initialData: { visits: initialVisits },
  });

  const removeFavoriteMutation = useRemoveFavorite();
  const removeVisitMutation = useRemoveVisit();

  // メモ化された変換済みデータ
  const favorites: MonumentWithRelations[] = useMemo(() => {
    if (!favoritesData?.favorites) return [];
    return favoritesData.favorites.map((fav) =>
      convertUserHaikuMonumentToMonumentWithRelations(fav.monument)
    );
  }, [favoritesData?.favorites]);

  const visited: MonumentWithRelations[] = useMemo(() => {
    if (!visitsData?.visits) return [];
    return visitsData.visits.map((visit) =>
      convertUserHaikuMonumentToMonumentWithRelations(visit.monument)
    );
  }, [visitsData?.visits]);

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
        logError(error, 'error', {
          context: 'ProfileView.handleRemoveFavorite',
          action: 'remove_favorite',
        });
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
        logError(error, 'error', {
          context: 'ProfileView.handleRemoveVisit',
          action: 'remove_visit',
        });
        const userMessage = getUserFriendlyErrorMessage(error);
        showToast(userMessage, 'error');
      }
    },
    [removeVisitMutation, showToast]
  );

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileHeader user={user} />

      <Tabs
        className="w-full"
        defaultValue={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6 grid grid-cols-2 md:w-[400px]">
          <TabsTrigger className="flex items-center gap-2" value="favorites">
            <Heart size={16} />
            お気に入り句碑
            {favorites.length > 0 && (
              <span className="ml-1 text-xs bg-muted rounded-full px-2 py-0.5">
                {favorites.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="visited">
            <MapPin size={16} />
            訪問済み句碑
            {visited.length > 0 && (
              <span className="ml-1 text-xs bg-muted rounded-full px-2 py-0.5">
                {visited.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites">
          <FavoritesTabContent
            favorites={favorites}
            isRemoving={removeFavoriteMutation.isPending}
            loading={favoritesLoading}
            onRemoveFavorite={handleRemoveFavorite}
          />
        </TabsContent>

        <TabsContent value="visited">
          <VisitedTabContent
            isRemoving={removeVisitMutation.isPending}
            loading={visitsLoading}
            onRemoveVisit={handleRemoveVisit}
            visited={visited}
          />
        </TabsContent>
      </Tabs>

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        onClose={hideToast}
        type={toast.type}
      />
    </div>
  );
}
