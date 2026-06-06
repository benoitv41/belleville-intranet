'use client'

import { useState, useEffect } from 'react'
import { Opportunite, CRM_ETAPES } from '@/lib/crm'
import { X, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/stats'

interface Props {
  opportunite?: Opportunite | null
  commerciaux: string[]
  onClose: () => void
  onSave: (opp: Opportunite) => void
  onDelete?: (id: string) => void
}

export function OpportuniteModal({ opportunite, commerciaux, onClose, onSave, onDelete }: Props) {
  const isEdit = !!opportunite?.id
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [form, setForm] = useState({
    titre: opportunite?.titre || '',
    client: opportunite?.client || '',
    client_numero: opportunite?.client_numero || '',
    commercial_nom: opportunite?.commercial_nom || '',
    montant_ht: opportunite?.montant_ht?.toString() || '',
    etape_id: opportunite?.etape_id ?? 0,
    notes: opportunite?.notes || '',
  })

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titre.trim()) return
    setLoading(true)
    try {
      const payload = {
        ...form,
        montant_ht: form.montant_ht ? parseFloat(form.montant_ht) : null,
        etape_id: Number(form.etape_id),
      }
      const url = isEdit ? `/api/crm/${opportunite!.id}` : '/api/crm'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onSave(data)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!opportunite?.id || !onDelete) return
    setLoading(true)
    try {
      await fetch(`/api/crm/${opportunite.id}`, { method: 'DELETE' })
      onDelete(opportunite.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{isEdit ? 'Modifier l\'opportunité' : 'Nouvelle opportunité'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              value={form.titre}
              onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8630A]/30"
              placeholder="Ex: Projet Dupont — Aménagement bureau"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <input
                type="text"
                value={form.client}
                onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8630A]/30"
                placeholder="Nom du client"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N° client</label>
              <input
                type="text"
                value={form.client_numero}
                onChange={e => setForm(f => ({ ...f, client_numero: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8630A]/30"
                placeholder="00001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commercial</label>
              <select
                value={form.commercial_nom}
                onChange={e => setForm(f => ({ ...f, commercial_nom: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8630A]/30 bg-white"
              >
                <option value="">— Sélectionner</option>
                {commerciaux.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant HT</label>
              <input
                type="number"
                value={form.montant_ht}
                onChange={e => setForm(f => ({ ...f, montant_ht: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8630A]/30"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Étape</label>
            <select
              value={form.etape_id}
              onChange={e => setForm(f => ({ ...f, etape_id: Number(e.target.value) }))}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8630A]/30 bg-white"
            >
              {CRM_ETAPES.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8630A]/30 resize-none"
              placeholder="Informations complémentaires..."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {isEdit && onDelete && (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600">Confirmer la suppression ?</span>
                  <button type="button" onClick={handleDelete} disabled={loading} className="text-xs px-2.5 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Oui</button>
                  <button type="button" onClick={() => setConfirmDelete(false)} className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">Non</button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="text-xs text-red-500 hover:text-red-700 transition-colors">
                  Supprimer
                </button>
              )
            )}
            {!isEdit && <div />}
            <div className="flex gap-2 ml-auto">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={loading || !form.titre.trim()} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50 transition-opacity" style={{ backgroundColor: '#E8630A' }}>
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isEdit ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
