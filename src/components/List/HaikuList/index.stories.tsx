import type { Meta, StoryObj } from '@storybook/react';
import { HaikuList } from './index';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/tanstack-query';
import { mockHaikuMonuments } from '@/mocks/data/haiku-monuments';
import * as apiHooks from '@/lib/api-hooks';
import { vi } from 'vitest';

import * as filterStore from '@/store/useFilterStore';

const mockHaikuListData = {
  data: {
    pages: [
      {
        monuments: mockHaikuMonuments.slice(0, 8),
        nextPage: null,
        totalCount: mockHaikuMonuments.length,
      },
    ],
  },
  fetchNextPage: () => {},
  hasNextPage: false,
  isFetchingNextPage: false,
  isLoading: false,
  isError: false,
  error: null,
};

const mockPoetsData = [
  {
    id: 1,
    name: '松尾芭蕉',
    biography: '俳聖',
    created_at: '',
    updated_at: '',
    link_url: null,
    image_url: null,
  },
  {
    id: 2,
    name: '与謝蕪村',
    biography: '俳諧',
    created_at: '',
    updated_at: '',
    link_url: null,
    image_url: null,
  },
];

const mockLocationsData = [
  {
    id: 1,
    region: '東海',
    prefecture: '三重県',
    municipality: '桑名市',
    address: '北寺町47',
    place_name: '本統寺',
    latitude: 35.065502,
    longitude: 136.692193,
  },
  {
    id: 2,
    region: '近畿',
    prefecture: '京都府',
    municipality: '京都市',
    address: '上京区',
    place_name: '蕪村堂',
    latitude: 35.025986,
    longitude: 135.759747,
  },
];

const createMockFilterStore = (customValues = {}) => {
  return {
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
    mapSelectedRegion: 'すべて',
    mapSelectedPrefecture: 'すべて',
    mapSelectedPoet: 'すべて',
    mapSearchText: '',
    mapFilteredMonuments: [],
    setMapSelectedRegion: vi.fn(),
    setMapSelectedPrefecture: vi.fn(),
    setMapSelectedPoet: vi.fn(),
    setMapSearchText: vi.fn(),
    setMapFilteredMonuments: vi.fn(),
    resetMapFilters: vi.fn(),
    ...customValues,
  };
};

function MockedHaikuList() {
  if (typeof window !== 'undefined') {
    const storeValues: Record<string, string | number | undefined> = {
      listSearchText: '',
      listSelectedRegion: 'すべて',
      listPoetId: undefined,
    };

    Object.defineProperty(filterStore, 'useFilterStore', {
      value: () => createMockFilterStore(storeValues),
      configurable: true,
    });
  }

  return <HaikuList />;
}

if (typeof window !== 'undefined') {
  Object.defineProperty(apiHooks, 'useHaikuList', {
    value: () => mockHaikuListData,
    configurable: true,
  });

  Object.defineProperty(apiHooks, 'usePoetsList', {
    value: () => ({ data: mockPoetsData }),
    configurable: true,
  });

  Object.defineProperty(apiHooks, 'useLocationsList', {
    value: () => ({ data: mockLocationsData }),
    configurable: true,
  });
}

const meta: Meta<typeof MockedHaikuList> = {
  title: 'Components/List/HaikuList',
  component: MockedHaikuList,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div
          className="container mx-auto p-4"
          data-testid="haiku-list-container"
        >
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/list',
        query: {},
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MockedHaikuList>;

export const Default: Story = {};

export const WithSearchQuery: Story = {};

export const FilteredByRegion: Story = {};

export const FilteredByPoet: Story = {};
