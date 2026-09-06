import type { MonumentWithRelations, Source } from '@/types/definitions/api';

export type Ranked = { name: string; count: number; share: number };
export type Period = { label: string; count: number };
export type SourceUsage = {
  citation: string;
  url: string | null;
  count: number;
};

export type MonumentStats = {
  total: number;
  prefectureCount: number;
  topPrefectures: Ranked[];
  topPoets: Ranked[];
  withEstablishedYear: number;
  oldestEstablishedYear: number | null;
  newestEstablishedYear: number | null;
  periods: Period[];
  sourceCount: number;
  topSources: SourceUsage[];
  lastUpdated: string | null;
};

const PERIODS: { label: string; from: number; to: number }[] = [
  { label: '江戸期（〜1867年）', from: -Infinity, to: 1867 },
  { label: '明治〜昭和戦前（1868〜1945年）', from: 1868, to: 1945 },
  { label: '戦後（1946〜1999年）', from: 1946, to: 1999 },
  { label: '2000年以降', from: 2000, to: Infinity },
];

function rank(counts: Map<string, number>, total: number, limit: number) {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({
      name,
      count,
      share: total === 0 ? 0 : count / total,
    }));
}

function increment(
  counts: Map<string, number>,
  key: string | null | undefined
) {
  if (!key) return;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function sourcesOf(monument: MonumentWithRelations): Source[] {
  const found = new Map<number, Source>();
  for (const inscription of monument.inscriptions ?? []) {
    if (inscription.source)
      found.set(inscription.source.id, inscription.source);
  }
  for (const event of monument.events ?? []) {
    if (event.source) found.set(event.source.id, event.source);
  }
  for (const source of monument.sources ?? []) {
    found.set(source.id, source);
  }
  return [...found.values()];
}

function establishedYear(monument: MonumentWithRelations): number | null {
  const start = monument.events?.find(
    (event) => event.event_type === 'erected'
  )?.interval_start;
  if (!start) return null;
  const year = Number(start.slice(0, 4));
  return Number.isFinite(year) ? year : null;
}

export function buildMonumentStats(
  monuments: MonumentWithRelations[]
): MonumentStats {
  const total = monuments.length;
  const prefectures = new Map<string, number>();
  const poets = new Map<string, number>();
  const sources = new Map<string, SourceUsage>();
  const years: number[] = [];

  let lastUpdated: string | null = null;

  for (const monument of monuments) {
    increment(prefectures, monument.locations?.[0]?.prefecture);

    for (const poet of monument.poets ?? []) {
      increment(poets, poet.name);
    }

    for (const source of sourcesOf(monument)) {
      const existing = sources.get(source.citation);
      sources.set(source.citation, {
        citation: source.citation,
        url: source.url ?? existing?.url ?? null,
        count: (existing?.count ?? 0) + 1,
      });
    }

    const year = establishedYear(monument);
    if (year !== null) years.push(year);

    const updated = monument.updated_at;
    if (updated && (!lastUpdated || updated > lastUpdated)) {
      lastUpdated = updated;
    }
  }

  return {
    total,
    prefectureCount: prefectures.size,
    topPrefectures: rank(prefectures, total, 5),
    topPoets: rank(poets, total, 5),
    withEstablishedYear: years.length,
    oldestEstablishedYear: years.length ? Math.min(...years) : null,
    newestEstablishedYear: years.length ? Math.max(...years) : null,
    periods: PERIODS.map(({ label, from, to }) => ({
      label,
      count: years.filter((year) => year >= from && year <= to).length,
    })),
    sourceCount: sources.size,
    topSources: [...sources.values()]
      .sort((a, b) => b.count - a.count || a.citation.localeCompare(b.citation))
      .slice(0, 8),
    lastUpdated,
  };
}
