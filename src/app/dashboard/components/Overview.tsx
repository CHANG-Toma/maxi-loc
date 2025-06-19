"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { OverviewService, DashboardStats, RevenusData, ReservationRecente } from "@/services/overviewService";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

const formatNumber = (value: number | null): string => {
  if (value === null || value === undefined) return '0';
  return value.toLocaleString('fr-FR');
};

const Overview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    revenus_mensuels: 0,
    proprietes_actives: 0,
    taux_occupation: 0,
    reservations: 0,
    variation_revenus: 0,
    variation_proprietes: 0,
    variation_occupation: 0,
    variation_reservations: 0
  });
  const [revenusData, setRevenusData] = useState<RevenusData[]>([]);
  const [reservationsRecentes, setReservationsRecentes] = useState<ReservationRecente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboardStats, revenus, reservations] = await Promise.all([
          OverviewService.getDashboardStats(),
          OverviewService.getRevenusData(),
          OverviewService.getReservationsRecentes()
        ]);

        setStats(dashboardStats);
        setRevenusData(revenus);
        setReservationsRecentes(reservations);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        // En cas d'erreur, on garde les valeurs par défaut
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cartes statistiques */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Revenus mensuels</span>
              <span className="text-2xl font-bold">{formatNumber(stats.revenus_mensuels)} €</span>
              <span className="text-xs text-green-500">+{formatNumber(stats.variation_revenus)}% vs le dernier mois</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Propriétés Actives</span>
              <span className="text-2xl font-bold">{formatNumber(stats.proprietes_actives)}</span>
              <span className="text-xs text-green-500">+{formatNumber(stats.variation_proprietes)} vs le dernier mois</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Taux d&apos;Occupation</span>
              <span className="text-2xl font-bold">{formatNumber(stats.taux_occupation)}%</span>
              <span className="text-xs text-green-500">+{formatNumber(stats.variation_occupation)}% vs le dernier mois</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Réservations</span>
              <span className="text-2xl font-bold">{formatNumber(stats.reservations)}</span>
              <span className="text-xs text-green-500">+{formatNumber(stats.variation_reservations)} vs le dernier mois</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique des revenus mensuels */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium">Revenus mensuels</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="mois" 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tickMargin={8}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    tickMargin={8}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatNumber(value) + ' €', 'Revenus']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      padding: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="montant" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-medium">Activité récente</h3>
            <div className="space-y-4">
              {reservationsRecentes.map((reservation) => (
                <div key={reservation.id} className="flex items-center space-x-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <Calendar className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Nouvelle réservation</span>
                    <span className="text-sm text-gray-500">{reservation.propriete}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
