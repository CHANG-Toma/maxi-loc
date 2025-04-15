'use server'

import { prisma } from '@/lib/prisma'
import { validateSession } from "@/lib/session";
import { cookies } from 'next/headers';

export async function getChargesParMois() {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    return { success: false, error: "Vous devez être connecté pour voir les rapports" };
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
        propriete: true,
        typeCharge: true,
      },
    });

    // Grouper les charges par mois
    const chargesParMois = charges.reduce((acc, charge) => {
      const date = new Date(charge.date_paiement);
      const mois = date.toLocaleString('fr-FR', { month: 'short' });
      
      if (!acc[mois]) {
        acc[mois] = 0;
      }
      acc[mois] += charge.montant;
      return acc;
    }, {} as Record<string, number>);

    // Convertir en format pour le graphique
    const data = Object.entries(chargesParMois).map(([name, montant]) => ({
      name,
      montant
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors de la récupération des charges par mois:", error);
    return { success: false, error: "Une erreur est survenue lors de la récupération des données" };
  }
}

export async function getChargesParType() {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    return { success: false, error: "Vous devez être connecté pour voir les rapports" };
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
        propriete: true,
        typeCharge: true,
      },
    });

    // Grouper les charges par type
    const chargesParType = charges.reduce((acc, charge) => {
      const type = charge.typeCharge.libelle;
      
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += charge.montant;
      return acc;
    }, {} as Record<string, number>);

    // Convertir en format pour le graphique
    const data = Object.entries(chargesParType).map(([name, value]) => ({
      name,
      value
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors de la récupération des charges par type:", error);
    return { success: false, error: "Une erreur est survenue lors de la récupération des données" };
  }
}

export async function getChargesParPropriete() {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    return { success: false, error: "Vous devez être connecté pour voir les rapports" };
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
        propriete: true,
        typeCharge: true,
      },
    });

    // Grouper les charges par propriété
    const chargesParPropriete = charges.reduce((acc, charge) => {
      const propriete = charge.propriete.nom;
      
      if (!acc[propriete]) {
        acc[propriete] = 0;
      }
      acc[propriete] += charge.montant;
      return acc;
    }, {} as Record<string, number>);

    // Convertir en format pour le graphique et calculer le total
    const total = Object.values(chargesParPropriete).reduce((sum, val) => sum + val, 0);
    const data = Object.entries(chargesParPropriete).map(([name, montant]) => ({
      name,
      montant,
      pourcentage: (montant / total) * 100
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors de la récupération des charges par propriété:", error);
    return { success: false, error: "Une erreur est survenue lors de la récupération des données" };
  }
} 