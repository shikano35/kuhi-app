'use client';

import { useState, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitContribution } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import { CheckCircle } from 'lucide-react';
import { LoginModal } from '@/components/Auth/LoginModal';

const contributionSchema = z.object({
  title: z.string().min(1, '句碑の題名または俳句を入力してください'),
  content: z.string().min(3, '詳細情報を入力してください（最低10文字）'),
  prefecture: z.string().min(1, '都道府県を選択してください'),
  location: z.string().min(1, '場所の詳細を入力してください'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type ContributionFormValues = z.infer<typeof contributionSchema>;

const PREFECTURES = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];

export function ContributeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      title: '',
      content: '',
      prefecture: '',
      location: '',
      latitude: '',
      longitude: '',
    },
  });

  const onSubmit = async () => {
    if (!formRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(formRef.current);
      const result = await submitContribution(formData);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        reset();
        if (photoInputRef.current) {
          photoInputRef.current.value = '';
        }
      }
    } catch {
      setError('投稿中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-32 bg-muted/50 rounded-lg">
        <h3 className="mt-2 text-2xl font-semibold text-primary">
          ログインが必要です
        </h3>
        <p className="mt-2 text-muted-foreground">
          句碑情報を投稿するにはログインが必要です。
        </p>
        <div className="mt-12">
          <LoginModal>
            <button className="text-muted-foreground hover:text-primary underline underline-offset-2">
              ログインページへ
            </button>
          </LoginModal>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
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

      {success ? (
        <div className="text-center py-16 bg-green-50 rounded-lg">
          <CheckCircle className="mx-auto size-12 text-green-500" />
          <h3 className="mt-4 text-xl font-semibold text-primary">
            投稿ありがとうございます
          </h3>
          <p className="mt-2 text-base text-muted-foreground">
            句碑情報を受け付けました。
            <br />
            内容を確認した後、サイトに掲載させていただきます。
          </p>
          <div className="mt-6">
            <button
              className="text-muted-foreground hover:text-primary underline underline-offset-4"
              onClick={() => setSuccess(false)}
            >
              別の情報を投稿する
            </button>
          </div>
        </div>
      ) : (
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          ref={formRef}
        >
          <div>
            <label
              className="block text-sm font-medium text-primary"
              htmlFor="title"
            >
              俳句（または句碑のタイトル）{' '}
              <span className="text-destructive">*</span>
            </label>
            <div className="mt-1">
              <input
                className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground/80 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                disabled={isLoading}
                id="title"
                type="text"
                {...register('title')}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-primary"
              htmlFor="content"
            >
              句碑の詳細情報（俳人名、建立年月日、出典情報など）{' '}
              <span className="text-destructive">*</span>
            </label>
            <div className="mt-1">
              <textarea
                className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground/80 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                disabled={isLoading}
                id="content"
                placeholder="できるだけ詳しい情報をご記入ください。"
                rows={5}
                {...register('content')}
              />
              {errors.content && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label
                className="block text-sm font-medium text-primary"
                htmlFor="prefecture"
              >
                都道府県 <span className="text-destructive">*</span>
              </label>
              <div className="mt-1">
                <select
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground/80 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  disabled={isLoading}
                  id="prefecture"
                  {...register('prefecture')}
                >
                  <option value="">選択してください</option>
                  {PREFECTURES.map((pref) => (
                    <option key={pref} value={pref}>
                      {pref}
                    </option>
                  ))}
                </select>
                {errors.prefecture && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.prefecture.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-primary"
                htmlFor="location"
              >
                場所の詳細 <span className="text-destructive">*</span>
              </label>
              <div className="mt-1">
                <input
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground/80 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  disabled={isLoading}
                  id="location"
                  placeholder="例: ○○市○○町1-2-3、○○寺境内"
                  type="text"
                  {...register('location')}
                />
                {errors.location && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label
                className="block text-sm font-medium text-primary"
                htmlFor="latitude"
              >
                緯度
              </label>
              <div className="mt-1">
                <input
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground/80 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  disabled={isLoading}
                  id="latitude"
                  placeholder="例: 35.681236"
                  type="text"
                  {...register('latitude')}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-primary"
                htmlFor="longitude"
              >
                経度
              </label>
              <div className="mt-1">
                <input
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground/80 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  disabled={isLoading}
                  id="longitude"
                  placeholder="例: 139.767136"
                  type="text"
                  {...register('longitude')}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-primary"
              htmlFor="photo"
            >
              句碑の写真
            </label>
            <div className="mt-1">
              <input
                accept="image/*"
                className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-muted-foreground/80 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                disabled={isLoading}
                id="photo"
                name="photo"
                ref={photoInputRef}
                type="file"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                JPG、PNG、GIF形式のファイル（最大10MB）
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? '送信中...' : '情報を送信する'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
