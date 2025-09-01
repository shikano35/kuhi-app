import { NextResponse } from 'next/server';
import { simpleFetch, createErrorResponse } from '@/lib/api-utils';

const KUHI_API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhi.jp';

export async function GET() {
  try {
    const allMonuments = [];
    let offset = 0;
    const limit = 30;
    let hasMore = true;
    let consecutiveErrors = 0;

    while (hasMore && consecutiveErrors < 3) {
      const url = `${KUHI_API_BASE_URL}/monuments?limit=${limit}&offset=${offset}`;

      try {
        const response = await simpleFetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: 3600 }, // 1時間キャッシュ
        });

        if (!response.ok) {
          consecutiveErrors++;

          if (response.status === 503 || response.status === 429) {
            if (consecutiveErrors < 3) {
              const delay = 2000 * consecutiveErrors;
              await new Promise((resolve) => setTimeout(resolve, delay));
              continue;
            }
            break;
          }

          if (consecutiveErrors >= 3) {
            break;
          }
          continue;
        }

        consecutiveErrors = 0;

        const monuments = await response.json();

        if (monuments.length === 0) {
          hasMore = false;
        } else {
          allMonuments.push(...monuments);
          offset += limit;

          if (monuments.length < limit) {
            hasMore = false;
          }

          if (hasMore) {
            const delay = allMonuments.length > 200 ? 500 : 300;
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }

        if (allMonuments.length >= 1000) {
          hasMore = false;
        }
      } catch {
        consecutiveErrors++;

        if (consecutiveErrors < 3) {
          const delay = 3000 * consecutiveErrors;
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          break;
        }
      }
    }

    const responseData = {
      monuments: allMonuments,
      total: allMonuments.length,
      isPartial: consecutiveErrors > 0 || allMonuments.length >= 1000,
      message:
        consecutiveErrors > 0
          ? 'Partial data due to API errors'
          : allMonuments.length >= 1000
            ? 'Partial data due to limit'
            : 'Complete data',
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400', // 30分キャッシュに短縮
      },
    });
  } catch (error) {
    const errorResponse = createErrorResponse(
      error,
      'Failed to fetch all monuments'
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
