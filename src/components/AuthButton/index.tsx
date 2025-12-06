'use client';

import { useEffect, useReducer, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useSession } from 'next-auth/react';
import { useEventListener } from '@/hooks/useEventListener';
import { UserIcon } from 'lucide-react';
import { FadeIn } from '../FadeIn';
import { DrawerMenu } from '../DrawerMenu';
import { LoginModal } from '@/components/Auth/LoginModal';

export function AuthButton({ isFlag = false }: { isFlag?: boolean }) {
  const { data: session, status } = useSession();
  const { setUser, setLoading } = useAuthStore();
  const [isOpen, toggleOpen] = useReducer((prev) => !prev, false);
  const [menuRef, setMenuRef] = useState<HTMLDivElement | null>(null);
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        menuRef &&
        !menuRef.contains(event.target as Node) &&
        buttonRef &&
        !buttonRef.contains(event.target as Node)
      ) {
        toggleOpen();
      }
    },
    [menuRef, buttonRef]
  );

  useEventListener('mousedown', handleClickOutside, isOpen);

  useEffect(() => {
    setLoading(status === 'loading');
    setUser(session?.user || null);
  }, [session, status, setLoading, setUser]);

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
    const imageUrl = session.user?.image;
    const userName = session.user?.name;

    return isFlag ? (
      <div className="relative flex justify-center items-center bg-foreground rounded-full">
        <button
          className="rounded-full transition overflow-hidden"
          onClick={toggleOpen}
          ref={setButtonRef}
          type="button"
        >
          {imageUrl ? (
            <Image
              alt={`${userName}のプロフィール画像`}
              className="size-10 object-cover rounded-full"
              height={28}
              src={imageUrl}
              width={28}
            />
          ) : (
            <UserIcon className="size-10" />
          )}
        </button>

        {isOpen && (
          <FadeIn>
            <div
              className="absolute right-0 top-12 mt-0 w-64 bg-popover border border-border rounded-lg shadow-lg py-2"
              ref={setMenuRef}
            >
              <DrawerMenu imageUrl={imageUrl} userName={userName} />
            </div>
          </FadeIn>
        )}
      </div>
    ) : (
      <div className="relative flex justify-center items-center bg-foreground rounded-full">
        <button
          className="rounded-full transition overflow-hidden"
          onClick={toggleOpen}
          ref={setButtonRef}
          type="button"
        >
          {imageUrl ? (
            <Image
              alt={`${userName}のプロフィール画像`}
              className="size-8 object-cover rounded-full"
              height={28}
              src={imageUrl}
              width={28}
            />
          ) : (
            <UserIcon className="size-8" />
          )}
        </button>

        {isOpen && (
          <FadeIn>
            <div
              className="absolute right-0 top-12 mt-0 w-64 bg-background border border-border rounded-lg shadow-lg py-2"
              ref={setMenuRef}
            >
              <DrawerMenu imageUrl={imageUrl} userName={userName} />
            </div>
          </FadeIn>
        )}
      </div>
    );
  }

  return isFlag ? (
    <LoginModal>
      <Button
        className="text-md bg-white/0 text-white hover:bg-white/20 hover:text-white rounded-full transition-colors text-shadow-lg shadow-lg"
        variant="outline"
      >
        ログイン
      </Button>
    </LoginModal>
  ) : (
    <LoginModal>
      <Button className="text-md text-primary-foreground rounded-full">
        ログイン
      </Button>
    </LoginModal>
  );
}
