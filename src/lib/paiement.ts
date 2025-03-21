import { prisma } from '@/lib/prisma'

export class PaiementService {
  async getAll() {
    return await prisma.paiement.findMany()
  }

  async create(data: { date_paiement: Date, montant: number, id_type_paiement: number, id_contrat: number }) {
    return await prisma.paiement.create({ data })
  }

  async getById(id: number) {
    return await prisma.paiement.findUnique({ where: { id_paiement: id } })
  }

  async update(id: number, data: { date_paiement: Date, montant: number, id_type_paiement: number, id_contrat: number }) {
    return await prisma.paiement.update({ where: { id_paiement: id }, data })
  }

  async delete(id: number) {
    return await prisma.paiement.delete({ where: { id_paiement: id } })
  }
}
