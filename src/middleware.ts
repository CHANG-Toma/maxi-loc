"use server"

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


// Permet de vérifier la session de l'utilisateur
export async function middleware(request: NextRequest) {


  return NextResponse.next();
}