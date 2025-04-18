"use server"

import { deleteSession, validateSession } from "@/lib/session";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (!sessionToken) {
      return null;
    }

    return await validateSession(sessionToken);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (sessionToken) {
      await deleteSession(sessionToken);
    }
    
    await cookieStore.delete("session");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return { success: false, error: "Erreur lors de la déconnexion" };
  }
} 