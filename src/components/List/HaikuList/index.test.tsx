import { render, screen, waitFor } from '@testing-library/react';
import { HaikuList } from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, vi, beforeEach, afterEach } from 'vitest';

// useHaikuListフックのモック
const mockUseHaikuList = vi.fn();
const mockUsePoetsList = vi.fn();
const mockUseLocationsList = vi.fn();

vi.mock('@/lib/api-hooks', () => ({
  useHaikuList: (options?: {
    search?: string;
    poet?: string;
    prefecture?: string;
  }) => mockUseHaikuList(options),
  usePoetsList: () => mockUsePoetsList(),
  useLocationsList: () => mockUseLocationsList(),
}));
const allMockMonuments = [
  {
    id: 1,
    inscription: '冬牡丹千鳥よ雪のほととぎす',
    poets: [{ id: 1, name: '松尾芭蕉' }],
    locations: [{ region: '東海', prefecture: '三重県' }],
    sources: [],
    photo_url: '/images/monuments/sample1.jpg',
  },
  {
    id: 2,
    inscription: '閑さや岩にしみ入る蝉の声',
    poets: [{ id: 1, name: '松尾芭蕉' }],
    locations: [{ region: '東北', prefecture: '山形県' }],
    sources: [],
    photo_url: '/images/monuments/sample2.jpg',
  },
  {
    id: 3,
    inscription: '菜の花や月は東に日は西に',
    poets: [{ id: 2, name: '与謝蕪村' }],
    locations: [{ region: '近畿', prefecture: '京都府' }],
    sources: [],
    photo_url: '/images/monuments/sample3.jpg',
  },
  {
    id: 4,
    inscription: '古池や蛙飛び込む水の音',
    poets: [{ id: 1, name: '松尾芭蕉' }],
    locations: [{ region: '近畿', prefecture: '滋賀県' }],
    sources: [],
    photo_url: '/images/monuments/sample4.jpg',
  },
];

// フィルターストアのモック関数を作成
const mockFilterStore = {
  listSearchText: '',
  listSelectedRegion: 'すべて',
  listSelectedPrefecture: 'すべて',
  listSelectedPoet: 'すべて',
  listPoetId: undefined,
  setListSearchText: vi.fn(),
  setListSelectedRegion: vi.fn(),
  setListSelectedPrefecture: vi.fn(),
  setListSelectedPoet: vi.fn(),
  resetListFilters: vi.fn(),
};

vi.mock('@/store/useFilterStore', () => ({
  useFilterStore: () => mockFilterStore,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/list',
  useSearchParams: () => ({
    get: vi.fn(),
    toString: () => '',
  }),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img alt={alt} data-testid="next-image" src={src} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a data-testid="next-link" href={href}>
      {children}
    </a>
  ),
}));

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

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

describe('HaikuList', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    // フィルターストアの状態をリセット
    mockFilterStore.listSearchText = '';
    mockFilterStore.listSelectedRegion = 'すべて';
    mockFilterStore.listSelectedPrefecture = 'すべて';
    mockFilterStore.listSelectedPoet = 'すべて';
    mockFilterStore.listPoetId = undefined;

    // ListFilter用のフックのモック
    mockUsePoetsList.mockReturnValue({ data: [] });
    mockUseLocationsList.mockReturnValue({ data: [] });

    // useHaikuListフックのデフォルトモック - 全ての句碑を返す
    mockUseHaikuList.mockReturnValue({
      data: {
        pages: [
          {
            monuments: allMockMonuments,
            nextPage: null,
            totalCount: allMockMonuments.length,
          },
        ],
      },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('句碑リストが正しく表示されること', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HaikuList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('4件の句碑が見つかりました')).toBeInTheDocument();
    });

    expect(screen.getByText('冬牡丹千鳥よ雪のほととぎす')).toBeInTheDocument();
    expect(screen.getByText('閑さや岩にしみ入る蝉の声')).toBeInTheDocument();
    expect(screen.getByText('菜の花や月は東に日は西に')).toBeInTheDocument();
    expect(screen.getByText('古池や蛙飛び込む水の音')).toBeInTheDocument();
  });

  test('地域で絞り込みができること', async () => {
    // フィルターストアの状態を東海地域に設定
    mockFilterStore.listSelectedRegion = '東海';

    // 東海地域の句碑のみを返すようにモック
    const toukaiMonuments = allMockMonuments.filter(
      (monument) => monument.locations[0]?.region === '東海'
    );

    mockUseHaikuList.mockReturnValue({
      data: {
        pages: [
          {
            monuments: toukaiMonuments,
            nextPage: null,
            totalCount: toukaiMonuments.length,
          },
        ],
      },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <HaikuList />
      </QueryClientProvider>
    );

    // 地域でフィルタリングされた句碑が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('1件の句碑が見つかりました')).toBeInTheDocument();
    });

    expect(screen.getByText('冬牡丹千鳥よ雪のほととぎす')).toBeInTheDocument();

    expect(
      screen.queryByText('閑さや岩にしみ入る蝉の声')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('菜の花や月は東に日は西に')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('古池や蛙飛び込む水の音')
    ).not.toBeInTheDocument();
  });

  test('検索結果が0件の場合は適切なメッセージが表示されること', async () => {
    // 0件の結果を返すようにモック
    mockUseHaikuList.mockReturnValue({
      data: {
        pages: [
          {
            monuments: [],
            nextPage: null,
            totalCount: 0,
          },
        ],
      },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <HaikuList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('0件の句碑が見つかりました')).toBeInTheDocument();
    });

    expect(
      screen.getByText('検索条件に一致する句碑が見つかりませんでした')
    ).toBeInTheDocument();
  });
});
