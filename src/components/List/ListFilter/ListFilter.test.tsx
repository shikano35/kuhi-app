import { render, screen, fireEvent } from '@testing-library/react';
import { ListFilter } from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, vi, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { mockHaikuMonuments } from '@/mocks/data/haiku-monuments';

const server = setupServer(
  // 俳人一覧のエンドポイントをモック
  http.get('https://api.kuhiapi.com/poets', () => {
    const poets = mockHaikuMonuments
      .flatMap((monument) => monument.poets)
      .filter(
        (poet, index, self) => index === self.findIndex((p) => p.id === poet.id)
      );

    return HttpResponse.json(poets);
  }),

  // 場所一覧のエンドポイントをモック
  http.get('https://api.kuhiapi.com/locations', () => {
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
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  afterAll(() => server.close());

  test('検索フォームが正しく表示されること', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ListFilter searchParams={{}} />
      </QueryClientProvider>
    );

    const searchInput =
      screen.getByPlaceholderText('俳句、俳人、場所などで検索...');
    expect(searchInput).toBeInTheDocument();

    const searchButton = screen.getByRole('button', { name: '検索' });
    expect(searchButton).toBeInTheDocument();

    const filterButton = screen.getByRole('button', { name: /絞り込み/ });
    expect(filterButton).toBeInTheDocument();
  });

  test('絞り込みボタンをクリックするとフィルターオプションが表示されること', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ListFilter searchParams={{}} />
      </QueryClientProvider>
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
      <QueryClientProvider client={queryClient}>
        <ListFilter searchParams={{}} />
      </QueryClientProvider>
    );

    const searchInput =
      screen.getByPlaceholderText('俳句、俳人、場所などで検索...');
    fireEvent.change(searchInput, { target: { value: '芭蕉' } });

    const searchButton = screen.getByRole('button', { name: '検索' });
    fireEvent.click(searchButton);

    expect(mockPush).toHaveBeenCalledWith('/list?q=%E8%8A%AD%E8%95%89');
  });

  test('初期値がある場合はフォームに値がセットされること', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ListFilter searchParams={{ q: '芭蕉', region: '東海' }} />
      </QueryClientProvider>
    );

    const searchInput =
      screen.getByPlaceholderText('俳句、俳人、場所などで検索...');
    expect(searchInput).toHaveValue('芭蕉');
  });

  test('リセットボタンをクリックするとフォームがクリアされること', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ListFilter searchParams={{ q: '芭蕉', region: '東海' }} />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /絞り込み/ }));

    await screen.findByRole('button', { name: 'リセット' });

    const resetButton = screen.getByRole('button', { name: 'リセット' });
    fireEvent.click(resetButton);

    expect(mockPush).toHaveBeenCalledWith('/list');
  });
});
