'use server'

import { prisma } from "@/lib/prisma";
import { validateSession } from "@/lib/session";
import { cookies } from 'next/headers';

// Fonction utilitaire pour récupérer un cookie
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : undefined;
  }
  return undefined;
}

interface ReservationData {
  id_propriete: number;
  date_debut: string;
  date_fin: string;
  prix_total: number;
  id_statut_reservation: number;
}

export async function getReservations() {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    return { success: false, error: "Vous devez être connecté pour voir les réservations" };
  }

  try {
    const user = await validateSession(token);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        propriete: {
          id_utilisateur: user.id_utilisateur
        }
      },
      include: {
        propriete: true,
        statutReservation: true,
      },
    });

    // Transformer les données pour correspondre à l'interface Reservation
    const formattedReservations = reservations.map(res => ({
      id_reservation: res.id_reservation,
      propriete: {
        id_propriete: res.propriete.id_propriete,
        nom: res.propriete.nom
      },
      date_debut: res.date_debut.toISOString(),
      date_fin: res.date_fin.toISOString(),
      id_statut_reservation: res.statutReservation.id_statut_reservation,
      prix_total: res.prix_total || 0
    }));

    return { success: true, reservations: formattedReservations };
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return { success: false, error: "Une erreur est survenue lors de la récupération des réservations" };
  }
}

export async function createReservation(data: ReservationData) {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    return { success: false, error: "Vous devez être connecté pour créer une réservation" };
  }

  try {
    const user = await validateSession(token);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    // Vérifier que la propriété appartient à l'utilisateur
    const propriete = await prisma.propriete.findUnique({
      where: { id_propriete: data.id_propriete }
    });

    if (!propriete || propriete.id_utilisateur !== user.id_utilisateur) {
      return { success: false, error: "Vous n'avez pas les droits pour cette propriété" };
    }

    const reservation = await prisma.reservation.create({
      data: {
        id_propriete: data.id_propriete,
        date_debut: new Date(data.date_debut),
        date_fin: new Date(data.date_fin),
        prix_total: data.prix_total,
        id_statut_reservation: Number(data.id_statut_reservation)
      },
      include: {
        propriete: true,
        statutReservation: true,
      },
    });

    return { success: true, reservation };
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    return { success: false, error: "Une erreur est survenue lors de la création de la réservation" };
  }
}

export async function updateReservation(id: number, data: ReservationData) {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    return { success: false, error: "Vous devez être connecté pour modifier une réservation" };
  }

  try {
    const user = await validateSession(token);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    // Vérifier que la propriété appartient à l'utilisateur
    const propriete = await prisma.propriete.findUnique({
      where: { id_propriete: data.id_propriete }
    });

    if (!propriete || propriete.id_utilisateur !== user.id_utilisateur) {
      return { success: false, error: "Vous n'avez pas les droits pour cette propriété" };
    }

    const reservation = await prisma.reservation.update({
      where: { id_reservation: id },
      data: {
        id_propriete: data.id_propriete,
        date_debut: new Date(data.date_debut),
        date_fin: new Date(data.date_fin),
        prix_total: data.prix_total,
        id_statut_reservation: Number(data.id_statut_reservation)
      },
      include: {
        propriete: true,
        statutReservation: true,
      },
    });

    return { success: true, reservation };
  } catch (error) {
    console.error("Erreur lors de la modification de la réservation:", error);
    return { success: false, error: "Une erreur est survenue lors de la modification de la réservation" };
  }
}

export async function deleteReservation(id: number) {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    return { success: false, error: "Vous devez être connecté pour supprimer une réservation" };
  }

  try {
    const user = await validateSession(token);
    if (!user) {
      return { success: false, error: "Session invalide" };
    }

    // Vérifier que la réservation appartient à une propriété de l'utilisateur
    const reservation = await prisma.reservation.findUnique({
      where: { id_reservation: id },
      include: { propriete: true }
    });

    if (!reservation || reservation.propriete.id_utilisateur !== user.id_utilisateur) {
      return { success: false, error: "Vous n'avez pas les droits pour cette réservation" };
    }

    await prisma.reservation.delete({
      where: { id_reservation: id }
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation:", error);
    return { success: false, error: "Une erreur est survenue lors de la suppression de la réservation" };
  }
}
