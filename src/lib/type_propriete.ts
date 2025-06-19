'use server'

import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/session";
import { cookies } from 'next/headers';

export async function getTypesPropriete() {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    return { success: false, error: "Vous devez être connecté pour voir les types de propriété" };
  }

  try {
    const user = await validateSession(token);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    const types = await prisma.typePropriete.findMany();
    return { success: true, types };
  } catch (error) {
    console.error("Erreur lors de la récupération des types de propriété:", error);
    return { success: false, error: "Une erreur est survenue lors de la récupération des types de propriété" };
  }
}
