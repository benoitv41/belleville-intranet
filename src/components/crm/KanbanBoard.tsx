'use client'

import { useState, useRef } from 'react'
import { Opportunite, CRM_ETAPES, ETAPE_MAP, ETAPES_ORDER } from '@/lib/crm'
import { OpportuniteModal } from './OpportuniteModal'
import { Plus, GripVertical, Euro } from 'lucide-react'
import { formatCurrency } from '@/lib/stats'

interface Props {
  initialOpportunites: Opportunite[]
  commerciaux: string[]
}

export function KanbanBoard({ initialOpportunites, commerciaux }: Props) {
  const [opps, setOpps] = useState<Opportunite[]>(initialOpportunites)
  const [modal, setModal] = useState<{ open: boolean; opp: Opportunite | null; etapeId?: number }>({ open: false, opp: null })
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverEtape, setDragOverEtape] = useState<number | null>(null)
  const dragSrcEtape = useRef<number | null>(null)

  const oppsByEtape = ETAPES_ORDER.reduce((acc, etapeId) => {
    acc[etapeId] = opps.filter(o => o.etape_id === etapeId)
    return acc
  }, {} as Record<number, Opportunite[]>)

  const handleDragStart = (opp: Opportunite) => {
    setDraggingId(opp.id)
    dragSrcEtape.current = opp.etape_id
  }

  const handleDrop = async (targetEtapeId: number) => {
    if (!draggingId || targetEtapeId === dragSrcEtape.current) {
      setDraggingId(null)
      setDragOverEtape(null)
      return
    }
    setOpps(prev => prev.map(o => o.id === draggingId ? { ...o, etape_id: targetEtapeId } : o))
    setDraggingId(null)
    setDragOverEtape(null)
    await fetch(`/api/crm/${draggingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etape_id: targetEtapeId }),
    })
  }

  const handleSave = (saved: Opportunite) => {
    setOpps(prev => {
      const exists = prev.find(o => o.id === saved.id)
      return exists ? prev.map(o => o.id === saved.id ? saved : o) : [saved, ...prev]
    })
    setModal({ open: false, opp: null })
  }

  const handleDelete = (id: string) => {
    setOpps(prev => prev.filter(o => o.id !== id))
    setModal({ open: false, opp: null })
  }

  const totalPipeline = opps
    .filter(o => o.etape_id !== -1 && o.etape_id !== 13)
    .reduce((s, o) => s + (o.montant_ht || 0), 0)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">{opps.filter(o => o.etape_id !== -1 && o.etape_id !== 13).length} opportunités actives</p>
          </div>
          {totalPipeline > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#1C3461' }}>
              <Euro className="w-3.5 h-3.5 text-white opacity-80" />
              <span className="text-sm font-semibold text-white">{formatCurrency(totalPipeline)} pipeline</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setModal({ open: true, opp: null })}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#E8630A' }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle opportunité
        </button>
      </div>

      {/* Kanban scroll container */}
      <div className="overflow-x-auto flex-1 pb-4">
        <div className="flex gap-3 h-full" style={{ minWidth: `${ETAPES_ORDER.length * 230}px` }}>
          {ETAPES_ORDER.map(etapeId => {
            const etape = ETAPE_MAP[etapeId]
            const cards = oppsByEtape[etapeId] || []
            const isDragTarget = dragOverEtape === etapeId
            const totalEtape = cards.reduce((s, o) => s + (o.montant_ht || 0), 0)

            return (
              <div
                key={etapeId}
                className={`flex flex-col w-[220px] flex-shrink-0 rounded-xl border transition-colors ${
                  isDragTarget ? 'border-[#E8630A]/50 bg-orange-50/50' : `${etape.borderClass} bg-gray-50`
                }`}
                onDragOver={e => { e.preventDefault(); setDragOverEtape(etapeId) }}
                onDragLeave={() => setDragOverEtape(null)}
                onDrop={() => handleDrop(etapeId)}
              >
                {/* Column header */}
                <div className={`px-3 py-2.5 rounded-t-xl border-b ${etape.borderClass}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${etape.textClass} leading-tight`}>{etape.label}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${etape.bgClass} ${etape.textClass}`}>
                      {cards.length}
                    </span>
                  </div>
                  {totalEtape > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(totalEtape)}</p>
                  )}
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px]">
                  {cards.map(opp => (
                    <div
                      key={opp.id}
                      draggable
                      onDragStart={() => handleDragStart(opp)}
                      onDragEnd={() => { setDraggingId(null); setDragOverEtape(null) }}
                      onClick={() => setModal({ open: true, opp })}
                      className={`bg-white border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all group select-none ${
                        draggingId === opp.id ? 'opacity-40 scale-95' : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2 flex-1">{opp.titre}</p>
                        <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5 group-hover:text-gray-400" />
                      </div>
                      {opp.client && (
                        <p className="text-xs text-gray-500 truncate">{opp.client}</p>
                      )}
                      {opp.commercial_nom && (
                        <p className="text-xs text-gray-400 truncate">{opp.commercial_nom}</p>
                      )}
                      {opp.montant_ht != null && opp.montant_ht > 0 && (
                        <p className="text-xs font-semibold mt-1.5" style={{ color: '#E8630A' }}>{formatCurrency(opp.montant_ht)}</p>
                      )}
                    </div>
                  ))}

                  {/* Drop zone hint */}
                  {isDragTarget && draggingId && (
                    <div className="border-2 border-dashed rounded-lg h-16 flex items-center justify-center" style={{ borderColor: 'rgba(232,99,10,0.5)' }}>
                      <span className="text-xs" style={{ color: '#E8630A' }}>Déposer ici</span>
                    </div>
                  )}
                </div>

                {/* Add button */}
                <button
                  onClick={() => setModal({ open: true, opp: null, etapeId })}
                  className="flex items-center gap-1 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-b-xl transition-colors border-t border-gray-100"
                >
                  <Plus className="w-3 h-3" />
                  Ajouter
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {modal.open && (
        <OpportuniteModal
          opportunite={modal.opp ?? (modal.etapeId != null ? { etape_id: modal.etapeId } as Opportunite : null)}
          commerciaux={commerciaux}
          onClose={() => setModal({ open: false, opp: null })}
          onSave={handleSave}
          onDelete={modal.opp ? handleDelete : undefined}
        />
      )}
    </div>
  )
}
