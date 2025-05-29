import { describe, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClientHistoryChart } from './ClientHistoryChart';
import { processHistoryData } from './utils';
import { type HaikuMonument } from '@/types/haiku';

// モックデータ
const mockMonuments: HaikuMonument[] = [
  {
    id: 1,
    inscription: '冬牡丹千鳥よ雪のほととぎす',
    commentary: 'テスト',
    kigo: '冬牡丹',
    season: '冬',
    is_reliable: true,
    has_reverse_inscription: true,
    material: null,
    total_height: null,
    width: null,
    depth: null,
    established_date: '昭和12年4月',
    established_year: '1937-4',
    founder: '小林雨月',
    monument_type: '句碑',
    designation_status: null,
    photo_url: null,
    photo_date: null,
    photographer: null,
    model_3d_url: null,
    remarks: null,
    created_at: '2025-05-11 16:02:33',
    updated_at: '2025-05-11 16:02:33',
    poet_id: 1,
    source_id: 1,
    location_id: 1,
    poets: [
      {
        id: 1,
        name: '松尾芭蕉',
        biography: '俳聖',
        link_url: null,
        image_url: null,
        created_at: '2025-05-11 15:56:40',
        updated_at: '2025-05-11 15:56:40',
      },
    ],
    sources: [
      {
        id: 1,
        title: '俳句のくに・三重',
        author: '三重県庁',
        publisher: '三重県庁',
        source_year: 2011,
        url: null,
        created_at: '2025-05-11 15:54:14',
        updated_at: '2025-05-11 15:54:14',
      },
    ],
    locations: [
      {
        id: 1,
        prefecture: '三重県',
        region: '東海',
        municipality: '桑名市',
        address: '桑名市北寺町47',
        place_name: '本統寺',
        latitude: 35.065502,
        longitude: 136.692193,
      },
    ],
  },
  {
    id: 2,
    inscription: '古池や蛙飛び込む水の音',
    commentary: 'テスト2',
    kigo: '蛙',
    season: '春',
    is_reliable: true,
    has_reverse_inscription: false,
    material: null,
    total_height: null,
    width: null,
    depth: null,
    established_date: '平成元年5月',
    established_year: '1989-5',
    founder: '俳句協会',
    monument_type: '句碑',
    designation_status: null,
    photo_url: null,
    photo_date: null,
    photographer: null,
    model_3d_url: null,
    remarks: null,
    created_at: '2025-05-11 16:02:33',
    updated_at: '2025-05-11 16:02:33',
    poet_id: 1,
    source_id: 1,
    location_id: 1,
    poets: [
      {
        id: 1,
        name: '松尾芭蕉',
        biography: '俳聖',
        link_url: null,
        image_url: null,
        created_at: '2025-05-11 15:56:40',
        updated_at: '2025-05-11 15:56:40',
      },
    ],
    sources: [],
    locations: [],
  },
];

// Rechartsのモックを作成
vi.mock('recharts', () => {
  const ActualRechartsModule = vi.importActual('recharts');
  return {
    ...ActualRechartsModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    AreaChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="area-chart">{children}</div>
    ),
    Area: () => <div data-testid="area" />,
    XAxis: () => <div data-testid="xaxis" />,
    YAxis: () => <div data-testid="yaxis" />,
    CartesianGrid: () => <div data-testid="grid" />,
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

      // 1989年のデータが2000年に分類されていることを確認
      const data2000 = result.find((item) => item.year === 2000);
      expect(data2000).toBeDefined();
      expect(data2000?.monuments).toBeGreaterThan(1);

      // 俳人数が正しくカウントされていることを確認（同じ俳人で重複しないこと）
      expect(data2000?.poets).toBe(1);
    });
  });

  describe('ClientHistoryChart', () => {
    const historyData = processHistoryData(mockMonuments);

    test('グラフコンポーネントが正しくレンダリングされること', () => {
      render(<ClientHistoryChart historyData={historyData} />);

      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      expect(screen.getByTestId('area')).toBeInTheDocument();
      expect(screen.getByTestId('xaxis')).toBeInTheDocument();
      expect(screen.getByTestId('yaxis')).toBeInTheDocument();
    });

    test('モード切り替えボタンが機能すること', () => {
      render(<ClientHistoryChart historyData={historyData} />);

      // 初期状態は句碑数モード
      expect(screen.getByText('句碑数')).toHaveClass('bg-primary');
      expect(screen.getByText('俳人数')).not.toHaveClass('bg-primary');

      fireEvent.click(screen.getByText('俳人数'));

      expect(screen.getByText('句碑数')).not.toHaveClass('bg-primary');
      expect(screen.getByText('俳人数')).toHaveClass('bg-primary');
    });
  });
});
