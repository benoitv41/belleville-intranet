import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

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

    // Use service role key to bypass RLS for server-side imports
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey)

    const upsertedCommercials = [...new Set(documents.map((d: { commercial_nom: string }) => d.commercial_nom))]
    for (const nom of upsertedCommercials) {
      await supabase.from('commerciaux').upsert({ nom, objectif_mensuel: 0 }, { onConflict: 'nom', ignoreDuplicates: true })
    }

    const BATCH = 100
    let inserted = 0
    let skipped = 0

    const withNumero = documents.filter((d: { numero?: string }) => d.numero)
    const withoutNumero = documents.filter((d: { numero?: string }) => !d.numero)

    // Upsert docs with a numero — skips duplicates
    for (let i = 0; i < withNumero.length; i += BATCH) {
      const batch = withNumero.slice(i, i + BATCH)
      const { data, error } = await supabase
        .from('documents')
        .upsert(batch, { onConflict: 'numero', ignoreDuplicates: true })
        .select('id')
      if (error) throw new Error(error.message)
      inserted += data?.length ?? 0
      skipped += batch.length - (data?.length ?? 0)
    }

    // Insert docs without numero (no dedup possible)
    for (let i = 0; i < withoutNumero.length; i += BATCH) {
      const batch = withoutNumero.slice(i, i + BATCH)
      const { error } = await supabase.from('documents').insert(batch)
      if (error) throw new Error(error.message)
      inserted += batch.length
    }

    return NextResponse.json({ count: inserted, skipped })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erreur interne' }, { status: 500 })
  }
}
