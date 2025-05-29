'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Session } from 'next-auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Trash2, Upload, User } from 'lucide-react';
import {
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
} from '@/lib/profile-api';

const profileFormSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  bio: z.string().optional(),
  email: z.string().email('有効なメールアドレスを入力してください'),
  emailNotifications: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ProfileSettingsProps = {
  user: Session['user'];
};

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState(user?.image || null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: ProfileFormValues = {
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    emailNotifications: user?.emailNotifications ?? true,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateProfile({
        name: data.name,
        bio: data.bio,
        emailNotifications: data.emailNotifications,
      });

      setSuccessMessage('プロフィール情報が更新されました');

      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'プロフィールの更新に失敗しました。後でもう一度お試しください。'
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('ファイルサイズが大きすぎます（最大5MB）');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('対応していないファイル形式です（JPEG、PNG、WebPのみ）');
      return;
    }

    setIsImageUploading(true);
    setErrorMessage(null);

    try {
      const imageUrl = await uploadProfileImage(file);
      setCurrentImage(imageUrl);
      setSuccessMessage('プロフィール画像が更新されました');
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '画像のアップロードに失敗しました。'
      );
    } finally {
      setIsImageUploading(false);
    }
  }

  async function handleImageDelete() {
    setIsImageUploading(true);
    setErrorMessage(null);

    try {
      await deleteProfileImage();
      setCurrentImage(null);
      setSuccessMessage('プロフィール画像が削除されました');
    } catch (error) {
      console.error('画像削除エラー:', error);
      setErrorMessage(
        error instanceof Error ? error.message : '画像の削除に失敗しました。'
      );
    } finally {
      setIsImageUploading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button asChild className="mb-6" variant="ghost">
        <Link className="flex items-center gap-2" href="/profile">
          <ArrowLeft size={16} />
          プロフィールに戻る
        </Link>
      </Button>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      <input
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleImageUpload}
        ref={fileInputRef}
        type="file"
      />

      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>プロフィール画像</CardTitle>
              <CardDescription>
                あなたのプロフィール画像を変更できます（最大5MB、JPEG/PNG/WebP形式のみ）
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-background shadow-lg">
                {currentImage ? (
                  <Image
                    alt="プロフィール画像"
                    className="object-cover"
                    fill
                    src={currentImage}
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  className="gap-2"
                  disabled={isImageUploading}
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  variant="outline"
                >
                  {isImageUploading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Upload size={16} />
                  )}
                  画像をアップロード
                </Button>
                {currentImage && (
                  <Button
                    className="gap-2 text-destructive hover:text-destructive"
                    disabled={isImageUploading}
                    onClick={handleImageDelete}
                    type="button"
                    variant="outline"
                  >
                    <Trash2 size={16} /> 画像を削除
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>プロフィール情報</CardTitle>
              <CardDescription>
                基本的なプロフィール情報を更新できます
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名前</FormLabel>
                    <FormControl>
                      <Input placeholder="名前を入力" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="メールアドレスを入力"
                        type="email"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormDescription>
                      メールアドレスは変更できません
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>自己紹介</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="あなたについて教えてください（500文字以内）"
                        {...field}
                        maxLength={500}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500文字
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>通知設定</CardTitle>
              <CardDescription>通知の受け取り方法を設定します</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">メール通知</FormLabel>
                      <FormDescription>
                        お知らせやアップデート情報をメールで受け取る
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-between">
            <Button
              onClick={() => router.push('/profile')}
              type="button"
              variant="outline"
            >
              キャンセル
            </Button>
            <Button className="gap-2" disabled={isLoading} type="submit">
              {isLoading && (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              )}
              <Save size={16} />
              設定を保存
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
