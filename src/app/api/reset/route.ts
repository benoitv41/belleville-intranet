import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
)

export async function DELETE() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: 'Supabase non configuré' }, { status: 400 })
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)

  const { error: docsError } = await supabase.from('documents').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (docsError) return NextResponse.json({ error: docsError.message }, { status: 500 })

  const { error: comError } = await supabase.from('commerciaux').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (comError) return NextResponse.json({ error: comError.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
