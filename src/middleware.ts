"use server"

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateSession } from '@/lib/session';

// Routes qui ne nécessitent pas d'authentification (route non protégée par le middleware) 
// #OWASP A1 (Injection) | #OWASP A6 (Sécurité des composants)
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
      const user = await validateSession(sessionToken); // Si la session est valide, l'utilisateur est authentifié #OWASP A7 (Validation des entrées)
      isAuthenticated = !user;
    } catch (error) {
      console.error("Erreur lors de la validation de la session:", error);
    }
  }

  // Vérifier si la route actuelle est une route publique #OWASP A1 (Injection)
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(route + "/")
  );

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée | #OWASP A1 (Injection) | #OWASP A6 (Sécurité des composants)
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}