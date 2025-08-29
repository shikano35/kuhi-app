'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { HaikuCard } from '@/components/shared/HaikuCard';
import { ListFilter } from '@/components/List/ListFilter';
import { MenuDropdown } from '@/components/shared/MenuDropdown';
import { HaikuMonument, Poet, Location } from '@/types/definitions/haiku';

type HaikuListClientComponentProps = {
  initialMonuments: HaikuMonument[];
  poets: Poet[];
  locations: Location[];
  _initialSearchParams?: {
    q?: string;
    region?: string;
    prefecture?: string;
    poet_id?: string;
  };
};

const PAGE_SIZE = 12;

export function HaikuListClientComponent({
  initialMonuments,
  poets,
  locations,
}: HaikuListClientComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();

  const [currentPage, setCurrentPage] = useState(0);
  const [allMonuments, setAllMonuments] = useState(initialMonuments);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const searchQuery = searchParams.get('q') || '';
  const regionFilter = searchParams.get('region') || 'すべて';
  const prefectureFilter = searchParams.get('prefecture') || 'すべて';
  const poetIdFilter = searchParams.get('poet_id')
    ? Number(searchParams.get('poet_id'))
    : null;

  const filteredMonuments = useMemo(() => {
    let filtered = allMonuments;

    if (searchQuery) {
      filtered = filtered.filter(
        (monument) =>
          monument.inscription
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          monument.poets.some((poet) =>
            poet.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          monument.locations.some(
            (location) =>
              location.prefecture
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              location.municipality
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
      );
    }

    if (regionFilter !== 'すべて') {
      filtered = filtered.filter((monument) =>
        monument.locations.some((location) => location.region === regionFilter)
      );
    }

    if (prefectureFilter !== 'すべて') {
      filtered = filtered.filter((monument) =>
        monument.locations.some(
          (location) => location.prefecture === prefectureFilter
        )
      );
    }

    if (poetIdFilter) {
      filtered = filtered.filter((monument) =>
        monument.poets.some((poet) => poet.id === poetIdFilter)
      );
    }

    return filtered;
  }, [allMonuments, searchQuery, regionFilter, prefectureFilter, poetIdFilter]);

  const displayedMonuments = useMemo(() => {
    const end = (currentPage + 1) * PAGE_SIZE;
    return filteredMonuments.slice(0, end);
  }, [filteredMonuments, currentPage]);

  const hasNextPage = displayedMonuments.length < filteredMonuments.length;
  const totalCount = filteredMonuments.length;

  useEffect(() => {
    if (inView && hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [inView, hasNextPage]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, regionFilter, prefectureFilter, poetIdFilter]);

  useEffect(() => {
    setAllMonuments(initialMonuments);
    setCurrentPage(0);
  }, [initialMonuments]);

  const isLoading = false;
  const isError = false;

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
        {totalCount}件の句碑が見つかりました
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      ) : totalCount === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            条件に合う句碑が見つかりませんでした
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedMonuments.map((monument) => (
              <HaikuCard key={monument.id} monument={monument} />
            ))}
          </div>

          {hasNextPage && (
            <div className="text-center py-8" ref={ref}>
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          )}
        </>
      )}

      <MenuDropdown isVisible={isDropdownVisible} />
    </div>
  );
}
