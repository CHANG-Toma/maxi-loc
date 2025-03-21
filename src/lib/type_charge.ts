import { prisma } from "@/lib/prisma";

export class TypeChargeService {
  async getAll() {
    return await prisma.typeCharge.findMany();
  }

  async create(data: { nom: string }) {
    return await prisma.typeCharge.create({ data });
  }

  async getById(id: number) {
    return await prisma.typeCharge.findUnique({ where: { id_type_charge: id } });
  }

  async update(id: number, data: { nom: string }) {
    return await prisma.typeCharge.update({ where: { id_type_charge: id }, data });
  }

  async delete(id: number) {
    return await prisma.typeCharge.delete({ where: { id_type_charge: id } });
  }
}
