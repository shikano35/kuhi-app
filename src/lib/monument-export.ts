import { getMonuments } from '@/lib/kuhi-api';
import type {
  MonumentWithRelations,
  Poet,
  Location,
  Media,
  Event as MonumentEvent,
  Source,
} from '@/types/definitions/api';

const PAGE_SIZE = 100;
const CONCURRENCY = 4;
const MAX_PAGES = 100;

export const EXPORT_SEPARATOR = ' | ';

export async function fetchAllMonumentsForExport(): Promise<
  MonumentWithRelations[]
> {
  const monuments: MonumentWithRelations[] = [];

  for (let batch = 0; batch < MAX_PAGES; batch += CONCURRENCY) {
    const pages = await Promise.all(
      Array.from({ length: CONCURRENCY }, (_, index) =>
        getMonuments({ limit: PAGE_SIZE, offset: (batch + index) * PAGE_SIZE })
      )
    );

    for (const page of pages) {
      monuments.push(...page);
    }

    if (pages.some((page) => page.length < PAGE_SIZE)) {
      break;
    }
  }

  return monuments.sort((a, b) => a.id - b.id);
}

function join(values: (string | number | null | undefined)[]): string {
  const kept = values.filter(
    (value): value is string | number =>
      value !== null && value !== undefined && value !== ''
  );
  return kept.join(EXPORT_SEPARATOR);
}

function erectedEvent(
  monument: MonumentWithRelations
): MonumentEvent | undefined {
  return monument.events?.find((event) => event.event_type === 'erected');
}

function primarySource(
  monument: MonumentWithRelations
): Source | null | undefined {
  return (
    monument.inscriptions?.[0]?.source ??
    erectedEvent(monument)?.source ??
    monument.sources?.[0]
  );
}

export const EXPORT_COLUMNS = [
  'id',
  'name',
  'page_url',
  'api_url',
  'monument_type',
  'material',
  'inscription_text',
  'inscription_side',
  'inscription_reading',
  'inscription_notes',
  'poem_text',
  'kigo',
  'season',
  'poet_name',
  'poet_name_kana',
  'poet_birth_year',
  'poet_death_year',
  'region',
  'prefecture',
  'municipality',
  'place_name',
  'latitude',
  'longitude',
  'established_start',
  'established_end',
  'established_actor',
  'established_note',
  'photo_url',
  'photographer',
  'photo_license',
  'source_citation',
  'source_url',
  'is_reliable',
  'verification_status',
  'created_at',
  'updated_at',
] as const;

export type ExportColumn = (typeof EXPORT_COLUMNS)[number];
export type ExportRow = Record<ExportColumn, string>;

function text(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

export function toExportRow(monument: MonumentWithRelations): ExportRow {
  const inscription = monument.inscriptions?.[0];
  const poems =
    monument.inscriptions?.flatMap((item) => item.poems ?? []) ?? [];
  const poets: Poet[] = monument.poets ?? [];
  const location: Location | undefined = monument.locations?.[0];
  const media: Media[] = monument.media ?? [];
  const erected = erectedEvent(monument);
  const source = primarySource(monument);

  return {
    id: text(monument.id),
    name: text(monument.canonical_name),
    page_url: `https://kuhi.jp/monument/${monument.id}`,
    api_url: text(monument.canonical_uri),
    monument_type: text(monument.monument_type),
    material: text(monument.material),
    inscription_text: text(inscription?.original_text),
    inscription_side: text(inscription?.side),
    inscription_reading: text(inscription?.reading),
    inscription_notes: text(inscription?.notes),
    poem_text: join(poems.map((poem) => poem.text)),
    kigo: join(poems.map((poem) => poem.kigo)),
    season: join(poems.map((poem) => poem.season)),
    poet_name: join(poets.map((poet) => poet.name)),
    poet_name_kana: join(poets.map((poet) => poet.name_kana)),
    poet_birth_year: join(poets.map((poet) => poet.birth_year)),
    poet_death_year: join(poets.map((poet) => poet.death_year)),
    region: text(location?.region),
    prefecture: text(location?.prefecture),
    municipality: text(location?.municipality),
    place_name: text(location?.place_name),
    latitude: text(location?.latitude),
    longitude: text(location?.longitude),
    established_start: text(erected?.interval_start),
    established_end: text(erected?.interval_end),
    established_actor: text(erected?.actor),
    established_note: text(erected?.uncertainty_note),
    photo_url: join(media.map((item) => item.url)),
    photographer: join(media.map((item) => item.photographer)),
    photo_license: join(media.map((item) => item.license)),
    source_citation: text(source?.citation),
    source_url: text(source?.url),
    is_reliable: text(monument.is_reliable),
    verification_status: text(monument.verification_status),
    created_at: text(monument.created_at),
    updated_at: text(monument.updated_at),
  };
}

const FORMULA_PREFIXES = ['=', '+', '-', '@', '\t', '\r'];

function escapeCsvCell(value: string): string {
  const guarded = FORMULA_PREFIXES.some((prefix) => value.startsWith(prefix))
    ? `'${value}`
    : value;

  return /[",\r\n]/.test(guarded)
    ? `"${guarded.replace(/"/g, '""')}"`
    : guarded;
}

const BOM = '﻿';

export function toCsv(monuments: MonumentWithRelations[]): string {
  const lines = [
    EXPORT_COLUMNS.join(','),
    ...monuments.map((monument) => {
      const row = toExportRow(monument);
      return EXPORT_COLUMNS.map((column) => escapeCsvCell(row[column])).join(
        ','
      );
    }),
  ];

  return BOM + lines.join('\r\n') + '\r\n';
}

export function toJsonLines(monuments: MonumentWithRelations[]): string {
  return (
    monuments.map((monument) => JSON.stringify(monument)).join('\n') + '\n'
  );
}

export function exportFileName(format: 'csv' | 'jsonl', date = new Date()) {
  const stamp = date.toISOString().slice(0, 10);
  return `kuhi-monuments-${stamp}.${format}`;
}
