"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Building2,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { NavigationService } from "@/services/navigationService";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardService } from "@/services/dashboardService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Home':
      return <Home className="w-5 h-5" />;
    case 'Building2':
      return <Building2 className="w-5 h-5" />;
    case 'Calendar':
      return <Calendar className="w-5 h-5" />;
    case 'DollarSign':
      return <DollarSign className="w-5 h-5" />;
    case 'BarChart3':
      return <BarChart3 className="w-5 h-5" />;
    case 'Settings':
      return <Settings className="w-5 h-5" />;
    case 'User':
      return <User className="w-5 h-5" />;
    case 'LogOut':
      return <LogOut className="w-5 h-5" />;
    default:
      return null;
  }
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: ReturnType<typeof DashboardService.getNavigationItems>;
  userMenuItems: ReturnType<typeof DashboardService.getUserMenuItems>;
  onLogout: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  navigationItems,
  userMenuItems,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 shadow-sm transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {isOpen && <h1 className="text-xl font-bold text-gray-900">Maxiloc</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={cn("md:flex", isOpen ? "" : "mx-auto")}
          >
            {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-1">
            {navigationItems.map((item) => (
              <TooltipProvider key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full gap-2",
                        pathname === item.path
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        isOpen ? "justify-start" : "justify-center px-0"
                      )}
                      onClick={() => router.push(item.path)}
                    >
                      <div className={cn("min-w-[20px] flex justify-center")}>
                        {getIconComponent(item.icon)}
                      </div>
                      {isOpen && <span>{item.label}</span>}
                    </Button>
                  </TooltipTrigger>
                  {!isOpen && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="space-y-1">
            {userMenuItems.map((item) => (
              <TooltipProvider key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full gap-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        isOpen ? "justify-start" : "justify-center px-0"
                      )}
                      onClick={() => {
                        if (item.action === "logout") {
                          onLogout();
                        } else if (item.path) {
                          router.push(item.path);
                        }
                      }}
                    >
                      <div className={cn("min-w-[20px] flex justify-center")}>
                        {getIconComponent(item.icon)}
                      </div>
                      {isOpen && <span>{item.label}</span>}
                    </Button>
                  </TooltipTrigger>
                  {!isOpen && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
