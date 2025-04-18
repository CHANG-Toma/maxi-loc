"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { DashboardService } from "@/services/dashboardService";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigationItems = DashboardService.getNavigationItems();
  const userMenuItems = DashboardService.getUserMenuItems();

  const handleLogout = async () => {
    await DashboardService.handleLogout(router);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navigationItems={navigationItems}
        userMenuItems={userMenuItems}
        onLogout={handleLogout}
      />
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isSidebarOpen ? "pl-64" : "pl-16"
      )}>
        <header className="sticky top-0 bg-white shadow-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-4">
              {/* User menu */}
            </div>
          </div>
        </header>
        <motion.main 
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-6 py-8">{children}</div>
        </motion.main>
      </div>
    </div>
  );
} 