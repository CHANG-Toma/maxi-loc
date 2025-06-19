'use server'

import { prisma } from '@/lib/prisma'
import { validateSession } from "@/lib/session";
import { cookies } from 'next/headers';

// Type pour les objets charge retournés par Prisma
type PrismaCharge = {
  id_charge: number;
  propriete: { id_propriete: number; nom: string };
  date_paiement: Date;
  montant: number;
  typeCharge: { id_type_charge: number; libelle: string };
  description: string | null;
};

interface ChargeData {
  id_propriete: number;
  date_paiement: string;
  montant: number;
  id_type_charge: number;
  description?: string;
}

export async function getCharges() {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    return { success: false, error: "Vous devez être connecté pour voir les charges" };
  }

  try {
    const user = await validateSession(token);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    const charges = await prisma.charge.findMany({
      where: {
        propriete: {
          id_utilisateur: user.id_utilisateur
        }
      },
      include: {
        propriete: {
          select: {
            id_propriete: true,
            nom: true
          }
        },
        typeCharge: {
          select: {
            id_type_charge: true,
            libelle: true
          }
        }
      },
      orderBy: {
        date_paiement: 'desc'
      }
    });

    const formattedCharges = charges.map((charge: PrismaCharge) => ({
      id_charge: charge.id_charge,
      propriete: {
        id_propriete: charge.propriete.id_propriete,
        nom: charge.propriete.nom
      },
      date_paiement: charge.date_paiement.toISOString(),
      montant: charge.montant,
      type_charge: {
        id_type_charge: charge.typeCharge.id_type_charge,
        libelle: charge.typeCharge.libelle
      },
      description: charge.description
    }));

    return { success: true, charges: formattedCharges };
  } catch (error) {
    console.error("Erreur lors de la récupération des charges:", error);
    return { success: false, error: "Une erreur est survenue lors de la récupération des charges" };
  }
}

// Créer une charge
export async function createCharge(data: ChargeData) {
  const token = (await cookies()).get('session')?.value;

  // Vérifier que le token est présent
  if (!token) {
    return { success: false, error: "Vous devez être connecté pour créer une charge" };
  }

  try {
    // Vérifier que la session est valide
    const user = await validateSession(token);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    // Vérifier que la propriété appartient à l'utilisateur
    const propriete = await prisma.propriete.findUnique({
      where: { id_propriete: data.id_propriete }
    });

    // Vérifier que la propriété appartient à l'utilisateur
    if (!propriete || propriete.id_utilisateur !== user.id_utilisateur) {
      return { success: false, error: "Vous n'avez pas les droits pour cette propriété" };
    }

    // Créer la charge dans la base de données via prisma
    const charge = await prisma.charge.create({
      data: {
        id_propriete: data.id_propriete,
        date_paiement: new Date(data.date_paiement),
        montant: data.montant,
        id_type_charge: Number(data.id_type_charge),
        description: data.description
      },
      include: {
        propriete: true,
        typeCharge: true,
      },
    });

    return { success: true, charge };
  } catch (error) {
    console.error("Erreur lors de la création de la charge:", error);
    return { success: false, error: "Une erreur est survenue lors de la création de la charge" };
  }
}

export async function updateCharge(id: number, data: ChargeData) {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    return { success: false, error: "Vous devez être connecté pour modifier une charge" };
  }

  try {
    const user = await validateSession(token);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    // Vérifier que la propriété appartient à l'utilisateur
    const propriete = await prisma.propriete.findUnique({
      where: { id_propriete: data.id_propriete }
    });

    if (!propriete || propriete.id_utilisateur !== user.id_utilisateur) {
      return { success: false, error: "Vous n'avez pas les droits pour cette propriété" };
    }

    const charge = await prisma.charge.update({
      where: { id_charge: id },
      data: {
        id_propriete: data.id_propriete,
        date_paiement: new Date(data.date_paiement),
        montant: data.montant,
        id_type_charge: Number(data.id_type_charge),
        description: data.description
      },
      include: {
        propriete: true,
        typeCharge: true,
      },
    });

    return { success: true, charge };
  } catch (error) {
    console.error("Erreur lors de la modification de la charge:", error);
    return { success: false, error: "Une erreur est survenue lors de la modification de la charge" };
  }
}

export async function deleteCharge(id: number) {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    return { success: false, error: "Vous devez être connecté pour supprimer une charge" };
  }

  try {
    const user = await validateSession(token);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    // Vérifier que la charge appartient à une propriété de l'utilisateur
    const charge = await prisma.charge.findUnique({
      where: { id_charge: id },
      include: { propriete: true }
    });

    if (!charge || charge.propriete.id_utilisateur !== user.id_utilisateur) {
      return { success: false, error: "Vous n'avez pas les droits pour cette charge" };
    }

    await prisma.charge.delete({
      where: { id_charge: id }
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la charge:", error);
    return { success: false, error: "Une erreur est survenue lors de la suppression de la charge" };
  }
}

export async function getTypeCharges() {
  try {
    const typeCharges = await prisma.typeCharge.findMany({
      select: {
        id_type_charge: true,
        libelle: true
      },
      orderBy: {
        id_type_charge: 'asc'
      }
    });

    return { success: true, typeCharges };
  } catch (error) {
    console.error("Erreur lors de la récupération des types de charges:", error);
    return { success: false, error: "Une erreur est survenue lors de la récupération des types de charges" };
  }
}
