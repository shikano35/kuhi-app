import { render, screen, fireEvent } from '@testing-library/react';
import { ListFilter } from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, vi, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { mockHaikuMonuments } from '@/mocks/data/haiku-monuments';
import { SessionProvider } from 'next-auth/react';

// FilterStoreのモック
const mockSetListSearchText = vi.fn();
const mockSetListSelectedRegion = vi.fn();
const mockSetListSelectedPrefecture = vi.fn();
const mockSetListSelectedPoet = vi.fn();
const mockResetListFilters = vi.fn();

vi.mock('@/store/useFilterStore', () => ({
  useFilterStore: () => ({
    listSearchText: '芭蕉',
    listSelectedRegion: '東海',
    listSelectedPrefecture: '三重県',
    listSelectedPoet: '松尾芭蕉',
    listPoetId: 1,
    setListSearchText: mockSetListSearchText,
    setListSelectedRegion: mockSetListSelectedRegion,
    setListSelectedPrefecture: mockSetListSelectedPrefecture,
    setListSelectedPoet: mockSetListSelectedPoet,
    resetListFilters: mockResetListFilters,
  }),
}));

const server = setupServer(
  // 俳人一覧のエンドポイントをモック
  http.get('https://api.kuhi.jp/poets', () => {
    const poets = mockHaikuMonuments
      .flatMap((monument) => monument.poets)
      .filter(
        (poet, index, self) => index === self.findIndex((p) => p.id === poet.id)
      );

    return HttpResponse.json(poets);
  }),

  // 場所一覧のエンドポイントをモック
  http.get('https://api.kuhi.jp/locations', () => {
    const locations = mockHaikuMonuments
      .flatMap((monument) => monument.locations)
      .filter(
        (location, index, self) =>
          index === self.findIndex((l) => l.id === location.id)
      );

    return HttpResponse.json(locations);
  })
);

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity,
      },
    },
  });

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: (key: string) => {
      const params: Record<string, string> = {
        q: '',
        region: '',
        prefecture: '',
        poet_id: '',
      };
      return params[key] || null;
    },
    toString: () => '',
  }),
}));

describe('ListFilter', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    server.listen();
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  test('検索フォームが正しく表示されること', () => {
    render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <ListFilter />
        </QueryClientProvider>
      </SessionProvider>
    );

    const searchInput =
      screen.getByPlaceholderText('俳句、俳人、場所などで検索...');
    expect(searchInput).toBeInTheDocument();

    const filterButton = screen.getByRole('button', { name: /絞り込み/ });
    expect(filterButton).toBeInTheDocument();
  });

  test('絞り込みボタンをクリックするとフィルターオプションが表示されること', async () => {
    render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <ListFilter />
        </QueryClientProvider>
      </SessionProvider>
    );

    expect(screen.queryByLabelText('地域')).not.toBeInTheDocument();

    const filterButton = screen.getByRole('button', { name: /絞り込み/ });
    fireEvent.click(filterButton);

    await screen.findByLabelText('地域');
    await screen.findByLabelText('都道府県');
    await screen.findByLabelText('俳人');
  });

  test('検索フォームに入力して送信できること', () => {
    render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <ListFilter />
        </QueryClientProvider>
      </SessionProvider>
    );

    const searchInput =
      screen.getByPlaceholderText('俳句、俳人、場所などで検索...');
    expect(searchInput).toHaveValue('芭蕉');

    const form = screen.getByRole('form');
    fireEvent.submit(form);
    expect(mockPush).toHaveBeenCalledWith(
      '/list?q=%E8%8A%AD%E8%95%89&region=%E6%9D%B1%E6%B5%B7&prefecture=%E4%B8%89%E9%87%8D%E7%9C%8C&poet_id=1'
    );
  });

  test('リセットボタンをクリックするとフォームがクリアされること', async () => {
    render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <ListFilter />
        </QueryClientProvider>
      </SessionProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /絞り込み/ }));

    await screen.findByRole('button', { name: 'リセット' });

    const resetButton = screen.getByRole('button', { name: 'リセット' });
    fireEvent.click(resetButton);

    expect(mockResetListFilters).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/list');
  });
});
