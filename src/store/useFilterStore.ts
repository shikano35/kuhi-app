import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HaikuMonument } from '@/types/definitions/haiku';

export interface FilterState {
  // マップフィルター用状態
  mapSelectedRegion: string;
  mapSelectedPrefecture: string;
  mapSelectedPoet: string;
  mapSearchText: string;
  mapFilteredMonuments: HaikuMonument[];
  mapShowFavoritesOnly: boolean;
  mapShowVisitedOnly: boolean;

  // リストフィルター用状態
  listSearchText: string;
  listSelectedRegion: string;
  listSelectedPrefecture: string;
  listSelectedPoet: string;
  listPoetId: number | undefined;

  // マップ関連アクション
  setMapSelectedRegion: (region: string) => void;
  setMapSelectedPrefecture: (prefecture: string) => void;
  setMapSelectedPoet: (poet: string) => void;
  setMapSearchText: (text: string) => void;
  setMapFilteredMonuments: (monuments: HaikuMonument[]) => void;
  setMapShowFavoritesOnly: (show: boolean) => void;
  setMapShowVisitedOnly: (show: boolean) => void;
  resetMapFilters: () => void;

  // リスト関連アクション
  setListSearchText: (text: string) => void;
  setListSelectedRegion: (region: string) => void;
  setListSelectedPrefecture: (prefecture: string) => void;
  setListSelectedPoet: (poet: string, poetId?: number) => void;
  resetListFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      // マップフィルター用初期状態
      mapSearchText: '',
      mapSelectedRegion: 'すべて',
      mapSelectedPrefecture: 'すべて',
      mapSelectedPoet: 'すべて',
      mapFilteredMonuments: [],
      mapShowFavoritesOnly: false,
      mapShowVisitedOnly: false,

      // リストフィルター用初期状態
      listSearchText: '',
      listSelectedRegion: 'すべて',
      listSelectedPrefecture: 'すべて',
      listSelectedPoet: 'すべて',
      listPoetId: undefined,

      // マップ関連アクション
      setMapSelectedRegion: (region) =>
        set({ mapSelectedRegion: region, mapSelectedPrefecture: 'すべて' }),
      setMapSelectedPrefecture: (prefecture) =>
        set({ mapSelectedPrefecture: prefecture }),
      setMapSelectedPoet: (poet) => set({ mapSelectedPoet: poet }),
      setMapSearchText: (text) => set({ mapSearchText: text }),
      setMapFilteredMonuments: (monuments) =>
        set({ mapFilteredMonuments: monuments }),
      setMapShowFavoritesOnly: (show) => set({ mapShowFavoritesOnly: show }),
      setMapShowVisitedOnly: (show) => set({ mapShowVisitedOnly: show }),
      resetMapFilters: () =>
        set({
          mapSelectedRegion: 'すべて',
          mapSelectedPrefecture: 'すべて',
          mapSelectedPoet: 'すべて',
          mapSearchText: '',
          mapShowFavoritesOnly: false,
          mapShowVisitedOnly: false,
        }),

      // リスト関連アクション
      setListSearchText: (text) => set({ listSearchText: text }),
      setListSelectedRegion: (region) =>
        set({
          listSelectedRegion: region,
          listSelectedPrefecture: region === 'すべて' ? 'すべて' : undefined,
        }),
      setListSelectedPrefecture: (prefecture) =>
        set({ listSelectedPrefecture: prefecture }),
      setListSelectedPoet: (poet, poetId) =>
        set({ listSelectedPoet: poet, listPoetId: poetId }),
      resetListFilters: () =>
        set({
          listSearchText: '',
          listSelectedRegion: 'すべて',
          listSelectedPrefecture: 'すべて',
          listSelectedPoet: 'すべて',
          listPoetId: undefined,
        }),
    }),
    {
      name: 'haiku-filters',
      skipHydration: true,
    }
  )
);
