'use client';

import { HaikuCard } from '@/components/shared/HaikuCard';
import { ListFilter } from '../ListFilter';
import {
  useInfiniteMonuments,
  useFlattenedInfiniteMonuments,
} from '@/hooks/useKuhiApi';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useFilterStore } from '@/store/useFilterStore';

export function HaikuList() {
  const { listSearchText, listSelectedRegion, listPoetId } = useFilterStore();

  const searchQuery = listSearchText;
  const regionFilter =
    listSelectedRegion !== 'すべて' ? listSelectedRegion : undefined;
  const poetIdFilter = listPoetId;

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMonuments({
    q: searchQuery,
    region: regionFilter,
    poet_id: poetIdFilter,
    limit: 20,
  });

  const monuments = useFlattenedInfiniteMonuments(data?.pages);
  const totalCount = monuments.length;

  const { loadMoreRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  });

  return (
    <div>
      <div className="mb-4">
        <ListFilter />
      </div>

      {isError && (
        <div className="mb-8 bg-red-50 border border-destructive text-destructive px-4 py-3 rounded text-center">
          {error instanceof Error
            ? error.message
            : '句碑データの読み込み中にエラーが発生しました'}
        </div>
      )}

      <div className="mb-16">
        <p className="text-muted-foreground">
          {isLoading ? '検索中...' : `${totalCount}件の句碑が見つかりました`}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              className="bg-background rounded-lg shadow-md overflow-hidden animate-pulse"
              key={index}
            >
              <div className="h-48 w-full bg-muted" />
              <div className="p-4">
                <div className="h-6 bg-muted rounded mb-3 w-full" />
                <div className="flex items-center mt-2">
                  <div className="h-5 w-4 bg-muted rounded-full mr-1" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
                <div className="flex items-center mt-1">
                  <div className="h-5 w-4 bg-muted rounded-full mr-1" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {monuments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {monuments.map((monument) => (
                <HaikuCard key={monument.id} monument={monument} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                検索条件に一致する句碑が見つかりませんでした
              </p>
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center mt-12" ref={loadMoreRef}>
              {isFetchingNextPage && (
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
