import { NextResponse } from "next/server";
import { ProprieteService } from "@/lib/propriete";

export async function GET() {
  const proprieteService = new ProprieteService();
  const proprietes = await proprieteService.getAll();
  return NextResponse.json(proprietes);
}

export async function POST(request: Request) {
  const proprieteService = new ProprieteService();
  const body = await request.json();
  const propriete = await proprieteService.create(body);
  return NextResponse.json(propriete);
}

export async function PUT(request: Request) {
  const proprieteService = new ProprieteService();
  const { id, ...data } = await request.json();
  const propriete = await proprieteService.update(id, data);
  return NextResponse.json(propriete);
}

export async function DELETE(request: Request) {
  const proprieteService = new ProprieteService();
  const { id } = await request.json();
  const propriete = await proprieteService.delete(id);
  return NextResponse.json(propriete);
}


