'use client';

import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
  useUserFavorites,
  useAddFavorite,
  useRemoveFavorite,
} from '@/lib/api-hooks';

type FavoriteButtonProps = {
  monumentId: number;
};

export function FavoriteButton({ monumentId }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const { data: favoritesData } = useUserFavorites();
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const isFavorited =
    favoritesData?.favorites?.some((fav) => fav.monumentId === monumentId) ??
    false;

  const isLoading =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  const handleFavoriteToggle = async () => {
    if (!session?.user || isLoading) return;

    try {
      if (isFavorited) {
        await removeFavoriteMutation.mutateAsync({ monumentId });
      } else {
        await addFavoriteMutation.mutateAsync({ monumentId });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="bg-background rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <Heart className="mr-2 text-primary size-5" />
        お気に入り
      </h3>

      {isFavorited ? (
        <div className="space-y-3">
          <div className="flex items-center text-red-500">
            <Heart className="mr-2 size-4 fill-current" />
            <span className="text-sm">お気に入り登録済み</span>
          </div>
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleFavoriteToggle}
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                解除中...
              </>
            ) : (
              <>
                <Heart className="mr-2 h-4 w-4" />
                お気に入りから削除
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">
            この句碑をお気に入りに追加できます
          </p>
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleFavoriteToggle}
            variant="default"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                追加中...
              </>
            ) : (
              <>
                <Heart className="mr-2 h-4 w-4" />
                お気に入りに追加
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
