'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Poet } from '@/types/definitions/haiku';

type PoetClientComponentProps = {
  poets: Poet[];
};

export function PoetClientComponent({ poets }: PoetClientComponentProps) {
  const displayPoets = poets.slice(0, 4);

  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          俳人で探す
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPoets.map((poet) => (
            <Link href={`/poet/${poet.id}`} key={poet.id}>
              <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                <div className="relative h-48">
                  {poet.image_url ? (
                    <Image
                      alt={poet.name}
                      className="object-cover"
                      fill
                      src={poet.image_url}
                    />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {poet.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1">{poet.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {poet.biography}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-8 text-center">
        <Button asChild className="rounded-full px-8 py-6 text-base">
          <Link href="/poets">すべての俳人を見る</Link>
        </Button>
      </div>
    </section>
  );
}
