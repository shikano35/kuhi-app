'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle, Info } from 'lucide-react';

// Supabaseクライアントの作成
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const registerSchema = z
  .object({
    name: z.string().min(1, '名前を入力してください'),
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Supabaseでユーザー登録
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);

        // ユーザーテーブルにロール情報を保存
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser?.user) {
          await supabase.from('users').insert({
            id: authUser.user.id,
            email: authUser.user.email,
            name: data.name,
            role: 'user',
          });
        }
      }
    } catch (err) {
      console.error('登録エラー:', err);
      setError('登録中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-background py-8 px-4 shadow sm:rounded-lg sm:px-10">
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="size-5 text-destructive" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success ? (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto size-12 text-green-500" />
          <h3 className="mt-2 text-xl font-medium text-primary">登録完了</h3>
          <p className="mt-2 text-muted-foreground">
            確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。
          </p>
          <div className="mt-6">
            <Link
              className="text-muted-foreground hover:text-primary hover:underline hover:underline-offset-2"
              href="/auth/login"
            >
              ログインページに戻る
            </Link>
          </div>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              className="block text-sm font-medium text-primary"
              htmlFor="name"
            >
              お名前
            </label>
            <div className="mt-1">
              <input
                autoComplete="name"
                className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-accent focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                disabled={isLoading}
                id="name"
                type="text"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

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
                <p className="mt-2 text-sm text-red-600">
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
                autoComplete="new-password"
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

          <div>
            <label
              className="block text-sm font-medium text-primary"
              htmlFor="confirmPassword"
            >
              パスワード（確認）
            </label>
            <div className="mt-1">
              <input
                autoComplete="new-password"
                className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-accent focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                disabled={isLoading}
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? '登録中...' : '登録する'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          すでにアカウントをお持ちの方は{' '}
          <Link
            className="font-medium text-muted-foreground hover:text-primary hover:underline hover:underline-offset-2"
            href="/auth/login"
          >
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
