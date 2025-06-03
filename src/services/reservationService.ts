import { getReservations, createReservation, updateReservation, deleteReservation } from "@/lib/reservation";
import { getProprietes } from "@/lib/propriete";

export interface Reservation {
  id_reservation: number;
  id_propriete: number;
  date_debut: Date;
  date_fin: Date;
  prix_total: number;
  id_statut_reservation: number;
  propriete: {
    nom: string;
    ville: string;
    pays: string;
  };
  statutReservation?: {
    id_statut_reservation: number;
    libelle: string;
  };
}

export interface ReservationFormData {
  id_propriete: string;
  date_debut: string;
  date_fin: string;
  id_statut_reservation: number;
  prix_total: string;
}

export class ReservationService {
  static async loadReservations() {
    try {
      const result = await getReservations();
      
      if (result.success && result.reservations) {
        // Ajouter les statuts de réservation par défaut
        const reservationsWithStatus = result.reservations.map(reservation => ({
          ...reservation,
          statutReservation: {
            id_statut_reservation: reservation.id_statut_reservation,
            libelle: this.getStatusLabel(reservation.id_statut_reservation)
          }
        }));
        return { success: true, reservations: reservationsWithStatus };
      } else {
        return { success: false, error: result.error || "Erreur lors du chargement des réservations" };
      }
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error);
      return { success: false, error: "Une erreur est survenue lors du chargement des réservations" };
    }
  }

  private static getStatusLabel(id: number): string {
    switch (id) {
      case 1:
        return "Confirmée";
      case 2:
        return "En attente";
      case 3:
        return "Annulée";
      default:
        return "Inconnu";
    }
  }

  static async loadProprietes() {
    try {
      const result = await getProprietes();
      
      if (result.success && result.proprietes) {
        return { success: true, proprietes: result.proprietes };
      } else {
        return { success: false, error: result.error || "Erreur lors du chargement des propriétés" };
      }
    } catch (error) {
      console.error("Erreur lors du chargement des propriétés:", error);
      return { success: false, error: "Une erreur est survenue lors du chargement des propriétés" };
    }
  }

  static async handleDelete(id: number) {
    try {
      const result = await deleteReservation(id);
      if (result.success) {
        return { success: true, message: "Réservation supprimée avec succès" };
      } else {
        return { success: false, error: result.error || "Erreur lors de la suppression" };
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      return { success: false, error: "Une erreur est survenue lors de la suppression" };
    }
  }

  // Gérer la soumission du formulaire pour ajouter ou modifier une réservation
  static async handleSubmit(formData: ReservationFormData, editingReservation: Reservation | null) {
    try {
      // Convertir les valeurs numériques
      const id_propriete = parseInt(formData.id_propriete);
      const prix_total = parseFloat(formData.prix_total);

      // Vérifier que les valeurs numériques sont valides
      if (isNaN(id_propriete) || isNaN(prix_total)) {
        return { success: false, error: "Veuillez entrer des valeurs numériques valides" };
      }

      // Préparer les données
      const reservationData = {
        id_propriete,
        date_debut: new Date(formData.date_debut),
        date_fin: new Date(formData.date_fin),
        id_statut_reservation: formData.id_statut_reservation,
        prix_total
      };

      // Si la réservation est en cours de modification, on met à jour la réservation
      let result;
      if (editingReservation) {
        result = await updateReservation(editingReservation.id_reservation, reservationData); // On met à jour la réservation
      } else {
        result = await createReservation(reservationData); // On crée la réservation
      }

      // Si la réservation est créée ou modifiée avec succès, on affiche un message de succès
      if (result.success) {
        return { 
          success: true, 
          message: editingReservation ? "Réservation modifiée avec succès" : "Réservation créée avec succès" 
        };
      } else {
        // si non on affiche un message d'erreur
        let errorMessage = result.error || `Erreur lors de la ${editingReservation ? 'modification' : 'création'} de la réservation`;
        if (result.details) {
          errorMessage = `${errorMessage}\n${result.details}`;
        }
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error(`Erreur lors de la ${editingReservation ? 'modification' : 'création'} de la réservation:`, error);
      return { 
        success: false, 
        error: `Une erreur est survenue lors de la ${editingReservation ? 'modification' : 'création'} de la réservation. Veuillez réessayer.` 
      };
    }
  }
} 