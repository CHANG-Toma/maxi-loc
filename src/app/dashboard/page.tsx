"use client"

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Building2, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Home, 
  Menu, 
  Settings, 
  Users2 
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Overview from "./components/Overview";
import { Sidebar } from "../../components/sidebar";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
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
          <Overview />
        </main>
      </div>
    </div>
  );
}
