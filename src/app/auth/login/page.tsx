import { LoginForm } from '@/components/Auth/LoginForm';
import { Info } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ログイン | くひめぐり',
  description:
    'くひめぐりのアカウントにログインして、お気に入りの句碑を登録したり、句碑情報を投稿したりできます。',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-extrabold text-primary">
            ログイン
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            句碑情報の投稿やお気に入り登録ができます。
          </p>
        </div>
        <div className="bg-yellow-50 border-l-2 border-yellow-400 p-2 my-6 max-w-xs mx-auto">
          <div className="flex justify-center">
            <div className="flex-shrink-0">
              <Info className="size-5 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-yellow-700 text-start">
                現在，句碑情報の投稿のみ可能です。
                <br />
                お気に入り登録は利用できません。
              </p>
            </div>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
