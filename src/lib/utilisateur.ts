import { prisma } from "@/lib/prisma";
import { Utilisateur } from "@prisma/client";

export class UtilisateurService {
  async getAll() {
    return await prisma.utilisateur.findMany();
  }

  async create(data: Omit<Utilisateur, "id_utilisateur">) {
    return await prisma.utilisateur.create({
      data
    });
  }

  async update(id: string, utilisateur: Utilisateur) {
    return await prisma.utilisateur.update({
      where: { id_utilisateur: parseInt(id) },
      data: utilisateur,
    });
  }

  async delete(id: string) {
    return await prisma.utilisateur.delete({
      where: { id_utilisateur: parseInt(id) },
    });
  }
  
}
