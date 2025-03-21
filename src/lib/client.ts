import { prisma } from '@/lib/prisma'

export class ClientService {
  async getAll() {
    return await prisma.client.findMany()
  }

  async create(data: { nom: string, prenom: string, email: string, telephone: string }) {
    return await prisma.client.create({ data })
  }

  async getById(id: number) {
    return await prisma.client.findUnique({ where: { id_client: id } })
  }

  async update(id: number, data: { nom: string, prenom: string, email: string, telephone: string }) {
    return await prisma.client.update({ where: { id_client: id }, data })
  }

  async delete(id: number) {
    return await prisma.client.delete({ where: { id_client: id } })
  }

  async getClientById(id: number) {
    return await prisma.client.findUnique({ where: { id_client: id } })
  }
  
  
}
