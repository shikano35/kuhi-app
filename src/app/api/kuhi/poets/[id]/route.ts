import { NextRequest, NextResponse } from 'next/server';
import { simpleFetch, createErrorResponse } from '@/lib/api-utils';

const KUHI_API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhi.jp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await simpleFetch(`${KUHI_API_BASE_URL}/poets/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 7200 }, // 2時間キャッシュ
    });

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      const errorResponse = createErrorResponse(
        response,
        'Failed to fetch poet'
      );
      return NextResponse.json(errorResponse, {
        status:
          response.status === 503 || response.status === 429
            ? response.status
            : 500,
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Poet API proxy error:', error);
    const errorResponse = createErrorResponse(error, 'Failed to fetch poet');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
