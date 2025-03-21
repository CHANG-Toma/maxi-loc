import { NextResponse } from 'next/server'
import { ChargeService } from '@/lib/charge'

const chargeService = new ChargeService()

export async function GET() {
  const charges = await chargeService.getAll()
  return NextResponse.json(charges)
}

export async function POST(request: Request) {
  const body = await request.json()
  const charge = await chargeService.create(body)
  return NextResponse.json(charge)
}