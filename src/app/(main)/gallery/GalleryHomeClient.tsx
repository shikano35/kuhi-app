'use client';

import Link from 'next/link';
import { Palette, Images, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { JapanSearchCard } from '@/components/shared/JapanSearchCard';
import { useDefaultImages } from '@/lib/japansearch-hooks';

export default function GalleryHomeClient() {
  const { data: popularItems, isLoading: loading, error } = useDefaultImages();
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

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">テーマ別ギャラリー</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full space-y-2">
              <p className="flex-1 text-sm text-muted-foreground mb-4">
                季節、地域、俳人、時代別に関連資料を検索できます。
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="px-2 py-1 bg-muted text-xs rounded-full">
                  季節
                </div>
                <div className="px-2 py-1 bg-muted text-xs rounded-full">
                  地域
                </div>
                <div className="px-2 py-1 bg-muted text-xs rounded-full">
                  俳人
                </div>
                <div className="px-2 py-1 bg-muted text-xs rounded-full">
                  時代
                </div>
              </div>
              <Link className="mt-10" href="/gallery/theme">
                <Button className="w-full" size="lg">
                  <Search className="w-4 h-4 mr-2" />
                  テーマ別検索
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Images className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">画像ギャラリー</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full space-y-2">
              <p className="flex-1 text-sm text-muted-foreground mb-4">
                画像を中心とした検索結果を、美しいギャラリー形式で表示します。
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="px-2 py-1 bg-muted text-xs rounded-full">
                  歴史
                </div>
                <div className="px-2 py-1 bg-muted text-xs rounded-full">
                  文化
                </div>
                <div className="px-2 py-1 bg-muted text-xs rounded-full">
                  絵画
                </div>
              </div>
              <Link className="mt-10" href="/gallery/images">
                <Button className="w-full" size="lg">
                  <Images className="w-4 h-4 mr-2" />
                  画像ギャラリー
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-6xl mx-auto mt-24">
          {loading ? (
            <div className="bg-background rounded-lg p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          ) : error ? (
            <div className="bg-background rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                コンテンツを読み込めませんでした
              </p>
            </div>
          ) : popularItems && popularItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-4">
              {popularItems.map((item) => (
                <JapanSearchCard item={item} key={item.id} variant="compact" />
              ))}
            </div>
          ) : (
            <div className="bg-background rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                コンテンツを読み込めませんでした
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center mb-6">
        <div className="space-x-2">
          <Link href="/gallery/theme">
            <Button>もっと見る</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
