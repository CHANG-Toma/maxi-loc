import { NextResponse } from "next/server";
import { TypeProprieteService } from "@/lib/type_propriete";

export async function GET() {
  const typeProprieteService = new TypeProprieteService();
  const typeProprietes = await typeProprieteService.getAll();
  return NextResponse.json(typeProprietes);
}

export async function POST(request: Request) {
  const typeProprieteService = new TypeProprieteService();
  const body = await request.json();
  const typePropriete = await typeProprieteService.create(body);
  return NextResponse.json(typePropriete);
}

export async function PUT(request: Request) {
  const typeProprieteService = new TypeProprieteService();
  const { id, ...data } = await request.json();
  const typePropriete = await typeProprieteService.update(id, data);
  return NextResponse.json(typePropriete);
}

export async function DELETE(request: Request) {    
  const typeProprieteService = new TypeProprieteService();
  const { id } = await request.json();
  const typePropriete = await typeProprieteService.delete(id);
  return NextResponse.json(typePropriete);
}


  
