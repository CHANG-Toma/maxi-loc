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
import { cn } from "@/lib/utils";

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
  montant_total?: number;
  statut?: string;
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

const Overview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    proprietes: 12,
    reservations: 45,
    charges: 12234,
    locataires: 8
  });
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([{
    id_reservation: 1,
    propriete: {
      id_propriete: 1,
      nom: "Villa Méditerranée"
    },
    date_debut: "2024-03-01",
    date_fin: "2024-03-08",
    id_statut_reservation: 1,
    prix_total: 1200
  }]);
  const [recentProprietes, setRecentProprietes] = useState<Propriete[]>([{
    id_propriete: 1,
    nom: "Villa Méditerranée",
    ville: "Nice",
    pays: "France",
    typePropriete: {
      id_type_propriete: 1,
      libelle: "Villa"
    },
    nb_pieces: 5
  }]);
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
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propriétés</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.proprietes}</div>
            <p className="text-xs text-muted-foreground">
              +2 depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reservations}</div>
            <p className="text-xs text-muted-foreground">
              +5 depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.charges.toLocaleString('fr-FR')} €</div>
            <p className="text-xs text-muted-foreground">
              +10% depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locataires</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.locataires}</div>
            <p className="text-xs text-muted-foreground">
              +1 depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Réservations récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReservations.length > 0 ? (
                recentReservations.map((reservation) => (
                  <div key={reservation.id_reservation} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{reservation.propriete.nom}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reservation.date_debut).toLocaleDateString('fr-FR')} - {new Date(reservation.date_fin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{reservation.prix_total} €</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune réservation récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Propriétés récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProprietes.length > 0 ? (
                recentProprietes.map((propriete) => (
                  <div key={propriete.id_propriete} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{propriete.nom}</p>
                      <p className="text-sm text-muted-foreground">
                        {propriete.ville}, {propriete.pays}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{propriete.typePropriete.libelle}</p>
                      <p className="text-sm text-muted-foreground">{propriete.nb_pieces} pièces</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune propriété récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
