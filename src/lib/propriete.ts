"use server"

import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/session";
import { z } from "zod";

// Schéma de validation pour les données de propriété
const proprieteSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(25), // Le nom de la propriété
  adresse: z.string().min(1, "L'adresse est requise").max(100), // L'adresse de la propriété
  ville: z.string().min(1, "La ville est requise").max(50), // La ville de la propriété
  pays: z.string().min(1, "Le pays est requis").max(50), // Le pays de la propriété
  code_postal: z.string().max(10).optional(), // Le code postal de la propriété
  nb_pieces: z.number().min(1, "Le nombre de pièces doit être supérieur à 0"), // Le nombre de pièces de la propriété
  superficie: z.number().min(1, "La superficie doit être supérieure à 0"), // La superficie de la propriété
  description: z.string().max(255).optional(), // La description de la propriété
  id_type_propriete: z.number().min(1, "Le type de propriété est requis"), // L'id du type de propriété
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

    // Valider la session pour savoir si l'utilisateur est connecté
    const user = await validateSession(sessionToken);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    // Valider les données
    const validatedData = proprieteSchema.parse(data);

    // Créer la propriété dans la base de données
    const propriete = await prisma.propriete.create({
      data: {
        ...validatedData,
        id_utilisateur: user.id_utilisateur,
        code_postal: validatedData.code_postal || "",
        description: validatedData.description || ""
      },
    });

    return { success: true, propriete };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: error.errors 
      };
    }
    console.error("Erreur lors de la création de la propriété:", error);
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

    // Vérifier si la propriété existe
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
      data: {
        ...validatedData,
        code_postal: validatedData.code_postal || undefined,
        description: validatedData.description || undefined
      },
    });

    return { success: true, propriete: updatedPropriete };
  } catch (error) {
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
