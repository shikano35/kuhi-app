'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { type JapanSearchItem } from '@/lib/japansearch';
import { useInfiniteThemeSearch } from '@/lib/japansearch-hooks';
import { BackButton } from '@/components/BackButton';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JapanSearchCard } from '@/components/shared/JapanSearchCard';
import { Input } from '@/components/ui/input';

type ThemeType = 'season' | 'region' | 'poet' | 'era';

type ThemeGalleryClientProps = {
  initialResults: JapanSearchItem[];
  initialTheme: ThemeType;
  initialQuery: string;
  initialPage: number;
  error?: string | null;
};

const themeOptions = {
  season: {
    label: '季節',
    queries: ['春', '夏', '秋', '冬'],
  },
  region: {
    label: '地域',
    queries: [
      '北海道',
      '東北',
      '関東甲信',
      '東海',
      '北陸',
      '近畿',
      '中国',
      '四国',
      '九州',
      '沖縄',
    ],
  },
  poet: {
    label: '俳人',
    queries: ['松尾芭蕉', '与謝蕪村', '小林一茶', '正岡子規', '高浜虚子'],
  },
  era: {
    label: '時代',
    queries: [
      '平安',
      '鎌倉',
      '室町',
      '江戸',
      '明治',
      '大正',
      '昭和',
      '近代',
      '現代',
    ],
  },
};

const THEME_LABELS: Record<ThemeType, string> = {
  season: '季節',
  region: '地域',
  poet: '俳人',
  era: '時代',
};

export function ThemeGalleryClient({
  initialResults: _initialResults,
  initialTheme,
  initialQuery,
  initialPage: _initialPage,
  error: _initialError,
}: ThemeGalleryClientProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(initialTheme);
  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    theme: initialTheme,
    query: initialQuery,
    customQuery: '',
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteThemeSearch(currentTheme, currentQuery);

  const results = data?.pages.flatMap((page) => page) || [];

  // テーマ変更ハンドラー
  const handleThemeChange = (theme: ThemeType) => {
    if (theme === currentTheme) return;

    const defaultQuery = themeOptions[theme].queries[0];

    startTransition(() => {
      setCurrentTheme(theme);
      setCurrentQuery(defaultQuery);

      // URLを更新
      const params = new URLSearchParams(searchParams);
      params.set('theme', theme);
      params.set('query', defaultQuery);
      params.set('page', '1');
      router.push(`?${params.toString()}`);
    });
  };

  // クエリ変更ハンドラー
  const handleQueryChange = (query: string) => {
    if (query === currentQuery) return;

    startTransition(() => {
      setCurrentQuery(query);

      // URLを更新
      const params = new URLSearchParams(searchParams);
      params.set('query', query);
      params.set('page', '1');
      router.push(`?${params.toString()}`);
    });
  };

  // カスタム検索ハンドラー
  const handleCustomSearch = () => {
    if (!filters.customQuery.trim()) return;

    startTransition(() => {
      setCurrentQuery(filters.customQuery.trim());

      // URLを更新
      const params = new URLSearchParams(searchParams);
      params.set('query', filters.customQuery.trim());
      params.set('page', '1');
      router.push(`?${params.toString()}`);
    });
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <BackButton fallbackUrl="/">戻る</BackButton>
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            テーマ別ギャラリー
          </h1>
          <p className="text-muted-foreground">
            テーマ別に俳句関連の文化資料を探索できます
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg lg:text-xl font-semibold text-primary mb-4">
            テーマを選択
          </h2>
          <div className="mb-6">
            <div className="flex flex-wrap gap-4">
              {Object.entries(themeOptions).map(([key, option]) => (
                <Button
                  className={`rounded-full transition-all duration-100 ${
                    currentTheme === key
                      ? 'bg-primary text-background shadow-lg'
                      : 'bg-background text-primary border border-border hover:bg-muted'
                  } ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                  disabled={isPending}
                  key={key}
                  onClick={() => handleThemeChange(key as ThemeType)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg lg:text-xl font-semibold text-primary mb-4">
            {themeOptions[currentTheme].label}を選択
          </h2>
          <div className="flex flex-wrap gap-4">
            {themeOptions[currentTheme].queries.map((query) => (
              <Button
                className={`transition-all duration-100 ${
                  currentQuery === query
                    ? 'bg-primary text-background shadow-md'
                    : 'bg-input text-primary hover:bg-muted-foreground/25'
                } ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
                disabled={isPending}
                key={query}
                onClick={() => handleQueryChange(query)}
              >
                {query}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg lg:text-xl font-semibold text-primary mb-4">
            カスタム検索
          </h2>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    customQuery: e.target.value,
                  }))
                }
                onKeyPress={(e) => e.key === 'Enter' && handleCustomSearch()}
                placeholder={`${THEME_LABELS[filters.theme]}名を入力してください`}
                value={filters.customQuery}
              />
            </div>
            <Button
              className="flex items-center justify-center bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!filters.customQuery.trim() || isPending}
              onClick={handleCustomSearch}
            >
              <Search className="w-4 h-4 mt-0.5" />
              検索
            </Button>
          </div>
        </div>

        {(isLoading || isPending) && (
          <div className="bg-background rounded-lg p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">検索中...</p>
          </div>
        )}

        {error && (
          <div className="bg-background rounded-lg p-8 text-center">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-4">{error.message}</p>
            <Button onClick={() => router.push('/')} variant="outline">
              ホームに戻る
            </Button>
          </div>
        )}

        {!isLoading && !isPending && results.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-4">
              検索結果: {currentQuery} ({results.length}件)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((item, index) => {
                return (
                  <JapanSearchCard
                    item={item}
                    key={`${item.id}-${index}`}
                    variant="default"
                  />
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && !isPending && results.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              「{currentQuery}」に関する資料が見つかりませんでした
            </p>
            <p className="text-gray-400 mt-2">
              別のキーワードで検索してみてください
            </p>
          </div>
        )}

        {!isLoading && !isPending && results.length > 0 && hasNextPage && (
          <div className="text-center mt-8">
            <Button
              className="transition-colors disabled:opacity-50"
              disabled={isFetchingNextPage}
              onClick={handleLoadMore}
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  読み込み中...
                </>
              ) : (
                'さらに読み込む'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
