// Prisma
import { NextResponse } from "next/server";
import { UtilisateurService } from "@/lib/utilisateur";

export async function GET(req: Request) { 
  const utilisateurService = new UtilisateurService();
  const utilisateurs = await utilisateurService.getAll();
  return NextResponse.json(utilisateurs);
}

export async function POST(req: Request) {
  const { nom, prenom, email, telephone, mot_de_passe } = await req.json();
  const utilisateurService = new UtilisateurService();
  const utilisateur = await utilisateurService.create({ nom, prenom, email, telephone, mot_de_passe });
  return NextResponse.json(utilisateur);
}





