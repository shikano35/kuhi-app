import { Suspense } from 'react';
import { Session } from 'next-auth';
import { ProfileServerComponent } from './ProfileServerComponent';
import { ProfileSkeleton } from './ProfileSkeleton';

type ProfileContainerProps = {
  user: Session['user'];
};

export function ProfileContainer({ user }: ProfileContainerProps) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileServerComponent user={user} />
    </Suspense>
  );
}
