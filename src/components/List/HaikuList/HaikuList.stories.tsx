import type { Meta, StoryObj } from '@storybook/react';
import { HaikuList } from './index';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/tanstack-query';
import { mockHaikuMonuments } from '@/mocks/data/haiku-monuments';
import * as apiHooks from '@/lib/api-hooks';
import type { ComponentProps } from 'react';

type HaikuListProps = ComponentProps<typeof HaikuList>;

// モックデータ
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

function MockedHaikuList(props: HaikuListProps) {
  return <HaikuList {...props} />;
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

export const Default: Story = {
  args: {
    searchParams: {},
  },
};

export const WithSearchQuery: Story = {
  args: {
    searchParams: {
      q: '芭蕉',
    },
  },
};

export const FilteredByRegion: Story = {
  args: {
    searchParams: {
      region: '東海',
    },
  },
};

export const FilteredByPoet: Story = {
  args: {
    searchParams: {
      poet_id: '1',
    },
  },
};
