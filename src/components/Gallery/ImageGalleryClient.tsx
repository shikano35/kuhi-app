'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, Images } from 'lucide-react';
import { searchImages, JapanSearchItem } from '@/lib/japansearch';
import { JapanSearchCard } from '@/components/shared/JapanSearchCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/BackButton';

export default function ImageGalleryClient() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JapanSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [showingDefault, setShowingDefault] = useState(false);

  const ITEMS_PER_PAGE = 60;

  useEffect(() => {
    const loadDefaultData = async () => {
      if (hasSearched || showingDefault) return;
      setLoading(true);
      setShowingDefault(true);

      try {
        const defaultResults = await searchImages('桜', ITEMS_PER_PAGE, 1);
        setResults(defaultResults);
        setCurrentPage(1);
        setHasMoreData(defaultResults.length === ITEMS_PER_PAGE);
      } catch (err) {
        console.error('デフォルトデータの読み込みエラー:', err);
        setError('デフォルトデータの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadDefaultData();
  }, [hasSearched, showingDefault]);

  const searchItems = async (loadMore = false) => {
    if ((loading && !loadMore) || (loadingMore && loadMore)) return;

    const searchQuery = query.trim();
    if (!searchQuery) {
      return;
    }

    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
      setResults([]);
      setHasSearched(true);
      setShowingDefault(false);
      setCurrentPage(1);
      setHasMoreData(true);
    }

    try {
      const page = loadMore ? currentPage + 1 : 1;
      const size = ITEMS_PER_PAGE;

      const searchResults = await searchImages(searchQuery, size, page);

      if (loadMore) {
        const existingIds = new Set(results.map((item) => item.id));
        const newResults = searchResults.filter(
          (item) => !existingIds.has(item.id)
        );
        setResults((prev) => [...prev, ...newResults]);
        setCurrentPage(page);

        if (searchResults.length < ITEMS_PER_PAGE) {
          setHasMoreData(false);
        }
      } else {
        setResults(searchResults);
        if (searchResults.length < ITEMS_PER_PAGE) {
          setHasMoreData(false);
        }
      }
    } catch (err) {
      console.error('画像検索エラー:', err);
      setError('検索中にエラーが発生しました。もう一度お試しください。');
      if (loadMore) {
        setHasMoreData(false);
      }
    } finally {
      if (loadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchItems();
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
            <Button disabled={!query.trim() || loading} type="submit">
              <Search className="w-4 h-4 mr-2" />
              検索
            </Button>
          </form>
        </div>

        {loading && (
          <div className="bg-background rounded-lg p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              {showingDefault
                ? 'おすすめ画像を読み込み中...'
                : '画像を検索中...'}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-background rounded-lg p-8 text-center">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <Button
              onClick={() =>
                showingDefault ? window.location.reload() : searchItems()
              }
              variant="outline"
            >
              再試行
            </Button>
          </div>
        )}

        {!loading &&
          !error &&
          results.length === 0 &&
          (hasSearched || showingDefault) && (
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
                {showingDefault && !hasSearched ? 'おすすめ画像' : '検索結果'} (
                {results.length}件)
              </h2>
              <div className="text-sm text-muted-foreground">
                {showingDefault && !hasSearched
                  ? 'テーマ: 桜'
                  : `検索キーワード: ${query}`}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {results.map((item) => (
                <JapanSearchCard item={item} key={item.id} variant="compact" />
              ))}
            </div>

            {results.length >= ITEMS_PER_PAGE && hasMoreData && (
              <div className="text-center mt-8">
                <Button
                  disabled={loadingMore}
                  onClick={() => searchItems(true)}
                  variant="outline"
                >
                  {loadingMore ? (
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
