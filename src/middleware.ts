"use server"

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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


  return NextResponse.next();
}