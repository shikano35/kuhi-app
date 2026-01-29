import Image from 'next/image';
import { Hina_Mincho } from 'next/font/google';
import { cn } from '@/lib/cn';

const hinaMincho = Hina_Mincho({
  variable: '--font-hina-mincho',
  weight: '400',
  subsets: ['latin'],
});

export function HeroSection() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          alt="句碑"
          className="object-cover"
          fill
          priority
          src="/images/hero-bg.jpg"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      <div className="relative z-10 text-center grid grid-cols-1 md:grid-cols-2 text-white max-w-6xl px-4">
        <div className="col-span-1">
          <h1 className={cn('text-6xl lg:text-7xl mb-2', hinaMincho.className)}>
            くひめぐり
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl mb-8">
            Haiku monument tour
          </h2>
          <p className="text-sm md:text-base lg:text-lg">
            くひめぐりは、日本全国の句碑を集めたデータベースサイトです。
            <br />
            句碑に刻まれた俳句や所在地、写真などの情報を紹介しています。
          </p>
        </div>
      </div>
    </div>
  );
}
