import { prisma } from '@/lib/prisma'

export class ContratService {
  async getAll() {
    return await prisma.contrat.findMany()
  }

  async create(data: { date_signature: Date, date_expiration: Date, montant: number, id_client: number, id_propriete: number, montant_loyer: number, date_debut: Date, date_fin: Date }) {
    return await prisma.contrat.create({ data })
  }

  async getById(id: number) {
    return await prisma.contrat.findUnique({ where: { id_contrat: id } })
  }

  async update(id: number, data: { date_signature: Date, date_expiration: Date, montant: number, id_client: number, id_propriete: number }) {
    return await prisma.contrat.update({ where: { id_contrat: id }, data })
  }

  async delete(id: number) {
    return await prisma.contrat.delete({ where: { id_contrat: id } })
  }
}
