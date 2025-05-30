'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { HaikuMonument } from '@/types/haiku';
import { Search } from 'lucide-react';

type HaikuListViewProps = {
  poems: HaikuMonument[];
};

export function HaikuListView({ poems }: HaikuListViewProps) {
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState('');
  const [filteredPoems, setFilteredPoems] = useState<HaikuMonument[]>(poems);

  useEffect(() => {
    let filtered = poems;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((poem) => {
        return (
          poem.inscription.toLowerCase().includes(lowerSearch) ||
          (poem.commentary &&
            poem.commentary.toLowerCase().includes(lowerSearch)) ||
          poem.poets.some((poet) =>
            poet.name.toLowerCase().includes(lowerSearch)
          )
        );
      });
    }

    if (season) {
      filtered = filtered.filter((poem) => poem.season === season);
    }

    setFilteredPoems(filtered);
  }, [search, season, poems]);

  const seasons = [
    ...new Set(poems.map((poem) => poem.season).filter(Boolean)),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-2/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10 w-full"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="俳句を検索..."
            type="text"
            value={search}
          />
        </div>

        <div className="w-full sm:w-1/3">
          <Select onValueChange={setSeason} value={season}>
            <SelectTrigger>
              <SelectValue placeholder="季節でフィルター" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての季節</SelectItem>
              {seasons.map((s) => (
                <SelectItem key={s} value={s || ''}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPoems.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          該当する俳句が見つかりませんでした
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPoems.map((poem) => (
            <Card className="overflow-hidden" key={poem.id}>
              <CardHeader className="p-4">
                <CardTitle className="text-xl md:text-2xl">
                  {poem.inscription}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  {poem.season && (
                    <Badge
                      className="bg-destructive/5 text-destructive/80"
                      variant="outline"
                    >
                      {poem.season}
                    </Badge>
                  )}
                  {poem.kigo &&
                    poem.kigo.split(',').map((k) => (
                      <Badge
                        className="bg-secondary/10"
                        key={k}
                        variant="outline"
                      >
                        {k.trim()}
                      </Badge>
                    ))}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {poem.commentary || '詳細な解説はありません。'}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button asChild className="px-0 text-primary" variant="link">
                  <Link href={`/poet/${poem.poet_id}`}>
                    {poem.poets.length > 0 && poem.poets[0].name}
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/monument/${poem.id}`}>句碑を見る</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
