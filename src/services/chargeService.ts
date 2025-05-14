import { Charge } from "@/types/charge";

export class ChargeService {
  static async getCharges(): Promise<Charge[]> {
    // TODO: Implémenter l'appel API pour récupérer les charges
    return [];
  }

  static async createCharge(charge: Omit<Charge, "id_charge">): Promise<Charge> {
    // TODO: Implémenter l'appel API pour créer une charge
    return {} as Charge;
  }

  static async updateCharge(id: number, charge: Partial<Charge>): Promise<Charge> {
    // TODO: Implémenter l'appel API pour mettre à jour une charge
    return {} as Charge;
  }

  static async deleteCharge(id: number): Promise<void> {
    // TODO: Implémenter l'appel API pour supprimer une charge
  }
} 