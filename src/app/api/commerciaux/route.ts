import { NextResponse } from 'next/server'
import { getCommerciaux } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const commerciaux = await getCommerciaux()
    return NextResponse.json(commerciaux)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erreur interne' }, { status: 500 })
  }
}
