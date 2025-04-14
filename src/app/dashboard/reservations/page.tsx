"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users2, Plus, Trash2, X, MoreVertical, Pencil, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import Dashboard from "../page";
import { getReservations, createReservation, updateReservation, deleteReservation } from "@/lib/reservation";
import { getProprietes } from "@/lib/propriete";
import { toast } from 'sonner';

// Fonction utilitaire pour récupérer un cookie
function getCookie(name: string): string | undefined {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(c => c.trim().startsWith(name + '='));
  return cookie ? cookie.split('=')[1] : undefined;
}

interface Reservation {
  id_reservation: number;
  propriete: {
    id_propriete: number;
    nom: string;
  };
  date_debut: string;
  date_fin: string;
  id_statut_reservation: number;
  prix_total: number;
}

interface FormData {
  id_propriete: string;
  date_debut: string;
  date_fin: string;
  id_statut_reservation: number;
  prix_total: string;
}

export default function BookingsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [proprietes, setProprietes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [formData, setFormData] = useState<FormData>({
    id_propriete: "",
    date_debut: "",
    date_fin: "",
    id_statut_reservation: 1,
    prix_total: ""
  });

  // Vérifier la session au chargement
  useEffect(() => {
    const loadReservations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await getReservations();
        
        if (result.success && result.reservations) {
          const typedReservations = result.reservations.map(res => ({
            id_reservation: res.id_reservation,
            propriete: res.propriete,
            date_debut: res.date_debut,
            date_fin: res.date_fin,
            id_statut_reservation: res.id_statut_reservation,
            prix_total: res.prix_total
          }));
          setReservations(typedReservations);
        } else {
          setError(result.error || "Erreur lors du chargement des réservations");
        }

        // Charger les propriétés
        const propResult = await getProprietes();
        if (propResult.success && propResult.proprietes) {
          setProprietes(propResult.proprietes);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des réservations:", error);
        setError("Une erreur est survenue lors du chargement des réservations");
      } finally {
        setIsLoading(false);
      }
    };

    loadReservations();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      // Validation des champs
      const errors = [];
      if (!formData.id_propriete) errors.push("La propriété est requise");
      if (!formData.date_debut) errors.push("La date d'arrivée est requise");
      if (!formData.date_fin) errors.push("La date de départ est requise");
      if (!formData.prix_total) errors.push("Le montant total est requis");

      if (errors.length > 0) {
        setError(errors.join("\n"));
        return;
      }

      const reservationData = {
        id_propriete: parseInt(formData.id_propriete),
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
        id_statut_reservation: parseInt(formData.id_statut_reservation.toString()),
        prix_total: parseFloat(formData.prix_total)
      };

      let result;
      if (editingReservation) {
        result = await updateReservation(editingReservation.id_reservation, reservationData);
      } else {
        result = await createReservation(reservationData);
      }

      if (result.success) {
        setSuccess(editingReservation ? "Réservation modifiée avec succès" : "Réservation créée avec succès");
        setShowForm(false);
        setFormData({
          id_propriete: "",
          date_debut: "",
          date_fin: "",
          id_statut_reservation: 1,
          prix_total: ""
        });
        setEditingReservation(null);

        // Recharger les réservations
        const newReservations = await getReservations();
        if (newReservations.success && newReservations.reservations) {
          const typedReservations = newReservations.reservations.map(res => ({
            id_reservation: res.id_reservation,
            propriete: res.propriete,
            date_debut: res.date_debut,
            date_fin: res.date_fin,
            id_statut_reservation: res.id_statut_reservation,
            prix_total: res.prix_total
          }));
          setReservations(typedReservations);
        }
        
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Une erreur est survenue lors de la création de la réservation");
      }
    } catch (error) {
      console.error("Erreur inattendue:", error);
      setError("Une erreur inattendue est survenue lors de la création de la réservation");
    }
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setFormData({
      id_propriete: reservation.propriete.id_propriete.toString(),
      date_debut: reservation.date_debut,
      date_fin: reservation.date_fin,
      id_statut_reservation: reservation.id_statut_reservation,
      prix_total: reservation.prix_total.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) return;
    try {
      const result = await deleteReservation(id);
      if (result.success) {
        setReservations(reservations.filter(r => r.id_reservation !== id));
        toast.success('Réservation supprimée avec succès');
      } else {
        throw new Error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression de la réservation');
    }
  };

  const reloadReservations = async () => {
    const newReservations = await getReservations();
    if (newReservations.success && newReservations.reservations) {
      const typedReservations = newReservations.reservations.map(res => ({
        id_reservation: res.id_reservation,
        propriete: res.propriete,
        date_debut: res.date_debut,
        date_fin: res.date_fin,
        id_statut_reservation: res.id_statut_reservation,
        prix_total: res.prix_total
      }));
      setReservations(typedReservations);
    }
  };

  const handleCreateClick = () => {
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Dashboard>
    );
  }

  // Si l'utilisateur n'a pas de réservations
  if (reservations.length === 0) {
    return (
      <Dashboard>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Réservations</h2>
            <Button 
              className="bg-black text-white hover:bg-primary/90 cursor-pointer"
              onClick={handleCreateClick}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle réservation
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Calendar className="h-12 w-12 text-gray-400" />
            <p className="text-gray-600">Vous n'avez pas encore de réservations. Ajoutez-en une !</p>
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
                  {editingReservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
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
                      prix_total: ""
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
                      {proprietes.map(prop => (
                        <option key={prop.id_propriete} value={prop.id_propriete}>
                          {prop.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700 mb-1">
                      Date d'arrivée
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
                    <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700 mb-1">
                      Date de départ
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
                    <label htmlFor="id_statut_reservation" className="block text-sm font-medium text-gray-700 mb-1">
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
                      <option value="1">Libre</option>
                      <option value="2">Réservé</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="prix_total" className="block text-sm font-medium text-gray-700 mb-1">
                      Montant total (€)
                    </label>
                    <Input
                      id="prix_total"
                      name="prix_total"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.prix_total}
                      onChange={handleInputChange}
                      required
                      className="bg-white text-gray-900"
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
                  <Button type="submit" className="bg-black text-white hover:bg-primary/90">
                    {editingReservation ? 'Modifier la réservation' : 'Créer la réservation'}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Réservations</h2>
          <Button 
            className="bg-black text-white hover:bg-primary/90 cursor-pointer"
            onClick={handleCreateClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle réservation
          </Button>
        </div>

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

        {/* Formulaire d'ajout/modification */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingReservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
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
                    prix_total: ""
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
                    {proprietes.map(prop => (
                      <option key={prop.id_propriete} value={prop.id_propriete}>
                        {prop.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="date_debut" className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'arrivée
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
                  <label htmlFor="date_fin" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de départ
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
                  <label htmlFor="id_statut_reservation" className="block text-sm font-medium text-gray-700 mb-1">
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
                    <option value="1">Libre</option>
                    <option value="2">Réservé</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="prix_total" className="block text-sm font-medium text-gray-700 mb-1">
                    Montant total (€)
                  </label>
                  <Input
                    id="prix_total"
                    name="prix_total"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.prix_total}
                    onChange={handleInputChange}
                    required
                    className="bg-white text-gray-900"
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
                <Button type="submit" className="bg-black text-white hover:bg-primary/90">
                  {editingReservation ? 'Modifier la réservation' : 'Créer la réservation'}
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Liste des réservations */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriété
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation, index) => (
                  <motion.tr 
                    key={reservation.id_reservation}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{reservation.propriete.nom}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(reservation.date_debut).toLocaleDateString()} - {new Date(reservation.date_fin).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${reservation.id_statut_reservation === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {reservation.id_statut_reservation === 1 ? 'Libre' : 'Réservé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reservation.prix_total.toLocaleString()}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-gray-900"
                          >
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(reservation)}
                            className="cursor-pointer flex items-center text-gray-900 hover:text-gray-900"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Modifier</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(reservation.id_reservation)}
                            className="cursor-pointer flex items-center text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
