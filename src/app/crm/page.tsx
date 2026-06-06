import { KanbanBoard } from '@/components/crm/KanbanBoard'
import { getCommerciaux } from '@/lib/data'
import { createClient } from '@supabase/supabase-js'
import { Opportunite } from '@/lib/crm'

export const dynamic = 'force-dynamic'

async function getOpportunites(): Promise<Opportunite[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url === 'https://placeholder.supabase.co') return []
  const supabase = createClient(url, key)
  const { data } = await supabase.from('opportunites').select('*').order('created_at', { ascending: false })
  return (data || []) as Opportunite[]
}

export default async function CrmPage() {
  const [opportunites, commerciaux] = await Promise.all([getOpportunites(), getCommerciaux()])

  return (
    <div className="p-6 flex flex-col" style={{ height: 'calc(100vh - 0px)' }}>
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold" style={{ color: '#1C3461' }}>CRM — Opportunités</h1>
        <p className="text-gray-500 text-sm mt-0.5">Suivi du pipeline commercial par étape</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          initialOpportunites={opportunites}
          commerciaux={commerciaux.map(c => c.nom)}
        />
      </div>
    </div>
  )
}
