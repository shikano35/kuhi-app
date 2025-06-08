'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Poet } from '@/types/haiku';
import { Search, User } from 'lucide-react';

type PoetListProps = {
  poets: Poet[];
};

export function PoetList({ poets }: PoetListProps) {
  const [search, setSearch] = useState('');
  const [filteredPoets, setFilteredPoets] = useState<Poet[]>(poets);

  useEffect(() => {
    if (!search) {
      setFilteredPoets(poets);
      return;
    }

    const lowerSearch = search.toLowerCase();
    const filtered = poets.filter((poet) => {
      return (
        poet.name.toLowerCase().includes(lowerSearch) ||
        (poet.biography && poet.biography.toLowerCase().includes(lowerSearch))
      );
    });

    setFilteredPoets(filtered);
  }, [search, poets]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10 w-full"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="俳人を検索..."
            type="text"
            value={search}
          />
        </div>
      </div>

      {filteredPoets.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          該当する俳人が見つかりませんでした
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoets.map((poet) => (
            <div key={poet.id}>
              <Link href={`/poet/${poet.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-4">
                    <CardTitle className="text-xl lg:text-2xl">
                      {poet.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center gap-4">
                      {poet.image_url ? (
                        <div className="relative h-24 w-24 rounded-full overflow-hidden">
                          <Image
                            alt={poet.name}
                            className="rounded-full"
                            layout="fill"
                            objectFit="cover"
                            src={poet.image_url}
                          />
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                          <User className="size-10 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm line-clamp-3 text-muted-foreground">
                          {poet.biography || `${poet.name}に関する情報です。`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
