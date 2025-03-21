"use client"

import { motion } from "framer-motion";
import { BarChart, LineChart, PieChart } from "lucide-react";
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
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

export default function ReportsPage() {
  // Récupérer les données des rapports de la base de données ici
  const monthlyRevenue = [
    { name: "Jan", revenue: 4000 },
    { name: "Fév", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Avr", revenue: 2780 },
    { name: "Mai", revenue: 1890 },
    { name: "Juin", revenue: 2390 },
    { name: "Juil", revenue: 3490 },
    { name: "Août", revenue: 4000 },
    { name: "Sep", revenue: 3200 },
    { name: "Oct", revenue: 2800 },
    { name: "Nov", revenue: 2600 },
    { name: "Déc", revenue: 3800 }
  ];

  // Récupérer les données des rapports de la base de données ici
  const occupancyRate = [
    { name: "Jan", rate: 65 },
    { name: "Fév", rate: 59 },
    { name: "Mar", rate: 80 },
    { name: "Avr", rate: 55 },
    { name: "Mai", rate: 40 },
    { name: "Juin", rate: 70 },
    { name: "Juil", rate: 95 },
    { name: "Août", rate: 98 },
    { name: "Sep", rate: 75 },
    { name: "Oct", rate: 65 },
    { name: "Nov", rate: 58 },
    { name: "Déc", rate: 90 }
  ];

  // Récupérer les données des sources de réservation de la base de données ici
  const bookingSources = [
    { name: "Site web", value: 45 },
    { name: "Airbnb", value: 25 },
    { name: "Booking.com", value: 20 },
    { name: "Autres", value: 10 }
  ];

  const COLORS = ["#007AFF", "#34C759", "#FF9500", "#FF3B30"];

  return (
    <Dashboard>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Rapports</h2>
          <Button className="bg-black text-white hover:bg-primary/90 cursor-pointer">
            Exporter les données
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center mb-4">
              <BarChart className="w-5 h-5 mr-2 text-gray-900" />
              <h3 className="text-lg font-semibold text-gray-900">Revenus mensuels</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart
                data={monthlyRevenue}
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
                <Tooltip formatter={(value) => [`${value}€`, "Revenu"]} />
                <Legend />
                <Bar dataKey="revenue" fill="#007AFF" name="Revenu (€)" />
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
              <LineChart className="w-5 h-5 mr-2 text-gray-900" />
              <h3 className="text-lg font-semibold text-gray-900">Taux d'occupation</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart
                data={occupancyRate}
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
                <Tooltip formatter={(value) => [`${value}%`, "Taux d'occupation"]} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#34C759" 
                  activeDot={{ r: 8 }} 
                  name="Taux d'occupation (%)" 
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center mb-4">
              <PieChart className="w-5 h-5 mr-2 text-gray-900" />
              <h3 className="text-lg font-semibold text-gray-900">Sources de réservation</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={bookingSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Pourcentage"]} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center mb-4">
              <BarChart className="w-5 h-5 mr-2 text-gray-900" />
              <h3 className="text-lg font-semibold text-gray-900">Performances des propriétés</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Villa Vue Mer</span>
                  <span className="text-sm font-medium text-gray-900">12,500€</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Appartement Haussmannien</span>
                  <span className="text-sm font-medium text-gray-900">3,200€</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Chalet Montagne</span>
                  <span className="text-sm font-medium text-gray-900">8,400€</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Dashboard>
  );
}
