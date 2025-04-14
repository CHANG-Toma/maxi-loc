import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes qui nécessitent une redirection si l'utilisateur est déjà connecté
const authRoutes = ["/login", "/signup"];

// Permet de vérifier la session de l'utilisateur
export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);

  // Si l'utilisateur est connecté et essaie d'accéder à login ou signup
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && !authRoutes.includes(request.nextUrl.pathname) && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configuration des routes à protéger
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