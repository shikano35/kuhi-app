import { Session } from 'next-auth';
import { ProfileContainer } from '@/components/Profile/ProfileContainer';

type ProfileViewProps = {
  user: Session['user'];
};

export function ProfileView({ user }: ProfileViewProps) {
  return <ProfileContainer user={user} />;
}
