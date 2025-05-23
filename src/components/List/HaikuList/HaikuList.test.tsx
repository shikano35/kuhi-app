/* eslint-disable @next/next/no-img-element */
import { render, screen, waitFor } from '@testing-library/react';
import { HaikuList } from './index';
import { mockHaikuMonuments } from '@/mocks/data/haiku-monuments';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  describe, expect, vi, beforeAll, afterEach, afterAll,
} from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  // 句碑一覧のエンドポイントをモック
  http.get('https://api.kuhiapi.com/haiku-monuments', () => {
    return HttpResponse.json({
      haiku_monuments: mockHaikuMonuments,
    });
  }),

  // 地域フィルタリングのエンドポイントをモック
  http.get('https://api.kuhiapi.com/haiku-monuments', ({ request }) => {
    const url = new URL(request.url);
    const region = url.searchParams.get('region');

    if (region) {
      const filteredMonuments = mockHaikuMonuments.filter(
        (monument) => monument.locations[0]?.region === region
      );

      return HttpResponse.json({
        haiku_monuments: filteredMonuments,
      });
    }

    return HttpResponse.json({
      haiku_monuments: mockHaikuMonuments,
    });
  }),

  // 俳人フィルタリングのエンドポイントをモック
  http.get(
    'https://api.kuhiapi.com/poets/:id/haiku-monuments',
    ({ params }) => {
      const { id } = params;
      const poetId = Number(id);

      const filteredMonuments = mockHaikuMonuments.filter((monument) =>
        monument.poets.some((poet) => poet.id === poetId)
      );

      return HttpResponse.json(filteredMonuments);
    }
  ),

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
      expect(
        screen.getByText(`${mockHaikuMonuments.length}件の句碑が見つかりました`)
      ).toBeInTheDocument();
    });

    for (const monument of mockHaikuMonuments) {
      expect(screen.getByText(monument.inscription)).toBeInTheDocument();
    }
  });

  test('地域で絞り込みができること', async () => {
    const region = '東海';
    const filteredMonuments = mockHaikuMonuments.filter(
      (monument) => monument.locations[0]?.region === region
    );

    render(
      <QueryClientProvider client={queryClient}>
        <HaikuList searchParams={{ region }} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(`${filteredMonuments.length}件の句碑が見つかりました`)
      ).toBeInTheDocument();
    });

    for (const monument of filteredMonuments) {
      expect(screen.getByText(monument.inscription)).toBeInTheDocument();
    }

    const otherMonuments = mockHaikuMonuments.filter(
      (monument) => monument.locations[0]?.region !== region
    );

    for (const monument of otherMonuments) {
      expect(screen.queryByText(monument.inscription)).not.toBeInTheDocument();
    }
  });

  test('検索結果が0件の場合は適切なメッセージが表示されること', async () => {
    // 存在しない地域で検索
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
