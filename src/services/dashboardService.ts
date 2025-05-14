import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export class DashboardService {
  static async handleLogout(router: ReturnType<typeof useRouter>) {
    const result = await logout();
    if (result.success) {
      router.push("/login");
    }
  }

  static getNavigationItems() {
    return [
      {
        icon: "Home",
        label: "Tableau de bord",
        path: "/dashboard",
      },
      {
        icon: "Building2",
        label: "Propriétés",
        path: "/dashboard/proprietes",
      },
      {
        icon: "Calendar",
        label: "Réservations",
        path: "/dashboard/reservations",
      },
      {
        icon: "DollarSign",
        label: "Charges",
        path: "/dashboard/charges",
      },
      {
        icon: "BarChart3",
        label: "Rapports",
        path: "/dashboard/rapports",
      },
      {
        icon: "Settings",
        label: "Paramètres",
        path: "/dashboard/parametres",
      },
    ];
  }

  static getUserMenuItems() {
    return [
      {
        icon: "User",
        label: "Mon profil",
        path: "/dashboard/parametres",
      },
      {
        icon: "LogOut",
        label: "Déconnexion",
        action: "logout",
      },
    ];
  }
} 