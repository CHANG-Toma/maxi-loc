"use server"

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { cookies } from "next/headers";
import { createSession } from "./session";

// Schéma de validation pour les données de connexion
const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  mot_de_passe: z.string().min(1, "Le mot de passe est requis")
});

type LoginData = z.infer<typeof loginSchema>;

export async function login(data: LoginData) {
  try {
    
    // Validation des données
    const validatedData = loginSchema.parse(data);

    // Recherche de l'utilisateur
    const utilisateur = await prisma.utilisateur.findFirst({
      where: { email: validatedData.email }
    });

    if (!utilisateur) {
      return { 
        success: false, 
        error: "Email ou mot de passe incorrect" 
      };
    }

    if (!utilisateur.mot_de_passe) {
      console.error("Mot de passe manquant pour l'utilisateur:", utilisateur.id_utilisateur);
      return { 
        success: false, 
        error: "Email ou mot de passe incorrect" 
      };
    }

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(
      validatedData.mot_de_passe, 
      utilisateur.mot_de_passe
    );

    if (!passwordMatch) {
      return { 
        success: false, 
        error: "Email ou mot de passe incorrect" 
      };
    }

    // Création de la session
    const session = await createSession(utilisateur.id_utilisateur);

    // Stockage du token dans un cookie sécurisé
    const cookieStore = await cookies();
    cookieStore.set({
      name: "session",
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    });

    return { 
      success: true, 
      utilisateur: {
        id_utilisateur: utilisateur.id_utilisateur,
        email: utilisateur.email,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        telephone: utilisateur.telephone
      }
    };
  } catch (error) {
    console.error("Erreur détaillée lors de la connexion:", error);
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: error.errors 
      };
    }
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la connexion" 
    };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    // Suppression de la session de la base de données si le token existe
    if (sessionToken) {
      await prisma.session.deleteMany({
        where: { token: sessionToken }
      });
    }

    // Suppression du cookie de session
    cookieStore.delete("session");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return { success: false, error: "Une erreur est survenue lors de la déconnexion" };
  }
} 