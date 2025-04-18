"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { DashboardService } from "@/services/dashboardService";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(!isSidebarOpen)}
        navigationItems={navigationItems}
        userMenuItems={userMenuItems}
        onLogout={handleLogout}
      />
      
      <div className={cn(
        "transition-all duration-300",
        isSidebarOpen ? "pl-64" : "pl-16"
      )}>
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Maxiloc</h1>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100">
                  <Avatar>
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-semibold text-gray-900">Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => router.push("/dashboard/profile")}
                  className="text-gray-900 hover:bg-gray-100 cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-gray-900 hover:bg-gray-100 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
} 