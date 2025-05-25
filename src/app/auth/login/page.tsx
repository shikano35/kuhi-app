import { LoginForm } from '@/components/Auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ログイン | くひめぐり',
  description:
    'くひめぐりのアカウントにログインして、お気に入りの句碑を登録したり、句碑情報を投稿したりできます。',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <div className="max-w-md w-full space-y-8">
        <LoginForm />
      </div>
    </div>
  );
}
