import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

type profileItem = {
  id: number;
  title: string;
  url: string | null;
  action: (() => void) | null;
};

const profileList: profileItem[] = [
  {
    id: 1,
    title: 'プロフィール',
    url: '/profile',
    action: null,
  },
  {
    id: 2,
    title: 'アカウント設定',
    url: '/profile/settings',
    action: null,
  },
  {
    id: 3,
    title: 'ログアウト',
    url: '',
    action: () => signOut({ callbackUrl: '/' }),
  },
];

interface DrawerMenuProps {
  imageUrl?: string | null;
  userName?: string | null;
  userEmail?: string | null;
}

export function DrawerMenu({
  imageUrl,
  userName = 'ユーザー',
  userEmail,
}: DrawerMenuProps) {
  return (
    <>
      <div className="px-2 flex items-center py-2">
        <div className="flex text-popover items-center">
          {imageUrl ? (
            <div className="size-10 ring-1 ring-border rounded-full overflow-hidden">
              <Image
                alt={`${userName}のプロフィール画像`}
                className="object-cover"
                height={40}
                src={imageUrl}
                width={40}
              />
            </div>
          ) : (
            <UserIcon className="size-10 p-1 ring-1 ring-border bg-primary rounded-full" />
          )}
        </div>
        <div className="flex flex-col items-start justify-start ml-2 overflow-hidden">
          <p className="text-base text-primary font-semibold overflow-hidden text-ellipsis whitespace-normal max-w-[16ch]">
            {userName}
          </p>
          <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-normal max-w-[20ch]">
            {userEmail || ''}
          </p>
        </div>
      </div>

      <div className="py-2">
        <div className="border-b border-border" />
      </div>
      <ul>
        {profileList.map((item) =>
          item.action ? (
            <li
              className="p-3 hover:bg-input text-muted-foreground cursor-pointer transition-colors"
              key={item.id}
              onClick={item.action}
            >
              <p>{item.title}</p>
            </li>
          ) : (
            <Link className="no-underline" href={item.url || ''} key={item.id}>
              <li className="p-3 hover:bg-input text-muted-foreground">
                <p>{item.title}</p>
              </li>
            </Link>
          )
        )}
      </ul>
    </>
  );
}
