'use client';

import Link from 'next/link';
import { Images, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { JapanSearchCard } from '@/components/shared/JapanSearchCard';
import { useDefaultImages } from '@/lib/japansearch-hooks';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function GalleryHomeClient() {
  const {
    data: popularItems,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDefaultImages();

  const allItems = popularItems?.pages.flat() || [];

  const { loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  });

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto py-8 px-4">
        <BackButton fallbackUrl="/">ホームに戻る</BackButton>

        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            特集ギャラリー
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Japan Search APIを活用して、文化資料や歴史的文書を探索できます。
            <br />
            テーマ別検索や美しい画像ギャラリーをお楽しみください。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center text-xl">
              <Search className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>テーマ別検索</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-muted-foreground mb-6 -mt-4">
                季節、地域、俳人、年代で文化資料を検索
              </p>
              <Link href="/gallery/theme">
                <Button className="w-full">検索する</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center text-xl">
              <Images className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle>画像ギャラリー</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-muted-foreground mb-6 -mt-4">
                古地図、写真集、浮世絵などの画像資料を閲覧
              </p>
              <Link href="/gallery/images">
                <Button className="w-full">画像を見る</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            コンテンツ一覧
          </h2>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">読み込み中...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                コンテンツの読み込みに失敗しました。
              </p>
            </div>
          )}

          {!loading && !error && allItems.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allItems.map((item, index) => (
                  <JapanSearchCard
                    item={item}
                    key={`${item.id || 'item'}-${index}`}
                  />
                ))}
              </div>

              <div className="text-center py-8" ref={loadMoreRef}>
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>さらに読み込み中...</span>
                  </div>
                )}
              </div>
            </>
          )}

          {!loading && !error && allItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                表示できるコンテンツがありません。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
