"use server"

import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/session";
import { z } from "zod";

// Schéma de validation pour les données de propriété
const proprieteSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(25),
  adresse: z.string().min(1, "L'adresse est requise").max(100),
  ville: z.string().min(1, "La ville est requise").max(50),
  pays: z.string().min(1, "Le pays est requis").max(50),
  capacite: z.number().min(1, "La capacité doit être supérieure à 0"),
  superficie: z.number().min(1, "La superficie doit être supérieure à 0"),
  description: z.string().max(255).optional(),
  id_type_propriete: z.number().min(1, "Le type de propriété est requis"),
});

// Type pour les données de création de propriété
type CreateProprieteData = z.infer<typeof proprieteSchema>;

// Fonction pour créer une propriété
export async function createPropriete(data: CreateProprieteData) {
  try {
    // Récupérer le token de session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (!sessionToken) {
      return { success: false, error: "Vous devez être connecté pour ajouter une propriété" };
    }

    // Valider la session
    const user = await validateSession(sessionToken);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    // Valider les données
    const validatedData = proprieteSchema.parse(data);

    // Créer la propriété
    const propriete = await prisma.propriete.create({
      data: {
        ...validatedData,
        id_utilisateur: user.id_utilisateur,
      },
    });

    return { success: true, propriete };
  } catch (error) {
    console.error("Erreur lors de la création de la propriété:", error);
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: error.errors 
      };
    }
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la création de la propriété" 
    };
  }
}

// Fonction pour récupérer toutes les propriétés d'un utilisateur
export async function getProprietes() {
  try {
    // Récupérer le token de session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (!sessionToken) {
      return { success: false, error: "Vous devez être connecté pour voir vos propriétés" };
    }

    // Valider la session
    const user = await validateSession(sessionToken);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    // Récupérer les propriétés avec les relations
    const proprietes = await prisma.propriete.findMany({
      where: {
        id_utilisateur: user.id_utilisateur,
      },
      include: {
        typePropriete: true,
        plateformes: {
          include: {
            plateforme: true,
          },
        },
      },
      orderBy: {
        id_propriete: 'desc',
      },
    });

    return { success: true, proprietes };
  } catch (error) {
    console.error("Erreur lors de la récupération des propriétés:", error);
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la récupération des propriétés" 
    };
  }
}

// Fonction pour mettre à jour une propriété
export async function updatePropriete(id: number, data: Partial<CreateProprieteData>) {
  try {
    // Récupérer le token de session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (!sessionToken) {
      return { success: false, error: "Vous devez être connecté pour modifier une propriété" };
    }

    // Valider la session
    const user = await validateSession(sessionToken);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    // Vérifier que la propriété appartient à l'utilisateur
    const propriete = await prisma.propriete.findFirst({
      where: {
        id_propriete: id,
        id_utilisateur: user.id_utilisateur,
      },
    });

    if (!propriete) {
      return { success: false, error: "Propriété non trouvée ou accès non autorisé" };
    }

    // Valider les données
    const validatedData = proprieteSchema.partial().parse(data);

    // Mettre à jour la propriété
    const updatedPropriete = await prisma.propriete.update({
      where: {
        id_propriete: id,
      },
      data: validatedData,
    });

    return { success: true, propriete: updatedPropriete };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la propriété:", error);
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: error.errors 
      };
    }
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la mise à jour de la propriété" 
    };
  }
}

// Fonction pour supprimer une propriété
export async function deletePropriete(id: number) {
  try {
    // Récupérer le token de session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (!sessionToken) {
      return { success: false, error: "Vous devez être connecté pour supprimer une propriété" };
    }

    // Valider la session
    const user = await validateSession(sessionToken);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    // Vérifier que la propriété appartient à l'utilisateur
    const propriete = await prisma.propriete.findFirst({
      where: {
        id_propriete: id,
        id_utilisateur: user.id_utilisateur,
      },
    });

    if (!propriete) {
      return { success: false, error: "Propriété non trouvée ou accès non autorisé" };
    }

    // Supprimer la propriété
    await prisma.propriete.delete({
      where: {
        id_propriete: id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la propriété:", error);
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la suppression de la propriété" 
    };
  }
}
