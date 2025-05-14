"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Plus,
  Trash2,
  Loader2,
  X,
  MoreVertical,
  Pencil,
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
import DashboardLayout from "../layout";
import { useRouter } from "next/navigation";
import {
  ProprieteService,
  Propriete,
  ProprieteFormData,
} from "@/services/proprieteService";

// Fonction utilitaire pour récupérer un cookie
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

export default function PropertiesPage() {
  const router = useRouter();
  const [proprietes, setProprietes] = useState<Propriete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ProprieteFormData>({
    nom: "",
    adresse: "",
    ville: "",
    pays: "",
    code_postal: "",
    nb_pieces: "",
    superficie: "",
    description: "",
    typePropriete: "1",
  });
  const [editingProperty, setEditingProperty] = useState<Propriete | null>(
    null
  );

  // Charger les propriétés au montage du composant
  useEffect(() => {
    const loadProprietes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await ProprieteService.loadProprietes();

        if (result.success && result.proprietes) {
          setProprietes(result.proprietes);
        } else {
          setError(result.error || "Erreur lors du chargement des propriétés");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des propriétés:", error);
        setError("Une erreur est survenue lors du chargement des propriétés");
      } finally {
        setIsLoading(false);
      }
    };

    loadProprietes();
  }, []);

  // Gérer la suppression d'une propriété
  const handleDelete = async (id: number) => {
    try {
      const result = await ProprieteService.handleDelete(id);
      if (result.success) {
        setProprietes(proprietes.filter((p) => p.id_propriete !== id));
        setSuccess(result.message || "Propriété supprimée avec succès");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setError("Une erreur est survenue lors de la suppression");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const result = await ProprieteService.handleSubmit(
        formData,
        editingProperty
      );

      if (result.success) {
        setSuccess(result.message || "Opération réussie");
        setShowForm(false);
        setFormData({
          nom: "",
          adresse: "",
          ville: "",
          pays: "",
          code_postal: "",
          nb_pieces: "",
          superficie: "",
          description: "",
          typePropriete: "1",
        });
        setEditingProperty(null);

        // Recharger les propriétés
        const newProprietes = await ProprieteService.loadProprietes();
        if (newProprietes.success && newProprietes.proprietes) {
          setProprietes(newProprietes.proprietes);
        }
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);
      setError("Une erreur est survenue lors de l'opération");
    }
  };

  // Fonction pour gérer la modification d'une propriété
  const handleEdit = (propriete: Propriete) => {
    setEditingProperty(propriete);
    setFormData({
      nom: propriete.nom,
      adresse: propriete.adresse,
      ville: propriete.ville,
      pays: propriete.pays,
      code_postal: propriete.code_postal || "",
      nb_pieces: propriete.nb_pieces.toString(),
      superficie: propriete.superficie.toString(),
      description: propriete.description || "",
      typePropriete: propriete.typePropriete.id_type_propriete.toString(),
    });
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si l'utilisateur n'a pas de propriétés
  if (proprietes.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Propriétés</h2>
          <Button
            className="bg-black text-white hover:bg-primary/90 cursor-pointer"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une propriété
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Building2 className="h-12 w-12 text-gray-400" />
          <p className="text-gray-600">
            Vous n'avez pas encore de propriétés. Ajoutez-en une !
          </p>
        </div>

        {/* Formulaire d'ajout si affiché */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProperty
                  ? "Modifier la propriété"
                  : "Nouvelle propriété"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  setEditingProperty(null);
                  setFormData({
                    nom: "",
                    adresse: "",
                    ville: "",
                    pays: "",
                    code_postal: "",
                    nb_pieces: "",
                    superficie: "",
                    description: "",
                    typePropriete: "1",
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
                    htmlFor="nom"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nom
                  </label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="adresse"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Adresse
                  </label>
                  <Input
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ville"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ville
                  </label>
                  <Input
                    id="ville"
                    name="ville"
                    value={formData.ville}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pays"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pays
                  </label>
                  <Input
                    id="pays"
                    name="pays"
                    value={formData.pays}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="code_postal"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Code postal
                  </label>
                  <Input
                    id="code_postal"
                    name="code_postal"
                    value={formData.code_postal}
                    onChange={handleInputChange}
                    className="bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="nb_pieces"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de pièces
                  </label>
                  <Input
                    id="nb_pieces"
                    name="nb_pieces"
                    type="number"
                    value={formData.nb_pieces}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="superficie"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Superficie (m²)
                  </label>
                  <Input
                    id="superficie"
                    name="superficie"
                    type="number"
                    value={formData.superficie}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-gray-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="bg-white text-gray-900 min-h-[100px]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="typePropriete"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type de propriété
                  </label>
                  <select
                    id="typePropriete"
                    name="typePropriete"
                    value={formData.typePropriete}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="1">Appartement</option>
                    <option value="2">Maison</option>
                    <option value="3">Villa</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
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
                  {editingProperty
                    ? "Modifier la propriété"
                    : "Créer la propriété"}
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Messages de feedback */}
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Propriétés</h2>
        <Button
          className="bg-black text-white hover:bg-primary/90 cursor-pointer"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une propriété
        </Button>
      </div>

      {/* Liste des propriétés */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {proprietes.map((propriete) => (
          <motion.div
            key={propriete.id_propriete}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {propriete.nom}
                </h3>
                <p className="text-sm text-gray-500">
                  {propriete.ville}, {propriete.pays}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(propriete)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDelete(propriete.id_propriete)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Type:</span>{" "}
                {propriete.typePropriete.libelle}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Pièces:</span>{" "}
                {propriete.nb_pieces}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Superficie:</span>{" "}
                {propriete.superficie} m²
              </p>
              {propriete.description && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Description:</span>{" "}
                  {propriete.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingProperty ? "Modifier la propriété" : "Nouvelle propriété"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setEditingProperty(null);
                setFormData({
                  nom: "",
                  adresse: "",
                  ville: "",
                  pays: "",
                  code_postal: "",
                  nb_pieces: "",
                  superficie: "",
                  description: "",
                  typePropriete: "1",
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
                  htmlFor="nom"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom
                </label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="adresse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adresse
                </label>
                <Input
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="ville"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ville
                </label>
                <Input
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="pays"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pays
                </label>
                <Input
                  id="pays"
                  name="pays"
                  value={formData.pays}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="code_postal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Code postal
                </label>
                <Input
                  id="code_postal"
                  name="code_postal"
                  value={formData.code_postal}
                  onChange={handleInputChange}
                  className="bg-white text-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="nb_pieces"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre de pièces
                </label>
                <Input
                  id="nb_pieces"
                  name="nb_pieces"
                  type="number"
                  value={formData.nb_pieces}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="superficie"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Superficie (m²)
                </label>
                <Input
                  id="superficie"
                  name="superficie"
                  type="number"
                  value={formData.superficie}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="bg-white text-gray-900 min-h-[100px]"
                />
              </div>
              <div>
                <label
                  htmlFor="typePropriete"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type de propriété
                </label>
                <select
                  id="typePropriete"
                  name="typePropriete"
                  value={formData.typePropriete}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="1">Appartement</option>
                  <option value="2">Maison</option>
                  <option value="3">Villa</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
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
                {editingProperty
                  ? "Modifier la propriété"
                  : "Créer la propriété"}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Messages de feedback */}
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
    </div>
  );
}
