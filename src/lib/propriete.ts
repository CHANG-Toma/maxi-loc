import { prisma } from "@/lib/prisma";

export class ProprieteService {
  async getAll() {
    return await prisma.propriete.findMany();
  }

  async create(data: {
    nom: string;
    description: string;
    prix: number;
    id_proprietaire: number;
    id_type_propriete: number;
  }) {
    return await prisma.propriete.create({ data });
  }

  async getById(id: number) {
    return await prisma.propriete.findUnique({ where: { id_propriete: id } });
  }

  async update(
    id: number,
    data: {
      nom: string;
      description: string;
      prix: number;
      id_proprietaire: number;
      id_type_propriete: number;
    }
  ) {
    return await prisma.propriete.update({ where: { id_propriete: id }, data });
  }

  async delete(id: number) {
    return await prisma.propriete.delete({ where: { id_propriete: id } });
  }
}
