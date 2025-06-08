import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const runtime = 'edge';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

function cleanup() {
  const now = Date.now();
  for (const [ip, info] of rateLimit) {
    if (info.resetTime <= now) rateLimit.delete(ip);
  }
}

function isRateLimited(ip: string): boolean {
  cleanup();

  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxReq = 100;

  const info = rateLimit.get(ip);
  if (!info) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > info.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (info.count >= maxReq) {
    return true;
  }

  info.count++;
  return false;
}

export async function middleware(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (req.nextUrl.pathname.startsWith('/api/')) {
    if (isRateLimited(ip)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: { 'Retry-After': String(15 * 60) },
      });
    }
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token || token.role !== 'admin') {
      const url = new URL('/api/auth/signin', req.url);
      url.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'index, follow');
  res.headers.set('X-DNS-Prefetch-Control', 'on');
  res.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  return res;
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};
