'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Info } from 'lucide-react';
import { GoogleIcon } from '@/components/Icon/GoogleIcon';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      console.error(err);
      setError('ログインに失敗しました。再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background pb-8 pt-4 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="text-center">
        <h1 className="mt-6 text-3xl font-extrabold text-primary">ログイン</h1>
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
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Info className="size-5 text-destructive" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 flex justify-center">
        <button
          className="w-2/3 flex justify-center items-center py-2 px-4 border border-border rounded-full shadow-sm text-sm font-semibold text-muted-foreground bg-background hover:bg-muted hover:cursor-pointer"
          disabled={isLoading}
          onClick={handleGoogleLogin}
        >
          <GoogleIcon className="size-5 mr-4" />
          Googleでログイン
        </button>
      </div>
      <div className="mt-6 text-center" />
    </div>
  );
}
