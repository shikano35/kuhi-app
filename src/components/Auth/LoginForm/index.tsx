'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { GoogleIcon } from '@/components/Icon/GoogleIcon';

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError('メールアドレスまたはパスワードが正しくありません');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError(
        'ログイン中にエラーが発生しました。後でもう一度お試しください。'
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white pb-8 pt-4 px-4 shadow sm:rounded-lg sm:px-10">
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
                <path
                  clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            className="block text-sm font-medium text-primary"
            htmlFor="email"
          >
            メールアドレス
          </label>
          <div className="mt-1">
            <input
              autoComplete="email"
              className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-accent focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              disabled={isLoading}
              id="email"
              type="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-primary"
            htmlFor="password"
          >
            パスワード
          </label>
          <div className="mt-1">
            <input
              autoComplete="current-password"
              className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-accent focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              disabled={isLoading}
              id="password"
              type="password"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
              id="remember_me"
              name="remember_me"
              type="checkbox"
            />
            <label
              className="ml-2 block text-sm text-primary"
              htmlFor="remember_me"
            >
              ログイン状態を保持する
            </label>
          </div>

          <div className="text-sm">
            <Link
              className="font-medium text-muted-foreground hover:text-primary hover:underline hover:underline-offset-2"
              href="/auth/forgot-password"
            >
              パスワードをお忘れですか？
            </Link>
          </div>
        </div>

        <div>
          <button
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </div>
      </form>

      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-primary-foreground text-muted-foreground">
            または
          </span>
        </div>
      </div>

      <div className="mt-4">
        <button
          className="w-full flex justify-center items-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-primary bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={isLoading}
          onClick={handleGoogleLogin}
        >
          <GoogleIcon className="size-5 mr-4" />
          Googleでログイン
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          アカウントをお持ちでない方は{' '}
          <Link
            className="font-medium text-muted-foreground hover:text-primary hover:underline hover:underline-offset-2"
            href="/auth/register"
          >
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
