import { Charge } from "@/types/charge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getTypeCharges } from "@/lib/charge";
import { getProprietes } from "@/lib/propriete";

interface TypeCharge {
  id_type_charge: number;
  libelle: string;
}

interface Propriete {
  id_propriete: number;
  nom: string;
}

interface ChargeFormProps {
  charge?: Charge | null;
  onClose: () => void;
  onSubmit: (charge: Omit<Charge, "id_charge">) => Promise<void>;
}

export function ChargeForm({ charge, onClose, onSubmit }: ChargeFormProps) {
  const [typeCharges, setTypeCharges] = useState<TypeCharge[]>([]);
  const [proprietes, setProprietes] = useState<Propriete[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [typeChargesResult, proprietesResult] = await Promise.all([
          getTypeCharges(),
          getProprietes()
        ]);

        if (typeChargesResult.success && typeChargesResult.typeCharges) {
          setTypeCharges(typeChargesResult.typeCharges);
        } else {
          setError(typeChargesResult.error || "Erreur lors du chargement des types de charges");
        }

        if (proprietesResult.success && proprietesResult.proprietes) {
          setProprietes(proprietesResult.proprietes);
        } else {
          setError(proprietesResult.error || "Erreur lors du chargement des propriétés");
        }
      } catch (error) {
        setError("Une erreur est survenue lors du chargement des données");
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const chargeData: Omit<Charge, "id_charge"> = {
      propriete: {
        id_propriete: Number(formData.get("id_propriete")),
        nom: proprietes.find(p => p.id_propriete === Number(formData.get("id_propriete")))?.nom || ""
      },
      date_paiement: formData.get("date_paiement") as string,
      montant: Number(formData.get("montant")),
      type_charge: {
        id_type_charge: Number(formData.get("id_type_charge")),
        libelle: typeCharges.find(tc => tc.id_type_charge === Number(formData.get("id_type_charge")))?.libelle || ""
      },
      description: formData.get("description") as string || null
    };

    await onSubmit(chargeData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {charge ? "Modifier la charge" : "Nouvelle charge"}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-900"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id_propriete" className="text-gray-900">Propriété</Label>
            <Select name="id_propriete" defaultValue={charge?.propriete.id_propriete.toString()}>
              <SelectTrigger className="bg-white text-gray-900 border-gray-200">
                <SelectValue placeholder="Sélectionnez une propriété" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 border-gray-200">
                {proprietes.map((propriete) => (
                  <SelectItem 
                    key={propriete.id_propriete} 
                    value={propriete.id_propriete.toString()}
                    className="hover:bg-gray-100"
                  >
                    {propriete.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_paiement" className="text-gray-900">Date de paiement</Label>
            <Input
              id="date_paiement"
              name="date_paiement"
              type="date"
              defaultValue={charge?.date_paiement.split('T')[0]}
              className="bg-white text-gray-900"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="montant" className="text-gray-900">Montant</Label>
            <Input
              id="montant"
              name="montant"
              type="number"
              step="0.01"
              defaultValue={charge?.montant}
              className="bg-white text-gray-900"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_type_charge" className="text-gray-900">Type de charge</Label>
            <Select name="id_type_charge" defaultValue={charge?.type_charge.id_type_charge.toString()}>
              <SelectTrigger className="bg-white text-gray-900 border-gray-200">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 border-gray-200">
                {typeCharges.map((type) => (
                  <SelectItem 
                    key={type.id_type_charge} 
                    value={type.id_type_charge.toString()}
                    className="hover:bg-gray-100"
                  >
                    {type.libelle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-900">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              defaultValue={charge?.description || ""}
              className="bg-white text-gray-900"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" className="bg-black text-white hover:bg-primary/90">
            {charge ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
} 