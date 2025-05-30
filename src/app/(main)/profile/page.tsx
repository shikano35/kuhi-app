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
  if (process.env.NODE_ENV === 'test' || process.env.BYPASS_AUTH === 'true') {
    const mockUser = {
      id: 'test-user',
      name: 'テストユーザー',
      email: 'test@example.com',
      image: null,
    };
    return (
      <div className="container mx-auto py-8 px-4">
        <ProfileView user={mockUser} />
      </div>
    );
  }

  const session = await auth();

  if (!session) {
    redirect('/auth/login?callbackUrl=/profile');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ProfileView user={session.user} />
    </div>
  );
}
