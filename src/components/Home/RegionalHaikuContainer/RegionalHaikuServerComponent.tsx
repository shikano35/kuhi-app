import { getMonuments, getAllMonumentsFromInscriptions } from '@/lib/kuhi-api';
import { RegionalHaikuClientComponent } from './RegionalHaikuClientComponent';
import { MonumentWithRelations } from '@/types/definitions/api';

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
    let canUseMonuments = false;
    try {
      await getMonuments({ limit: 1 });
      canUseMonuments = true;
    } catch {
      return [];
    }

    const regionMonumentsMap: Record<string, MonumentWithRelations[]> = {};

    if (canUseMonuments) {
      for (const region of REGIONS) {
        try {
          const monuments = await getMonuments({
            region,
            limit: 6,
          });
          regionMonumentsMap[region] = monuments;
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch {
          regionMonumentsMap[region] = [];
        }
      }
    } else {
      try {
        const allMonuments = await getAllMonumentsFromInscriptions();

        // 地域別にフィルタリング
        for (const region of REGIONS) {
          const regionMonuments = allMonuments
            .filter((monument) => {
              if (monument.locations && monument.locations.length > 0) {
                return monument.locations.some(
                  (location) => location.region === region
                );
              }
              return false;
            })
            .slice(0, 6);

          regionMonumentsMap[region] = regionMonuments;
        }
      } catch {
        for (const region of REGIONS) {
          regionMonumentsMap[region] = [];
        }
      }
    }

    // 初期表示用の全体データ
    let initialMonuments: MonumentWithRelations[] = [];
    try {
      if (canUseMonuments) {
        initialMonuments = await getMonuments({ limit: 6 });
      } else {
        const allRegionMonuments = Object.values(regionMonumentsMap).flat();
        initialMonuments = allRegionMonuments.slice(0, 6);
      }
    } catch {
      const firstRegionWithData = Object.values(regionMonumentsMap).find(
        (monuments) => monuments.length > 0
      );
      initialMonuments = firstRegionWithData
        ? firstRegionWithData.slice(0, 6)
        : [];
    }

    return (
      <RegionalHaikuClientComponent
        initialMonuments={initialMonuments}
        regionMonumentsMap={regionMonumentsMap}
        regions={REGIONS}
      />
    );
  } catch {
    const emptyRegionMonumentsMap = REGIONS.reduce(
      (acc, region) => {
        acc[region] = [];
        return acc;
      },
      {} as Record<string, MonumentWithRelations[]>
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
