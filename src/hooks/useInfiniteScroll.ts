import { useEffect, useRef, useCallback } from 'react';

type UseInfiniteScrollOptions = {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  threshold?: number;
  rootMargin?: string;
};

export function useInfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  threshold = 0.1,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const currentObserver = observerRef.current;
    const currentRef = loadMoreRef.current;

    if (currentRef) {
      currentObserver?.unobserve(currentRef);
    }

    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    observerRef.current = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [handleIntersect, hasNextPage, isFetchingNextPage, threshold, rootMargin]);

  return { loadMoreRef };
}
