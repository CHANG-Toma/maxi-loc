export interface Charge {
  id: string;
  type: string;
  montant: number;
  periode: string;
  date: Date;
  description?: string;
  proprieteId: string;
  createdAt: Date;
  updatedAt: Date;
} 