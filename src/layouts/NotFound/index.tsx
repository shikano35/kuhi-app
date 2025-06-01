import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/Container';
import { BackButton } from './NotFoundClient';

export function NotFoundPage() {
  return (
    <Container className="flex items-center justify-center min-h-screen py-16">
      <div className="w-full max-w-2xl">
        <Card className="text-center shadow-lg">
          <CardHeader className="pb-6">
            <div className="mx-auto mb-6">
              <div className="text-7xl md:text-8xl font-bold text-primary/20 leading-none">
                404
              </div>
            </div>

            <CardTitle
              className="text-2xl md:text-3xl font-bold text-foreground"
              id="not-found-title"
            >
              ページが見つかりません
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="space-y-4">
              <p
                aria-describedby="not-found-title"
                className="text-base md:text-lg text-muted-foreground"
              >
                お探しのページは移動または削除された可能性があります。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-6 border-t">
              <Button
                aria-label="ホームページに戻る"
                asChild
                className="w-full sm:w-auto"
                size="lg"
                variant="default"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  ホームに戻る
                </Link>
              </Button>

              <BackButton />
            </div>

            <div className="pt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                特定の句碑をお探しの場合は、
                <Link
                  className="underline hover:text-foreground transition-colors mx-1"
                  href="/list"
                >
                  句碑リスト
                </Link>
                から検索してください。
              </p>

              <p className="text-sm text-muted-foreground">
                問題が継続する場合は、
                <Link
                  className="underline hover:text-foreground transition-colors ml-1"
                  href="/contribute"
                >
                  お問い合わせページ
                </Link>
                からご連絡ください。
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="sr-only">
          <h1>404エラー - ページが見つかりません</h1>
          <p>
            このページでは要求されたページが見つからないことをお知らせし、代替のナビゲーション手段を提供しています。
          </p>
        </div>
      </div>
    </Container>
  );
}
