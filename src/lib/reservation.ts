import { prisma } from "@/lib/prisma";

export class ReservationService {
  async getAll() {
    return await prisma.reservation.findMany()
  }

  async create(data: { date_debut: Date, date_fin: Date, prix_total: number, id_statut_reservation: number, id_propriete: number }) {
    return await prisma.reservation.create({ data })
  }

  async getById(id: number) {
    return await prisma.reservation.findUnique({ where: { id_reservation: id } })
  }

  async update(id: number, data: { date_debut: Date, date_fin: Date, prix_total: number, id_statut_reservation: number, id_propriete: number }) {
    return await prisma.reservation.update({ where: { id_reservation: id }, data })
  }

  async delete(id: number) {
    return await prisma.reservation.delete({ where: { id_reservation: id } })
  }
}
