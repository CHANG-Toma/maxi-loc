"use server";

// Backend pour la gestion des utilisateurs et des sessions

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/session";

// Liste de mots de passe courants
const commonPasswords = new Set([
  "password",
  "123456",
  "qwerty",
  "admin",
  "welcome",
]);

// Fonction pour vérifier la force du mot de passe
function validatePasswordStrength(password: string): {
  valid: boolean;
  message: string;
} {
  // Vérification de la longueur du mot de passe
  const minLength = 12;
  // Vérification si le mot de passe contient une majuscule
  const hasUpperCase = /[A-Z]/.test(password);
  // Vérification si le mot de passe contient une minuscule
  const hasLowerCase = /[a-z]/.test(password);
  // Vérification si le mot de passe contient un chiffre
  const hasNumbers = /\d/.test(password);
  // Vérification si le mot de passe contient un caractère spécial
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  // Vérification si le mot de passe ne contient pas d'espaces
  const hasNoSpaces = !/\s/.test(password);
  // Vérification si le mot de passe ne contient pas de caractères répétés
  const hasNoSequentialChars = !/(.)\1{2,}/.test(password);

  if (password.length < minLength) {
    // Vérifie si le mot de passe est assez long
    return {
      valid: false,
      message: `Le mot de passe doit contenir au moins ${minLength} caractères`,
    };
  }
  if (!hasUpperCase) {
    // Vérifie si le mot de passe contient une majuscule
    return {
      valid: false,
      message: "Le mot de passe doit contenir au moins une majuscule",
    };
  }
  if (!hasLowerCase) {
    // Vérifie si le mot de passe contient une minuscule
    return {
      valid: false,
      message: "Le mot de passe doit contenir au moins une minuscule",
    };
  }
  if (!hasNumbers) {
    // Vérifie si le mot de passe contient un chiffre
    return {
      valid: false,
      message: "Le mot de passe doit contenir au moins un chiffre",
    };
  }
  if (!hasSpecialChar) {
    // Vérifie si le mot de passe contient un caractère spécial
    return {
      valid: false,
      message: "Le mot de passe doit contenir au moins un caractère spécial",
    };
  }
  if (!hasNoSpaces) {
    // Vérifie si le mot de passe ne contient pas d'espaces
    return {
      valid: false,
      message: "Le mot de passe ne doit pas contenir d'espaces",
    };
  }
  if (!hasNoSequentialChars) {
    // Vérifie si le mot de passe ne contient pas de caractères répétés
    return {
      valid: false,
      message: "Le mot de passe ne doit pas contenir de caractères répétés",
    };
  }

  // Si toutes les conditions sont remplies, le mot de passe est valide
  return { valid: true, message: "Mot de passe valide" };
}

// Fonction pour vérifier si le mot de passe est courant
function isCommonPassword(password: string): boolean {
  return commonPasswords.has(password.toLowerCase());
}

// Schéma de validation pour les données utilisateur
// Protection contre les attaques par injection (OWASP #1)
const utilisateurSchema = z.object({
  email: z.string().email("Email invalide"),
  mot_de_passe: z
    .string()
    .min(12, "Le mot de passe doit contenir au moins 12 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(
      /[^A-Za-z0-9]/,
      "Le mot de passe doit contenir au moins un caractère spécial"
    ),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  telephone: z
    .string()
    .regex(/^[0-9]{10}$/, "Le numéro de téléphone doit contenir 10 chiffres"),
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
      telephone: true,
    },
  });
}

