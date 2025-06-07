'use client';

import { useState } from 'react';
import { Search, Loader2, AlertCircle, Images } from 'lucide-react';
import { JapanSearchCard } from '@/components/shared/JapanSearchCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/BackButton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type {
  UseInfiniteQueryResult,
  InfiniteData,
} from '@tanstack/react-query';
import type { JapanSearchItem } from '@/lib/japansearch-types';

type ImageGalleryClientProps = {
  imageSearchQuery: UseInfiniteQueryResult<
    InfiniteData<JapanSearchItem[], unknown>,
    Error
  >;
  onSearchChange: (query: string) => void;
  currentQuery: string;
};

export default function ImageGalleryClient({
  imageSearchQuery,
  onSearchChange,
  currentQuery,
}: ImageGalleryClientProps) {
  const [inputValue, setInputValue] = useState('');

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = imageSearchQuery;

  const results = data?.pages.flat() || [];

  const { loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearchChange(inputValue.trim());
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
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="画像を検索（例：桜、富士山、京都など）"
                value={inputValue}
              />
            </div>
            <Button disabled={!inputValue.trim() || isLoading} type="submit">
              <Search className="w-4 h-4 mr-2" />
              検索
            </Button>
          </form>
        </div>

        {isLoading && results.length === 0 && (
          <div className="bg-background rounded-lg p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">画像を検索中...</p>
          </div>
        )}

        {error && (
          <div className="bg-background rounded-lg border border-destructive/50 p-6 mb-8">
            <div className="flex items-center text-destructive mb-2">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">エラーが発生しました</span>
            </div>
            <p className="text-muted-foreground">
              検索中にエラーが発生しました。もう一度お試しください。
            </p>
          </div>
        )}

        {!isLoading && !error && results.length === 0 && currentQuery && (
          <div className="bg-background rounded-lg p-8 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              検索結果が見つかりません
            </h3>
            <p className="text-muted-foreground">
              「{currentQuery}」に関連する画像は見つかりませんでした。
              <br />
              別のキーワードでお試しください。
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                検索結果 ({results.length}件)
              </h2>
              <div className="text-sm text-muted-foreground">
                検索キーワード: {currentQuery}
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

            <div className="text-center py-8" ref={loadMoreRef}>
              {isFetchingNextPage && (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>さらに読み込み中...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
