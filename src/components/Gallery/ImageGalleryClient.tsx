'use client';

import { useState } from 'react';
import { Search, Loader2, AlertCircle, Images } from 'lucide-react';
import { JapanSearchCard } from '@/components/shared/JapanSearchCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/BackButton';
import {
  useDefaultImages,
  useInfiniteImageSearch,
} from '@/lib/japansearch-hooks';

export default function ImageGalleryClient() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: defaultImages,
    isLoading: isLoadingDefault,
    error: defaultError,
  } = useDefaultImages();

  const {
    data: searchData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isSearching,
    error: searchError,
  } = useInfiniteImageSearch(query, {
    enabled: hasSearched && !!query.trim(),
  });

  const results =
    hasSearched && searchData
      ? searchData.pages.flatMap((page) => page)
      : defaultImages || [];

  const isLoading = hasSearched ? isSearching : isLoadingDefault;
  const error = hasSearched
    ? typeof searchError === 'string'
      ? searchError
      : searchError?.message
    : typeof defaultError === 'string'
      ? defaultError
      : defaultError?.message;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setHasSearched(true);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto py-8 px-4">
        <BackButton fallbackUrl="/gallery">ギャラリーに戻る</BackButton>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary flex items-center">
            <Images className="w-8 h-8 mr-3" />
            画像ギャラリー
          </h1>
          <p className="text-muted-foreground">
            Japan Search APIから画像を検索し、美しいギャラリー形式で表示します
          </p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <div className="flex-1">
              <Input
                onChange={(e) => setQuery(e.target.value)}
                placeholder="画像を検索（例：桜、富士山、京都など）"
                value={query}
              />
            </div>
            <Button disabled={!query.trim() || isLoading} type="submit">
              <Search className="w-4 h-4 mr-2" />
              検索
            </Button>
          </form>
        </div>

        {isLoading && (
          <div className="bg-background rounded-lg p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              {hasSearched ? '画像を検索中...' : 'おすすめ画像を読み込み中...'}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-background rounded-lg p-8 text-center">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              再試行
            </Button>
          </div>
        )}

        {!isLoading && !error && results.length === 0 && (
          <div className="bg-background rounded-lg p-8 text-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {hasSearched
                ? '検索条件に一致する画像が見つかりませんでした'
                : '画像を読み込めませんでした'}
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {hasSearched ? '検索結果' : 'おすすめ画像'} ({results.length}件)
              </h2>
              <div className="text-sm text-muted-foreground">
                {hasSearched ? `検索キーワード: ${query}` : 'テーマ: 桜'}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {results.map((item, index) => (
                <JapanSearchCard
                  item={item}
                  key={`${item.id}-${index}`}
                  variant="compact"
                />
              ))}
            </div>

            {hasSearched && hasNextPage && (
              <div className="text-center mt-8">
                <Button
                  disabled={isFetchingNextPage}
                  onClick={handleLoadMore}
                  variant="outline"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      読み込み中...
                    </>
                  ) : (
                    'さらに表示'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
