"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Building2,
  Calendar,
  Users2,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

const navigationItems = [
  { icon: <Home className="w-5 h-5" />, label: "Accueil", path: "/dashboard" },
  {
    icon: <Building2 className="w-5 h-5" />,
    label: "Propriétés",
    path: "/dashboard/proprietes",
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    label: "Charges",
    path: "/dashboard/charges",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    label: "Réservations",
    path: "/dashboard/reservations",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Rapports",
    path: "/dashboard/rapports",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "Paramètres",
    path: "/dashboard/parametres",
  },
];

export function Sidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen 
}: { 
  isSidebarOpen: boolean, 
  setIsSidebarOpen?: (open: boolean) => void 
}) {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ width: "64px" }}
      animate={{ 
        width: isSidebarOpen ? "16rem" : "64px" 
      }}
      className="bg-white border-r border-gray-200 fixed h-full z-30 overflow-hidden transition-all duration-300"
    >
      <div className="p-4">
        <h2 className={`text-xl font-bold text-gray-800 mb-6 ${isSidebarOpen ? 'block' : 'hidden'}`}>MaxiLoc</h2>
        <nav className="space-y-2">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'} text-gray-600 hover:text-gray-700 hover:bg-gray-50 w-full p-2 rounded-lg transition-colors ${
                pathname === item.path ? "bg-gray-100 text-gray-900" : ""
              }`}
              title={isSidebarOpen ? "" : item.label}
            >
              {item.icon}
              <span className={isSidebarOpen ? "block" : "hidden"}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}

export default Sidebar;
