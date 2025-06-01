import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/Container';
import { ErrorProps } from '@/app/error';

export function ErrorPage({ error: _error, reset }: ErrorProps) {
  const handleReset = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };
  return (
    <Container className="flex items-center justify-center min-h-screen py-16">
      <div className="w-full max-w-2xl">
        <Card className="text-center shadow-lg">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle
                aria-hidden="true"
                className="h-10 w-10 text-destructive"
              />
            </div>

            <CardTitle
              className="text-2xl md:text-3xl font-bold text-foreground"
              id="error-title"
            >
              エラーが発生しました
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p
                aria-describedby="error-title"
                className="text-base md:text-lg text-muted-foreground"
              >
                申し訳ございません。予期しないエラーが発生しました。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
              <Button
                aria-label="ページを再読み込み"
                className="w-full sm:w-auto"
                onClick={handleReset}
                size="lg"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                再試行
              </Button>

              <Button
                aria-label="ホームページに戻る"
                asChild
                className="w-full sm:w-auto"
                size="lg"
                variant="outline"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  ホームに戻る
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t">
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
          <h1>エラーページ</h1>
          <p>
            このページでは予期しないエラーが発生したことをお知らせし、解決方法を提供しています。
          </p>
        </div>
      </div>
    </Container>
  );
}
