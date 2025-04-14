"use server"

import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Durée de validité d'une session (7 jours)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export async function createSession(userId: number) {
  // Génération d'un token sécurisé
  const token = crypto.randomBytes(32).toString("hex");
  
  // Création de la session dans la base de données
  const session = await prisma.session.create({
    data: {
      token,
      utilisateur_id: userId,
      expires_at: new Date(Date.now() + SESSION_DURATION)
    }
  });

  return session;
}

export async function validateSession(token: string) {
  try {
    const session = await prisma.session.findFirst({
      where: {
        token,
        expires_at: {
          gt: new Date()
        }
      },
      include: {
        utilisateur: {
          select: {
            id_utilisateur: true,
            email: true,
            nom: true,
            prenom: true,
            telephone: true
          }
        }
      }
    });

    if (!session) {
      return null;
    }

    return session.utilisateur;
  } catch (error) {
    console.error("Erreur lors de la validation de la session:", error);
    return null;
  }
}

export async function deleteSession(token: string) {
  try {
    await prisma.session.delete({
      where: { token }
    });
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de la session:", error);
    return false;
  }
} 