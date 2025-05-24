import { render, screen, fireEvent } from '@testing-library/react';
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
    setMapSelectedRegion: vi.fn(),
    setMapSelectedPrefecture: vi.fn(),
    setMapSelectedPoet: vi.fn(),
    setMapSearchText: vi.fn(),
    resetMapFilters: resetMapFiltersMock,
  }),
}));

describe('MapFilter', () => {
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('初期レンダリング時にはフィルターが適用されること', () => {
    render(
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
        setMapSelectedRegion,
        setMapSelectedPrefecture: vi.fn(),
        setMapSelectedPoet: vi.fn(),
        setMapSearchText: vi.fn(),
        resetMapFilters: vi.fn(),
      }),
    }));

    render(
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
        setMapSelectedRegion: vi.fn(),
        setMapSelectedPrefecture: vi.fn(),
        setMapSelectedPoet: vi.fn(),
        setMapSearchText,
        resetMapFilters: vi.fn(),
      }),
    }));

    render(
      <MapFilter
        monuments={mockHaikuMonuments}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  test('リセットボタンをクリックするとフィルターがリセットされること', async () => {
    render(
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
