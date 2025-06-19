import { getProprietes } from "@/lib/propriete";
import { getReservations } from "@/lib/reservation";
import { format } from 'date-fns';

export interface DashboardStats {
  revenus_mensuels: number;
  proprietes_actives: number;
  taux_occupation: number;
  reservations: number;
  variation_revenus: number;
  variation_proprietes: number;
  variation_occupation: number;
  variation_reservations: number;
}

export interface RevenusData {
  mois: string;
  montant: number;
}

export interface ReservationRecente {
  id: number;
  propriete: string;
  date: string;
  prix: number;
  statut: string;
  ville: string;
}

interface Reservation {
  date_debut: string;
  prix_total: number;
}

interface ReservationWithDetails {
  id_reservation: number;
  propriete: {
    id_propriete: number;
    nom: string;
    ville: string;
    pays: string;
  };
  date_debut: string;
  date_fin: string;
  id_statut_reservation: number;
  prix_total: number;
  statutReservation?: {
    id_statut_reservation: number;
    libelle: string;
  };
}

interface Propriete {
  id_propriete: number;
  nom: string;
  adresse: string;
  ville: string;
  code_postal: string;
  pays: string;
  nb_pieces: number;
  superficie: number;
  description: string | null;
  id_utilisateur: number;
  id_type_propriete: number;
  typePropriete: {
    id_type_propriete: number;
    libelle: string;
  };
  plateformes: Array<{
    id_propriete: number;
    id_plateforme: number;
    plateforme: {
      nom: string | null;
      id_plateforme: number;
      site_web: string | null;
    };
  }>;
}

export class OverviewService {
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Récupérer toutes les données nécessaires
      const [reservationsResult, proprietesResult] = await Promise.all([
        getReservations(),
        getProprietes()
      ]);

      // Revenus mensuels (somme des prix_total des réservations du mois en cours)
      let revenus_mensuels = 0;
      if (reservationsResult.success && reservationsResult.reservations) {
        const now = new Date();
        revenus_mensuels = reservationsResult.reservations
          .filter((r: Reservation) => {
            const d = new Date(r.date_debut);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          })
          .reduce((sum: number, r: Reservation) => sum + (r.prix_total || 0), 0);
      }

      // Propriétés actives
      const proprietes_actives = (proprietesResult.success && proprietesResult.proprietes)
        ? proprietesResult.proprietes.length
        : 0;

      // Nombre de réservations du mois en cours
      let reservations = 0;
      if (reservationsResult.success && reservationsResult.reservations) {
        const now = new Date();
        reservations = reservationsResult.reservations
          .filter((r: Reservation) => {
            const d = new Date(r.date_debut);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          })
          .length;
      }

      // Taux d'occupation et variations : placeholders (0)
      return {
        revenus_mensuels,
        proprietes_actives,
        taux_occupation: 0,
        reservations,
        variation_revenus: 0,
        variation_proprietes: 0,
        variation_occupation: 0,
        variation_reservations: 0
      };
    } catch (error) {
      console.error("Erreur lors du calcul des statistiques du dashboard:", error);
      return {
        revenus_mensuels: 0,
        proprietes_actives: 0,
        taux_occupation: 0,
        reservations: 0,
        variation_revenus: 0,
        variation_proprietes: 0,
        variation_occupation: 0,
        variation_reservations: 0
      };
    }
  }

  static async getRevenusData(): Promise<RevenusData[]> {
    try {
      const reservationsResult = await getReservations();
      if (reservationsResult.success && reservationsResult.reservations) {
        // Créer un tableau pour les 12 derniers mois
        const now = new Date();
        const moisLabels = Array.from({ length: 12 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
          return {
            key: `${d.getFullYear()}-${d.getMonth()}`,
            label: d.toLocaleString('fr-FR', { month: 'short' }),
            year: d.getFullYear(),
            month: d.getMonth()
          };
        });

        // Grouper les réservations par mois
        const revenusParMois = moisLabels.map(({ year, month, label }) => {
          const montant = reservationsResult.reservations
            .filter((r: Reservation) => {
              const d = new Date(r.date_debut);
              return d.getFullYear() === year && d.getMonth() === month;
            })
            .reduce((sum: number, r: Reservation) => sum + (r.prix_total || 0), 0);
          return { mois: label.charAt(0).toUpperCase() + label.slice(1), montant };
        });

        return revenusParMois;
      }
      return [];
    } catch (error) {
      console.error("Erreur lors du calcul des revenus mensuels:", error);
      return [];
    }
  }

  static async getReservationsRecentes(): Promise<ReservationRecente[]> {
    try {
      const result = await getReservations();
      if (result.success && result.reservations) {
        // Trier par date de début (les plus récentes en premier) et prendre les 5 dernières
        const reservationsRecentes = result.reservations
          .sort((a: ReservationWithDetails, b: ReservationWithDetails) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime())
          .slice(0, 5)
          .map((reservation: ReservationWithDetails) => ({
            id: reservation.id_reservation,
            propriete: reservation.propriete.nom,
            date: format(new Date(reservation.date_debut), 'dd/MM/yyyy'),
            prix: reservation.prix_total || 0,
            statut: reservation.statutReservation?.libelle || 'En attente',
            ville: reservation.propriete.ville
          }));
        
        return reservationsRecentes;
      }
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations récentes:", error);
      return [];
    }
  }

  static async getRecentReservations() {
    try {
      const result = await getReservations();
      if (result.success && result.reservations) {
        return result.reservations
          .sort((a: Reservation, b: Reservation) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime())
          .slice(0, 5);
      }
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations récentes:", error);
      return [];
    }
  }

  static async getRecentProprietes() {
    try {
      const result = await getProprietes();
      if (result.success && result.proprietes) {
        return result.proprietes
          .sort((a: Propriete, b: Propriete) => b.id_propriete - a.id_propriete)
          .slice(0, 5);
      }
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des propriétés récentes:", error);
      return [];
    }
  }
} 