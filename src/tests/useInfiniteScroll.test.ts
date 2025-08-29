import { renderHook } from '@testing-library/react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { vi, describe, test, expect, beforeEach } from 'vitest';

const mockObserver = {
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '200px',
  thresholds: [0.1],
  takeRecords: vi.fn(() => []),
};

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(() => mockObserver)
  );
});

describe('useInfiniteScroll', () => {
  test('should initialize and return loadMoreRef', () => {
    const mockFetchNextPage = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      })
    );

    expect(result.current.loadMoreRef).toBeDefined();
    expect(result.current.loadMoreRef.current).toBeNull();
  });

  test('should create IntersectionObserver with correct options', () => {
    const mockFetchNextPage = vi.fn();
    const mockIntersectionObserver = vi.fn(() => mockObserver);
    vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

    renderHook(() =>
      useInfiniteScroll({
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
      })
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '200px',
      }
    );
  });
});
