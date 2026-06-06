import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
)

function getClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export async function GET() {
  if (!isSupabaseConfigured) return NextResponse.json([])
  const supabase = getClient()
  const { data, error } = await supabase
    .from('opportunites')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: 'Supabase non configuré' }, { status: 400 })
  const body = await req.json()
  const supabase = getClient()
  const { data, error } = await supabase
    .from('opportunites')
    .insert({ ...body, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
