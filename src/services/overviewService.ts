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
}

interface Reservation {
  date_debut: string;
  prix_total: number;
}

interface Propriete {
  date_creation: string;
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
    // Simuler un appel API
    return [
      {
        id: 1,
        propriete: "Appartement Paris 15",
        date: format(new Date(), 'dd/MM/yyyy')
      },
      {
        id: 2,
        propriete: "Appartement Paris 13",
        date: format(new Date(Date.now() - 86400000), 'dd/MM/yyyy')
      },
      {
        id: 3,
        propriete: "Appartement Paris 15",
        date: format(new Date(Date.now() - 172800000), 'dd/MM/yyyy')
      }
    ];
  }

  static async getRecentReservations() {
    try {
      const result = await getReservations();
      if (result.success) {
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
      if (result.success) {
        return result.proprietes
          .sort((a: Propriete, b: Propriete) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime())
          .slice(0, 5);
      }
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des propriétés récentes:", error);
      return [];
    }
  }
} 