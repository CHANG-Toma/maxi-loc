import { prisma } from '@/lib/prisma'

export class PlateformeService {
  async getAll() {
    return await prisma.plateforme.findMany()
  }

  async create(data: { nom: string, description: string, url: string }) {
    return await prisma.plateforme.create({ data })
  }

  async getById(id: number) {
    return await prisma.plateforme.findUnique({ where: { id_plateforme: id } })
  }

  async update(id: number, data: { nom: string, description: string, url: string }) {
    return await prisma.plateforme.update({ where: { id_plateforme: id }, data })
  }

  async delete(id: number) {
    return await prisma.plateforme.delete({ where: { id_plateforme: id } })
  }
}
