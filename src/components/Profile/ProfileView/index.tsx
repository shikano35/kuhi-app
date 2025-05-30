'use client';

import { useState, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Heart } from 'lucide-react';
import { Session } from 'next-auth';
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileHeader } from '@/components/Profile/ProfileHeader';
import { FavoritesTabContent } from '@/components/Profile/FavoritesTabContent';
import { VisitedTabContent } from '@/components/Profile/VisitedTabContent';
import { Toast } from '@/components/ui/toast';

type ProfileViewProps = {
  user: Session['user'];
};

function ProfileContent({ user }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState('favorites');

  const {
    favorites,
    visited,
    loading,
    isRemovingFavorite,
    isRemovingVisit,
    handleRemoveFavorite,
    handleRemoveVisit,
    toast,
    hideToast,
  } = useProfileData();

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
            isRemoving={isRemovingFavorite}
            loading={loading}
            onRemoveFavorite={handleRemoveFavorite}
          />
        </TabsContent>

        <TabsContent value="visited">
          <VisitedTabContent
            isRemoving={isRemovingVisit}
            loading={loading}
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

export function ProfileView({ user }: ProfileViewProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent user={user} />
    </Suspense>
  );
}
