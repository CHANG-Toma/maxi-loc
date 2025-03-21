// Prisma
import { prisma } from "@/lib/prisma";
import { Client } from "@prisma/client";

import { NextResponse } from "next/server";

export class UserRoute {
  static async getAllUsers() {
    const users = await prisma.client.findMany();
    return NextResponse.json(users);
  }

  static async getUserById(id: string) {
    const user = await prisma.client.findUnique({
      where: { id_client: parseInt(id) },
    });
    return NextResponse.json(user);
  }

  static async createUser(user: Client) {
    const newUser = await prisma.client.create({
      data: user,
    });
    return NextResponse.json(newUser);
  }

  static async updateUser(id: string, user: Client) {
    const updatedUser = await prisma.client.update({
      where: { id_client: parseInt(id) },
      data: user,
    });
    return NextResponse.json(updatedUser);
  }

  static async deleteUser(id: string) {
    const deletedUser = await prisma.client.delete({
      where: { id_client: parseInt(id) },
    });
    return NextResponse.json(deletedUser);
  }
}
