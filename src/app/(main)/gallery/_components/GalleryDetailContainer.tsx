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
  Tag,
  Building2,
  Globe,
  Scale,
  Hash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BackButton } from '@/components/BackButton';
import { useItemDetail } from '@/lib/japansearch-hooks';

type GalleryDetailContainerProps = {
  itemId: string;
};

function InfoItem({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

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
      <div className="min-h-screen bg-linear-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 mx-auto" />
            <Loader2 className="w-16 h-16 animate-spin text-primary absolute top-0 left-1/2 -translate-x-1/2" />
          </div>
          <p className="text-muted-foreground mt-4">詳細情報を取得中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/30 flex items-center justify-center">
        <Card className="max-w-md mx-4 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold mb-2">読み込みエラー</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                {error instanceof Error
                  ? error.message
                  : '詳細情報の取得に失敗しました'}
              </p>
              <div className="space-y-3">
                <div className="flex gap-2 justify-center">
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
                  <>
                    <Separator />
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
                      variant="ghost"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Japan Search で直接開く
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/30 flex items-center justify-center">
        <Card className="max-w-md mx-4 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                アイテムが見つかりません
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                指定されたアイテムは存在しないか、削除された可能性があります。
              </p>
              <Button onClick={() => router.push('/gallery')}>
                ギャラリーに戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { common, rdfindex } = item;
  const title = common.title || '無題';
  const description = common.description || '';
  const creator = common.creator;
  const contributor = common.contributor;
  const date = common.date;
  const temporal = common.temporal || rdfindex?.temporal;
  const spatial = common.spatial || rdfindex?.spatial;
  const thumbnailUrl = common.thumbnailUrl;
  const landingPage = common.landingPage;
  const dataProvider = common.dataProvider;
  const type = common.type || (rdfindex?.type && rdfindex.type[0]);
  const subject = common.subject;
  const identifier = common.identifier;
  const language = common.language;
  const rights = common.rights;

  const imageUrl =
    typeof thumbnailUrl === 'string' ? thumbnailUrl : thumbnailUrl?.[0];
  const hasValidImage =
    !imageError &&
    imageUrl &&
    imageUrl.trim() !== '' &&
    imageUrl.trim() !== 'null' &&
    imageUrl.trim() !== 'undefined' &&
    (imageUrl.startsWith('https://') || imageUrl.startsWith('http://'));

  const allCreators = [
    ...(creator || []),
    ...(contributor || []).filter((c) => !creator?.includes(c)),
  ].filter((c) => c && c.trim());

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <BackButton fallbackUrl="/gallery">ギャラリーに戻る</BackButton>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {type && (
              <Badge className="text-xs" variant="default">
                <Tag className="w-3 h-3 mr-1" />
                {type}
              </Badge>
            )}
            {dataProvider && (
              <Badge className="text-xs" variant="secondary">
                <Building2 className="w-3 h-3 mr-1" />
                {dataProvider}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {title}
          </h1>
          {allCreators.length > 0 && (
            <p className="text-muted-foreground mt-2">
              {allCreators.slice(0, 3).join('、')}
              {allCreators.length > 3 && ` 他${allCreators.length - 3}名`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden shadow-md">
              <CardContent className="p-0">
                {hasValidImage ? (
                  <div className="relative aspect-4/3 overflow-hidden bg-muted">
                    <Image
                      alt={title}
                      className="object-contain w-full h-full"
                      fill
                      onError={handleImageError}
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      src={imageUrl}
                    />
                  </div>
                ) : (
                  <div className="aspect-4/3 bg-linear-to-br from-muted to-muted/50 flex flex-col items-center justify-center gap-2">
                    <Database className="w-12 h-12 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground">
                      画像がありません
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-2">
              {landingPage && (
                <Button
                  className="w-full shadow-sm"
                  onClick={() =>
                    window.open(landingPage, '_blank', 'noopener,noreferrer')
                  }
                  size="lg"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  提供元サイトで詳細を見る
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
                <Globe className="w-4 h-4 mr-2" />
                Japan Search で表示
              </Button>
            </div>

            <Card className="hidden lg:block">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  識別情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  <span className="font-mono text-muted-foreground break-all">
                    {identifier || item.id}
                  </span>
                </div>
                {common.database && (
                  <div className="flex items-center gap-2 text-xs">
                    <Database className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {common.database}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {description && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    説明
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none">
                    {description
                      .replace(/<[^>]*>/g, '')
                      .split('\n')
                      .map((line, index, array) => (
                        <span key={index}>
                          {line}
                          {index < array.length - 1 && <br />}
                        </span>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">基本情報</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allCreators.length > 0 && (
                    <InfoItem icon={User} label="作者・制作者">
                      <div className="space-y-1">
                        {allCreators.map((c, index) => (
                          <p key={index}>{c}</p>
                        ))}
                      </div>
                    </InfoItem>
                  )}

                  {(date || (temporal && temporal.length > 0)) && (
                    <InfoItem icon={Calendar} label="時代・年代">
                      {date && <p>{date}</p>}
                      {temporal && temporal.length > 0 && !date && (
                        <div className="flex flex-wrap gap-1">
                          {temporal.map((t, index) => (
                            <Badge
                              className="text-xs"
                              key={index}
                              variant="outline"
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </InfoItem>
                  )}

                  {spatial && spatial.length > 0 && (
                    <InfoItem icon={MapPin} label="制作地・関連地域">
                      <div className="flex flex-wrap gap-1">
                        {spatial.map((s, index) => (
                          <Badge
                            className="text-xs"
                            key={index}
                            variant="secondary"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </InfoItem>
                  )}

                  {dataProvider && (
                    <InfoItem icon={Building2} label="所蔵・提供機関">
                      <p>{dataProvider}</p>
                    </InfoItem>
                  )}
                </div>
              </CardContent>
            </Card>

            {subject && subject.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    分類・主題
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {subject.map((s, index) => (
                      <Badge
                        className="text-sm py-1 px-3"
                        key={index}
                        variant="outline"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {(language || rights) && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">その他の情報</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {language && (
                      <InfoItem icon={Globe} label="言語">
                        <p>
                          {Array.isArray(language)
                            ? language.join(', ')
                            : language}
                        </p>
                      </InfoItem>
                    )}

                    {rights && (
                      <InfoItem icon={Scale} label="権利情報">
                        <p className="text-xs">
                          {Array.isArray(rights) ? rights.join(', ') : rights}
                        </p>
                      </InfoItem>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="lg:hidden shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  識別情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  <span className="font-mono text-muted-foreground break-all">
                    {identifier || item.id}
                  </span>
                </div>
                {common.database && (
                  <div className="flex items-center gap-2 text-xs">
                    <Database className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {common.database}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
