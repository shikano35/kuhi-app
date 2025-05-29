import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { Hina_Mincho } from 'next/font/google';
import { AuthButton } from '@/components/AuthButton';
import { cn } from '@/lib/cn';

const hinaMincho = Hina_Mincho({
  variable: '--font-hina-mincho',
  weight: '400',
  subsets: ['latin'],
});

export const menuLinks = [
  { href: '/', label: 'ホーム' },
  { href: '/map', label: '句碑マップ' },
  { href: '/list', label: '句碑リスト' },
  { href: '/about', label: '句碑とは' },
];

export function HomeHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center p-4 py-8 justify-end">
        <nav className="hidden md:flex space-x-12 lg:space-x-16 mr-16 lg:mr-32">
          {menuLinks.map((link, index) => (
            <Link
              className="text-white hover:text-gray-300 transition-colors md:text-base lg:text-lg font-medium text-shadow-lg"
              href={link.href}
              key={index}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <AuthButton isFlag={true} />
          <button className="md:hidden">
            <MenuIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function MapHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm bg-background">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link className="flex items-center" href="/">
            <span className={cn('text-2xl font-bold', hinaMincho.className)}>
              くひめぐり
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8 ml-12 lg:ml-24">
            {menuLinks.map((link, index) => (
              <Link
                className="text-primary hover:text-muted-foreground transition-colors font-medium"
                href={link.href}
                key={index}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <AuthButton />
          <button className="md:hidden">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function Header() {
  return (
    <header className="top-0 left-0 right-0 z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link className="flex items-center" href="/">
            <span className={cn('text-2xl font-bold', hinaMincho.className)}>
              くひめぐり
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8 ml-12 lg:ml-24">
            {menuLinks.map((link, index) => (
              <Link
                className="text-primary hover:text-muted-foreground transition-colors font-medium"
                href={link.href}
                key={index}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <AuthButton />
          <button className="md:hidden">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
