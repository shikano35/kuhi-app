'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { HaikuCard } from '@/components/shared/HaikuCard';
import { ListFilter } from '@/components/List/ListFilter';
import { MenuDropdown } from '@/components/shared/MenuDropdown';
import { MonumentWithRelations, Poet, Location } from '@/types/definitions/api';
import {
  useInfiniteMonuments,
  useFlattenedInfiniteMonuments,
} from '@/hooks/useKuhiApi';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface HaikuListClientComponentProps {
  initialMonuments: MonumentWithRelations[];
  poets: Poet[];
  locations: Location[];
  _initialSearchParams?: {
    q?: string;
    region?: string;
    prefecture?: string;
    poet_id?: string;
  };
}

export function HaikuListClientComponent({
  initialMonuments,
  poets,
  locations,
}: HaikuListClientComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const searchQuery = searchParams.get('q') || '';
  const regionFilter = searchParams.get('region') || 'すべて';
  const _prefectureFilter = searchParams.get('prefecture') || 'すべて';
  const poetIdFilter = searchParams.get('poet_id')
    ? Number(searchParams.get('poet_id'))
    : null;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error: _error,
  } = useInfiniteMonuments({
    q: searchQuery,
    region: regionFilter === 'すべて' ? undefined : regionFilter,
    poet_id: poetIdFilter || undefined,
    limit: 30,
  });

  const loadMoreRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    { enabled: hasNextPage && !isFetchingNextPage }
  );

  const infiniteData = useFlattenedInfiniteMonuments(data?.pages);

  const monuments = useMemo(() => {
    return infiniteData.length > 0 ? infiniteData : initialMonuments;
  }, [infiniteData, initialMonuments]);

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">
          データの読み込みに失敗しました
        </p>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          onClick={() => router.refresh()}
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div
      className="space-y-6"
      onMouseEnter={() => setIsDropdownVisible(true)}
      onMouseLeave={() => setIsDropdownVisible(false)}
    >
      <ListFilter locations={locations} poets={poets} />

      <div className="text-sm text-muted-foreground">
        {monuments.length}件の句碑が見つかりました
        {hasNextPage && !isFetchingNextPage}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      ) : monuments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            条件に合う句碑が見つかりませんでした
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {monuments.map((monument: MonumentWithRelations) => (
              <HaikuCard key={monument.id} monument={monument} />
            ))}
          </div>

          {hasNextPage && (
            <div className="text-center py-8" ref={loadMoreRef}>
              {isFetchingNextPage ? (
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              ) : (
                <div className="h-8" />
              )}
            </div>
          )}
        </>
      )}

      <MenuDropdown isVisible={isDropdownVisible} />
    </div>
  );
}
