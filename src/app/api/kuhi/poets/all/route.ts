import { NextResponse } from 'next/server';
import { simpleFetch, createErrorResponse } from '@/lib/api-utils';

const KUHI_API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhi.jp';

export async function GET() {
  try {
    const allPoets = [];
    let offset = 0;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      const url = `${KUHI_API_BASE_URL}/poets?limit=${limit}&offset=${offset}`;

      const response = await simpleFetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 7200 },
      });

      if (!response.ok) {
        if (response.status === 503 || response.status === 429) {
          break;
        }

        const errorResponse = createErrorResponse(
          response,
          'Failed to fetch all poets'
        );
        return NextResponse.json(errorResponse, { status: response.status });
      }

      const poets = await response.json();

      if (poets.length === 0) {
        hasMore = false;
      } else {
        allPoets.push(...poets);
        offset += limit;

        if (poets.length < limit) {
          hasMore = false;
        }

        if (hasMore) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }
    }

    return NextResponse.json(allPoets, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    const errorResponse = createErrorResponse(
      error,
      'Failed to fetch all poets'
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
