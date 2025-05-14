"use server"

import { deleteSession, validateSession } from "@/lib/session";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

// Fonction pour récupérer l'utilisateur connecté
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies(); // Récupérer le cookie de session
    const sessionToken = cookieStore.get("session")?.value; // Récupérer le token de session
    
    if (!sessionToken) {
      return null;
    }

    // Valider la session et retourner l'utilisateur
    return await validateSession(sessionToken);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}

// Fonction de déconnexion
export async function logout() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (sessionToken) { // Vérifier si le token de session existe
      await deleteSession(sessionToken);
    }
    
    await cookieStore.delete("session"); // Supprimer le cookie de session
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return { success: false, error: "Erreur lors de la déconnexion" };
  }
}

export async function login(credentials: { email: string; mot_de_passe: string; recaptchaToken: string }) {
  try {
    // Vérifier le reCAPTCHA
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.recaptchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return {
        success: false,
        error: "Vérification reCAPTCHA échouée. Veuillez réessayer."
      };
    }

    // Chercher l'utilisateur avec l'email fourni
    const user = await prisma.utilisateur.findFirst({
      where: { email: credentials.email }
    }); 

    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (!user || !user.mot_de_passe) {
      return {
        success: false,
        error: "Email ou mot de passe incorrect"
      };
    }

    // Vérifier si le mot de passe est correct
    const isValid = await bcrypt.compare(credentials.mot_de_passe, user.mot_de_passe);

    if (!isValid) {
      return {
        success: false,
        error: "Email ou mot de passe incorrect"
      };
    }

    // Créer une session avec un cookie pour 7 jours
    const sessionToken = crypto.randomUUID(); // Générer un token de session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

    // Créer une session dans la base de données
    await prisma.session.create({
      data: {
        token: sessionToken,
        utilisateur_id: user.id_utilisateur,
        expires_at: expiresAt
      }
    });

    // Définir le cookie de session
    const cookieStore = await cookies();
    await cookieStore.set("session", sessionToken, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });

    return {
      success: true,
      user: {
        id: user.id_utilisateur,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom
      }
    };
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la connexion"
    };
  }
}

// Fonction en cas d'oublie du mot de passe
export async function forgotPassword(email: string) {
  try {
    // Vérifier si l'utilisateur existe
    const user = await prisma.utilisateur.findFirst({
      where: { email }
    });

    if (!user) {
      // On renvoie toujours un succès pour des raisons de sécurité
      return { 
        success: true,
        message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation."
      };
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token dans la base de données
    await prisma.utilisateur.update({
      where: { id_utilisateur: user.id_utilisateur },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    });

    // Envoyer l'email de réinitialisation
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
      `,
    });

    return { 
      success: true,
      message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation."
    };
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);
    return { 
      success: false,
      error: "Une erreur est survenue lors de la demande de réinitialisation."
    };
  }
}

// Réinitialisation du mot de passe
export async function resetPassword(token: string, newPassword: string) {
  try {
    // Chercher l'utilisateur avec ce token et vérifier l'expiration
    const user = await prisma.utilisateur.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });

    if (!user) {
      return { success: false, error: "Lien invalide ou expiré." };
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et supprimer le token
    await prisma.utilisateur.update({
      where: { id_utilisateur: user.id_utilisateur },
      data: {
        mot_de_passe: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    return { success: false, error: "Erreur lors de la réinitialisation." };
  }
} 