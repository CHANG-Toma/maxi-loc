"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  Trash2,
  Loader2,
  X,
  MoreVertical,
  Pencil,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {
  ReservationService,
  Reservation,
  ReservationFormData,
} from "@/services/reservationService";

export default function BookingsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [proprietes, setProprietes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [formData, setFormData] = useState<ReservationFormData>({
    id_propriete: "",
    date_debut: "",
    date_fin: "",
    id_statut_reservation: 1,
    prix_total: "",
  });

  // Charger les réservations et les propriétés au montage du composant
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [reservationsResult, proprietesResult] = await Promise.all([
          ReservationService.loadReservations(),
          ReservationService.loadProprietes(),
        ]);

        if (reservationsResult.success && reservationsResult.reservations) {
          setReservations(reservationsResult.reservations);
        } else {
          setError(
            reservationsResult.error ||
              "Erreur lors du chargement des réservations"
          );
        }

        if (proprietesResult.success && proprietesResult.proprietes) {
          setProprietes(proprietesResult.proprietes);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError("Une erreur est survenue lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gérer la suppression d'une réservation
  const handleDelete = async (id: number) => {
    try {
      const result = await ReservationService.handleDelete(id);
      if (result.success) {
        setReservations(reservations.filter((r) => r.id_reservation !== id));
        setSuccess(result.message || "Réservation supprimée avec succès");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setError("Une erreur est survenue lors de la suppression");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const result = await ReservationService.handleSubmit(
        formData,
        editingReservation
      );

      if (result.success) {
        setSuccess(result.message || "Opération réussie");
        setShowForm(false);
        setFormData({
          id_propriete: "",
          date_debut: "",
          date_fin: "",
          id_statut_reservation: 1,
          prix_total: "",
        });
        setEditingReservation(null);

        // Recharger les réservations
        const newReservations = await ReservationService.loadReservations();
        if (newReservations.success && newReservations.reservations) {
          setReservations(newReservations.reservations);
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

  // Fonction pour gérer la modification d'une réservation
  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setFormData({
      id_propriete: reservation.id_propriete.toString(),
      date_debut: reservation.date_debut.toISOString().split("T")[0],
      date_fin: reservation.date_fin.toISOString().split("T")[0],
      id_statut_reservation: reservation.id_statut_reservation,
      prix_total: reservation.prix_total.toString(),
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Réservations</h2>
        <Button
          className="bg-black text-white hover:bg-primary/90 cursor-pointer"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une réservation
        </Button>
      </div>

      {/* Liste des réservations */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reservations.map((reservation) => (
          <motion.div
            key={reservation.id_reservation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {reservation.propriete.nom}
                </h3>
                <p className="text-sm text-gray-500">
                  {reservation.propriete.ville}, {reservation.propriete.pays}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(reservation)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDelete(reservation.id_reservation)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Statut:</span>{" "}
                {reservation.statutReservation?.libelle || "Inconnu"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Dates:</span>{" "}
                {new Date(reservation.date_debut).toLocaleDateString()} -{" "}
                {new Date(reservation.date_fin).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Prix total:</span>{" "}
                {reservation.prix_total} €
              </p>
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
              {editingReservation
                ? "Modifier la réservation"
                : "Nouvelle réservation"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setEditingReservation(null);
                setFormData({
                  id_propriete: "",
                  date_debut: "",
                  date_fin: "",
                  id_statut_reservation: 1,
                  prix_total: "",
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
                  htmlFor="id_propriete"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                  {proprietes.map((propriete) => (
                    <option
                      key={propriete.id_propriete}
                      value={propriete.id_propriete}
                    >
                      {propriete.nom} - {propriete.ville}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="date_debut"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date de début
                </label>
                <Input
                  id="date_debut"
                  name="date_debut"
                  type="date"
                  value={formData.date_debut}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="date_fin"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date de fin
                </label>
                <Input
                  id="date_fin"
                  name="date_fin"
                  type="date"
                  value={formData.date_fin}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="prix_total"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Prix total
                </label>
                <Input
                  id="prix_total"
                  name="prix_total"
                  type="number"
                  value={formData.prix_total}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="id_statut_reservation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Statut
                </label>
                <select
                  id="id_statut_reservation"
                  name="id_statut_reservation"
                  value={formData.id_statut_reservation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="1">Confirmée</option>
                  <option value="2">En attente</option>
                  <option value="3">Annulée</option>
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
                {editingReservation
                  ? "Modifier la réservation"
                  : "Créer la réservation"}
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
