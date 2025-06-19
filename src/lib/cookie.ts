'use client'

// Fonction utilitaire pour récupérer un cookie
export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  console.log("parts", parts);
  return undefined;
} 