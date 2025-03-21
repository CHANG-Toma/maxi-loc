import { NextResponse } from "next/server";
import { ReservationService } from "@/lib/reservation";

export async function GET() {
  const reservationService = new ReservationService();
  const reservations = await reservationService.getAll();
  return NextResponse.json(reservations);
}

export async function POST(request: Request) {
  const reservationService = new ReservationService();
  const body = await request.json();
  const reservation = await reservationService.create(body);
  return NextResponse.json(reservation);
}

export async function PUT(request: Request) {
  const reservationService = new ReservationService();
  const { id, ...data } = await request.json();
  const reservation = await reservationService.update(id, data);
  return NextResponse.json(reservation);
}

export async function DELETE(request: Request) {
  const reservationService = new ReservationService();
  const { id } = await request.json();
  const reservation = await reservationService.delete(id);
  return NextResponse.json(reservation);
}


