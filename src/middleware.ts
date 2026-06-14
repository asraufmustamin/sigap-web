import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const adminToken = request.cookies.get('admin_token')?.value;
  const wargaToken = request.cookies.get('warga_token')?.value;

  // --- Admin Routes ---
  if (path === '/') {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (path === '/login') {
    if (adminToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // --- Warga Routes ---
  const isProtectedWargaRoute = path.startsWith('/warga/home') || 
                                path.startsWith('/warga/lapor') || 
                                path.startsWith('/warga/riwayat') ||
                                path.startsWith('/warga/(main)'); // In case route group path leaks

  if (isProtectedWargaRoute) {
    if (!wargaToken) {
      return NextResponse.redirect(new URL('/warga/login', request.url));
    }
  }

  const isAuthWargaRoute = path === '/warga/login' || path === '/warga/register';
  if (isAuthWargaRoute) {
    if (wargaToken) {
      return NextResponse.redirect(new URL('/warga/home', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/warga/home/:path*',
    '/warga/lapor/:path*',
    '/warga/riwayat/:path*',
    '/warga/login',
    '/warga/register'
  ]
};
