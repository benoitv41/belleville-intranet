import { NextResponse } from 'next/server'
import { getDocuments } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const documents = await getDocuments()
    return NextResponse.json(documents)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erreur interne' }, { status: 500 })
  }
}
