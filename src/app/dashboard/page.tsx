"use client"

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Building2, 
  Calendar, 
  ChevronDown, 
  CreditCard, 
  DollarSign, 
  Home, 
  LogOut,
  Menu, 
  Settings, 
  User,
  Users2 
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Overview from "./components/Overview";
import { Sidebar } from "../../components/sidebar";
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu,
  MenubarTrigger 
} from "@/components/ui/menubar";
import { ReactNode } from "react";
import { logout } from "@/lib/auth";

export default function Dashboard({ children }: { children?: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/login");
    }
  };

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
            className="text-gray-900 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-4">
            {/* User Avatar + dropdown menu */}
            <Menubar className="border-0 bg-white p-0 h-auto">
              <MenubarMenu>
                <MenubarTrigger className="p-0 focus:bg-transparent data-[state=open]:bg-transparent cursor-pointer">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                </MenubarTrigger>
                <MenubarContent className="bg-white">
                  <MenubarItem className="flex gap-2 text-gray-900 cursor-pointer hover:bg-gray-100">
                    <User className="w-4 h-4" />
                    <a href="/dashboard/parametres">Mon profil</a>
                  </MenubarItem>
                  <MenubarItem 
                    className="flex gap-2 text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {children || <Overview />}  
        </main>
      </div>
    </div>
  );
}
