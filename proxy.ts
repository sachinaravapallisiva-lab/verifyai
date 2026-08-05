import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeSession, SESSION_COOKIE } from '@/lib/session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === '/login') {
    if (session) {
      return NextResponse.redirect(new URL('/rep', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin')) {
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: session ? 403 : 401 });
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/admin') && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/rep', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/rep/:path*', '/admin/:path*', '/api/admin/:path*'],
};
