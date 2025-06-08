'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ExternalLink,
  Calendar,
  MapPin,
  User,
  Database,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/BackButton';
import { useItemDetail } from '@/lib/japansearch-hooks';

type GalleryDetailContainerProps = {
  itemId: string;
};

export function GalleryDetailContainer({
  itemId,
}: GalleryDetailContainerProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const { data: item, isLoading, error } = useItemDetail(itemId);

  const handleImageError = () => {
    setImageError(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">詳細情報を取得中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">エラー</h2>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error
              ? error.message
              : '詳細情報の取得に失敗しました'}
          </p>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                variant="outline"
              >
                再試行
              </Button>
              <Button onClick={() => router.push('/gallery')} size="sm">
                ギャラリーに戻る
              </Button>
            </div>
            {itemId && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Japan Searchで直接検索してみる：
                </p>
                <Button
                  className="w-full"
                  onClick={() =>
                    window.open(
                      `https://jpsearch.go.jp/item/${encodeURIComponent(itemId)}`,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                  size="sm"
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Japan Search で開く
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            アイテムが見つかりません
          </h2>
          <p className="text-muted-foreground mb-6">
            指定されたアイテムは存在しないか、削除された可能性があります。
          </p>
          <Button onClick={() => router.push('/gallery')}>
            ギャラリーに戻る
          </Button>
        </div>
      </div>
    );
  }

  const { common } = item;
  const title = common.title || '無題';
  const description = common.description || '';
  const creator = common.creator;
  const date = common.date;
  const spatial = common.spatial;
  const thumbnailUrl = common.thumbnailUrl;
  const landingPage = common.landingPage;
  const dataProvider = common.dataProvider;
  const type = common.type;
  const subject = common.subject;
  const identifier = common.identifier;
  const language = common.language;
  const rights = common.rights;

  // 画像URLの有効性チェック
  const hasValidImage =
    !imageError &&
    thumbnailUrl &&
    typeof thumbnailUrl === 'string' &&
    thumbnailUrl.trim() !== '' &&
    thumbnailUrl.trim() !== 'null' &&
    thumbnailUrl.trim() !== 'undefined' &&
    (thumbnailUrl.startsWith('https://') || thumbnailUrl.startsWith('/'));

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto py-8 px-4">
        <BackButton fallbackUrl="/gallery">ギャラリーに戻る</BackButton>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  {hasValidImage ? (
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                      <Image
                        alt={title}
                        className="object-cover w-full h-full"
                        fill
                        onError={handleImageError}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        src={thumbnailUrl}
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted flex items-center justify-center rounded-lg">
                      <Database className="w-16 h-16 text-muted-foreground/50" />
                    </div>
                  )}
                </CardContent>
              </Card>
              <div className="space-y-2">
                {landingPage && (
                  <Button
                    className="w-full"
                    onClick={() =>
                      window.open(landingPage, '_blank', 'noopener,noreferrer')
                    }
                    size="lg"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    元サイトで詳細を見る
                  </Button>
                )}

                <Button
                  className="w-full"
                  onClick={() =>
                    window.open(
                      `https://jpsearch.go.jp/item/${encodeURIComponent(item.id)}`,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                  size="sm"
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Japan Search で表示
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{title}</CardTitle>
                  {type && (
                    <Badge className="w-fit" variant="secondary">
                      {type}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {description && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        説明
                      </h3>
                      <div className="text-muted-foreground prose prose-sm max-w-none">
                        {description.split('\n').map((line, index, array) => (
                          <span key={index}>
                            {line}
                            {index < array.length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">詳細情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {creator && creator.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        作成者
                      </h4>
                      <div className="space-y-1">
                        {creator.map((c: string, index: number) => (
                          <p className="text-muted-foreground" key={index}>
                            {c}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {date && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        日付
                      </h4>
                      <p className="text-muted-foreground">{date}</p>
                    </div>
                  )}

                  {spatial && spatial.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        場所
                      </h4>
                      <div className="space-y-1">
                        {spatial.map((s: string, index: number) => (
                          <p className="text-muted-foreground" key={index}>
                            {s}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {subject && subject.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        主題・分野
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {subject.map((s: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {identifier && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Database className="w-4 h-4 mr-2" />
                        識別子
                      </h4>
                      <p className="text-muted-foreground font-mono text-sm">
                        {identifier}
                      </p>
                    </div>
                  )}

                  {language && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        言語
                      </h4>
                      <p className="text-muted-foreground">
                        {Array.isArray(language)
                          ? language.join(', ')
                          : language}
                      </p>
                    </div>
                  )}

                  {rights && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        権利情報
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {Array.isArray(rights) ? rights.join(', ') : rights}
                      </p>
                    </div>
                  )}

                  {dataProvider && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Database className="w-4 h-4 mr-2" />
                        提供機関
                      </h4>
                      <p className="text-muted-foreground">{dataProvider}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
