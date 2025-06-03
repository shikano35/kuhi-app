'use client';

import { MenuIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const menuLinks = [
  { href: '/', label: 'ホーム' },
  { href: '/map', label: '句碑マップ' },
  { href: '/list', label: '句碑リスト' },
  { href: '/haiku', label: '俳句リスト' },
  { href: '/poets', label: '俳人リスト' },
  { href: '/about', label: '句碑とは' },
];

type MobileMenuProps = {
  variant?: 'default' | 'home';
};

export function MobileMenu({ variant = 'default' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const iconColor = variant === 'home' ? 'text-white' : 'text-foreground';
  const bgColor =
    variant === 'home' ? 'hover:bg-muted-foreground' : 'hover:bg-muted';
  const margin = variant === 'home' ? 'top-9 right-6' : 'top-4 right-6';

  const handleLinkClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button
          className={`md:hidden p-2 ${bgColor}`}
          size="icon"
          variant="ghost"
        >
          <MenuIcon className={`size-5 ${iconColor}`} />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-64" margin={margin} side="right">
        <nav
          className={`flex flex-col relative z-10 ${variant === 'home' ? 'mt-24' : 'mt-16'}`}
        >
          {menuLinks.map((link, index) => (
            <button
              className="text-lg font-medium hover:bg-muted p-6 rounded-md transition-colors text-left w-full relative z-10 cursor-pointer"
              key={index}
              onClick={() => handleLinkClick(link.href)}
              type="button"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
