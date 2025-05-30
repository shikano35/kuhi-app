'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Info } from 'lucide-react';

export function LoginForm() {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line unused-imports/no-unused-vars
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
        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-primary">
          ログイン
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          句碑情報の投稿やお気に入り登録ができます。
        </p>
      </div>
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="size-5 mt-0.75 text-destructive" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 flex justify-center">
        {/* <button
          className="w-3/4 text-base md:text-lg flex justify-center items-center py-2 px-4 border border-border rounded-full shadow-sm font-semibold text-primary bg-background hover:bg-muted hover:cursor-pointer"
          disabled={isLoading}
          onClick={handleGoogleLogin}
        >
          <GoogleIcon className="size-5 mr-4 mt-0.75" />
          Googleでログイン
        </button> */}
        <p>現在，プライバシーポリシーを準備中です</p>
      </div>
      <div className="mt-6 text-center" />
    </div>
  );
}
