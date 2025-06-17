"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, PieChart, Loader2 } from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";
import { getChargesParMois, getChargesParType, getChargesParPropriete } from "@/lib/rapport";
import { Card, CardContent } from "../../../components/ui/card";

interface ChargeType {
  name: string;
  value: number;
}

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [chargesParMois, setChargesParMois] = useState<unknown[]>([]);
  const [chargesParType, setChargesParType] = useState<ChargeType[]>([]);
  const [chargesParPropriete, setChargesParPropriete] = useState<unknown[]>([]);
  const [totalCharges, setTotalCharges] = useState(0);
  const [nbCharges, setNbCharges] = useState(0);
  const [topProprietes, setTopProprietes] = useState<unknown[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Charger toutes les données
        const [moisResult, typeResult, proprieteResult] = await Promise.all([
          getChargesParMois(),
          getChargesParType(),
          getChargesParPropriete()
        ]);

        if (moisResult.success && moisResult.data) {
          setChargesParMois(moisResult.data);
        }

        if (typeResult.success && typeResult.data) {
          setChargesParType(typeResult.data);
        }

        if (proprieteResult.success && proprieteResult.data) {
          setChargesParPropriete(proprieteResult.data);
          // Total des charges de l'année
          const total = proprieteResult.data.reduce((sum, item) => sum + item.montant, 0);
          setTotalCharges(total);
          // Nombre total de charges (somme des charges par propriété)
          setNbCharges(proprieteResult.data.length);
          // Top 3 propriétés les plus coûteuses
          const top3 = [...proprieteResult.data].sort((a, b) => b.montant - a.montant).slice(0, 3);
          setTopProprietes(top3);
        }

        if (!moisResult.success || !typeResult.success || !proprieteResult.success) {
          console.error("Erreur lors du chargement des données");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const COLORS = ["#007AFF", "#34C759", "#FF9500", "#FF3B30", "#5856D6", "#FF2D55"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Total charges (année en cours)</span>
              <span className="text-2xl font-bold text-black">{totalCharges.toLocaleString('fr-FR')} €</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-gray-500">Nombre de propriétés avec charges</span>
              <span className="text-2xl font-bold text-black">{nbCharges}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 propriétés les plus coûteuses */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 3 propriétés les plus coûteuses</h3>
        <div className="space-y-2">
          {topProprietes.map((item, idx) => (
            <div key={item.name} className="flex items-center">
              <span className="w-8 text-lg font-bold text-gray-700">#{idx + 1}</span>
              <span className="flex-1 text-gray-900">{item.name}</span>
              <span className="ml-2 font-semibold text-black">{item.montant.toLocaleString('fr-FR')} €</span>
            </div>
          ))}
          {topProprietes.length === 0 && <span className="text-gray-500">Aucune donnée</span>}
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center mb-4">
            <BarChart className="w-5 h-5 mr-2 text-gray-900" />
            <h3 className="text-lg font-semibold text-gray-900">Évolution mensuelle des charges</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart
              data={chargesParMois}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}€`, "Montant"]} />
              <Legend />
              <Bar dataKey="montant" fill="#007AFF" name="Montant (€)" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center mb-4">
            <PieChart className="w-5 h-5 mr-2 text-gray-900" />
            <h3 className="text-lg font-semibold text-gray-900">Répartition par type de charge</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={chargesParType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chargesParType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}€`, "Montant"]} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm col-span-2"
        >
          <div className="flex items-center mb-4">
            <BarChart className="w-5 h-5 mr-2 text-gray-900" />
            <h3 className="text-lg font-semibold text-gray-900">Répartition des charges par propriété</h3>
          </div>
          <div className="space-y-4">
            {chargesParPropriete.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  <span className="text-sm font-medium text-black">
                    {item.montant.toLocaleString('fr-FR')}€
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${item.pourcentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
