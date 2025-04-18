import { getProprietes } from "@/lib/propriete";
import { getReservations } from "@/lib/reservation";
import { getCharges } from "@/lib/charge";

export class OverviewService {
  static async getDashboardStats() {
    try {
      const [proprietes, reservations, charges] = await Promise.all([
        getProprietes(),
        getReservations(),
        getCharges()
      ]);

      const totalProprietes = proprietes.success ? proprietes.proprietes.length : 0;
      const totalReservations = reservations.success ? reservations.reservations.length : 0;
      const totalCharges = charges.success ? charges.charges.reduce((sum, charge) => sum + charge.montant, 0) : 0;
      const totalLocataires = proprietes.success 
        ? proprietes.proprietes.filter(p => p.locataire).length 
        : 0;

      return {
        proprietes: totalProprietes,
        reservations: totalReservations,
        charges: totalCharges,
        locataires: totalLocataires
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      return {
        proprietes: 0,
        reservations: 0,
        charges: 0,
        locataires: 0
      };
    }
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