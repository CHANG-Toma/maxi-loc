"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, PieChart, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import Dashboard from "../page";
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

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chargesParMois, setChargesParMois] = useState<any[]>([]);
  const [chargesParType, setChargesParType] = useState<any[]>([]);
  const [chargesParPropriete, setChargesParPropriete] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

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
        }

        if (!moisResult.success || !typeResult.success || !proprieteResult.success) {
          setError("Erreur lors du chargement des données");
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

  const COLORS = ["#007AFF", "#34C759", "#FF9500", "#FF3B30", "#5856D6", "#FF2D55"];

  if (isLoading) {
    return (
      <Dashboard>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Rapports des charges</h2>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-800 p-4 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center mb-4">
              <BarChart className="w-5 h-5 mr-2 text-gray-900" />
              <h3 className="text-lg font-semibold text-gray-900">Charges mensuelles</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart
                data={chargesParMois}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
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
              <h3 className="text-lg font-semibold text-gray-900">Charges par propriété</h3>
            </div>
            <div className="space-y-4">
              {chargesParPropriete.map((item, index) => (
                <div key={item.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    <span className="text-sm font-medium text-gray-900">
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
    </Dashboard>
  );
}
