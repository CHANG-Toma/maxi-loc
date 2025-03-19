
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

const Overview = () => {
  const data = [
    { month: "Jan", revenue: 4000 },
    { month: "Fév", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Avr", revenue: 2780 },
    { month: "Mai", revenue: 6890 },
    { month: "Jun", revenue: 2390 },
  ];

  const stats = [
    {
      title: "Revenus Mensuels",
      value: "12,500€",
      change: "+12%",
      icon: <DollarSign className="w-4 h-4" />,
      trend: "up",
    },
    {
      title: "Propriétés Actives",
      value: "25",
      change: "+2",
      icon: <Building2 className="w-4 h-4" />,
      trend: "up",
    },
    {
      title: "Taux d'Occupation",
      value: "89%",
      change: "+5%",
      icon: <Users2 className="w-4 h-4" />,
      trend: "up",
    },
    {
      title: "Réservations",
      value: "156",
      change: "+18",
      icon: <Calendar className="w-4 h-4" />,
      trend: "up",
    },
  ];

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs mois dernier</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-6"
      >
        <h3 className="text-lg font-semibold mb-4">Revenus Mensuels</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#007AFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4">Activité Récente</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Nouvelle réservation</p>
                  <p className="text-sm text-gray-500">Appartement Paris 15</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Il y a 2h</span>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Overview;
