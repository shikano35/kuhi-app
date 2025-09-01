'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MonumentWithRelations } from '@/types/definitions/api';
import { truncateInscription } from '@/lib/utils';
import { MapPinIcon, UserIcon, Heart, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
  useUserFavorites,
  useAddFavorite,
  useRemoveFavorite,
} from '@/lib/api-hooks';

type HaikuCardProps = {
  monument: MonumentWithRelations;
  showFavoriteButton?: boolean;
};

export function HaikuCard({
  monument,
  showFavoriteButton = true,
}: HaikuCardProps) {
  const { data: session } = useSession();
  const { data: favoritesData } = useUserFavorites();
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const { id, inscriptions, poets, locations, media } = monument;
  const poet = poets?.[0];
  const location = locations?.[0];
  const inscription = inscriptions?.[0]?.original_text || '';
  const photo_url = media?.[0]?.url || null;

  const isFavorited = useMemo(() => {
    if (!favoritesData?.favorites || !session?.user) return false;
    return favoritesData.favorites.some((fav) => fav.monument.id === id);
  }, [favoritesData?.favorites, id, session?.user]);

  const isLoading =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user || isLoading) return;

    try {
      if (isFavorited) {
        await removeFavoriteMutation.mutateAsync({ monumentId: id });
      } else {
        await addFavoriteMutation.mutateAsync({ monumentId: id });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <Link href={`/monument/${id}`}>
      <div
        className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
        data-testid="haiku-card"
      >
        <div className="relative h-48 bg-muted">
          {showFavoriteButton && session?.user && (
            <button
              className={`absolute top-2 right-2 z-10 p-2 rounded-full ${
                isFavorited
                  ? 'text-red-500 hover:text-red-600 transition-colors'
                  : 'text-primary/60 hover:text-primary transition-colors'
              }`}
              disabled={isLoading}
              onClick={handleFavoriteToggle}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart
                  className={`h-5 w-5 ${isFavorited ? 'fill-red-500 hover:fill-red-600 transition-colors' : ''}`}
                />
              )}
            </button>
          )}
          {photo_url ? (
            <Image
              alt={inscription}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={photo_url}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              写真はありません
            </div>
          )}
        </div>
        <div className="p-4 flex-grow">
          <h3 className="text-lg font-medium mb-2 line-clamp-1">
            {truncateInscription(inscription)}
          </h3>

          <div className="mt-auto">
            {poet && (
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <UserIcon className="h-4 w-4 text-muted-foreground mr-1" />
                <span data-testid="poet-name">{poet.name}</span>
              </div>
            )}

            {location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPinIcon className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="truncate" data-testid="location-name">
                  {location.prefecture} {location.municipality}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
