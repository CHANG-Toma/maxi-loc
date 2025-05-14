"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

interface User {
  id_utilisateur: number;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
  error: null,
  refreshSession: async () => {},
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error("Erreur lors du chargement de l'utilisateur:", err);
      setError("Impossible de charger les données utilisateur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const refreshSession = async () => {
    await loadUser();
  };

  return (
    <SessionContext.Provider value={{ user, loading, error, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
} 