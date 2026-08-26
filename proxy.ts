import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeSession, hasProductAccess, SESSION_COOKIE } from '@/lib/session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  const productSession = hasProductAccess(session) ? session : null;

  if (pathname === '/login') {
    if (productSession) {
      return NextResponse.redirect(new URL('/rep', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin')) {
    if (!productSession || productSession.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: productSession ? 403 : 401 });
    }
    return NextResponse.next();
  }

  if (!productSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/admin') && productSession.role !== 'admin') {
    return NextResponse.redirect(new URL('/rep', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/rep/:path*', '/admin/:path*', '/api/admin/:path*'],
};
