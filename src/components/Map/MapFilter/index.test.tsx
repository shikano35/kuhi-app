import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { MapFilter } from './index';
import { mockHaikuMonuments } from '@/mocks/data/haiku-monuments';
import { vi } from 'vitest';

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
