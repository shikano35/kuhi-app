'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { signOut, useSession } from 'next-auth/react';

export function AuthButton({ isFlag = false }: { isFlag?: boolean }) {
  const { data: session, status } = useSession();
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(status === 'loading');
    setUser(session?.user || null);
  }, [session, status, setUser, setLoading]);

  if (status === 'loading') {
    return isFlag ? (
      <Button
        className="text-md bg-white/0 text-white hover:bg-white/20 hover:text-white rounded-full transition-colors text-shadow-lg shadow-lg"
        disabled
        variant="outline"
      >
        読み込み中...
      </Button>
    ) : (
      <Button className="text-md text-primary-foreground rounded-full" disabled>
        読み込み中...
      </Button>
    );
  }

  if (session) {
    return isFlag ? (
      <Button
        className="text-md bg-white/0 text-white hover:bg-white/20 hover:text-white rounded-full transition-colors text-shadow-lg shadow-lg"
        onClick={() => signOut({ callbackUrl: '/' })}
        variant="outline"
      >
        ログアウト
      </Button>
    ) : (
      <Button
        className="text-md text-primary-foreground rounded-full"
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        ログアウト
      </Button>
    );
  }

  return isFlag ? (
    <Button
      asChild
      className="text-md bg-white/0 text-white hover:bg-white/20 hover:text-white rounded-full transition-colors text-shadow-lg shadow-lg"
      variant="outline"
    >
      <Link href="/auth/login">ログイン</Link>
    </Button>
  ) : (
    <Button asChild className="text-md text-primary-foreground rounded-full">
      <Link href="/auth/login">ログイン</Link>
    </Button>
  );
}
