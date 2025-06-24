import Link from 'next/link';
import { Hina_Mincho } from 'next/font/google';
import { AuthButton } from '@/components/AuthButton';
import { cn } from '@/lib/cn';
import { MobileMenu } from '@/components/shared/MobileMenu';
import { HeaderDropdown } from '@/components/shared/HeaderDropdown';

const hinaMincho = Hina_Mincho({
  variable: '--font-hina-mincho',
  weight: '400',
  subsets: ['latin'],
});

export const menuLinks = [
  { href: '/', label: 'ホーム' },
  { href: '/map', label: '句碑マップ' },
  { href: '/list', label: '句碑リスト' },
  { href: '/gallery', label: 'ギャラリー' },
  { href: '/about', label: '句碑とは' },
];

const dropdownItems = [
  { href: '/list', label: '句碑', description: '句碑を検索' },
  { href: '/haiku', label: '俳句', description: '俳句を検索' },
  { href: '/poets', label: '俳人', description: '俳人を検索' },
];

export function HomeHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center p-4 py-8 justify-end">
        <nav className="hidden md:flex space-x-12 lg:space-x-16 mr-12 lg:mr-32">
          {menuLinks.map((link, index) => {
            if (link.label === '句碑リスト') {
              return (
                <HeaderDropdown
                  items={dropdownItems}
                  key={index}
                  trigger={
                    <Link
                      className="text-white hover:text-gray-300 transition-colors md:text-base lg:text-lg font-medium text-shadow-lg"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  }
                />
              );
            }
            return (
              <Link
                className="text-white hover:text-gray-300 transition-colors md:text-base lg:text-lg font-medium text-shadow-lg"
                href={link.href}
                key={index}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <AuthButton isFlag={true} />
          <MobileMenu variant="home" />
        </div>
      </div>
    </header>
  );
}

export function MapHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm bg-background">
      <div className="mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link className="flex items-center" href="/">
            <span className={cn('text-2xl font-bold', hinaMincho.className)}>
              くひめぐり
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8 ml-12 lg:ml-24">
            {menuLinks.map((link, index) => {
              if (link.label === '句碑リスト') {
                return (
                  <HeaderDropdown
                    items={dropdownItems}
                    key={index}
                    trigger={
                      <Link
                        className="text-primary hover:text-muted-foreground transition-colors font-medium"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    }
                  />
                );
              }
              return (
                <Link
                  className="text-primary hover:text-muted-foreground transition-colors font-medium"
                  href={link.href}
                  key={index}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <AuthButton />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export function Header() {
  return (
    <header className="top-0 left-0 right-0 z-50 shadow-sm">
      <div className="mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link className="flex items-center" href="/">
            <span className={cn('text-2xl font-bold', hinaMincho.className)}>
              くひめぐり
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8 ml-12 lg:ml-24">
            {menuLinks.map((link, index) => {
              if (link.label === '句碑リスト') {
                return (
                  <HeaderDropdown
                    items={dropdownItems}
                    key={index}
                    trigger={
                      <Link
                        className="text-primary hover:text-muted-foreground transition-colors font-medium"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    }
                  />
                );
              }
              return (
                <Link
                  className="text-primary hover:text-muted-foreground transition-colors font-medium"
                  href={link.href}
                  key={index}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <AuthButton />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
