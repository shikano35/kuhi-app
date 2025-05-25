import { RegisterForm } from '@/components/Auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '新規登録 | くひめぐり',
  description:
    'くひめぐりに新規登録して、お気に入りの句碑を登録したり、句碑情報を投稿したりできます。',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-extrabold text-primary">
            アカウント作成
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            新規登録して、句碑情報の投稿やお気に入り登録ができるようになります
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
