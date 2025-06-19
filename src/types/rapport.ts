export interface ChargeMois {
  name: string;
  montant: number;
}

export interface ChargeType {
  name: string;
  value: number;
}

export interface ChargePropriete {
  name: string;
  montant: number;
  pourcentage: number;
}

export interface RapportResponse<T> {
  success: boolean;
  data?: T[];
  error?: string;
} 