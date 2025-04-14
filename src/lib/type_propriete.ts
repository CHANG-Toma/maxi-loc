import { prisma } from "@/lib/prisma";

export class TypeProprieteService {
  async getAll() {
    return await prisma.typePropriete.findMany();
  }

  async create(data: { nom: string }) {
    return await prisma.typePropriete.create({ data: { libelle: data.nom } });
  }

  async update(id: number, data: { nom: string }) {
    return await prisma.typePropriete.update({ where: { id_type_propriete: id }, data });
  }

  async delete(id: number) {
    return await prisma.typePropriete.delete({ where: { id_type_propriete: id } });
  }

  async getById(id: number) {
    return await prisma.typePropriete.findUnique({ where: { id_type_propriete: id } });
  }

  async getProprietesByTypePropriete(id: number) {
    return await prisma.propriete.findMany({ where: { id_type_propriete: id } });
  }
}
