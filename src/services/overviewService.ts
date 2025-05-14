import { getProprietes } from "@/lib/propriete";
import { getReservations } from "@/lib/reservation";
import { getCharges } from "@/lib/charge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

export class OverviewService {
  static async getDashboardStats(): Promise<DashboardStats> {
    // Simuler un appel API
    return {
      revenus_mensuels: 12500,
      proprietes_actives: 25,
      taux_occupation: 89,
      reservations: 156,
      variation_revenus: 15,
      variation_proprietes: 2,
      variation_occupation: 5,
      variation_reservations: 8
    };
  }

  static async getRevenusData(): Promise<RevenusData[]> {
    // Simuler un appel API
    const derniersMois = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return {
        mois: format(date, 'MMM', { locale: fr }).toUpperCase(),
        montant: Math.floor(Math.random() * 5000) + 8000
      };
    });

    return derniersMois;
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
          .sort((a, b) => new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime())
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
          .sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime())
          .slice(0, 5);
      }
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des propriétés récentes:", error);
      return [];
    }
  }
} 