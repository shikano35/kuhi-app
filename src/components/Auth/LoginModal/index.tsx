'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type LoginModalProps = {
  children: React.ReactNode;
};

export function LoginModal({ children }: LoginModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error(error);
      setError('ログインに失敗しました。再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-background w-7/8 pb-8 pt-4 shadow rounded-md sm:rounded-lg sm:px-10">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="mt-6 text-3xl md:text-4xl font-extrabold text-primary">
            ログイン
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm md:text-base text-muted-foreground">
            句碑情報の投稿やお気に入り登録ができます。
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          {/* <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-3/4 text-base md:text-lg flex justify-center items-center py-2 px-4 border border-border rounded-full shadow-sm font-semibold text-primary bg-background hover:bg-muted hover:cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ログイン中...
              </>
            ) : (
              <>
                <GoogleIcon className="size-5 mr-4 mt-0.75" />
                Googleでログイン
              </>
            )}
          </button> */}
          <p>現在，プライバシーポリシーを準備中です</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
