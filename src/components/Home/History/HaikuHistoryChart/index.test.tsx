import { describe, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClientHistoryChart } from './ClientHistoryChart';
import { processHistoryData } from './utils';
import { type MonumentWithRelations } from '@/types/definitions/api';

// モックデータ
const mockMonuments: MonumentWithRelations[] = [
  {
    id: 1,
    canonical_name: '本統寺 句碑（松尾芭蕉）',
    canonical_uri: 'https://api.kuhi.jp/monuments/1',
    monument_type: '句碑',
    monument_type_uri: null,
    material: null,
    material_uri: null,
    created_at: '2025-05-11T16:02:33.000Z',
    updated_at: '2025-05-11T16:02:33.000Z',
    original_established_date: null,
    hu_time_normalized: null,
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
        notes: 'この句は芭蕉が詠んだものです',
        poems: [
          {
            id: 1,
            text: '冬牡丹千鳥よ雪のほととぎす',
            normalized_text: '冬牡丹千鳥よ雪のほととぎす',
            text_hash: '4c5f9260',
            kigo: '冬牡丹,千鳥,雪,ほととぎす',
            season: '冬',
            created_at: '2025-05-11T16:02:33.000Z',
            updated_at: '2025-05-11T16:02:33.000Z',
          },
        ],
        source: {
          id: 1,
          citation: '三重県庁 『俳句のくに・三重』 三重県庁 2011',
          author: '三重県庁',
          title: '俳句のくに・三重',
          publisher: '三重県庁',
          source_year: 2011,
          url: 'https://www.bunka.pref.mie.lg.jp/haiku/',
          created_at: '2025-05-11T15:54:14.000Z',
          updated_at: '2025-05-11T15:54:14.000Z',
        },
      },
    ],
    events: [
      {
        id: 111,
        event_type: 'erected',
        hu_time_normalized: 'HT:interval/1937-04-01/1937-04-30',
        interval_start: '1937-04-01',
        interval_end: '1937-04-30',
        uncertainty_note: '月は特定だが日不明',
        actor: '小林雨月',
        source: {
          id: 1,
          citation: '三重県庁 『俳句のくに・三重』 三重県庁 2011',
          author: '三重県庁',
          title: '俳句のくに・三重',
          publisher: '三重県庁',
          source_year: 2011,
          url: 'https://www.bunka.pref.mie.lg.jp/haiku/',
          created_at: '2025-05-11T15:54:14.000Z',
          updated_at: '2025-05-11T15:54:14.000Z',
        },
      },
    ],
    media: [],
    locations: [
      {
        id: 1,
        imi_pref_code: null,
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
        created_at: '2025-08-25T18:05:44.000Z',
        updated_at: '2025-08-25T18:05:44.000Z',
      },
    ],
    poets: [
      {
        id: 1,
        name: '松尾芭蕉',
        name_kana: null,
        biography:
          '滑稽や諧謔を主としていた俳諧を、蕉風と呼ばれる芸術性の極めて高い句風として確立し、後世では俳聖として世界的にも知られる、日本史上最高の俳諧師の一人',
        birth_year: null,
        death_year: null,
        link_url:
          'https://ja.wikipedia.org/wiki/%E6%9D%BE%E5%B0%BE%E8%8A%AD%E8%95%89',
        image_url:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Basho_by_Morikawa_Kyoriku_%281656-1715%29.jpg/500px-Basho_by_Morikawa_Kyoriku_%281656-1715%29.jpg',
        created_at: '2025-05-11T15:56:40.000Z',
        updated_at: '2025-05-11T15:56:40.000Z',
      },
    ],
    sources: [
      {
        id: 1,
        citation: '三重県庁 『俳句のくに・三重』 三重県庁 2011',
        author: '三重県庁',
        title: '俳句のくに・三重',
        publisher: '三重県庁',
        source_year: 2011,
        url: 'https://www.bunka.pref.mie.lg.jp/haiku/',
        created_at: '2025-05-11T15:54:14.000Z',
        updated_at: '2025-05-11T15:54:14.000Z',
      },
    ],
  },
  {
    id: 2,
    canonical_name: '春日神社 句碑（山口誓子）',
    canonical_uri: 'https://api.kuhi.jp/monuments/2',
    monument_type: '句碑',
    monument_type_uri: null,
    material: null,
    material_uri: null,
    created_at: '2025-05-26T12:33:08.000Z',
    updated_at: '2025-05-26T12:33:08.000Z',
    original_established_date: null,
    hu_time_normalized: null,
    interval_start: null,
    interval_end: null,
    uncertainty_note: null,
    inscriptions: [
      {
        id: 2,
        side: 'front',
        original_text: '山車統べて鎧皇后立ち給ふ',
        transliteration: null,
        reading: null,
        language: 'ja',
        notes: '誓子はよく桑名を訪れた',
        poems: [
          {
            id: 2,
            text: '山車統べて鎧皇后立ち給ふ',
            normalized_text: '山車統べて鎧皇后立ち給ふ',
            text_hash: '6419b232',
            kigo: '山車',
            season: '夏',
            created_at: '2025-05-26T12:33:08.000Z',
            updated_at: '2025-05-26T12:33:08.000Z',
          },
        ],
        source: {
          id: 1,
          citation: '三重県庁 『俳句のくに・三重』 三重県庁 2011',
          author: '三重県庁',
          title: '俳句のくに・三重',
          publisher: '三重県庁',
          source_year: 2011,
          url: 'https://www.bunka.pref.mie.lg.jp/haiku/',
          created_at: '2025-05-11T15:54:14.000Z',
          updated_at: '2025-05-11T15:54:14.000Z',
        },
      },
    ],
    events: [
      {
        id: 112,
        event_type: 'erected',
        hu_time_normalized: 'HT:interval/1965-09-01/1965-09-30',
        interval_start: '1965-09-01',
        interval_end: '1965-09-30',
        uncertainty_note: '月は特定だが日不明',
        actor: '市内の山口誓子門下生',
        source: {
          id: 1,
          citation: '三重県庁 『俳句のくに・三重』 三重県庁 2011',
          author: '三重県庁',
          title: '俳句のくに・三重',
          publisher: '三重県庁',
          source_year: 2011,
          url: 'https://www.bunka.pref.mie.lg.jp/haiku/',
          created_at: '2025-05-11T15:54:14.000Z',
          updated_at: '2025-05-11T15:54:14.000Z',
        },
      },
    ],
    media: [],
    locations: [
      {
        id: 2,
        imi_pref_code: null,
        region: '東海',
        prefecture: '三重県',
        municipality: '桑名市',
        address: '桑名市本町46',
        place_name: '春日神社',
        latitude: 35.065263,
        longitude: 136.69499,
        geohash: null,
        geom_geojson: null,
        accuracy_m: null,
        created_at: '2025-08-25T18:05:45.000Z',
        updated_at: '2025-08-25T18:05:45.000Z',
      },
    ],
    poets: [
      {
        id: 2,
        name: '山口誓子',
        name_kana: null,
        biography:
          '昭和初期に水原秋桜子、高野素十、阿波野青畝とともに「ホトトギスの四S」とされた',
        birth_year: null,
        death_year: null,
        link_url:
          'https://ja.wikipedia.org/wiki/%E5%B1%B1%E5%8F%A3%E8%AA%93%E5%AD%90',
        image_url:
          'https://upload.wikimedia.org/wikipedia/commons/c/c2/Yamaguchi_Seishi.JPG',
        created_at: '2025-05-26T03:15:56.000Z',
        updated_at: '2025-05-26T03:15:56.000Z',
      },
    ],
    sources: [
      {
        id: 1,
        citation: '三重県庁 『俳句のくに・三重』 三重県庁 2011',
        author: '三重県庁',
        title: '俳句のくに・三重',
        publisher: '三重県庁',
        source_year: 2011,
        url: 'https://www.bunka.pref.mie.lg.jp/haiku/',
        created_at: '2025-05-11T15:54:14.000Z',
        updated_at: '2025-05-11T15:54:14.000Z',
      },
    ],
  },
];

