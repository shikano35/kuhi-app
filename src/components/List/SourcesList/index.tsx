'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Source } from '@/types/haiku';
import { Search } from 'lucide-react';

interface SourcesListProps {
  sources: Source[];
}

export function SourcesList({ sources }: SourcesListProps) {
  const [search, setSearch] = useState('');
  const [filteredSources, setFilteredSources] = useState<Source[]>(sources);

  useEffect(() => {
    if (!search) {
      setFilteredSources(sources);
      return;
    }

    const lowerSearch = search.toLowerCase();
    const filtered = sources.filter((source) => {
      return (
        source.title.toLowerCase().includes(lowerSearch) ||
        (source.author && source.author.toLowerCase().includes(lowerSearch)) ||
        (source.publisher &&
          source.publisher.toLowerCase().includes(lowerSearch))
      );
    });

    setFilteredSources(filtered);
  }, [search, sources]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10 w-full"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="タイトルや著者名で検索..."
            type="text"
            value={search}
          />
        </div>
      </div>

      {filteredSources.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          該当する文献が見つかりませんでした
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSources.map((source) => (
            <div key={source.id}>
              {source.url ? (
                <a href={source.url} rel="noopener noreferrer" target="_blank">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4">
                      <CardTitle className="text-xl lg:text-2xl">
                        {source.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <dl className="grid grid-cols-2 gap-2 text-sm md:text-base">
                        <dt className="font-semibold text-muted-foreground">
                          著者
                        </dt>
                        <dd>{source.author || 'ー'}</dd>

                        <dt className="font-semibold text-muted-foreground">
                          出版社
                        </dt>
                        <dd>{source.publisher || 'ー'}</dd>

                        <dt className="font-semibold text-muted-foreground">
                          出版年
                        </dt>
                        <dd>{source.source_year || 'ー'}</dd>
                      </dl>
                    </CardContent>
                  </Card>
                </a>
              ) : (
                <Card className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-xl lg:text-2xl">
                      {source.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <dl className="grid grid-cols-2 gap-2 text-sm md:text-base">
                      <dt className="font-semibold text-muted-foreground">
                        著者
                      </dt>
                      <dd>{source.author || 'ー'}</dd>

                      <dt className="font-semibold text-muted-foreground">
                        出版社
                      </dt>
                      <dd>{source.publisher || 'ー'}</dd>

                      <dt className="font-semibold text-muted-foreground">
                        出版年
                      </dt>
                      <dd>{source.source_year || 'ー'}</dd>
                    </dl>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
