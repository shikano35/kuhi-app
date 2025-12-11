import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Hina_Mincho } from 'next/font/google';
import { cn } from '@/lib/cn';
import { menuLinks } from '@/layouts/Header';

const hinaMincho = Hina_Mincho({
  variable: '--font-hina-mincho',
  weight: '400',
  subsets: ['latin'],
});

const otherLinks = [
  { href: '/references', label: '関連文献・参考文献等' },
  { href: '/contribute', label: '句碑の情報をお持ちの方へ' },
  { href: '/news', label: 'お知らせ一覧' },
  { href: '/privacy', label: 'プライバシーポリシー' },
];

const externalLinks = [
  {
    href: `${process.env.KUHI_API_URL || ''}/docs`,
    label: 'API',
  },
  {
    href: process.env.KUHI_API_DOCS_URL || '',
    label: 'APIドキュメント',
  },
  {
    href: 'https://github.com/shikano35/kuhi-api-mcp-server',
    label: 'MCP',
  },
];

function LinkList({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="col-span-1">
      <h3 className="text-lg md:text-xl font-semibold mb-8">{title}</h3>
      <ul className="space-y-4">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              className="text-gray-400 hover:text-white transition-colors"
              href={href}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        className="text-gray-400 hover:text-white transition-colors flex items-center"
        href={href}
      >
        {label}
        <ExternalLinkIcon className="w-3.5 h-3.5 ml-2" />
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20 mt-12 ">
          <div className="col-span-1 lg:col-span-2">
            <Link className="flex flex-col items-start" href="/">
              <span
                className={cn(
                  'text-4xl md:text-5xl font-bold',
                  hinaMincho.className
                )}
              >
                くひめぐり
              </span>
              <span className="mt-2 md:ml-4 text-base md:text-lg">
                - Haiku monument tour -
              </span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm md:text-base mb-8">
              日本各地の句碑を紹介するサイト
            </p>
          </div>

          <LinkList links={menuLinks} title="メニュー" />
          <LinkList links={otherLinks} title="その他" />

          <div className="col-span-1">
            <h3 className="text-lg md:text-xl font-semibold mb-8">
              外部リンク
            </h3>
            <ul className="space-y-4">
              {externalLinks.map(({ href, label }) => (
                <ExternalLink href={href} key={href} label={label} />
              ))}
            </ul>
          </div>
        </div>

        <div className="text-sm border-t border-muted-foreground mt-12 pt-8 text-center text-muted-foreground">
          <p>
            © {new Date().getFullYear()} くひめぐり -Haiku monument tour- All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
