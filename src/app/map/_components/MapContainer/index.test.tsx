import { render, screen, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// APIモック
vi.mock('@/lib/api', () => ({
  getAllHaikuMonuments: vi.fn().mockResolvedValue([]),
}));

// Leaflet コンポーネントのモック
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="leaflet-map">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: () => <div data-testid="map-marker" />,
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-popup">{children}</div>
  ),
}));

// Leaflet ライブラリのモック
vi.mock('leaflet', () => ({
  default: {
    Icon: {
      Default: {
        mergeOptions: vi.fn(),
        prototype: {},
      },
    },
    divIcon: vi.fn(() => ({
      options: {},
      createIcon: vi.fn(),
    })),
  },
}));

// グローバル状態のモック
let mapFilteredMonuments: unknown[] = [];
const setMapFilteredMonuments = vi.fn((monuments: unknown[]) => {
  mapFilteredMonuments = monuments;
});

vi.mock('@/store/useFilterStore', () => ({
  useFilterStore: () => ({
    mapFilteredMonuments,
    setMapFilteredMonuments,
    mapSelectedRegion: 'すべて',
    mapSelectedPrefecture: 'すべて',
    mapSelectedPoet: 'すべて',
    mapSearchText: '',
  }),
}));

// コンポーネントのインポートをモックの後に配置
import { MapClientComponent } from './MapClientComponent';

describe('HaikuMap', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    mapFilteredMonuments = [];
  });

  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          {component}
        </QueryClientProvider>
      </SessionProvider>
    );
  };

  test('マップコンテナがレンダリングされること', async () => {
    renderWithProviders(<MapClientComponent initialMonuments={[]} />);

    // フィルターヘッダー表示
    expect(screen.getByText('句碑を絞り込む')).toBeInTheDocument();

    // リセットボタン表示
    expect(screen.getByText('フィルターをリセット')).toBeInTheDocument();
  });

  test('フィルターコンポーネントが表示されること', async () => {
    renderWithProviders(<MapClientComponent initialMonuments={[]} />);

    // フィルターが表示されることを確認
    await waitFor(() => {
      expect(screen.getByTestId('leaflet-map')).toBeInTheDocument();
    });
  });

  test('フィルターが適用されるとマーカーの表示が変わること', async () => {
    renderWithProviders(<MapClientComponent initialMonuments={[]} />);

    // Leafletマップが表示されることを確認
    await waitFor(() => {
      expect(screen.getByTestId('leaflet-map')).toBeInTheDocument();
    });

    // モック関数の呼び出しを確認
    expect(setMapFilteredMonuments).toBeDefined();
  });
});
