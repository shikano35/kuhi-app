import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { POST } from '@/app/api/revalidate/route';

vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }));

const SECRET = 'test-secret-value';

function request(options: { secret?: string; tag?: string } = {}) {
  const url = new URL('http://localhost/api/revalidate');
  if (options.tag) url.searchParams.set('tag', options.tag);

  return new NextRequest(url, {
    method: 'POST',
    headers: options.secret
      ? { authorization: `Bearer ${options.secret}` }
      : undefined,
  });
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.mocked(revalidateTag).mockClear();
    process.env.REVALIDATE_SECRET = SECRET;
  });

  afterEach(() => {
    delete process.env.REVALIDATE_SECRET;
  });

  test('シークレット未設定なら503を返し、再検証しないこと', async () => {
    delete process.env.REVALIDATE_SECRET;
    const response = await POST(request({ secret: SECRET }));

    expect(response.status).toBe(503);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  test('認証情報がなければ401を返すこと', async () => {
    const response = await POST(request());

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  test('シークレットが一致しなければ401を返すこと', async () => {
    const response = await POST(request({ secret: 'wrong-secret-value' }));

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  test('tag未指定なら対象タグをすべて再検証すること', async () => {
    const response = await POST(request({ secret: SECRET }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.revalidated).toContain('haiku-monuments');
    expect(body.revalidated).toContain('poets');
    expect(revalidateTag).toHaveBeenCalledTimes(body.revalidated.length);
  });

  test('tagを指定すればそのタグだけ再検証すること', async () => {
    const response = await POST(request({ secret: SECRET, tag: 'poets' }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.revalidated).toEqual(['poets']);
    expect(revalidateTag).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledWith('poets');
  });

  test('許可していないtagは400で拒否すること', async () => {
    const response = await POST(
      request({ secret: SECRET, tag: 'arbitrary-tag' })
    );

    expect(response.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
