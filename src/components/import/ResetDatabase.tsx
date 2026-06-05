'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'

export function ResetDatabase() {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleReset = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reset', { method: 'DELETE' })
      if (!res.ok) {
        const json = await res.json()
        alert(json.error || 'Erreur lors de la suppression')
        return
      }
      setDone(true)
      setConfirm(false)
      setTimeout(() => setDone(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <span className="text-sm text-green-600 font-medium">Base vidée avec succès.</span>
    )
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600 font-medium">Supprimer toutes les données ?</span>
        <button
          onClick={handleReset}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Confirmer
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="px-3 py-1.5 border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex items-center gap-2 px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Vider la base
    </button>
  )
}
