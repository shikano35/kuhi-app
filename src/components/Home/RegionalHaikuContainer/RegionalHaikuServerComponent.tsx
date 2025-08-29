import { getAllHaikuMonuments } from '@/lib/api';
import { RegionalHaikuClientComponent } from './RegionalHaikuClientComponent';
import { HaikuMonument } from '@/types/definitions/haiku';

const REGIONS = [
  '北海道',
  '東北',
  '関東甲信',
  '東海',
  '北陸',
  '近畿',
  '中国',
  '四国',
  '九州',
  '沖縄',
];

export async function RegionalHaikuServerComponent() {
  try {
    // 各地域の句碑データを並行取得
    const monumentsByRegion = await Promise.all(
      REGIONS.map(async (region) => {
        const monuments = await getAllHaikuMonuments({
          region,
          limit: 6,
        });
        return { region, monuments };
      })
    );

    const regionMonumentsMap = monumentsByRegion.reduce(
      (acc, { region, monuments }) => {
        acc[region] = monuments;
        return acc;
      },
      {} as Record<string, HaikuMonument[]>
    );

    // 初期表示用の全体データ
    const initialMonuments = await getAllHaikuMonuments({ limit: 6 });

    return (
      <RegionalHaikuClientComponent
        initialMonuments={initialMonuments}
        regionMonumentsMap={regionMonumentsMap}
        regions={REGIONS}
      />
    );
  } catch (error) {
    console.error('地域別句碑データの取得に失敗:', error);

    const emptyRegionMonumentsMap = REGIONS.reduce(
      (acc, region) => {
        acc[region] = [];
        return acc;
      },
      {} as Record<string, HaikuMonument[]>
    );

    return (
      <RegionalHaikuClientComponent
        initialMonuments={[]}
        regionMonumentsMap={emptyRegionMonumentsMap}
        regions={REGIONS}
      />
    );
  }
}
