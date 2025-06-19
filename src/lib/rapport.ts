'use server'

import { prisma } from '@/lib/prisma'
import { validateSession } from "@/lib/session";
import { cookies } from 'next/headers';
import { ChargeMois, ChargeType, ChargePropriete, RapportResponse } from '@/types/rapport';

// Type pour les objets charge retournés par Prisma
type PrismaCharge = {
  id_charge: number;
  propriete: { id_propriete: number; nom: string };
  date_paiement: Date;
  montant: number;
  typeCharge: { id_type_charge: number; libelle: string };
  description: string | null;
};

export async function getChargesParMois(): Promise<RapportResponse<ChargeMois>> {
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
    const chargesParMois: Record<string, number> = {};
    
    charges.forEach((charge: PrismaCharge) => {
      const date = new Date(charge.date_paiement);
      const mois = date.toLocaleString('fr-FR', { month: 'short' });
      
      if (!chargesParMois[mois]) {
        chargesParMois[mois] = 0;
      }
      chargesParMois[mois] += Number(charge.montant);
    });

    // Convertir en format pour le graphique
    const data: ChargeMois[] = Object.entries(chargesParMois).map(([name, montant]) => ({
      name,
      montant: Number(montant)
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors de la récupération des charges par mois:", error);
    return { success: false, error: "Une erreur est survenue lors de la récupération des données" };
  }
}

export async function getChargesParType(): Promise<RapportResponse<ChargeType>> {
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
    const chargesParType: Record<string, number> = {};
    
    charges.forEach((charge: PrismaCharge) => {
      const type = charge.typeCharge.libelle;
      
      if (!chargesParType[type]) {
        chargesParType[type] = 0;
      }
      chargesParType[type] += Number(charge.montant);
    });

    // Convertir en format pour le graphique
    const data: ChargeType[] = Object.entries(chargesParType).map(([name, value]) => ({
      name,
      value: Number(value)
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors de la récupération des charges par type:", error);
    return { success: false, error: "Une erreur est survenue lors de la récupération des données" };
  }
}

export async function getChargesParPropriete(): Promise<RapportResponse<ChargePropriete>> {
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
    const chargesParPropriete: Record<string, number> = {};
    
    charges.forEach((charge: PrismaCharge) => {
      const propriete = charge.propriete.nom;
      
      if (!chargesParPropriete[propriete]) {
        chargesParPropriete[propriete] = 0;
      }
      chargesParPropriete[propriete] += Number(charge.montant);
    });

    // Convertir en format pour le graphique et calculer le total
    const total = Object.values(chargesParPropriete).reduce((sum, val) => sum + Number(val), 0);
    const data: ChargePropriete[] = Object.entries(chargesParPropriete).map(([name, montant]) => ({
      name,
      montant: Number(montant),
      pourcentage: (Number(montant) / total) * 100
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors de la récupération des charges par propriété:", error);
    return { success: false, error: "Une erreur est survenue lors de la récupération des données" };
  }
} 