import type { Meta, StoryObj } from '@storybook/react';
import { SessionProvider } from 'next-auth/react';
import { HaikuCard } from './index';
import { MonumentWithRelations } from '@/types/definitions/api';
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

const baseMonument: MonumentWithRelations = {
  id: 1,
  canonical_name: '冬牡丹千鳥よ雪のほととぎす',
  canonical_uri: 'https://api.kuhi.jp/monuments/1',
  monument_type: '句碑',
  monument_type_uri: null,
  material: '石材',
  material_uri: null,
  is_reliable: false,
  verification_status: 'unverified',
  verified_at: null,
  verified_by: null,
  reliability_note: null,
  created_at: now,
  updated_at: now,
  original_established_date: '昭和12年4月',
  hu_time_normalized: '1937-04',
  interval_start: null,
  interval_end: null,
  uncertainty_note: null,
  inscriptions: [
    {
      id: 1,
      side: 'front',
      original_text: '冬牡丹千鳥よ雪のほととぎす',
      transliteration: null,
      reading: null,
      language: 'ja',
      notes: null,
      poems: [
        {
          id: 1,
          text: '冬牡丹千鳥よ雪のほととぎす',
          normalized_text: '冬牡丹千鳥よ雪のほととぎす',
          text_hash: 'hash1',
          kigo: '冬牡丹,千鳥,雪',
          season: '冬',
          created_at: now,
          updated_at: now,
        },
      ],
    },
  ],
  events: [],
  media: [
    {
      id: 1,
      media_type: 'photo',
      url: 'https://example.com/photo1.jpg',
      iiif_manifest_url: null,
      captured_at: '2022-01-01',
      photographer: '撮影者',
      license: null,
    },
  ],
  locations: [
    {
      id: 1,
      imi_pref_code: '24',
      region: '東海',
      prefecture: '三重県',
      municipality: '桑名市',
      address: '桑名市北寺町47',
      place_name: '本統寺',
      latitude: 35.065502,
      longitude: 136.692193,
      geohash: null,
      geom_geojson: null,
      accuracy_m: null,
      created_at: now,
      updated_at: now,
    },
  ],
  poets: [
    {
      id: 1,
      name: '松尾芭蕉',
      name_kana: 'まつおばしょう',
      biography: '俳聖として知られる江戸時代の俳人',
      birth_year: 1644,
      death_year: 1694,
      link_url: 'https://example.com/basho',
      image_url: 'https://example.com/basho.jpg',
      created_at: now,
      updated_at: now,
    },
  ],
  sources: [
    {
      id: 1,
      citation: '俳句のくに・三重',
      author: '三重県庁',
      title: '俳句のくに・三重',
      publisher: '三重県庁',
      source_year: 2011,
      url: 'https://example.com/source1',
      created_at: now,
      updated_at: now,
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
      media: [],
    },
  },
};

export const LongText: Story = {
  args: {
    monument: {
      ...baseMonument,
      id: 3,
      inscriptions: [
        {
          ...baseMonument.inscriptions[0],
          original_text:
            'これは長いサンプルテキストです。これは長いサンプルテキストです。これは長いサンプルテキストです。',
          poems: [
            {
              ...baseMonument.inscriptions[0].poems[0],
              text: 'これは長いサンプルテキストです。これは長いサンプルテキストです。これは長いサンプルテキストです。',
              normalized_text:
                'これは長いサンプルテキストです。これは長いサンプルテキストです。これは長いサンプルテキストです。',
            },
          ],
        },
      ],
      poets: [
        {
          id: 3,
          name: '小林一茶',
          name_kana: 'こばやしいっさ',
          biography: '江戸後期の俳人',
          birth_year: 1763,
          death_year: 1828,
          link_url: 'https://example.com/issa',
          image_url: 'https://example.com/issa.jpg',
          created_at: now,
          updated_at: now,
        },
      ],
      locations: [
        {
          ...baseMonument.locations[0],
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
      inscriptions: [
        {
          ...baseMonument.inscriptions[0],
          original_text: '菜の花や月は東に日は西に',
          poems: [
            {
              ...baseMonument.inscriptions[0].poems[0],
              text: '菜の花や月は東に日は西に',
              normalized_text: '菜の花や月は東に日は西に',
              kigo: '菜の花',
              season: '春',
            },
          ],
        },
      ],
      poets: [
        {
          id: 2,
          name: '与謝蕪村',
          name_kana: 'よさぶそん',
          biography: '江戸中期の俳人・画家',
          birth_year: 1716,
          death_year: 1784,
          link_url: 'https://example.com/buson',
          image_url: 'https://example.com/buson.jpg',
          created_at: now,
          updated_at: now,
        },
        {
          id: 4,
          name: '正岡子規',
          name_kana: 'まさおかしき',
          biography: '明治期の俳人・歌人',
          birth_year: 1867,
          death_year: 1902,
          link_url: 'https://example.com/shiki',
          image_url: 'https://example.com/shiki.jpg',
          created_at: now,
          updated_at: now,
        },
      ],
      locations: [
        {
          ...baseMonument.locations[0],
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
