import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value;
    const { pathname } = request.nextUrl;

    // Define public routes (no auth required)
    // You might want to include other public paths like /api/public, /images, etc. if needed
    const isAuthRoute = pathname === '/signin' || pathname === '/signup' || pathname === '/reset-password';
    const isPublicAsset = pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.includes('.');

    // If user is accessing a protected route without a token
    if (!token && !isAuthRoute && !isPublicAsset) {
        const url = request.nextUrl.clone();
        url.pathname = '/signin';
        return NextResponse.redirect(url);
    }

    // If user is accessing login/signup with a valid token
    if (token && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
