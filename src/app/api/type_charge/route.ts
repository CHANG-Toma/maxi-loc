import { NextResponse } from "next/server";
import { TypeChargeService } from "@/lib/type_charge";

export async function GET() {
  const typeChargeService = new TypeChargeService();
  const typeCharges = await typeChargeService.getAll();
  return NextResponse.json(typeCharges);
}

export async function POST(request: Request) {
  const typeChargeService = new TypeChargeService();
  const body = await request.json();
  const typeCharge = await typeChargeService.create(body);
  return NextResponse.json(typeCharge);
}

export async function PUT(request: Request) {
  const typeChargeService = new TypeChargeService();
  const { id, ...data } = await request.json();
  const typeCharge = await typeChargeService.update(id, data);
  return NextResponse.json(typeCharge);
}

export async function DELETE(request: Request) {
  const typeChargeService = new TypeChargeService();
  const { id } = await request.json();
  const typeCharge = await typeChargeService.delete(id);
  return NextResponse.json(typeCharge);
}



