"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Euro,
  Plus,
  Trash2,
  X,
  MoreVertical,
  Pencil,
  Loader2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  getCharges,
  createCharge,
  updateCharge,
  deleteCharge,
} from "@/lib/charge";
import { getProprietes } from "@/lib/propriete";
import { toast } from "sonner";
import { Charge } from "@/types/charge";
import { ChargeService } from "@/services/chargeService";
import { ChargeTable } from "./components/ChargeTable";
import { ChargeForm } from "./components/ChargeForm";

interface FormData {
  id_propriete: string;
  date_paiement: string;
  montant: string;
  id_type_charge: number;
  description: string;
}

export default function ChargesPage() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [proprietes, setProprietes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [formData, setFormData] = useState<FormData>({
    id_propriete: "",
    date_paiement: "",
    montant: "",
    id_type_charge: 1,
    description: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<Charge | null>(null);

  const loadCharges = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getCharges();

      if (result.success && result.charges) {
        setCharges(result.charges);
      } else {
        setError(result.error || "Erreur lors du chargement des charges");
      }

      const propResult = await getProprietes();
      if (propResult.success && propResult.proprietes) {
        setProprietes(propResult.proprietes);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des charges:", error);
      setError("Une erreur est survenue lors du chargement des charges");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCharges();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      // Validation des champs
      const errors = [];
      if (!formData.id_propriete) errors.push("La propriété est requise"); // Si la propriété n'est pas sélectionnée, on affiche une erreur
      if (!formData.date_paiement)
        errors.push("La date de paiement est requise"); // Si la date de paiement n'est pas sélectionnée, on affiche une erreur
      if (!formData.montant) errors.push("Le montant est requis"); // Si le montant n'est pas sélectionné, on affiche une erreur
      if (!formData.id_type_charge)
        errors.push("Le type de charge est requis"); // Si le type de charge n'est pas sélectionné, on affiche une erreur

      if (errors.length > 0) {
        setError(errors.join("\n")); // Si les erreurs sont présentes, on affiche une erreur
        return;
      }

      // On crée les données de la charge
      const chargeData = {
        id_propriete: parseInt(formData.id_propriete),
        date_paiement: formData.date_paiement,
        montant: parseFloat(formData.montant),
        id_type_charge: formData.id_type_charge,
        description: formData.description,
      };

      let result;
      // Si la charge est en cours de modification, on met à jour la charge
      if (editingCharge) {
        result = await updateCharge(editingCharge.id_charge, chargeData);
      } else {
        // Sinon, on crée la charge
        result = await createCharge(chargeData);
      }

      // Si la charge est créée ou modifiée avec succès, on affiche un message de succès
      if (result.success) {
        setSuccess(
          editingCharge
            ? "Charge modifiée avec succès"
            : "Charge créée avec succès"
        );
        setShowForm(false);
        setFormData({
          id_propriete: "",
          date_paiement: "",
          montant: "",
          id_type_charge: 1,
          description: "",
        });
        setEditingCharge(null); // On réinitialise la charge en cours de modification
        await loadCharges();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(
          result.error ||
            "Une erreur est survenue lors de la création de la charge"
        );
      }
    } catch (error) {
      console.error("Erreur inattendue:", error);
      setError(
        "Une erreur inattendue est survenue lors de la création de la charge"
      );
    }
  };

  // Gérer l'édition de la charge
  const handleEdit = (charge: Charge) => {
    setEditingCharge(charge);
    setFormData({
      id_propriete: charge.propriete.id_propriete.toString(),
      date_paiement: charge.date_paiement.split("T")[0],
      montant: charge.montant.toString(),
      id_type_charge: charge.type_charge.id_type_charge,
      description: charge.description || "",
    });
    setShowForm(true);
  };

  // Gérer la suppression de la charge
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette charge ?")) return;
    try {
      const result = await deleteCharge(id);
      if (result.success) {
        setCharges(charges.filter((c) => c.id_charge !== id));
        toast.success("Charge supprimée avec succès");
      } else {
        throw new Error(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression de la charge");
    }
  };

  const handleCreateClick = () => {
    setShowForm(true);
  };

  // Gérer la création de la charge
  const handleCreateCharge = async (charge: Omit<Charge, "id_charge">) => {
    const result = await createCharge({
      // On crée les données de la charge
      id_propriete: parseInt(charge.propriete.id_propriete.toString()),
      date_paiement: charge.date_paiement,
      montant: charge.montant,
      id_type_charge: charge.type_charge.id_type_charge,
      description: charge.description || undefined,
    });

    if (result.success) {
      await loadCharges(); // On recharge les charges pour actualiser la liste
      setIsFormOpen(false);
    } else {
      setError(result.error || "Erreur lors de la création de la charge");
    }
  };

  // Gérer la mise à jour de la charge
  const handleUpdateCharge = async (id: number, charge: Partial<Charge>) => {
    const result = await updateCharge(id, {
      id_propriete: parseInt(charge.propriete?.id_propriete.toString() || "0"),
      date_paiement: charge.date_paiement || "",
      montant: charge.montant || 0,
      id_type_charge: charge.type_charge?.id_type_charge || 0,
      description: charge.description || undefined,
    });

    if (result.success) {
      await loadCharges();
      setIsFormOpen(false);
      setSelectedCharge(null);
    } else {
      setError(result.error || "Erreur lors de la mise à jour de la charge");
    }
  };

  // Gérer la suppression de la charge
  const handleDeleteCharge = async (id: number) => {
    const result = await deleteCharge(id);
    if (result.success) {
      await loadCharges();
    } else {
      setError(result.error || "Erreur lors de la suppression de la charge");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si l'utilisateur n'a pas de charges
  if (charges.length === 0) {
    return (  
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Charges</h2>
          <Button
            className="bg-black text-white hover:bg-primary/90 cursor-pointer"
            onClick={() => {
              setIsFormOpen(true);
              setSelectedCharge(null);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle charge
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Euro className="h-12 w-12 text-gray-400" />
          <p className="text-gray-600">
            Vous n'avez pas encore de charges. Ajoutez-en une !
          </p>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCharge ? "Modifier la charge" : "Nouvelle charge"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  setEditingCharge(null);
                  setFormData({
                    id_propriete: "",
                    date_paiement: "",
                    montant: "",
                    id_type_charge: 1,
                    description: "",
                  });
                }}
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="proprieteId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Propriété
                  </label>
                  <select
                    id="proprieteId"
                    name="proprieteId"
                    value={formData.id_propriete}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Sélectionnez une propriété</option>
                    {proprietes.map((prop) => (
                      <option key={prop.id_propriete} value={prop.id_propriete}>
                        {prop.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date
                  </label>
                  <Input
                    id="date"
                    name="date_paiement"
                    type="date"
                    value={formData.date_paiement}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type
                  </label>
                  <select
                    id="type"
                    name="id_type_charge"
                    value={formData.id_type_charge}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="Entretien">Entretien</option>
                    <option value="Fonctionnement">Fonctionnement</option>
                    <option value="Financière">Financière</option>
                    <option value="Fiscal">Fiscal</option>
                    <option value="Copropriété">Copropriété</option>
                    <option value="Travaux">Travaux</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="montant"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Montant (€)
                  </label>
                  <Input
                    id="montant"
                    name="montant"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.montant}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <Input
                    id="description"
                    name="description"
                    type="text"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="bg-white text-gray-900"
                    placeholder="Description optionnelle"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-primary/90"
                >
                  {editingCharge ? "Modifier la charge" : "Créer la charge"}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Charges</h2>
        <Button
          className="bg-black text-white hover:bg-primary/90 cursor-pointer"
          onClick={() => {
            setIsFormOpen(true);
            setSelectedCharge(null);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle charge
        </Button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-800 p-4 rounded-lg whitespace-pre-line"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-800 p-4 rounded-lg"
        >
          {success}
        </motion.div>
      )}

      <ChargeTable
        charges={charges}
        onEdit={(charge) => {
          setSelectedCharge(charge);
          setIsFormOpen(true);
        }}
        onDelete={handleDeleteCharge}
      />

      {isFormOpen && (
        <ChargeForm
          charge={selectedCharge}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedCharge(null);
          }}
          onSubmit={
            selectedCharge
              ? (charge) => handleUpdateCharge(selectedCharge.id_charge, charge)
              : handleCreateCharge
          }
        />
      )}
    </div>
  );
}
