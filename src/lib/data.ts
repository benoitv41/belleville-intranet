import { createClient } from '@supabase/supabase-js'
import { Document, Commercial } from './types'

const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
)

function getSupabaseClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

export async function getDocuments(): Promise<Document[]> {
  if (!isSupabaseConfigured) {
    const { DEMO_DOCUMENTS } = await import('./demo-data')
    return DEMO_DOCUMENTS
  }
  const supabase = getSupabaseClient()
  const PAGE = 1000
  const all: Document[] = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('date', { ascending: false })
      .range(from, from + PAGE - 1)
    if (error) throw new Error(error.message)
    all.push(...((data || []) as Document[]))
    if (!data || data.length < PAGE) break
    from += PAGE
  }
  return all
}

export async function getCommerciaux(): Promise<Commercial[]> {
  if (!isSupabaseConfigured) {
    const { DEMO_COMMERCIAUX } = await import('./demo-data')
    return DEMO_COMMERCIAUX
  }
  const supabase = getSupabaseClient()
  const { data } = await supabase.from('commerciaux').select('*').eq('actif', true).order('nom')
  return (data || []) as Commercial[]
}

export { isSupabaseConfigured }
