'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';

type PoetCardPoet = {
  id: number;
  name: string;
  biography: string | null;
  image_url: string | null;
};

type PoetCardProps = {
  poet: PoetCardPoet;
};

export function PoetCard({ poet }: PoetCardProps) {
  return (
    <Link href={`/poet/${poet.id}`}>
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
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-1">{poet.name}</h3>
          {poet.biography && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {poet.biography}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
