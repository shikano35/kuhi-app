'use client';

import { useState, useCallback, useMemo } from 'react';
import { HaikuListViewWithInfiniteScroll } from './HaikuListViewWithInfiniteScroll';
import { HaikuMonument } from '@/types/definitions/haiku';

type HaikuListViewClientWrapperProps = {
  initialPoems: HaikuMonument[];
};

const ITEMS_PER_PAGE = 50;

export function HaikuListViewClientWrapper({
  initialPoems,
}: HaikuListViewClientWrapperProps) {
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  const displayedPoems = useMemo(() => {
    return initialPoems.slice(0, displayedCount);
  }, [initialPoems, displayedCount]);

  const hasMore = displayedCount < initialPoems.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    setTimeout(() => {
      setDisplayedCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 300);
  }, [hasMore, isLoading]);

  return (
    <HaikuListViewWithInfiniteScroll
      hasMore={hasMore}
      initialPoems={displayedPoems}
      isLoading={isLoading}
      onLoadMore={loadMore}
    />
  );
}
