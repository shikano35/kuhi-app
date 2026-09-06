import { describe, expect, test, vi, beforeEach } from 'vitest';
import {
  toExportRow,
  toCsv,
  toJsonLines,
  exportFileName,
  fetchAllMonumentsForExport,
  EXPORT_COLUMNS,
} from '@/lib/monument-export';
import { getMonuments } from '@/lib/kuhi-api';
import type { MonumentWithRelations } from '@/types/definitions/api';
import { mockHaikuMonuments } from './monument-fixture';

vi.mock('@/lib/kuhi-api', () => ({ getMonuments: vi.fn() }));

const monument = mockHaikuMonuments[0];

describe('toExportRow', () => {
  test('句碑のページURLをidから組み立てること', () => {
    expect(toExportRow(monument).page_url).toBe(
      `https://kuhi.jp/monument/${monument.id}`
    );
  });

  test('全ての列が文字列で埋まること', () => {
    const row = toExportRow(monument);
    for (const column of EXPORT_COLUMNS) {
      expect(typeof row[column]).toBe('string');
    }
  });

  test('関連が空でも例外にならないこと', () => {
    const empty = {
      ...monument,
      inscriptions: [],
      events: [],
      media: [],
      locations: [],
      poets: [],
      sources: [],
    } satisfies MonumentWithRelations;

    expect(toExportRow(empty).inscription_text).toBe('');
    expect(toExportRow(empty).prefecture).toBe('');
  });
});

describe('toCsv', () => {
  test('BOM付きで、ヘッダーが列定義と一致すること', () => {
    const csv = toCsv([monument]);
    expect(csv.startsWith('﻿')).toBe(true);
    expect(csv.slice(1).split('\r\n')[0]).toBe(EXPORT_COLUMNS.join(','));
  });

  test('カンマ・引用符・改行を含む値をエスケープすること', () => {
    const tricky = {
      ...monument,
      canonical_name: 'あ,い"う\nえ',
    } satisfies MonumentWithRelations;

    expect(toCsv([tricky])).toContain('"あ,い""う\nえ"');
  });

  test('数式として解釈されうる値を無害化すること', () => {
    const injected = {
      ...monument,
      canonical_name: '=SUM(A1:A2)',
    } satisfies MonumentWithRelations;

    expect(toCsv([injected])).toContain("'=SUM(A1:A2)");
  });
});

describe('toJsonLines', () => {
  test('1行1件で、入れ子構造を保持すること', () => {
    const lines = toJsonLines(mockHaikuMonuments).trim().split('\n');
    expect(lines).toHaveLength(mockHaikuMonuments.length);
    expect(JSON.parse(lines[0])).toEqual(mockHaikuMonuments[0]);
  });
});

describe('exportFileName', () => {
  test('取得日を含む名前にすること', () => {
    expect(exportFileName('csv', new Date('2026-09-06T00:00:00Z'))).toBe(
      'kuhi-monuments-2026-09-06.csv'
    );
  });
});

describe('fetchAllMonumentsForExport', () => {
  beforeEach(() => {
    vi.mocked(getMonuments).mockReset();
  });

  test('上限未満のページが返るまで取得し、id順に整列すること', async () => {
    const page = (start: number, count: number) =>
      Array.from({ length: count }, (_, index) => ({
        ...monument,
        id: start + index,
      }));

    vi.mocked(getMonuments).mockImplementation(async (params = {}) => {
      const offset = params.offset ?? 0;
      return offset < 100 ? page(offset, 100) : page(offset, 0);
    });

    const result = await fetchAllMonumentsForExport();

    expect(result).toHaveLength(100);
    expect(result[0].id).toBe(0);
    expect(result.at(-1)?.id).toBe(99);
  });
});
