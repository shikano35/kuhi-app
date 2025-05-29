'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MapPin, Heart, Loader2, X } from 'lucide-react';
import { Session } from 'next-auth';
import { HaikuCard } from '@/components/shared/HaikuCard';
import { HaikuMonument, UserHaikuMonument } from '@/types/haiku';
import {
  useUserFavorites,
  useUserVisits,
  useRemoveFavorite,
  useRemoveVisit,
} from '@/lib/api-hooks';

type ProfileViewProps = {
  user: Session['user'];
};

export function ProfileView({ user }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState('favorites');

  const { data: favoritesData, isLoading: favoritesLoading } =
    useUserFavorites();
  const { data: visitsData, isLoading: visitsLoading } = useUserVisits();
  const removeFavoriteMutation = useRemoveFavorite();
  const removeVisitMutation = useRemoveVisit();

  const loading = favoritesLoading || visitsLoading;

  const convertToHaikuMonument = (
    userMonument: UserHaikuMonument
  ): HaikuMonument => {
    return {
      id: userMonument.id,
      inscription: userMonument.inscription,
      commentary: userMonument.commentary || null,
      kigo: userMonument.kigo || null,
      season: userMonument.season || null,
      is_reliable: userMonument.isReliable || null,
      has_reverse_inscription: userMonument.hasReverseInscription || null,
      material: userMonument.material || null,
      total_height: userMonument.totalHeight
        ? Number(userMonument.totalHeight)
        : null,
      width: userMonument.width ? Number(userMonument.width) : null,
      depth: userMonument.depth ? Number(userMonument.depth) : null,
      established_date: userMonument.establishedDate || null,
      established_year: userMonument.establishedYear || null,
      founder: userMonument.founder || null,
      monument_type: userMonument.monumentType || null,
      designation_status: userMonument.designationStatus || null,
      photo_url: userMonument.photoUrl || null,
      photo_date: userMonument.photoDate || null,
      photographer: userMonument.photographer || null,
      model_3d_url: userMonument.model3dUrl || null,
      remarks: userMonument.remarks || null,
      created_at:
        userMonument.createdAt instanceof Date
          ? userMonument.createdAt.toISOString()
          : userMonument.createdAt,
      updated_at:
        userMonument.updatedAt instanceof Date
          ? userMonument.updatedAt.toISOString()
          : userMonument.updatedAt,
      poet_id: userMonument.poetId || 0,
      source_id: userMonument.sourceId || 0,
      location_id: userMonument.locationId || 0,
      poets: [
        {
          id: userMonument.poetId || 0,
          name: userMonument.poetName || '',
          biography: userMonument.poetBiography || null,
          link_url: userMonument.poetLinkUrl || null,
          image_url: userMonument.poetImageUrl || null,
          created_at:
            userMonument.createdAt instanceof Date
              ? userMonument.createdAt.toISOString()
              : userMonument.createdAt,
          updated_at:
            userMonument.updatedAt instanceof Date
              ? userMonument.updatedAt.toISOString()
              : userMonument.updatedAt,
        },
      ],
      sources: [
        {
          id: userMonument.sourceId || 0,
          title: userMonument.sourceTitle || '',
          author: userMonument.sourceAuthor || null,
          publisher: userMonument.sourcePublisher || null,
          source_year: userMonument.sourceYear || null,
          url: userMonument.sourceUrl || null,
          created_at:
            userMonument.createdAt instanceof Date
              ? userMonument.createdAt.toISOString()
              : userMonument.createdAt,
          updated_at:
            userMonument.updatedAt instanceof Date
              ? userMonument.updatedAt.toISOString()
              : userMonument.updatedAt,
        },
      ],
      locations: [
        {
          id: userMonument.locationId || 0,
          region: userMonument.locationRegion || '',
          prefecture: userMonument.locationPrefecture || '',
          municipality: userMonument.locationMunicipality || null,
          address: userMonument.locationAddress || null,
          place_name: userMonument.locationPlaceName || null,
          latitude: userMonument.locationLatitude
            ? Number(userMonument.locationLatitude)
            : null,
          longitude: userMonument.locationLongitude
            ? Number(userMonument.locationLongitude)
            : null,
        },
      ],
    };
  };

  const favorites =
    favoritesData?.favorites?.map((fav) =>
      convertToHaikuMonument(fav.monument)
    ) || [];
  const visited =
    visitsData?.visits?.map((visit) =>
      convertToHaikuMonument(visit.monument)
    ) || [];

  const handleRemoveFavorite = async (monumentId: number) => {
    try {
      await removeFavoriteMutation.mutateAsync({ monumentId });
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const handleRemoveVisit = async (monumentId: number) => {
    try {
      await removeVisitMutation.mutateAsync(monumentId);
    } catch (error) {
      console.error('Failed to remove visit:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-6 bg-card rounded-lg shadow-sm">
        <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-background">
          {user?.image ? (
            <Image
              alt={user.name || 'ユーザープロフィール画像'}
              className="object-cover"
              fill
              src={user.image}
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user?.name || 'ユーザー'}</h2>
        </div>
      </div>

      <Tabs
        className="w-full"
        defaultValue={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6 grid grid-cols-2 md:w-[400px]">
          <TabsTrigger className="flex items-center gap-2" value="favorites">
            <Heart size={16} />
            お気に入り句碑
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="visited">
            <MapPin size={16} />
            訪問済み句碑
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites">
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((monument) => (
                <div className="relative" key={monument.id}>
                  <HaikuCard monument={monument} showFavoriteButton={false} />
                  <button
                    className="absolute top-4 right-4"
                    disabled={removeFavoriteMutation.isPending}
                    onClick={() => handleRemoveFavorite(monument.id)}
                  >
                    {removeFavoriteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </TabsContent>

        <TabsContent value="visited">
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          ) : visited.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visited.map((monument) => (
                <div className="relative" key={monument.id}>
                  <HaikuCard monument={monument} showFavoriteButton={false} />
                  <button
                    className="absolute top-4 right-4"
                    disabled={removeVisitMutation.isPending}
                    onClick={() => handleRemoveVisit(monument.id)}
                  >
                    {removeVisitMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">訪問記録がありません</h3>
              <p className="text-muted-foreground mb-6">
                訪れた句碑を記録して、あなたの句碑めぐりの思い出を残しましょう
              </p>
              <Button asChild>
                <Link href="/map">地図で句碑を探す</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
