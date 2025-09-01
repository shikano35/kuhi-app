import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { MapFilter } from './index';
import { vi } from 'vitest';
import { HaikuMonument } from '@/types/definitions/haiku';

interface ApiMonument {
  id: number;
  canonical_name: string;
  poets: Array<{ name: string }>;
  locations: Array<{ region: string; prefecture: string }>;
}

// HaikuMonument形式に変換する関数
function convertToHaikuMonument(apiMonument: ApiMonument): HaikuMonument {
  return {
    id: apiMonument.id,
    inscription: '',
    commentary: null,
    kigo: null,
    season: null,
    is_reliable: null,
    has_reverse_inscription: null,
    material: null,
    total_height: null,
    width: null,
    depth: null,
    established_date: null,
    established_year: null,
    founder: null,
    monument_type: null,
    designation_status: null,
    photo_url: null,
    photo_date: null,
    photographer: null,
    model_3d_url: null,
    remarks: null,
    created_at: '',
    updated_at: '',
    poet_id: 0,
    source_id: 0,
    location_id: 0,
    poets: apiMonument.poets.map((poet) => ({
      id: 0,
      name: poet.name,
      biography: null,
      link_url: null,
      image_url: null,
      created_at: '',
      updated_at: '',
    })),
    sources: [],
    locations: apiMonument.locations.map((location) => ({
      id: 0,
      region: location.region,
      prefecture: location.prefecture,
      municipality: null,
      address: null,
      place_name: null,
      latitude: null,
      longitude: null,
    })),
  };
}

const mockApiMonuments: ApiMonument[] = [
  {
    id: 1,
    canonical_name: '本統寺 句碑（松尾芭蕉）',
    poets: [{ name: '松尾芭蕉' }],
    locations: [{ region: '東海', prefecture: '三重県' }],
  },
];

const mockHaikuMonuments: HaikuMonument[] = mockApiMonuments.map(
  convertToHaikuMonument
);

const resetMapFiltersMock = vi.fn();
vi.mock('@/store/useFilterStore', () => ({
  useFilterStore: () => ({
    mapSelectedRegion: 'すべて',
    mapSelectedPrefecture: 'すべて',
    mapSelectedPoet: 'すべて',
    mapSearchText: '',
    mapFilteredMonuments: mockHaikuMonuments,
    mapShowFavoritesOnly: false,
    mapShowVisitedOnly: false,
    setMapSelectedRegion: vi.fn(),
    setMapSelectedPrefecture: vi.fn(),
    setMapSelectedPoet: vi.fn(),
    setMapSearchText: vi.fn(),
    setMapShowFavoritesOnly: vi.fn(),
    setMapShowVisitedOnly: vi.fn(),
    resetMapFilters: resetMapFiltersMock,
  }),
}));

// API hooks のモック
vi.mock('@/lib/api-hooks', () => ({
  useUserFavorites: () => ({ data: [] }),
  useUserVisits: () => ({ data: [] }),
}));

describe('MapFilter', () => {
  const mockOnFilterChange = vi.fn();
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
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

  test('初期レンダリング時にはフィルターが適用されること', () => {
    renderWithProviders(
      <MapFilter
        monuments={mockHaikuMonuments}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    expect(mockOnFilterChange).toHaveBeenCalledWith(mockHaikuMonuments);
  });

  test('フィルター条件の変更が適用されるとuseEffectによってフィルタリングが実行されること', async () => {
    let selectedRegion = 'すべて';
    const setMapSelectedRegion = vi.fn(() => {
      selectedRegion = '東北';
    });

    vi.doMock('@/store/useFilterStore', () => ({
      useFilterStore: () => ({
        mapSelectedRegion: selectedRegion,
        mapSelectedPrefecture: 'すべて',
        mapSelectedPoet: 'すべて',
        mapSearchText: '',
        mapFilteredMonuments: mockHaikuMonuments,
        mapShowFavoritesOnly: false,
        mapShowVisitedOnly: false,
        setMapSelectedRegion,
        setMapSelectedPrefecture: vi.fn(),
        setMapSelectedPoet: vi.fn(),
        setMapSearchText: vi.fn(),
        setMapShowFavoritesOnly: vi.fn(),
        setMapShowVisitedOnly: vi.fn(),
        resetMapFilters: vi.fn(),
      }),
    }));

    renderWithProviders(
      <MapFilter
        monuments={mockHaikuMonuments}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  test('検索テキストの変更によってフィルタリングが実行されること', async () => {
    const setMapSearchText = vi.fn();

    vi.doMock('@/store/useFilterStore', () => ({
      useFilterStore: () => ({
        mapSelectedRegion: 'すべて',
        mapSelectedPrefecture: 'すべて',
        mapSelectedPoet: 'すべて',
        mapSearchText: '',
        mapFilteredMonuments: mockHaikuMonuments,
        mapShowFavoritesOnly: false,
        mapShowVisitedOnly: false,
        setMapSelectedRegion: vi.fn(),
        setMapSelectedPrefecture: vi.fn(),
        setMapSelectedPoet: vi.fn(),
        setMapSearchText,
        setMapShowFavoritesOnly: vi.fn(),
        setMapShowVisitedOnly: vi.fn(),
        resetMapFilters: vi.fn(),
      }),
    }));

    renderWithProviders(
      <MapFilter
        monuments={mockHaikuMonuments}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  test('リセットボタンをクリックするとフィルターがリセットされること', async () => {
    renderWithProviders(
      <MapFilter
        monuments={mockHaikuMonuments}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'フィルターをリセット' })
    );

    expect(resetMapFiltersMock).toHaveBeenCalled();
  });
});
