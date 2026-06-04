import { NextRequest, NextResponse } from 'next/server'

const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
)

export async function POST(req: NextRequest) {
  try {
    const { documents } = await req.json()

    if (!Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json({ error: 'Aucun document à importer' }, { status: 400 })
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json({ count: documents.length, demo: true })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const upsertedCommercials = [...new Set(documents.map((d: { commercial_nom: string }) => d.commercial_nom))]
    for (const nom of upsertedCommercials) {
      await supabase.from('commerciaux').upsert({ nom, objectif_mensuel: 0 }, { onConflict: 'nom', ignoreDuplicates: true })
    }

    const BATCH = 100
    let inserted = 0
    for (let i = 0; i < documents.length; i += BATCH) {
      const batch = documents.slice(i, i + BATCH)
      const { error } = await supabase.from('documents').insert(batch)
      if (error) throw new Error(error.message)
      inserted += batch.length
    }

    return NextResponse.json({ count: inserted })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erreur interne' }, { status: 500 })
  }
}