// Insertion d'un utilisateur en bdd
export async function createUtilisateur(data: CreateUtilisateurData) {
  try {
    // Validation des données de l'utilisateur (OWASP #1)
    const validatedData = utilisateurSchema.parse(data);

    // Vérification si l'email existe déjà dans la base de données (OWASP #2)
    const existingUser = await prisma.utilisateur.findFirst({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Un utilisateur avec cet email existe déjà",
      };
    }

    // Hashage du mot de passe avec bcrypt (OWASP #2)
    const hashedPassword = await bcrypt.hash(validatedData.mot_de_passe, 12);

    // Création de l'utilisateur avec le mot de passe hashé
    const utilisateur = await prisma.utilisateur.create({
      data: {
        email: validatedData.email,
        mot_de_passe: hashedPassword,
        nom: validatedData.nom,
        prenom: validatedData.prenom,
        telephone: validatedData.telephone,
      },
      // Ne retourne pas le mot de passe (OWASP #3)
      select: {
        id_utilisateur: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
      },
    });

    return { success: true, utilisateur };
  } catch (error) {
    // Gestion sécurisée des erreurs (OWASP #7)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Données invalides",
        details: error.errors,
      };
    }
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création du compte",
    };
  }
}

// Mise à jour du profil de l'utilisateur
export async function updateProfile(
  id: string,
  utilisateur: Partial<CreateUtilisateurData>
) {
  try {
    let userId: number;

    // Récupérer l'ID de l'utilisateur connecté
    if (id === "current") {
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("session")?.value;

      // Vérifier si la session est valide
      if (!sessionToken) {
        return {
          success: false,
          error: "Vous devez être connecté pour modifier votre profil",
        };
      }

      // Valider la session
      const user = await validateSession(sessionToken);
      if (!user) {
        return { success: false, error: "Session invalide" };
      }

      userId = user.id_utilisateur;
    } else {
      userId = parseInt(id);
      if (isNaN(userId)) {
        return {
          success: false,
          error: "L'identifiant de l'utilisateur est invalide",
        };
      }
    }

    const validatedData = utilisateurSchema.partial().parse(utilisateur);

    // Mettre à jour les données de l'utilisateur en appelant la fonction update de prisma
    const updatedUser = await prisma.utilisateur.update({
      where: { id_utilisateur: userId },
      data: validatedData,
      select: {
        id_utilisateur: true,
        email: true,
        nom: true,
        prenom: true,
        telephone: true,
      },
    });

    // Retourner les données mises à jour
    return {
      success: true,
      message: "Votre profil a été mis à jour avec succès",
      utilisateur: updatedUser,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Les données saisies sont invalides",
        details: error.errors.map((err) => err.message).join(", "),
      };
    }
    // Gestion des erreurs
    return {
      success: false,
      error:
        "Une erreur est survenue lors de la mise à jour de votre profil. Veuillez réessayer plus tard.",
    };
  }
}

// Mise à jour du mot de passe de l'utilisateur
export async function updatePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Récupérer le token de session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) {
      return {
        success: false,
        error: "Vous devez être connecté pour modifier votre mot de passe",
      };
    }

    // Valider la session
    const user = await validateSession(sessionToken);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    // Vérifier que les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: "Les mots de passe ne correspondent pas",
      };
    }

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    if (newPassword === currentPassword) {
      return {
        success: false,
        error: "Le nouveau mot de passe doit être différent de l'ancien",
      };
    }

    // Vérifier la force du mot de passe
    const passwordStrength = validatePasswordStrength(newPassword);
    if (!passwordStrength.valid) {
      return { success: false, error: passwordStrength.message };
    }

    // Vérifier si le mot de passe est courant
    if (isCommonPassword(newPassword)) {
      return {
        success: false,
        error:
          "Ce mot de passe est trop courant. Veuillez en choisir un autre.",
      };
    }

    // Récupérer l'utilisateur avec son mot de passe
    const currentUser = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: user.id_utilisateur },
      select: { mot_de_passe: true },
    });

    if (!currentUser || !currentUser.mot_de_passe) {
      return {
        success: false,
        error: "Utilisateur non trouvé ou mot de passe non défini",
      };
    }

    // Vérifier que l'ancien mot de passe est correct
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      currentUser.mot_de_passe
    );
    if (!isPasswordValid) {
      return { success: false, error: "Mot de passe actuel incorrect" };
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe dans la base de données
    await prisma.utilisateur.update({
      where: { id_utilisateur: user.id_utilisateur },
      data: { mot_de_passe: hashedPassword },
    });

    return {
      success: true,
      message: "Votre mot de passe a été mis à jour avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour du mot de passe",
    };
  }
}
