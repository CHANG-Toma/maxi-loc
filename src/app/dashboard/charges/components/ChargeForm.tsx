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
import { ChargeService } from "@/services/chargeService";

interface ChargeFormProps {
  charge?: Charge | null;
  onClose: () => void;
  onSubmit: (charge: Omit<Charge, "id">) => Promise<void>;
}

export function ChargeForm({ charge, onClose, onSubmit }: ChargeFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const chargeData: Omit<Charge, "id"> = {
      type: formData.get("type") as string,
      montant: Number(formData.get("montant")),
      periode: formData.get("periode") as string,
      date: new Date(formData.get("date") as string),
      description: formData.get("description") as string,
      proprieteId: formData.get("proprieteId") as string,
      createdAt: new Date(),
      updatedAt: new Date(),
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-900">Type de charge</Label>
            <Select name="type" defaultValue={charge?.type}>
              <SelectTrigger className="bg-white text-gray-900 border-gray-200">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 border-gray-200">
                {ChargeService.getChargeTypes().map((type) => (
                  <SelectItem key={type.value} value={type.value} className="hover:bg-gray-100">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="periode" className="text-gray-900">Période</Label>
            <Select name="periode" defaultValue={charge?.periode}>
              <SelectTrigger className="bg-white text-gray-900 border-gray-200">
                <SelectValue placeholder="Sélectionnez une période" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 border-gray-200">
                {ChargeService.getChargePeriods().map((periode) => (
                  <SelectItem key={periode.value} value={periode.value} className="hover:bg-gray-100">
                    {periode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-900">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={charge?.date ? new Date(charge.date).toISOString().split("T")[0] : ""}
              required
              className="bg-white text-gray-900 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="montant" className="text-gray-900">Montant (€)</Label>
            <Input
              id="montant"
              name="montant"
              type="number"
              step="0.01"
              min="0"
              defaultValue={charge?.montant}
              required
              className="bg-white text-gray-900 border-gray-200"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description" className="text-gray-900">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              defaultValue={charge?.description}
              placeholder="Description optionnelle"
              className="bg-white text-gray-900 border-gray-200 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-black text-white hover:bg-gray-900 border-transparent"
          >
            Annuler
          </Button>
          <Button type="submit" className="bg-black text-white hover:bg-gray-900">
            {charge ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
} 