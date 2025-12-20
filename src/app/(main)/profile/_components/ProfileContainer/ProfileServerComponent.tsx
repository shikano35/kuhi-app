import { Session } from 'next-auth';
import { ProfileClientComponent } from './ProfileClientComponent';
import {
  getUserFavoritesServer,
  getUserVisitsServer,
} from '@/lib/server-user-api';

type ProfileServerComponentProps = {
  user: Session['user'];
};

export async function ProfileServerComponent({
  user,
}: ProfileServerComponentProps) {
  const [favoritesData, visitsData] = await Promise.all([
    getUserFavoritesServer().catch(() => ({ favorites: [] })),
    getUserVisitsServer().catch(() => ({ visits: [] })),
  ]);

  return (
    <ProfileClientComponent
      initialFavorites={favoritesData.favorites}
      initialVisits={visitsData.visits}
      user={user}
    />
  );
}
