import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Base64URL to Base64
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if necessary
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    
    const payload = atob(base64);
    return JSON.parse(payload);
  } catch (err) {
    console.error("[PROXY] Decode error:", err);
    return null;
  }
}

export function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Protect Admin Routes - check both session existence AND admin role
  if (pathname.startsWith('/admin')) {
    // Let the admin login page through
    if (pathname === '/admin/login') {
      if (session) {
        const payload = decodeJwtPayload(session);
        if (payload && (payload.role === 'admin' || payload.role === 'superadmin')) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }
      return NextResponse.next();
    }

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Decode JWT and verify admin role
    const payload = decodeJwtPayload(session);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'superadmin')) {
      // User is logged in but not admin — redirect to homepage
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect from login/register if already logged in
  if ((pathname === '/login' || pathname === '/register') && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/register',
    '/admin/login',
  ],
};
