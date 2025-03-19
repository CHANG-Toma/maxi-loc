
"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Building2, 
  Calendar, 
  CreditCard, 
  Home, 
  Menu, 
  Settings, 
  Users2 
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navigationItems = [
    { icon: <Home className="w-5 h-5" />, label: "Accueil", path: "/dashboard" },
    { icon: <Building2 className="w-5 h-5" />, label: "Propriétés", path: "/dashboard/properties" },
    { icon: <Calendar className="w-5 h-5" />, label: "Réservations", path: "/dashboard/bookings" },
    { icon: <Users2 className="w-5 h-5" />, label: "Clients", path: "/dashboard/clients" },
    { icon: <CreditCard className="w-5 h-5" />, label: "Paiements", path: "/dashboard/payments" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Rapports", path: "/dashboard/reports" },
    { icon: <Settings className="w-5 h-5" />, label: "Paramètres", path: "/dashboard/settings" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isSidebarOpen ? 0 : -250 }}
        className="w-64 bg-white border-r border-gray-200 fixed h-full z-30"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h2>
          <nav className="space-y-2">
            {navigationItems.map((item, index) => (
              <Link 
                key={index}
                href={item.path}
                className={`flex items-center space-x-3 text-gray-600 hover:text-primary hover:bg-gray-50 w-full p-2 rounded-lg transition-colors ${
                  pathname === item.path ? 'bg-gray-50 text-primary' : ''
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Aide
            </Button>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
