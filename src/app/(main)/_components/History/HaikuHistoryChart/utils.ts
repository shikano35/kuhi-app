import { MonumentWithRelations } from '@/types/definitions/api';

export type HistoryDataPoint = {
  year: number;
  events: string;
  monuments: number;
  poets: number;
};

const START_YEAR = 1700;
const END_YEAR = 2025;
const INTERVAL = 25;

const years: number[] = [];
for (let y = START_YEAR; y <= END_YEAR; y += INTERVAL) {
  years.push(y);
}

export const HISTORICAL_EVENTS: Record<number, string> = {
  1700: '蕉風の定着と流派化',
  1725: '中期俳諧の動き',
  1750: '与謝蕪村の活躍期',
  1775: '蕪村以後の展開',
  1800: '小林一茶の活躍期',
  1825: '近世俳句の変化点',
  1850: '幕末の動乱',
  1875: '明治期の俳句革新の萌芽',
  1900: '正岡子規らによる近代化運動',
  1925: '大正〜昭和初期の変容',
  1950: '戦後の多様化と復興',
  1975: 'モダン俳句の展開',
  2000: '国際俳句の普及',
  2025: '現在',
};

export function processHistoryData(
  monuments: MonumentWithRelations[]
): HistoryDataPoint[] {
  const yearGroupMap: Map<number, { count: number; poetIds: Set<number> }> =
    new Map();
  years.forEach((year) => {
    yearGroupMap.set(year, { count: 0, poetIds: new Set() });
  });

  monuments.forEach((monument) => {
    let establishedYear: number | null = null;

    if (monument.events && monument.events.length > 0) {
      const erectEvent = monument.events.find(
        (event) => event.event_type === 'erected'
      );
      if (erectEvent && erectEvent.interval_start) {
        const yearMatch = erectEvent.interval_start.match(/(\d{4})/);
        if (yearMatch) {
          establishedYear = parseInt(yearMatch[1], 10);
        }
      }
    }

    if (!establishedYear) return;

    const offset = establishedYear - START_YEAR;
    const bucketIndex = Math.round(offset / INTERVAL);
    const closestYear = START_YEAR + bucketIndex * INTERVAL;

    const group = yearGroupMap.get(closestYear);
    if (group) {
      group.count += 1;
      if (monument.poets && monument.poets.length > 0) {
        monument.poets.forEach((poet) => group.poetIds.add(poet.id));
      }
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
