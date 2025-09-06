import { NextResponse } from 'next/server';
import { simpleFetch, createErrorResponse } from '@/lib/api-utils';
import type { MonumentWithRelations } from '@/types/definitions/api';

const KUHI_API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhi.jp';

export async function GET() {
  try {
    const allMonuments: MonumentWithRelations[] = [];
    const batchSize = 9;
    const limit = 50;

    const promises = Array.from({ length: batchSize }, (_, i) => {
      const offset = i * limit;
      const url = `${KUHI_API_BASE_URL}/monuments?limit=${limit}&offset=${offset}&expand=locations,inscriptions.poems,poets`;

      return simpleFetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 7200 }, // 2時間キャッシュ
      })
        .then(async (response) => {
          if (!response.ok) {
            console.warn(`Failed to fetch batch ${i}: ${response.status}`);
            return [] as MonumentWithRelations[];
          }

          const monuments = (await response.json()) as MonumentWithRelations[];
          if (!Array.isArray(monuments)) {
            console.warn(`Batch ${i} returned non-array data`);
            return [] as MonumentWithRelations[];
          }

          return monuments;
        })
        .catch((error) => {
          console.warn(`Batch ${i} failed:`, error);
          return [] as MonumentWithRelations[];
        });
    });

    const results = await Promise.allSettled(promises);

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allMonuments.push(...result.value);
      }
    });

    const limitedMonuments = allMonuments.slice(0, 800);

    const responseData = {
      monuments: limitedMonuments,
      total: limitedMonuments.length,
      isPartial: limitedMonuments.length === 800,
      message:
        limitedMonuments.length === 800
          ? 'Limited to 800 monuments for map performance'
          : `Map monuments with location data (${limitedMonuments.length} total)`,
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Map monuments API error:', error);
    const errorResponse = createErrorResponse(
      error,
      'Failed to fetch map monuments'
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
