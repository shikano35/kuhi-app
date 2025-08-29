import { HaikuMonument } from '@/types/definitions/haiku';

export type HistoryDataPoint = {
  year: number;
  events: string;
  monuments: number;
  poets: number;
};

const START_YEAR = 1600;
const END_YEAR = 2025;
const INTERVAL = 25;

const years: number[] = [];
for (let y = START_YEAR; y <= END_YEAR; y += INTERVAL) {
  years.push(y);
}

export const HISTORICAL_EVENTS: Record<number, string> = {
  1600: '俳諧の勃興',
  1625: '江戸初期の発展期',
  1650: '松尾芭蕉の活躍期',
  1675: '蕉風の深化',
  1700: '蕉風の確立',
  1725: '中期俳諧の動き',
  1750: '与謝蕪村の活躍期',
  1775: '蕪村以後の展開',
  1800: '小林一茶の活躍期',
  1825: '近世俳句の転換点',
  1850: '幕末・明治維新',
  1875: '明治期俳句の革新',
  1900: '正岡子規による俳句革新',
  1925: '大正〜昭和初期の変容',
  1950: '戦後俳句ブーム',
  1975: 'モダン俳句の展開',
  2000: '国際俳句の普及',
  2025: '現在',
};

export function processHistoryData(
  monuments: HaikuMonument[]
): HistoryDataPoint[] {
  const yearGroupMap: Map<number, { count: number; poetIds: Set<number> }> =
    new Map();
  years.forEach((year) => {
    yearGroupMap.set(year, { count: 0, poetIds: new Set() });
  });

  monuments.forEach((monument) => {
    if (!monument.established_year) return;
    const actualYear = parseInt(monument.established_year.split('-')[0], 10);
    if (isNaN(actualYear)) return;

    const offset = actualYear - START_YEAR;
    const bucketIndex = Math.round(offset / INTERVAL);
    const closestYear = START_YEAR + bucketIndex * INTERVAL;

    const group = yearGroupMap.get(closestYear);
    if (group) {
      group.count += 1;
      monument.poets.forEach((poet) => group.poetIds.add(poet.id));
    }
  });

  let cumulativeMonuments = 0;
  const cumulativePoets = new Set<number>();

  return years.map((year) => {
    const group = yearGroupMap.get(year) ?? {
      count: 0,
      poetIds: new Set<number>(),
    };
    const { count, poetIds } = group;

    cumulativeMonuments += count;
    poetIds.forEach((id) => cumulativePoets.add(id));

    return {
      year,
      events: HISTORICAL_EVENTS[year] || '',
      monuments: cumulativeMonuments,
      poets: cumulativePoets.size,
    };
  });
}
