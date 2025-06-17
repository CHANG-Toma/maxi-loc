import { cookies } from "next/headers";
import { validateSession } from "@/lib/session";

export async function getUserData() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (!sessionToken) {
      return null;
    }

    const user = await validateSession(sessionToken);
    return user;
  } catch (error) {
    console.error("Erreur lors du chargement des données utilisateur:", error);
    return null;
  }
}

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
} 