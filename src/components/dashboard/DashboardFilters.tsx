'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

const PERIODES = [
  { value: 'tout', label: 'Tout' },
  { value: 'mois', label: 'Mois en cours' },
  { value: 'm1', label: 'M-1' },
  { value: 'm2', label: 'M-2' },
  { value: 'm3', label: 'M-3' },
  { value: 'trimestre', label: 'Trimestre' },
  { value: 'annee', label: 'Année en cours' },
  { value: 'a1', label: 'A-1' },
  { value: 'comparaison', label: 'Compa. A / A-1' },
]

export function DashboardFilters({ commerciaux }: { commerciaux: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const commercial = searchParams.get('commercial') || ''
  const periode = searchParams.get('periode') || 'tout'

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || value === 'tout') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <select
          value={commercial}
          onChange={e => update('commercial', e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 pr-8 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        >
          <option value="">Tous les commerciaux</option>
          {commerciaux.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PERIODES.map(p => (
          <button
            key={p.value}
            onClick={() => update('periode', p.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              periode === p.value
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
