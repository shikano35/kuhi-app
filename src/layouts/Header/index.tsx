import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

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
              className="text-white hover:text-gray-300 transition-colors font-medium text-shadow-lg"
              href={link.href}
              key={index}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            asChild
            className="text-md bg-white/0 text-white hover:bg-white/20 hover:text-white rounded-full transition-colors text-shadow-lg shadow-lg"
            variant="outline"
          >
            <Link href="/login">ログイン</Link>
          </Button>
          <button className="md:hidden">
            <MenuIcon className="w-6 h-6 text-white" />
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
            <span className="text-2xl font-bold">くひめぐり</span>
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
          <Button
            asChild
            className="text-md text-primary-foreground rounded-full"
          >
            <Link href="/login">ログイン</Link>
          </Button>
          <button className="md:hidden">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
