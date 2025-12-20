import { render, screen, waitFor } from '@testing-library/react';
import { HaikuList } from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, vi, beforeEach, afterEach } from 'vitest';
import { SessionProvider } from 'next-auth/react';

vi.mock('@/hooks/useKuhiApi', () => ({
  useInfiniteMonuments: vi.fn(() => ({
    data: { pages: [] },
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
    isError: false,
    error: null,
  })),
  useFlattenedInfiniteMonuments: vi.fn(() => []),
  usePoets: vi.fn(() => ({ data: [] })),
  useLocations: vi.fn(() => ({ data: [] })),
}));

vi.mock('@/hooks/useInfiniteScroll', () => ({
  useInfiniteScroll: vi.fn(() => ({
    loadMoreRef: vi.fn(),
  })),
}));

vi.mock('@/lib/api-hooks', () => ({
  useUserFavorites: () => ({ data: { favorites: [] }, isLoading: false }),
  useAddFavorite: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useRemoveFavorite: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock('@/store/useFilterStore', () => ({
  useFilterStore: () => ({
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
  }),
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('コンポーネントが正しくレンダリングされること', async () => {
    render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <HaikuList />
        </QueryClientProvider>
      </SessionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('0件の句碑が見つかりました')).toBeInTheDocument();
    });
  });
});
