"use server"

import { prisma } from "@/lib/prisma";
import { Utilisateur } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Schéma de validation pour les données utilisateur
// Protection contre les attaques par injection (OWASP #1)
const utilisateurSchema = z.object({
  email: z.string().email("Email invalide"),
  mot_de_passe: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  telephone: z.string().regex(/^[0-9]{10}$/, "Le numéro de téléphone doit contenir 10 chiffres")
});

// Type pour les données de création d'utilisateur
type CreateUtilisateurData = z.infer<typeof utilisateurSchema>;

// Protection contre les attaques par énumération (OWASP #2)
export async function getAllUtilisateurs() {
  // Ne retourne que les informations non sensibles
  return await prisma.utilisateur.findMany({
    select: {
      id_utilisateur: true,
      email: true,
      nom: true,
      prenom: true,
      telephone: true
    }
  });
}

export async function createUtilisateur(data: CreateUtilisateurData) {
  try {
    // Validation des données (OWASP #1)
    const validatedData = utilisateurSchema.parse(data);

    // Vérification si l'email existe déjà (OWASP #2)
    const existingUser = await prisma.utilisateur.findFirst({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return { 
        success: false, 
        error: "Un utilisateur avec cet email existe déjà" 
      };
    }

    // Hashage du mot de passe avec bcrypt (OWASP #2)
    const hashedPassword = await bcrypt.hash(validatedData.mot_de_passe, 10);

    // Création de l'utilisateur avec le mot de passe hashé
    const utilisateur = await prisma.utilisateur.create({
      data: {
        email: validatedData.email,
        mot_de_passe: hashedPassword,
        nom: validatedData.nom,
        prenom: validatedData.prenom,
        telephone: validatedData.telephone
      },
      // Ne retourne pas le mot de passe (OWASP #3)
      select: {
        id_utilisateur: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true
      }
    });

    return { success: true, utilisateur };
  } catch (error) {
    // Gestion sécurisée des erreurs (OWASP #7)
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: error.errors 
      };
    }
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la création du compte" 
    };
  }
}

export async function updateUtilisateur(id: string, utilisateur: Partial<CreateUtilisateurData>) {
  try {
    // Validation de l'ID (OWASP #1)
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return { success: false, error: "ID invalide" };
    }

    // Validation des données (OWASP #1)
    const validatedData = utilisateurSchema.partial().parse(utilisateur);

    return await prisma.utilisateur.update({
      where: { id_utilisateur: userId },
      data: validatedData,
      // Ne retourne pas le mot de passe (OWASP #3)
      select: {
        id_utilisateur: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true
      }
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return { success: false, error };
  }
}

export async function deleteUtilisateur(id: string) {
  try {
    // Validation de l'ID (OWASP #1)
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return { success: false, error: "ID invalide" };
    }

    return await prisma.utilisateur.delete({
      where: { id_utilisateur: userId }
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return { success: false, error };
  }
}
