import { describe, expect, test } from 'vitest';
import { buildMonumentStats } from '@/lib/monument-stats';
import type {
  MonumentWithRelations,
  Event as MonumentEvent,
  Source,
} from '@/types/definitions/api';
import { mockHaikuMonuments } from './monument-fixture';

const base = mockHaikuMonuments[0];

function monument(overrides: Partial<MonumentWithRelations>) {
  return { ...base, ...overrides } satisfies MonumentWithRelations;
}

const source: Source = {
  id: 1,
  citation: '三重県庁 『俳句のくに・三重』 三重県庁 2011',
  author: '三重県庁',
  title: '俳句のくに・三重',
  publisher: '三重県庁',
  source_year: 2011,
  url: 'https://www.bunka.pref.mie.lg.jp/haiku/',
  created_at: '2025-05-11 15:54:14',
  updated_at: '2025-05-11 15:54:14',
};

function erectedAt(year: number): MonumentEvent {
  return {
    id: year,
    event_type: 'erected',
    hu_time_normalized: null,
    interval_start: `${year}-01-01`,
    interval_end: `${year}-12-31`,
    uncertainty_note: null,
    actor: null,
    source,
  };
}

describe('buildMonumentStats', () => {
  test('都道府県ごとの件数と割合を集計すること', () => {
    const stats = buildMonumentStats([
      monument({ locations: [{ ...base.locations[0], prefecture: '三重県' }] }),
      monument({ locations: [{ ...base.locations[0], prefecture: '三重県' }] }),
      monument({ locations: [{ ...base.locations[0], prefecture: '鳥取県' }] }),
    ]);

    expect(stats.total).toBe(3);
    expect(stats.prefectureCount).toBe(2);
    expect(stats.topPrefectures[0]).toMatchObject({ name: '三重県', count: 2 });
    expect(stats.topPrefectures[0].share).toBeCloseTo(2 / 3);
  });

  test('建立年を時代区分ごとに振り分けること', () => {
    const erected = (year: number) => [
      {
        ...base.events[0],
        event_type: 'erected',
        interval_start: `${year}-01-01`,
      },
    ];
    const stats = buildMonumentStats([
      monument({ events: erected(1743) }),
      monument({ events: erected(1937) }),
      monument({ events: erected(1980) }),
      monument({ events: erected(2005) }),
    ]);

    expect(stats.withEstablishedYear).toBe(4);
    expect(stats.oldestEstablishedYear).toBe(1743);
    expect(stats.newestEstablishedYear).toBe(2005);
    expect(stats.periods.map((period) => period.count)).toEqual([1, 1, 1, 1]);
  });

  test('建立以外のイベントを建立年として数えないこと', () => {
    const stats = buildMonumentStats([
      monument({
        events: [
          {
            ...base.events[0],
            event_type: 'relocated',
            interval_start: '1990-01-01',
          },
        ],
      }),
    ]);

    expect(stats.withEstablishedYear).toBe(0);
    expect(stats.oldestEstablishedYear).toBeNull();
  });

  test('碑文と建立イベントで同じ出典を指していても句碑単位で1件と数えること', () => {
    const stats = buildMonumentStats([
      monument({
        inscriptions: [{ ...base.inscriptions[0], source }],
        events: [erectedAt(1937)],
        sources: [source],
      }),
    ]);

    expect(stats.sourceCount).toBe(1);
    expect(stats.topSources[0]).toMatchObject({
      citation: source.citation,
      url: source.url,
      count: 1,
    });
  });

  test('関連が空でも例外にならないこと', () => {
    const stats = buildMonumentStats([
      monument({
        inscriptions: [],
        events: [],
        media: [],
        locations: [],
        poets: [],
        sources: [],
        material: null,
      }),
    ]);

    expect(stats.total).toBe(1);
    expect(stats.prefectureCount).toBe(0);
    expect(stats.sourceCount).toBe(0);
    expect(stats.withEstablishedYear).toBe(0);
    expect(stats.lastUpdated).toBe(base.updated_at);
  });

  test('最終更新日に最も新しい updated_at を採ること', () => {
    const stats = buildMonumentStats([
      monument({ updated_at: '2025-01-01 00:00:00' }),
      monument({ updated_at: '2026-09-06 00:00:00' }),
    ]);

    expect(stats.lastUpdated).toBe('2026-09-06 00:00:00');
  });
});
