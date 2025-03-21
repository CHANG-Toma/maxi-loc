import { NextResponse } from "next/server";
import { PlateformeService } from "@/lib/plateforme";

export async function GET() {
  const plateformeService = new PlateformeService();
  const plateformes = await plateformeService.getAll();
  return NextResponse.json(plateformes);
}

export async function POST(request: Request) {
  const plateformeService = new PlateformeService();
  const body = await request.json();
  const plateforme = await plateformeService.create(body);
  return NextResponse.json(plateforme);
}

export async function PUT(request: Request) {
  const plateformeService = new PlateformeService();
  const { id, ...data } = await request.json();
  const plateforme = await plateformeService.update(id, data);
  return NextResponse.json(plateforme);
}

export async function DELETE(request: Request) {
  const plateformeService = new PlateformeService();
  const { id } = await request.json();
  const plateforme = await plateformeService.delete(id);
  return NextResponse.json(plateforme);
}

