import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ProfileSettings } from '@/components/Profile/ProfileSettings';

export default async function ProfileSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <ProfileSettings user={session.user} />
    </div>
  );
}