// Rechartsコンポーネントのモック
vi.mock('recharts', () => {
  return {
    AreaChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="area-chart">{children}</div>
    ),
    Area: () => <div data-testid="area" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    Tooltip: () => <div data-testid="tooltip" />,
  };
});

describe('HaikuHistoryChart', () => {
  describe('processHistoryData', () => {
    test('句碑データから年代ごとの統計データを正しく生成すること', () => {
      const result = processHistoryData(mockMonuments);

      // データが正しい長さであることを確認
      expect(result).toHaveLength(18);

      // 1937年のデータが1950年に分類されていることを確認
      const data1950 = result.find((item) => item.year === 1950);
      expect(data1950).toBeDefined();
      expect(data1950?.monuments).toBeGreaterThan(0);

      // 1965年のデータが1975年に分類されていることを確認
      const data1975 = result.find((item) => item.year === 1975);
      expect(data1975).toBeDefined();
      expect(data1975?.monuments).toBeGreaterThan(1);

      // 俳人数が正しくカウントされていることを確認
      expect(data1975?.poets).toBe(2);
    });
  });

  describe('ClientHistoryChart', () => {
    const historyData = processHistoryData(mockMonuments);

    test('グラフコンポーネントが正しくレンダリングされること', () => {
      render(<ClientHistoryChart historyData={historyData} />);

      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });

    test('モード切り替えボタンが機能すること', () => {
      render(<ClientHistoryChart historyData={historyData} />);

      const toggleButton = screen.getByText('俳人数');
      expect(toggleButton).toBeInTheDocument();

      // ボタンをクリックしてモードを切り替える
      fireEvent.click(toggleButton);

      // ボタンのテキストが変わることを確認
      expect(screen.getByText('句碑数')).toBeInTheDocument();
    });
  });
});
