import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';
import { useInfiniteMonuments } from '@/hooks/useKuhiApi';
import { getMonumentsPage } from '@/lib/kuhi-api';
import { mockHaikuMonuments } from './monument-fixture';

vi.mock('@/lib/kuhi-api', () => ({ getMonumentsPage: vi.fn() }));

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
}

describe('一覧の初期データ', () => {
  test('初期60件を再取得せず、追加取得はoffset 60から開始する', async () => {
    vi.mocked(getMonumentsPage).mockClear().mockResolvedValue([]);
    const initial = Array.from({ length: 60 }, (_, id) => ({
      ...mockHaikuMonuments[0],
      id,
    }));
    const { result } = renderHook(
      () => useInfiniteMonuments({ limit: 60 }, initial),
      { wrapper: createWrapper() }
    );
    expect(result.current.data?.pages[0].data).toHaveLength(60);
    expect(result.current.isLoading).toBe(false);
    expect(getMonumentsPage).not.toHaveBeenCalled();
    await act(async () => {
      await result.current.fetchNextPage();
    });
    expect(getMonumentsPage).toHaveBeenCalledExactlyOnceWith({
      limit: 60,
      offset: 60,
    });
    await waitFor(() => expect(result.current.hasNextPage).toBe(false));
  });

  test('検索条件変更後の0件を初期結果で置き換えない', async () => {
    vi.mocked(getMonumentsPage).mockClear().mockResolvedValue([]);
    const { result, rerender } = renderHook(
      ({ q }) =>
        useInfiniteMonuments(
          { q, limit: 60 },
          q === '芭蕉' ? mockHaikuMonuments : undefined
        ),
      {
        wrapper: createWrapper(),
        initialProps: { q: '芭蕉' },
      }
    );
    expect(result.current.data?.pages[0].data).toHaveLength(1);
    rerender({ q: '該当なし' });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[0].data).toEqual([]);
  });

  test('初期取得失敗時はクライアントで再取得できる', async () => {
    vi.mocked(getMonumentsPage)
      .mockClear()
      .mockResolvedValue(mockHaikuMonuments);
    const { result } = renderHook(() => useInfiniteMonuments({ limit: 60 }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[0].data).toEqual(mockHaikuMonuments);
  });
});
