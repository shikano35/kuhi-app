'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HaikuCard } from '@/components/shared/HaikuCard';
import { Loader2, X, Heart } from 'lucide-react';
import { HaikuMonument } from '@/types/haiku';

interface FavoritesTabContentProps {
  favorites: HaikuMonument[];
  loading: boolean;
  isRemoving: boolean;
  onRemoveFavorite: (monumentId: number) => void;
}

export const FavoritesTabContent = memo<FavoritesTabContentProps>(
  function FavoritesTabContent({
    favorites,
    loading,
    isRemoving,
    onRemoveFavorite,
  }) {
    if (loading) {
      return (
        <div className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      );
    }

    if (favorites.length === 0) {
      return (
        <div className="py-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">
            お気に入り登録した句碑はありません
          </h3>
          <p className="text-muted-foreground mb-6">
            気に入った句碑や俳句をお気に入り登録して、いつでも見返せるようにしましょう
          </p>
          <Button asChild>
            <Link href="/list">句碑や俳句を探す</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((monument) => (
          <div className="relative" key={monument.id}>
            <HaikuCard monument={monument} showFavoriteButton={false} />
            <button
              aria-label={`${monument.inscription}をお気に入りから削除`}
              className="absolute top-4 right-4 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
              disabled={isRemoving}
              onClick={() => onRemoveFavorite(monument.id)}
            >
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    );
  }
);
