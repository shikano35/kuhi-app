/* eslint-disable @next/next/no-img-element */
import { render, screen, waitFor } from '@testing-library/react';
import { HaikuList } from './index';
import { mockHaikuMonuments } from '@/mocks/data/haiku-monuments';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  describe,
  expect,
  vi,
  beforeAll,
  afterEach,
  afterAll,
  beforeEach,
} from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// モックするためのサンプルデータ
const mockPoets = [
  { id: 1, name: '松尾芭蕉' },
  { id: 2, name: '与謝蕪村' },
];

const mockLocations = [
  { id: 1, region: '東海', prefecture: '三重県' },
  { id: 2, region: '東北', prefecture: '山形県' },
];

// APIモック
vi.mock('@/lib/api', () => {
  return {
    getAllHaikuMonuments: vi.fn((options) => {
      // regionsパラメータによってフィルタリング
      const { region } = options || {};
      if (region === '東海') {
        return Promise.resolve([
          {
            id: 1,
            inscription: '冬牡丹千鳥よ雪のほととぎす',
            poets: [{ id: 1, name: '松尾芭蕉' }],
            locations: [{ region: '東海', prefecture: '三重県' }],
          },
        ]);
      }
      if (region === '存在しない地域') {
        return Promise.resolve([]);
      }
      return Promise.resolve([
        {
          id: 1,
          inscription: '冬牡丹千鳥よ雪のほととぎす',
          poets: [{ id: 1, name: '松尾芭蕉' }],
          locations: [{ region: '東海', prefecture: '三重県' }],
        },
        {
          id: 2,
          inscription: '閑さや岩にしみ入る蝉の声',
          poets: [{ id: 1, name: '松尾芭蕉' }],
          locations: [{ region: '東北', prefecture: '山形県' }],
        },
        {
          id: 3,
          inscription: '菜の花や月は東に日は西に',
          poets: [{ id: 2, name: '与謝蕪村' }],
          locations: [{ region: '近畿', prefecture: '京都府' }],
        },
        {
          id: 4,
          inscription: '古池や蛙飛び込む水の音',
          poets: [{ id: 1, name: '松尾芭蕉' }],
          locations: [{ region: '近畿', prefecture: '滋賀県' }],
        },
      ]);
    }),
    getHaikuMonumentsByPoet: vi.fn(() => Promise.resolve([])),
    getAllPoets: vi.fn(() => Promise.resolve(mockPoets)),
    getAllLocations: vi.fn(() => Promise.resolve(mockLocations)),
    getHaikuMonumentById: vi.fn(() => Promise.resolve({})),
  };
});

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

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

const server = setupServer(
  // 句碑一覧のエンドポイントをモック
  http.get('https://api.kuhiapi.com/haiku-monuments', () => {
    return HttpResponse.json({
      haiku_monuments: mockHaikuMonuments,
    });
  }),

  http.get('https://api.kuhiapi.com/haiku-monuments', ({ request }) => {
    const url = new URL(request.url);
    const region = url.searchParams.get('region');

    if (region === '東海') {
      // 東海地域の句碑のみを返す
      return HttpResponse.json({
        haiku_monuments: mockHaikuMonuments.filter(
          (monument) => monument.locations[0]?.region === '東海'
        ),
      });
    }

    return HttpResponse.json({
      haiku_monuments: mockHaikuMonuments,
    });
  }),

  // その他のエンドポイント
  http.get('https://api.kuhiapi.com/poets', () => {
    return HttpResponse.json(mockPoets);
  }),

  http.get('https://api.kuhiapi.com/locations', () => {
    return HttpResponse.json(mockLocations);
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

describe('HaikuList', () => {
  let queryClient: QueryClient;

  beforeAll(() => server.listen());

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  afterAll(() => server.close());

  test('句碑リストが正しく表示されること', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HaikuList searchParams={{}} />
      </QueryClientProvider>
    );

    expect(screen.getByText('検索中...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('4件の句碑が見つかりました')).toBeInTheDocument();
    });

    expect(screen.getByText('冬牡丹千鳥よ雪のほととぎす')).toBeInTheDocument();
    expect(screen.getByText('閑さや岩にしみ入る蝉の声')).toBeInTheDocument();
    expect(screen.getByText('菜の花や月は東に日は西に')).toBeInTheDocument();
    expect(screen.getByText('古池や蛙飛び込む水の音')).toBeInTheDocument();
  });

  test('地域で絞り込みができること', async () => {
    // 東海地域のみに絞り込むためのMSWハンドラを設定
    server.use(
      http.get('https://api.kuhiapi.com/haiku-monuments', () => {
        return HttpResponse.json({
          // 東海地域の句碑のみを含む配列を返す
          haiku_monuments: [
            {
              id: 1,
              inscription: '冬牡丹千鳥よ雪のほととぎす',
              poets: [{ id: 1, name: '松尾芭蕉' }],
              locations: [{ region: '東海', prefecture: '三重県' }],
              sources: [],
              photo_url: '/images/monuments/sample1.jpg',
            },
          ],
        });
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <HaikuList searchParams={{ region: '東海' }} />
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
    // 0件の結果を返すMSWハンドラ
    server.use(
      http.get('https://api.kuhiapi.com/haiku-monuments', () => {
        return HttpResponse.json({
          haiku_monuments: [],
        });
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <HaikuList searchParams={{ region: '存在しない地域' }} />
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
