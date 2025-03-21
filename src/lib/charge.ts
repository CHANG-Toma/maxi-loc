import { prisma } from '@/lib/prisma'

export class ChargeService {
  async getAll() {
    return await prisma.charge.findMany()
  }

  async create(data: { date_paiement: Date, montant: number, id_type_charge: number, id_propriete: number }) {
    return await prisma.charge.create({ data })
  }

  async getById(id: number) {
    return await prisma.charge.findUnique({ where: { id_charge: id } })
  }

  async delete(id: number) {
    return await prisma.charge.delete({ where: { id_charge: id } })
  }
}
