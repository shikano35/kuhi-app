import { NextRequest, NextResponse } from 'next/server';
import { simpleFetch, createErrorResponse } from '@/lib/api-utils';

const KUHI_API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhi.jp';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const targetUrl = `${KUHI_API_BASE_URL}/monuments${queryString ? `?${queryString}` : ''}`;

    console.log(`Fetching monuments from: ${targetUrl}`);

    const response = await simpleFetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(
        `API request failed - Status: ${response.status}, URL: ${targetUrl}, Response: ${errorText}`
      );
      const errorResponse = createErrorResponse(
        errorText,
        'Failed to fetch monuments'
      );
      return NextResponse.json(errorResponse, {
        status: response.status,
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Monument API proxy error:', error);
    const errorResponse = createErrorResponse(
      error,
      'Failed to fetch monuments'
    );
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
