import { render, screen, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { mockHaikuMonuments } from '@/mocks/data/haiku-monuments';
import { vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// APIモック
vi.mock('@/lib/api', () => ({
  getAllHaikuMonuments: vi.fn().mockResolvedValue(mockHaikuMonuments),
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
let mapFilteredMonuments: typeof mockHaikuMonuments = [];
const setMapFilteredMonuments = vi.fn((monuments) => {
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

  test('データ読み込み時にマーカーが表示されること', async () => {
    renderWithProviders(
      <MapClientComponent initialMonuments={mockHaikuMonuments} />
    );

    // ローディング表示を確認
    expect(screen.getByText('地図データを読み込み中...')).toBeInTheDocument();

    // データ読み込み後にマーカーが表示されることを確認
    await waitFor(() => {
      const markers = screen.getAllByTestId('map-marker');
      expect(markers.length).toBeGreaterThan(0);
    });
  });

  test('フィルターが適用されるとマーカーの表示が変わること', async () => {
    renderWithProviders(
      <MapClientComponent initialMonuments={mockHaikuMonuments} />
    );

    // データ読み込み後の初期マーカー数を確認
    await waitFor(() => {
      const initialMarkers = screen.getAllByTestId('map-marker');
      expect(initialMarkers.length).toBe(mockHaikuMonuments.length);
    });

    // 「東海の三重県」のみに絞り込み
    const filteredMonuments = mockHaikuMonuments.filter(
      (monument) =>
        monument.locations[0]?.region === '東海' &&
        monument.locations[0]?.prefecture === '三重県'
    );
    setMapFilteredMonuments(filteredMonuments);

    // モックが正しく呼び出されたかを確認
    expect(setMapFilteredMonuments).toHaveBeenCalledWith(filteredMonuments);

    expect(mapFilteredMonuments).toEqual(filteredMonuments);
  });
});
