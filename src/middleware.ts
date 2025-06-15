import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/sign-in', '/sign-up'];
const PRIVATE_PATHS = ['/', '/dashboard'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const refreshToken = req.cookies.get('refreshToken');

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const isPrivate = PRIVATE_PATHS.includes(pathname);

  const isAuthenticated = !!refreshToken;

  // Авторизованный пользователь
  if (isAuthenticated) {
    // Если он пытается зайти на /sign-in или /sign-up — редиректим на /dashboard
    if (!isPrivate) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Разрешаем доступ к разрешённым страницам
    return NextResponse.next();
  }

  // Неавторизованный пользователь
  if (!isPublic) {
    // Пытается попасть в /dashboard, /profile, и т.д.
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Разрешаем публичные страницы
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
