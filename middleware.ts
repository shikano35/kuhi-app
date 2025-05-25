import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    console.log('Auth token in middleware:', token);

    if (!token || token.role !== 'admin') {
      const url = new URL('/api/auth/signin', req.url);
      url.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
