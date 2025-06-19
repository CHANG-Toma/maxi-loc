'use server'

import { prisma } from '@/lib/prisma'
import { validateSession } from "@/lib/session";
import { cookies } from 'next/headers';

export async function getPlateformes() {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    return { success: false, error: "Vous devez être connecté pour voir les plateformes" };
  }

  try {
    const user = await validateSession(token);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    const plateformes = await prisma.plateforme.findMany();
    return { success: true, plateformes };
  } catch (error) {
    console.error("Erreur lors de la récupération des plateformes:", error);
    return { success: false, error: "Une erreur est survenue lors de la récupération des plateformes" };
  }
}
