import { Charge } from "@/types/charge";

export class ChargeService {
  static async getCharges(): Promise<Charge[]> {
    // TODO: Implémenter l'appel API pour récupérer les charges
    return [];
  }

  static async createCharge(charge: Omit<Charge, "id">): Promise<Charge> {
    // TODO: Implémenter l'appel API pour créer une charge
    return {} as Charge;
  }

  static async updateCharge(id: string, charge: Partial<Charge>): Promise<Charge> {
    // TODO: Implémenter l'appel API pour mettre à jour une charge
    return {} as Charge;
  }

  static async deleteCharge(id: string): Promise<void> {
    // TODO: Implémenter l'appel API pour supprimer une charge
  }

  static getChargeTypes(): { value: string; label: string }[] {
    return [
      { value: "taxe_fonciere", label: "Taxe foncière" },
      { value: "taxe_habitation", label: "Taxe d'habitation" },
      { value: "assurance", label: "Assurance" },
      { value: "entretien", label: "Entretien" },
      { value: "copropriete", label: "Copropriété" },
      { value: "autre", label: "Autre" },
    ];
  }

  static getChargePeriods(): { value: string; label: string }[] {
    return [
      { value: "mensuel", label: "Mensuel" },
      { value: "trimestriel", label: "Trimestriel" },
      { value: "semestriel", label: "Semestriel" },
      { value: "annuel", label: "Annuel" },
      { value: "ponctuel", label: "Ponctuel" },
    ];
  }
} 