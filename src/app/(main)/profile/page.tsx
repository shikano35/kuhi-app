import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { baseMetadata } from '@/lib/metadata';
import { auth } from '@/lib/auth';
import { ProfileView } from '@/components/Profile/ProfileView';

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'プロフィール | くひめぐり',
  description:
    'あなたのプロフィールページです。お気に入り句碑や訪問履歴を確認できます。',
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login?callbackUrl=/profile');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">プロフィール</h1>
      <ProfileView user={session.user} />
    </div>
  );
}
