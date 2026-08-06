import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (!token || token.role !== 'admin') {
      const url = new URL('/api/auth/signin', req.url);
      url.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
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
