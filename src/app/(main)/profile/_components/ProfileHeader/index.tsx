'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Session } from 'next-auth';

interface ProfileHeaderProps {
  user: Session['user'];
}

export const ProfileHeader = memo<ProfileHeaderProps>(function ProfileHeader({
  user,
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-6 bg-card rounded-lg shadow-sm">
      <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-background">
        {user?.image ? (
          <Image
            alt={user.name || 'ユーザープロフィール画像'}
            className="object-cover"
            fill
            priority
            sizes="96px"
            src={user.image}
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <span className="text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold">{user?.name || 'ユーザー'}</h1>
      </div>
    </div>
  );
});
