import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { baseMetadata } from '@/lib/metadata';
import { auth } from '@/lib/auth';
import { ProfileSettings } from '@/components/Profile/ProfileSettings';

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'プロフィール設定 | くひめぐり',
  description: 'プロフィール情報の編集や各種設定を行えます。',
};

export default async function ProfileSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login?callbackUrl=/profile/settings');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">プロフィール設定</h1>
      <ProfileSettings user={session.user} />
    </div>
  );
}
