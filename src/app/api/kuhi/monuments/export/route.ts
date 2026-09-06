import { NextRequest, NextResponse } from 'next/server';
import { getFullMonumentDataset } from '@/lib/monument-dataset';
import { toCsv, toJsonLines, exportFileName } from '@/lib/monument-export';

export const maxDuration = 60;

const FORMATS = ['csv', 'jsonl'] as const;
type Format = (typeof FORMATS)[number];

function isFormat(value: string | null): value is Format {
  return FORMATS.some((format) => format === value);
}

const CONTENT_TYPE: Record<Format, string> = {
  csv: 'text/csv; charset=utf-8',
  jsonl: 'application/jsonl; charset=utf-8',
};

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get('format') ?? 'csv';

  if (!isFormat(format)) {
    return NextResponse.json(
      { error: 'format は csv または jsonl を指定してください' },
      { status: 400 }
    );
  }

  try {
    const monuments = await getFullMonumentDataset();
    const body = format === 'csv' ? toCsv(monuments) : toJsonLines(monuments);

    return new NextResponse(body, {
      headers: {
        'Content-Type': CONTENT_TYPE[format],
        'Content-Disposition': `attachment; filename="${exportFileName(format)}"`,
        'Cache-Control':
          'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        'X-Monument-Count': String(monuments.length),
      },
    });
  } catch (error) {
    console.error('Monument export failed:', error);
    return NextResponse.json(
      { error: 'データの書き出しに失敗しました' },
      { status: 502 }
    );
  }
}
