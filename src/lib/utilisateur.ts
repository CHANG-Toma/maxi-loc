"use server"

import { prisma } from "@/lib/prisma";
import { Utilisateur } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/session";

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

// Insertion d'un utilisateur en bdd
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

export async function updateProfile(id: string, utilisateur: Partial<CreateUtilisateurData>) {
  try {
    let userId: number;

    if (id === "current") {
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("session")?.value;
      
      if (!sessionToken) {
        return { success: false, error: "Vous devez être connecté pour modifier votre profil" };
      }

      const user = await validateSession(sessionToken);
      if (!user) {
        return { success: false, error: "Votre session a expiré, veuillez vous reconnecter" };
      }

      userId = user.id_utilisateur;
    } else {
      userId = parseInt(id);
      if (isNaN(userId)) {
        return { success: false, error: "L'identifiant de l'utilisateur est invalide" };
      }
    }

    const validatedData = utilisateurSchema.partial().parse(utilisateur);

    const updatedUser = await prisma.utilisateur.update({
      where: { id_utilisateur: userId },
      data: validatedData,
      select: {
        id_utilisateur: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true
      }
    });

    return { 
      success: true, 
      message: "Votre profil a été mis à jour avec succès",
      utilisateur: updatedUser 
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Les données saisies sont invalides",
        details: error.errors.map(err => err.message).join(", ")
      };
    }
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la mise à jour de votre profil. Veuillez réessayer plus tard." 
    };
  }
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (!sessionToken) {
      return { success: false, error: "Vous devez être connecté pour modifier votre mot de passe" };
    }

    const user = await validateSession(sessionToken);
    if (!user) {
      return { success: false, error: "Votre session a expiré, veuillez vous reconnecter" };
    }

    // Vérifier que le nouveau mot de passe et sa confirmation correspondent
    if (newPassword !== confirmPassword) {
      return { success: false, error: "Les mots de passe ne correspondent pas" };
    }

    // Vérifier que le mot de passe actuel est correct
    const currentUser = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: user.id_utilisateur },
      select: { mot_de_passe: true }
    });

    if (!currentUser || !currentUser.mot_de_passe) {
      return { success: false, error: "Utilisateur non trouvé ou mot de passe non défini" };
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.mot_de_passe);
    if (!isPasswordValid) {
      return { success: false, error: "Le mot de passe actuel est incorrect" };
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await prisma.utilisateur.update({
      where: { id_utilisateur: user.id_utilisateur },
      data: { mot_de_passe: hashedPassword }
    });

    return { 
      success: true, 
      message: "Votre mot de passe a été mis à jour avec succès" 
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe:", error);
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la mise à jour de votre mot de passe. Veuillez réessayer plus tard." 
    };
  }
}
