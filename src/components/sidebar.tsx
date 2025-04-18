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
} from "lucide-react";
import { motion } from "framer-motion";
import { NavigationService } from "@/services/navigationService";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardService } from "@/services/dashboardService";

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
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Maxiloc</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.path
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => router.push(item.path)}
              >
                {getIconComponent(item.icon)}
                {item.label}
              </Button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="space-y-1">
            {userMenuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => {
                  if (item.action === "logout") {
                    onLogout();
                  } else if (item.path) {
                    router.push(item.path);
                  }
                }}
              >
                {getIconComponent(item.icon)}
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
