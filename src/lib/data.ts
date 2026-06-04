import { Document, Commercial } from './types'

const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
)

export async function getDocuments(): Promise<Document[]> {
  if (!isSupabaseConfigured) {
    const { DEMO_DOCUMENTS } = await import('./demo-data')
    return DEMO_DOCUMENTS
  }
  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()
  const { data } = await supabase.from('documents').select('*').order('date', { ascending: false })
  return (data || []) as Document[]
}

export async function getCommerciaux(): Promise<Commercial[]> {
  if (!isSupabaseConfigured) {
    const { DEMO_COMMERCIAUX } = await import('./demo-data')
    return DEMO_COMMERCIAUX
  }
  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()
  const { data } = await supabase.from('commerciaux').select('*').order('nom')
  return (data || []) as Commercial[]
}

export { isSupabaseConfigured }
