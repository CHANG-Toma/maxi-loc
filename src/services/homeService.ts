import { LucideIcon } from "lucide-react";
import { Rocket, Atom, CircuitBoard, Star, Globe2, Laptop2, LineChart, Shield } from "lucide-react";

export interface Feature {
  iconName: string;
  title: string;
  description: string;
  color: string;
}

export interface FloatingIcon {
  iconName: string;
  delay: number;
  rotate: number;
}

export class HomeService {
  static getFeatures(): Feature[] {
    return [
      {
        iconName: "Rocket",
        title: "Innovation Constante",
        description: "Technologies de pointe pour une gestion optimale",
        color: "from-cyan-500 to-blue-600",
      },
      {
        iconName: "Atom",
        title: "IA Intelligente",
        description: "Prédictions et analyses automatisées",
        color: "from-fuchsia-500 to-violet-600",
      },
      {
        iconName: "CircuitBoard",
        title: "Automatisation",
        description: "Processus automatisés pour plus d'efficacité",
        color: "from-teal-400 to-emerald-600",
      },
      {
        iconName: "Star",
        title: "Performance",
        description: "Maximisez vos revenus locatifs",
        color: "from-indigo-400 to-blue-600",
      },
    ];
  }

  static getFloatingIcons(): FloatingIcon[] {
    return [
      { iconName: "Globe2", delay: 0, rotate: 20 },
      { iconName: "Laptop2", delay: 0.2, rotate: -15 },
      { iconName: "LineChart", delay: 0.4, rotate: 10 },
      { iconName: "Shield", delay: 0.6, rotate: -20 },
    ];
  }

  static getBackgroundStyles(isDarkMode: boolean) {
    return {
      gradient1: isDarkMode
        ? "bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1)_0%,transparent_100%)]"
        : "bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.3)_0%,transparent_100%)]",
      gradient2: isDarkMode
        ? "bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_100%)]"
        : "bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_100%)]",
      grid1: isDarkMode
        ? "bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px)]"
        : "bg-[linear-gradient(to_right,#4f4f4f33_1px,transparent_1px)]",
      grid2: isDarkMode
        ? "bg-[linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)]"
        : "bg-[linear-gradient(to_bottom,#4f4f4f33_1px,transparent_1px)]",
    };
  }

  static getButtonStyles(isDarkMode: boolean) {
    return {
      primary: isDarkMode
        ? "border-white bg-white text-black hover:bg-white/10"
        : "border-black bg-black text-white hover:bg-black/80",
      secondary: isDarkMode
        ? "border-gray-500 text-white"
        : "border-gray-700 text-gray-900 bg-white",
    };
  }

  static getIconComponent(iconName: string) {
    switch (iconName) {
      case 'Rocket':
        return Rocket;
      case 'Atom':
        return Atom;
      case 'CircuitBoard':
        return CircuitBoard;
      case 'Star':
        return Star;
      case 'Globe2':
        return Globe2;
      case 'Laptop2':
        return Laptop2;
      case 'LineChart':
        return LineChart;
      case 'Shield':
        return Shield;
      default:
        return null;
    }
  }
} 