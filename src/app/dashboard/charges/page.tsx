"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2, X, Euro } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  getCharges,
  createCharge,
  deleteCharge,
  updateCharge,
  getTypeCharges
} from "@/lib/charge";
import { getProprietes } from "@/lib/propriete";
import { toast } from "sonner";
import { ChargeTable } from "./components/ChargeTable";

interface FormData {
  id_propriete: string;
  date_paiement: string;
  montant: string;
  id_type_charge: string;
  description: string;
}

interface ChargeData {
  id_charge: number;
  propriete: {
    id_propriete: number;
    nom: string;
  };
  type_charge: {
    id_type_charge: number;
    libelle: string;
  };
  date_paiement: string;
  montant: number;
  description: string | null;
}

interface TypeCharge {
  id_type_charge: number;
  libelle: string;
}

interface Propriete {
  id_propriete: number;
  nom: string;
}

export default function ChargesPage() {
  const [charges, setCharges] = useState<ChargeData[]>([]);
  const [proprietes, setProprietes] = useState<Propriete[]>([]);
  const [typeCharges, setTypeCharges] = useState<TypeCharge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState<ChargeData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    id_propriete: "",
    date_paiement: "",
    montant: "",
    id_type_charge: "1",
    description: "",
  });

  const loadCharges = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [chargesResult, propResult, typeChargesResult] = await Promise.all([
        getCharges(),
        getProprietes(),
        getTypeCharges()
      ]);

      if (chargesResult.success && chargesResult.charges) {
        setCharges(chargesResult.charges);
      } else {
        setError(chargesResult.error || "Erreur lors du chargement des charges");
      }

      if (propResult.success && propResult.proprietes) {
        setProprietes(propResult.proprietes);
      }

      if (typeChargesResult.success && typeChargesResult.typeCharges) {
        setTypeCharges(typeChargesResult.typeCharges);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      setError("Une erreur est survenue lors du chargement des données");
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
        id_type_charge: parseInt(formData.id_type_charge),
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
        setIsFormOpen(false);
        setFormData({
          id_propriete: "",
          date_paiement: "",
          montant: "",
          id_type_charge: "1",
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
  const handleEdit = (charge: ChargeData) => {
    setEditingCharge(charge);
    setFormData({
      id_propriete: charge.propriete.id_propriete.toString(),
      date_paiement: charge.date_paiement,
      montant: charge.montant.toString(),
      id_type_charge: charge.type_charge.id_type_charge.toString(),
      description: charge.description || "",
    });
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingCharge(null);
    setFormData({
      id_propriete: "",
      date_paiement: "",
      montant: "",
      id_type_charge: "1",
      description: "",
    });
    setIsFormOpen(true);
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
            onClick={handleCreateClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle charge
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Euro className="h-12 w-12 text-gray-400" />
          <p className="text-gray-600">
            Vous n&apos;avez pas encore de charges. Ajoutez-en une !
          </p>
        </div>

        <ChargeTable
          charges={charges}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCharge ? "Modifier la charge" : "Nouvelle charge"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingCharge(null);
                    setFormData({
                      id_propriete: "",
                      date_paiement: "",
                      montant: "",
                      id_type_charge: "1",
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
                    <label htmlFor="id_propriete" className="block text-sm font-medium text-gray-700 mb-1">
                      Propriété
                    </label>
                    <select
                      id="id_propriete"
                      name="id_propriete"
                      value={formData.id_propriete}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      required
                    >
                      <option value="">Sélectionnez une propriété</option>
                      {proprietes.map((prop: Propriete) => (
                        <option key={prop.id_propriete} value={prop.id_propriete.toString()}>
                          {prop.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="date_paiement" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <Input
                      id="date_paiement"
                      name="date_paiement"
                      type="date"
                      value={formData.date_paiement}
                      onChange={handleInputChange}
                      required
                      className="bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="id_type_charge" className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      id="id_type_charge"
                      name="id_type_charge"
                      value={formData.id_type_charge}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      required
                    >
                      <option value="">Sélectionnez un type</option>
                      {typeCharges.map((type: TypeCharge) => (
                        <option key={type.id_type_charge} value={type.id_type_charge.toString()}>
                          {type.libelle}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingCharge(null);
                      setFormData({
                        id_propriete: "",
                        date_paiement: "",
                        montant: "",
                        id_type_charge: "1",
                        description: "",
                      });
                    }}
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
            </div>
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
          onClick={handleCreateClick}
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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCharge ? "Modifier la charge" : "Nouvelle charge"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingCharge(null);
                  setFormData({
                    id_propriete: "",
                    date_paiement: "",
                    montant: "",
                    id_type_charge: "1",
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
                  <label htmlFor="id_propriete" className="block text-sm font-medium text-gray-700 mb-1">
                    Propriété
                  </label>
                  <select
                    id="id_propriete"
                    name="id_propriete"
                    value={formData.id_propriete}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Sélectionnez une propriété</option>
                    {proprietes.map((prop: Propriete) => (
                      <option key={prop.id_propriete} value={prop.id_propriete.toString()}>
                        {prop.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="date_paiement" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <Input
                    id="date_paiement"
                    name="date_paiement"
                    type="date"
                    value={formData.date_paiement}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="id_type_charge" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="id_type_charge"
                    name="id_type_charge"
                    value={formData.id_type_charge}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    {typeCharges.map((type: TypeCharge) => (
                      <option key={type.id_type_charge} value={type.id_type_charge.toString()}>
                        {type.libelle}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-1">
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
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingCharge(null);
                    setFormData({
                      id_propriete: "",
                      date_paiement: "",
                      montant: "",
                      id_type_charge: "1",
                      description: "",
                    });
                  }}
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
          </div>
        </motion.div>
      )}
    </div>
  );
}
