import { useState } from 'react';
import { TypeCharge } from '@/types/typeCharge';
import { Propriete } from '@/types/propriete';
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
import { Charge } from "@/types/charge";

type ChargeFormProps = {
  onSubmit: (data: Charge) => void;
  initialData?: Charge;
  onCancel: () => void;
  typeCharges: TypeCharge[];
  proprietes: Propriete[];
};

export default function ChargeForm({ onSubmit, onCancel, typeCharges, proprietes, initialData }: ChargeFormProps) {
  const [formData, setFormData] = useState({
    id_propriete: initialData?.propriete.id_propriete.toString() || '',
    date_paiement: initialData?.date_paiement || '',
    montant: initialData?.montant.toString() || '',
    id_type_charge: initialData?.type_charge.id_type_charge.toString() || '',
    description: initialData?.description || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chargeData: Charge = {
      id_charge: initialData?.id_charge || 0,
      propriete: {
        id_propriete: parseInt(formData.id_propriete.toString()),
        nom: proprietes.find(p => p.id_propriete === parseInt(formData.id_propriete.toString()))?.nom || ''
      },
      date_paiement: formData.date_paiement,
      montant: parseFloat(formData.montant.toString()),
      type_charge: {
        id_type_charge: parseInt(formData.id_type_charge.toString()),
        libelle: typeCharges.find(t => t.id_type_charge === parseInt(formData.id_type_charge.toString()))?.libelle || ''
      },
      description: formData.description
    };
    await onSubmit(chargeData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Nouvelle charge
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-900"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id_propriete" className="text-gray-900">Propriété</Label>
            <Select name="id_propriete" defaultValue={formData.id_propriete}>
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
              value={formData.date_paiement}
              onChange={handleChange}
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
              value={formData.montant}
              onChange={handleChange}
              className="bg-white text-gray-900"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_type_charge" className="text-gray-900">Type de charge</Label>
            <Select name="id_type_charge" defaultValue={formData.id_type_charge}>
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
              value={formData.description}
              onChange={handleChange}
              className="bg-white text-gray-900"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-black text-white hover:bg-primary/90">
            Créer la charge
          </Button>
        </div>
      </form>
    </motion.div>
  );
} 