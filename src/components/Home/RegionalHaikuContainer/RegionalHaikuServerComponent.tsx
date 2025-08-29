import { getAllHaikuMonuments } from '@/lib/server-api';
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
  const monumentsByRegion = await Promise.all(
    REGIONS.map(async (region) => {
      const monuments = await getAllHaikuMonuments({ region });
      return { region, monuments: monuments.slice(0, 6) };
    })
  );

  const regionMonumentsMap = monumentsByRegion.reduce(
    (acc, { region, monuments }) => {
      acc[region] = monuments;
      return acc;
    },
    {} as Record<string, HaikuMonument[]>
  );

  const allMonuments = await getAllHaikuMonuments({});
  const initialMonuments = allMonuments.slice(0, 6);

  return (
    <RegionalHaikuClientComponent
      initialMonuments={initialMonuments}
      regionMonumentsMap={regionMonumentsMap}
      regions={REGIONS}
    />
  );
}
