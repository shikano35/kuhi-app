import type { Meta, StoryObj } from '@storybook/react';
import { SessionProvider } from 'next-auth/react';
import { HaikuCard } from './index';
import { HaikuMonument } from '@/types/definitions/haiku';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});

const meta: Meta<typeof HaikuCard> = {
  title: 'Components/HaikuCard',
  component: HaikuCard,
  decorators: [
    (Story) => (
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      </SessionProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HaikuCard>;

const now = new Date().toISOString();

const baseMonument: HaikuMonument = {
  id: 1,
  inscription: '冬牡丹千鳥よ雪のほととぎす',
  commentary: '松尾芭蕉の句',
  kigo: '冬牡丹,千鳥,雪',
  season: '冬',
  is_reliable: true,
  has_reverse_inscription: true,
  material: '石材',
  total_height: 150,
  width: 60,
  depth: 30,
  established_date: '昭和12年4月',
  established_year: '1937-4',
  founder: '小林雨月',
  monument_type: '句碑',
  designation_status: null,
  photo_url: 'https://example.com/photo1.jpg',
  photo_date: '2022-01-01',
  photographer: '撮影者',
  model_3d_url: null,
  remarks: null,
  created_at: now,
  updated_at: now,
  poet_id: 1,
  source_id: 1,
  location_id: 1,
  poets: [
    {
      id: 1,
      name: '松尾芭蕉',
      biography: '俳聖として知られる江戸時代の俳人',
      link_url: 'https://example.com/basho',
      image_url: 'https://example.com/basho.jpg',
      created_at: now,
      updated_at: now,
    },
  ],
  sources: [
    {
      id: 1,
      title: '俳句のくに・三重',
      author: '三重県庁',
      publisher: '三重県庁',
      source_year: 2011,
      url: 'https://example.com/source1',
      created_at: now,
      updated_at: now,
    },
  ],
  locations: [
    {
      id: 1,
      region: '東海',
      prefecture: '三重県',
      municipality: '桑名市',
      address: '桑名市北寺町47',
      place_name: '本統寺',
      latitude: 35.065502,
      longitude: 136.692193,
    },
  ],
};

export const Default: Story = {
  args: {
    monument: baseMonument,
  },
};

export const WithoutImage: Story = {
  args: {
    monument: {
      ...baseMonument,
      id: 2,
      inscription: '葉桜や頬白よりも散りおそし',
      photo_url: null,
      poets: [
        {
          id: 2,
          name: '与謝蕪村',
          biography: '江戸中期の俳人・画家',
          link_url: 'https://example.com/buson',
          image_url: 'https://example.com/buson.jpg',
          created_at: now,
          updated_at: now,
        },
      ],
      locations: [
        {
          id: 2,
          region: '近畿',
          prefecture: '京都府',
          municipality: '京都市',
          address: '京都市上京区',
          place_name: '蕪村堂',
          latitude: 35.025986,
          longitude: 135.759747,
        },
      ],
    },
  },
};

export const LongText: Story = {
  args: {
    monument: {
      ...baseMonument,
      id: 3,
      inscription:
        'これは長いサンプルテキストです。これは長いサンプルテキストです。これは長いサンプルテキストです。',
      poets: [
        {
          id: 3,
          name: '小林一茶',
          biography: '江戸後期の俳人',
          link_url: 'https://example.com/issa',
          image_url: 'https://example.com/issa.jpg',
          created_at: now,
          updated_at: now,
        },
      ],
      locations: [
        {
          id: 3,
          region: '中部',
          prefecture: '長野県',
          municipality: '信濃町',
          address: '長野県上水内郡信濃町',
          place_name: '一茶記念館',
          latitude: 36.804239,
          longitude: 138.159221,
        },
      ],
    },
  },
};

export const MultiplePoets: Story = {
  args: {
    monument: {
      ...baseMonument,
      id: 4,
      inscription: '菜の花や月は東に日は西に',
      poets: [
        {
          id: 2,
          name: '与謝蕪村',
          biography: '江戸中期の俳人・画家',
          link_url: 'https://example.com/buson',
          image_url: 'https://example.com/buson.jpg',
          created_at: now,
          updated_at: now,
        },
        {
          id: 4,
          name: '正岡子規',
          biography: '明治期の俳人・歌人',
          link_url: 'https://example.com/shiki',
          image_url: 'https://example.com/shiki.jpg',
          created_at: now,
          updated_at: now,
        },
      ],
      locations: [
        {
          id: 4,
          region: '関東',
          prefecture: '東京都',
          municipality: '文京区',
          address: '東京都文京区本郷',
          place_name: '子規庵',
          latitude: 35.707666,
          longitude: 139.756519,
        },
      ],
    },
  },
};
