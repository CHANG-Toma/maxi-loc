export interface Charge {
  id_charge: number;
  propriete: {
    id_propriete: number;
    nom: string;
  };
  date_paiement: string;
  montant: number;
  type_charge: {
    id_type_charge: number;
    libelle: string;
  };
  description: string | null;
} 