import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateSession } from '@/lib/session';

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/forgotpassword",
  "/legal/mentions-legales",
  "/legal/politique-confidentialite",
  "/legal/cgu",
  "/legal/accessibilite"
];

// Permet de vérifier la session de l'utilisateur
export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;
  let isAuthenticated = false;

  if (sessionToken) {
    try {
      const user = await validateSession(sessionToken);
      isAuthenticated = !!user;
    } catch (error) {
      console.error("Erreur lors de la validation de la session:", error);
    }
  }

  // Vérifier si la route actuelle est une route publique
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(route + "/")
  );

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!isAuthenticated && !isPublicRoute) {
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