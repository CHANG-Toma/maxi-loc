"use client"

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Building2, 
  Calendar, 
  DollarSign, 
  Users2 
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewService } from "@/services/overviewService";
import { useEffect, useState } from "react";

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

interface Propriete {
  id_propriete: number;
  nom: string;
  ville: string;
  pays: string;
  typePropriete: {
    id_type_propriete: number;
    libelle: string;
  };
  nb_pieces: number;
}

interface DashboardStats {
  proprietes: number;
  reservations: number;
  charges: number;
  locataires: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    proprietes: 0,
    reservations: 0,
    charges: 0,
    locataires: 0
  });
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [recentProprietes, setRecentProprietes] = useState<Propriete[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboardStats, reservations, proprietes] = await Promise.all([
          OverviewService.getDashboardStats(),
          OverviewService.getRecentReservations(),
          OverviewService.getRecentProprietes()
        ]);

        setStats(dashboardStats);
        setRecentReservations(reservations);
        setRecentProprietes(proprietes);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const data = [
    { month: "Jan", revenue: 4000 },
    { month: "Fév", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Avr", revenue: 2780 },
    { month: "Mai", revenue: 6890 },
    { month: "Jun", revenue: 2390 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Tableau de bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Propriétés</CardTitle>
            <Building2 className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.proprietes}</div>
            <p className="text-xs text-gray-600">
              +2 depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.reservations}</div>
            <p className="text-xs text-gray-600">
              +5 depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Revenus</CardTitle>
            <DollarSign className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.charges.toLocaleString('fr-FR')} €</div>
            <p className="text-xs text-gray-600">
              +10% depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Locataires</CardTitle>
            <Users2 className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{stats.locataires}</div>
            <p className="text-xs text-gray-600">
              +1 depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Réservations récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations.length > 0 ? (
                recentReservations.map((reservation) => (
                  <div key={reservation.id_reservation} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-black">{reservation.propriete.nom}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(reservation.date_debut).toLocaleDateString('fr-FR')} - {new Date(reservation.date_fin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black">{reservation.prix_total} €</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">
                  Aucune réservation récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-black">Propriétés récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProprietes.length > 0 ? (
                recentProprietes.map((propriete) => (
                  <div key={propriete.id_propriete} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-black">{propriete.nom}</p>
                      <p className="text-sm text-gray-600">
                        {propriete.ville}, {propriete.pays}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black">{propriete.typePropriete.libelle}</p>
                      <p className="text-sm text-gray-600">{propriete.nb_pieces} pièces</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">
                  Aucune propriété récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 