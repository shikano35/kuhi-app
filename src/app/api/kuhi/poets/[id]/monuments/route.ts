import { NextRequest, NextResponse } from 'next/server';

const KUHI_API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhi.jp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await fetch(`${KUHI_API_BASE_URL}/poets/${id}/monuments`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Poet monuments API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poet monuments' },
      { status: 500 }
    );
  }
}
