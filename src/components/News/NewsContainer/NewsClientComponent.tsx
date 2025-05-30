'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { News } from '@/types/haiku';
import { Search, AlertCircle } from 'lucide-react';

type NewsClientComponentProps = {
  initialNews: News[];
};

export function NewsClientComponent({ initialNews }: NewsClientComponentProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => {
    return [
      'all',
      ...new Set(initialNews.map((item) => item.category).filter(Boolean)),
    ];
  }, [initialNews]);

  const filteredNews = useMemo(() => {
    let filtered = initialNews;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((item) => {
        return (
          item.title.toLowerCase().includes(lowerSearch) ||
          item.content.toLowerCase().includes(lowerSearch)
        );
      });
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((item) => item.category === category);
    }

    return [...filtered].sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  }, [search, category, initialNews]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10 w-full"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="お知らせを検索..."
            type="text"
            value={search}
          />
        </div>
      </div>

      <Tabs
        className="w-full"
        defaultValue={category}
        onValueChange={setCategory}
      >
        <TabsList className="mb-6 flex flex-wrap h-auto">
          <TabsTrigger className="mb-1" value="all">
            すべて
          </TabsTrigger>
          {categories
            .filter((c) => c !== 'all')
            .map((c) => (
              <TabsTrigger className="mb-1" key={c} value={c || ''}>
                {c}
              </TabsTrigger>
            ))}
        </TabsList>

        <TabsContent value={category || 'all'}>
          {filteredNews.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              {initialNews.length === 0
                ? 'お知らせはありません'
                : '該当するお知らせが見つかりませんでした'}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredNews.map((item) => {
                const publishDate = new Date(item.published_at);
                return (
                  <Card
                    className={`overflow-hidden ${item.is_important ? 'border-destructive/50 bg-destructive/5' : ''}`}
                    key={item.id}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {item.is_important && (
                            <AlertCircle className="h-4 w-4 mt-0.25 text-destructive" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {format(publishDate, 'yyyy年MM月dd日', {
                              locale: ja,
                            })}
                          </span>
                        </div>
                        {item.category && (
                          <Badge className="bg-secondary/40" variant="outline">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl md:text-2xl">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm md:text-base text-muted-foreground whitespace-pre-line">
                        {item.content}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
